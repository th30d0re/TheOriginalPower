//
//  decodingOppressionApp.swift
//  decodingOppression
//
//  Created by Emmanuel Theodore on 2/19/26.
//

//
//  decodingOppressionApp.swift
//  decodingOppression
//
//  Created by Emmanuel Theodore on 2/19/26.
//

import Combine
import SwiftData
import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

@main
@MainActor
struct decodingOppressionApp: App {
    #if canImport(UIKit)
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    #endif

    /// Shared dependencies: same ModelDownloadManager instance is URLSession delegate (identifier matches AppDelegate).
    @StateObject private var modelDownloadManager: ModelDownloadManager
    @StateObject private var deps: AppDependencies

    init() {
        let manager = ModelDownloadManager.shared
        _modelDownloadManager = StateObject(wrappedValue: manager)
        _deps = StateObject(wrappedValue: AppDependencies(modelDownloadManager: manager))
    }

    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            PolicyAnalysis.self,
            AnalyzedClause.self,
            #if os(macOS)
            EvalRun.self,
            EvalMetric.self,
            EvalThresholdsCache.self,
            MirroredItem.self,
            AuditEntry.self,
            ProviderState.self,
            #endif
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(deps)
                .environmentObject(modelDownloadManager)
        }
        .modelContainer(sharedModelContainer)
    }
}

// MARK: - Shared ModelDownloadManager + Tier2Engine for pipeline/view-model

@MainActor
final class AppDependencies: ObservableObject {
    enum DependencyError: LocalizedError {
        case pipelineUnavailable(underlyingDescription: String)

        var errorDescription: String? {
            switch self {
            case .pipelineUnavailable(let underlyingDescription):
                return "Pipeline unavailable: \(underlyingDescription)"
            }
        }
    }

    static let shared = AppDependencies(modelDownloadManager: ModelDownloadManager.shared)
    let modelDownloadManager: ModelDownloadManager
    let tier2Engine: Tier2Engine
    private let pipeline: ClauseClassificationPipeline?
    @Published private(set) var pipelineError: Error?

    #if os(macOS)
    let trainingManager: TrainingManager
    let validationRunner: ValidationRunner
    let trainingDataStore: TrainingDataStore
    let harnessClient: HarnessClient
    #endif

    init(modelDownloadManager: ModelDownloadManager) {
        self.modelDownloadManager = modelDownloadManager
        tier2Engine = Tier2Engine(downloadManager: modelDownloadManager)
        do {
            pipeline = try ClauseClassificationPipeline(tier2Engine: tier2Engine)
        } catch {
            pipeline = nil
            pipelineError = error
        }
        #if os(macOS)
        trainingManager = TrainingManager()
        validationRunner = ValidationRunner()
        trainingDataStore = TrainingDataStore.shared
        harnessClient = HarnessClient()
        Task { await harnessClient.connect() }
        #endif
    }

    func classify(clause: Clause) async throws -> TierClassification {
        guard let pipeline else {
            let message = pipelineError?.localizedDescription ?? "Initialization failed"
            throw DependencyError.pipelineUnavailable(underlyingDescription: message)
        }
        return await pipeline.classify(clause: clause)
    }

    func extractAndPreprocess(pdf url: URL) async throws -> [Clause] {
        guard let pipeline else {
            let message = pipelineError?.localizedDescription ?? "Initialization failed"
            throw DependencyError.pipelineUnavailable(underlyingDescription: message)
        }
        return try await pipeline.extractAndPreprocess(pdf: url)
    }

    func makeAnalysisPipeline() throws -> AnalysisPipeline {
        let tier1 = try Tier1Engine()
        let resolver = TierResolver(tier1: tier1, tier2: tier2Engine, tier3: Tier3Engine())
        return AnalysisPipeline(tier1: tier1, resolver: resolver, scorer: DefaultPolicyScorer())
    }

    func similarity(clause: String, taxonomyTerm: String) async throws -> Double {
        guard let pipeline else {
            let message = pipelineError?.localizedDescription ?? "Initialization failed"
            throw DependencyError.pipelineUnavailable(underlyingDescription: message)
        }
        return try await pipeline.similarity(clause: clause, taxonomyTerm: taxonomyTerm)
    }

    func embed(_ text: String) async throws -> [Float] {
        guard let pipeline else {
            let message = pipelineError?.localizedDescription ?? "Initialization failed"
            throw DependencyError.pipelineUnavailable(underlyingDescription: message)
        }
        return try await pipeline.embed(text)
    }

    func startTier2Download() async {
        await modelDownloadManager.startDownload()
    }
}

// MARK: - Background URLSession handoff for model download

#if canImport(UIKit)
@MainActor
final class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        handleEventsForBackgroundURLSession identifier: String,
        completionHandler: @escaping () -> Void
    ) {
        guard identifier == ModelDownloadManager.sessionIdentifier else {
            completionHandler()
            return
        }
        // Must match ModelDownloadManager.sessionIdentifier so the shared instance receives delegate callbacks.
        ModelDownloadManager.shared.setBackgroundCompletionHandler(completionHandler)
    }
}
#endif

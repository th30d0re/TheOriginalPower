//
//  EvalViewModel.swift
//  decodingOppression
//
//  macOS-only: observable state for EvaluationView (T5).
//

#if os(macOS)

import Foundation
import SwiftData
import SwiftUI

// MARK: - DTOs

struct MetricResult: Codable, Sendable {
    let name: String
    let value: Double
    let threshold: Double
    let passed: Bool
}

struct EvalRunResult: Codable, Sendable {
    let id: String
    let adapter: String
    let ranAt: Date
    let metrics: [MetricResult]
    let thresholds: EvalThresholdsDTO
    let passed: [String: Bool]
    let fidelity: Double
    let allPassed: Bool

    enum CodingKeys: String, CodingKey {
        case id, adapter, metrics, thresholds, passed, fidelity
        case ranAt = "ran_at"
        case allPassed = "all_passed"
    }
}

struct EvalThresholdsDTO: Codable, Sendable {
    var recall: Double
    var refusal: Double
    var classification: Double
    var lexicalFractal: Double
    var weights: [String: Double]

    enum CodingKeys: String, CodingKey {
        case recall, refusal, classification, weights
        case lexicalFractal = "lexical_fractal"
    }

    init(
        recall: Double = 0.80,
        refusal: Double = 0.10,
        classification: Double = 0.75,
        lexicalFractal: Double = 0.70,
        weights: [String: Double] = [:]
    ) {
        self.recall = recall
        self.refusal = refusal
        self.classification = classification
        self.lexicalFractal = lexicalFractal
        self.weights = weights
    }
}

struct ManifestSummary: Codable, Sendable {
    let id: String
    let store: String?
    let itemType: String?
    let domain: String?
    let status: String?
    let contentSha: String?

    enum CodingKeys: String, CodingKey {
        case id, store, domain, status
        case itemType = "item_type"
        case contentSha = "content_sha"
    }
}

struct AuditEntryDTO: Codable, Sendable {
    let id: String
    let mutationRef: String?
    let invariant: String?
    let decision: String?
    let reason: String?
    let ts: Date?

    enum CodingKeys: String, CodingKey {
        case id, invariant, decision, reason, ts
        case mutationRef = "mutation_ref"
    }
}

struct InvariantDTO: Codable, Sendable {
    let name: String
    let holding: Bool
    let lastRejection: String?
    let armed: Bool?

    enum CodingKeys: String, CodingKey {
        case name, holding, armed
        case lastRejection = "last_rejection"
    }
}

struct InvariantStatusDTO: Codable, Sendable {
    let invariants: [InvariantDTO]
}

struct FlagResult: Codable, Sendable {
    let status: String
    let message: String?
}

private struct ProgressPayload: Decodable {
    let metric: String
    let value: Double
}

// MARK: - EvalViewModel

@Observable
@MainActor
final class EvalViewModel {

    // MARK: State

    var adapters: [String] = []
    var selectedAdapter: String?
    var isRunning: Bool = false
    var progressMetrics: [String: Double] = [:]
    var scorecard: EvalRunResult?
    var history: [EvalRunResult] = []
    var thresholds: EvalThresholdsDTO = EvalThresholdsDTO()
    var isSavingThresholds: Bool = false
    var failingExamples: [String: [String]] = [:]
    var auditEntries: [AuditEntryDTO] = []
    var backendUnavailable: Bool = false
    var lastError: String?

    // MARK: - Lifecycle

    func onAppear(client: HarnessClient, context: ModelContext) {
        backendUnavailable = !client.status.isOnline
        Task {
            await loadHistory(client: client, context: context)
            await loadThresholds(client: client, context: context)
            await syncManifestAndAudit(client: client, context: context)
            do {
                let list = try await client.fetchAdapters()
                adapters = list
                if selectedAdapter == nil { selectedAdapter = list.first }
            } catch {
                // adapter list is non-critical; suppress
            }
        }
    }

    // MARK: - Eval run (SSE streaming)

    func runEvaluation(client: HarnessClient, context: ModelContext) {
        guard let adapter = selectedAdapter else { return }
        isRunning = true
        progressMetrics = [:]
        scorecard = nil
        lastError = nil

        Task {
            do {
                let stream = client.evalRunStream(adapter: adapter)
                for try await event in stream {
                    switch event.eventType {
                    case "progress":
                        guard let raw = event.data.data(using: .utf8),
                              let payload = try? JSONDecoder().decode(ProgressPayload.self, from: raw) else { break }
                        progressMetrics[payload.metric] = payload.value
                    case "done":
                        guard let raw = event.data.data(using: .utf8) else { break }
                        let decoder = JSONDecoder()
                        decoder.dateDecodingStrategy = .iso8601
                        let result = try decoder.decode(EvalRunResult.self, from: raw)
                        scorecard = result
                        HarnessSwiftDataBridge.upsertEvalRun(result, context: context)
                    default:
                        break
                    }
                }
                await loadHistory(client: client, context: context)
                await syncManifestAndAudit(client: client, context: context)
            } catch {
                lastError = error.localizedDescription
                backendUnavailable = true
            }
            isRunning = false
        }
    }

    // MARK: - Thresholds

    func saveThresholds(client: HarnessClient, context: ModelContext) {
        isSavingThresholds = true
        Task {
            do {
                let updated = try await client.putThresholds(thresholds)
                thresholds = updated
                HarnessSwiftDataBridge.upsertEvalThresholds(updated, context: context)
            } catch {
                lastError = error.localizedDescription
            }
            isSavingThresholds = false
        }
    }

    func loadThresholds(client: HarnessClient, context: ModelContext) async {
        do {
            let dto = try await client.fetchThresholds()
            thresholds = dto
            HarnessSwiftDataBridge.upsertEvalThresholds(dto, context: context)
        } catch {
            // keep DTO defaults on error
        }
    }

    // MARK: - History

    func loadHistory(client: HarnessClient, context: ModelContext) async {
        do {
            let results = try await client.fetchEvalHistory()
            history = results
            for result in results {
                HarnessSwiftDataBridge.upsertEvalRun(result, context: context)
            }
        } catch {
            if history.isEmpty {
                lastError = error.localizedDescription
            }
        }
    }

    // MARK: - Flag / promote

    @discardableResult
    func flagExample(text: String, label: String, client: HarnessClient) async throws -> FlagResult {
        return try await client.flagExample(text: text, label: label)
    }

    func promoteAdapter(client: HarnessClient) {
        guard let adapter = selectedAdapter, scorecard?.allPassed == true else { return }
        Task {
            do {
                try await client.activateAdapter(adapter)
            } catch {
                lastError = error.localizedDescription
            }
        }
    }

    // MARK: - Manifest / audit sync

    func syncManifestAndAudit(client: HarnessClient, context: ModelContext) async {
        do {
            let summaries = try await client.fetchManifestSummaries()
            HarnessSwiftDataBridge.upsertMirroredItems(summaries, context: context)
        } catch { }
        do {
            let entries = try await client.fetchAuditEntries(limit: 100)
            auditEntries = entries
            HarnessSwiftDataBridge.upsertAuditEntries(entries, context: context)
        } catch { }
    }

    // MARK: - Invariant helpers

    /// Returns the invariant name from the most recent rejected audit entry whose
    /// `mutationRef` matches `itemId`, or `nil` if no rejection is on record.
    func blockedInvariant(for itemId: String) -> String? {
        auditEntries
            .reversed()
            .first { $0.mutationRef == itemId && $0.decision == "rejected" }
            .flatMap { $0.invariant }
    }
}

#endif

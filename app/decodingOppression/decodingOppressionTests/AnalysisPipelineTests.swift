//
//  AnalysisPipelineTests.swift
//  decodingOppressionTests
//
//  Created by Emmanuel Theodore on 2/22/26.
//

import Foundation
import Testing
@testable import decodingOppression

@Suite struct AnalysisPipelineTests {
    @Test func testClassifyingEventsAreMonotonic() async {
        let clauses = makeClauses(count: 3)
        let pipeline = makePipeline(clauses: clauses)
        let stream = await pipeline.analyze(pdfURL: URL(fileURLWithPath: "/tmp/mock.pdf"))

        let events = await collectProgress(from: stream)
        let indices: [Int] = events.compactMap { progress -> Int? in
            if case let .classifying(clauseIndex, _, _, _, _) = progress { return clauseIndex }
            return nil
        }

        #expect(indices == Array(0..<clauses.count))
    }

    @Test func testCompleteEmittedAfterAllClauses() async {
        let pipeline = makePipeline(clauses: makeClauses(count: 2))
        let stream = await pipeline.analyze(pdfURL: URL(fileURLWithPath: "/tmp/mock.pdf"))

        let events = await collectProgress(from: stream)
        let last = events.last
        let isComplete: Bool
        switch last {
        case .some(.complete(_)):
            isComplete = true
        default:
            isComplete = false
        }
        #expect(isComplete)
    }

    @Test func testFailedEmittedOnPDFError() async {
        let error = MockExtractionError.failed
        let tier1 = MockTier1EngineForPipeline(clauses: [], error: error)
        let resolver = MockTierResolver(result: makeClassification(tier: .tier1, confidence: 0.9))
        let pipeline = AnalysisPipeline(tier1: tier1, resolver: resolver, scorer: StubPolicyScorer())
        let stream = await pipeline.analyze(pdfURL: URL(fileURLWithPath: "/tmp/mock.pdf"))

        var firstNonExtracting: AnalysisProgress?
        for await progress in stream {
            if case .extracting = progress { continue }
            firstNonExtracting = progress
            break
        }

        let isFailed: Bool
        switch firstNonExtracting {
        case .some(.failed(_)):
            isFailed = true
        default:
            isFailed = false
        }
        #expect(isFailed)
    }

    @Test func testCancellationStopsStreamCleanly() async {
        let pipeline = makePipeline(clauses: makeClauses(count: 5), resolverDelayNanos: 20_000_000)
        let stream = await pipeline.analyze(pdfURL: URL(fileURLWithPath: "/tmp/mock.pdf"))

        var task: Task<[AnalysisProgress], Never>?
        task = Task {
            var events: [AnalysisProgress] = []
            for await progress in stream {
                events.append(progress)
                if case .classifying = progress {
                    task?.cancel()
                }
            }
            return events
        }

        let events = await task?.value ?? []
        let hasComplete = events.contains { progress in
            if case .complete = progress { return true }
            return false
        }

        #expect(!hasComplete)
    }
}

private func makeClauses(count: Int) -> [Clause] {
    (0..<count).map { index in
        Clause(id: UUID(), text: "Clause \(index)", sectionType: .operativeClauses, targetGroup: nil, effectDirection: nil)
    }
}

private func makePipeline(clauses: [Clause], resolverDelayNanos: UInt64? = nil) -> AnalysisPipeline {
    let tier1 = MockTier1EngineForPipeline(clauses: clauses, error: nil)
    let resolver = MockTierResolver(result: makeClassification(tier: .tier2, confidence: 0.8), delayNanoseconds: resolverDelayNanos)
    return AnalysisPipeline(tier1: tier1, resolver: resolver, scorer: StubPolicyScorer())
}

private func collectProgress(from stream: AsyncStream<AnalysisProgress>) async -> [AnalysisProgress] {
    var events: [AnalysisProgress] = []
    for await progress in stream {
        events.append(progress)
    }
    return events
}

private func makeClassification(tier: MLTier, confidence: Double) -> TierClassification {
    TierClassification(
        targetGroup: .outgroup,
        effectDirection: .burden,
        architectureScores: ArchitectureScores(aar: 0, se: 0, ij: 0, rsc: 0),
        proxyDetection: ProxyDetection(usesProxyVariables: false, proxyTerms: [], expandsOutgroup: false),
        confidence: confidence,
        tier: tier,
        wasSafetyFallback: false
    )
}

private enum MockExtractionError: Error {
    case failed
}

actor MockTier1EngineForPipeline: Tier1EngineProtocol {
    private let clauses: [Clause]
    private let error: Error?

    init(clauses: [Clause], error: Error?) {
        self.clauses = clauses
        self.error = error
    }

    func extractAndPreprocess(pdf url: URL) async throws -> [Clause] {
        if let error {
            throw error
        }
        return clauses
    }

    func classify(clause: Clause) async -> TierClassification {
        makeClassification(tier: .tier1, confidence: 0.7)
    }
}

actor MockTierResolver: TierResolving {
    private let result: TierClassification
    private let delayNanoseconds: UInt64?

    init(result: TierClassification, delayNanoseconds: UInt64? = nil) {
        self.result = result
        self.delayNanoseconds = delayNanoseconds
    }

    func classify(clause: Clause) async -> TierClassification {
        if let delayNanoseconds {
            try? await Task.sleep(nanoseconds: delayNanoseconds)
        }
        return result
    }
}

//
//  TierResolverTests.swift
//  decodingOppressionTests
//
//  Created by Emmanuel Theodore on 2/22/26.
//

import Foundation
import Testing
@testable import decodingOppression

@Suite struct TierResolverTests {
    @Test func testTier1AcceptedWhenHighConfidence() async {
        let clause = Clause(id: UUID(), text: "Sample clause", sectionType: .operativeClauses, targetGroup: nil, effectDirection: nil)
        let tier1Result = makeClassification(tier: .tier1, confidence: 0.90)
        let tier2Result = makeClassification(tier: .tier2, confidence: 0.95)
        let tier3Result = makeClassification(tier: .tier3, confidence: 0.95)

        let tier1 = MockTier1Engine(classification: tier1Result)
        let tier2 = MockTier2Engine(result: tier2Result)
        let tier3 = MockTier3Engine(result: tier3Result)
        let resolver = TierResolver(tier1: tier1, tier2: tier2, tier3: tier3)

        let result = await resolver.classify(clause: clause)
        #expect(result.tier == .tier1)
    }

    @Test func testEscalatesWhenTier1LowConfidence() async {
        let clause = Clause(id: UUID(), text: "Sample clause", sectionType: .operativeClauses, targetGroup: nil, effectDirection: nil)
        let tier1Result = makeClassification(tier: .tier1, confidence: 0.70)
        let tier2Result = makeClassification(tier: .tier2, confidence: 0.88)

        let tier1 = MockTier1Engine(classification: tier1Result)
        let tier2 = MockTier2Engine(result: tier2Result)
        let tier3 = MockTier3Engine(result: nil)
        let resolver = TierResolver(tier1: tier1, tier2: tier2, tier3: tier3)

        let result = await resolver.classify(clause: clause)
        #expect(result.tier == .tier2)
    }

    @Test func testFallsBackToTier3WhenTier2Unavailable() async {
        let clause = Clause(id: UUID(), text: "Sample clause", sectionType: .operativeClauses, targetGroup: nil, effectDirection: nil)
        let tier1Result = makeClassification(tier: .tier1, confidence: 0.70)
        let tier3Result = makeClassification(tier: .tier3, confidence: 0.82)

        let tier1 = MockTier1Engine(classification: tier1Result)
        let tier2 = MockTier2Engine(result: nil)
        let tier3 = MockTier3Engine(result: tier3Result)
        let resolver = TierResolver(tier1: tier1, tier2: tier2, tier3: tier3)

        let result = await resolver.classify(clause: clause)
        #expect(result.tier == .tier3)
    }

    @Test func testFallsBackToTier1WhenBothUnavailable() async {
        let clause = Clause(id: UUID(), text: "Sample clause", sectionType: .operativeClauses, targetGroup: nil, effectDirection: nil)
        let tier1Result = makeClassification(tier: .tier1, confidence: 0.70)

        let tier1 = MockTier1Engine(classification: tier1Result)
        let tier2 = MockTier2Engine(result: nil)
        let tier3 = MockTier3Engine(result: nil)
        let resolver = TierResolver(tier1: tier1, tier2: tier2, tier3: tier3)

        let result = await resolver.classify(clause: clause)
        #expect(result.tier == .tier1)
    }
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

actor MockTier1Engine: Tier1EngineProtocol {
    private let classification: TierClassification
    private let clauses: [Clause]

    init(classification: TierClassification, clauses: [Clause] = []) {
        self.classification = classification
        self.clauses = clauses
    }

    func extractAndPreprocess(pdf url: URL) async throws -> [Clause] {
        clauses
    }

    func classify(clause: Clause) async -> TierClassification {
        classification
    }
}

actor MockTier2Engine: Tier2EngineProtocol {
    private let result: TierClassification?
    private let error: Error?

    init(result: TierClassification?, error: Error? = nil) {
        self.result = result
        self.error = error
    }

    func classify(clause: Clause) async throws -> TierClassification? {
        if let error {
            throw error
        }
        return result
    }
}

actor MockTier3Engine: Tier3EngineProtocol {
    private let result: TierClassification?
    private let error: Error?

    init(result: TierClassification?, error: Error? = nil) {
        self.result = result
        self.error = error
    }

    func classify(clause: Clause) async throws -> TierClassification? {
        if let error {
            throw error
        }
        return result
    }
}

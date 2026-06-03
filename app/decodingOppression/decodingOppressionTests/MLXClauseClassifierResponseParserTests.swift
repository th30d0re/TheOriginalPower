//
//  MLXClauseClassifierResponseParserTests.swift
//  decodingOppressionTests
//

import Foundation
import Testing
@testable import decodingOppression

@Suite struct MLXClauseClassifierResponseParserTests {
    private let validClassificationLine =
        "CLASSIFICATION: targetGroup=outgroup effect=burden aar=0.5 se=0.3 ij=0.2 rsc=0.1 proxy=no"

    @Test func testParsesValidFinalClassificationLine() {
        let response = """
        Root Ledger analysis of the extraction kernel and buffer class dynamics.

        \(validClassificationLine)
        """

        let result = MLXClassificationResponseParser.parse(response)

        #expect(result.targetGroup == .outgroup)
        #expect(result.effectDirection == .burden)
        #expect(result.architectureScores.aar == 0.5)
        #expect(result.architectureScores.se == 0.3)
        #expect(result.architectureScores.ij == 0.2)
        #expect(result.architectureScores.rsc == 0.1)
        #expect(result.proxyDetection.usesProxyVariables == false)
        #expect(result.confidence == 0.85)
        #expect(result.tier == .tier2)
    }

    @Test func testIgnoresEarlierClassificationMentionInProse() {
        let response = """
        The model may discuss classification: as a general concept before concluding.

        Earlier prose could even include classification: targetGroup=elite effect=benefit aar=0.9 se=0.9 ij=0.9 rsc=0.9 proxy=yes inline.

        Root Ledger analysis continues with thermodynamic analogies.

        \(validClassificationLine)
        """

        let result = MLXClassificationResponseParser.parse(response)

        #expect(result.targetGroup == .outgroup)
        #expect(result.effectDirection == .burden)
        #expect(result.confidence == 0.85)
    }

    @Test func testMalformedFinalLineKeepsDefaultConfidence() {
        let response = """
        Analysis prose without a valid trailing classification contract.

        CLASSIFICATION: targetGroup=outgroup effect=burden
        """

        let result = MLXClassificationResponseParser.parse(response)

        #expect(result.targetGroup == .outgroup)
        #expect(result.effectDirection == .burden)
        #expect(result.confidence == 0.5)
    }

    @Test func testMissingClassificationLineKeepsDefaults() {
        let response = """
        The response discusses classification: in prose but never emits the required final line.
        """

        let result = MLXClassificationResponseParser.parse(response)

        #expect(result.targetGroup == .multiple)
        #expect(result.effectDirection == .neutral)
        #expect(result.confidence == 0.5)
    }

    @Test func testParsedTier2IntegratesWithTierResolver() async {
        let parsed = MLXClassificationResponseParser.parse("""
        Analysis body.

        \(validClassificationLine)
        """)

        let clause = Clause(
            id: UUID(),
            text: "Sample clause",
            sectionType: .operativeClauses,
            targetGroup: nil,
            effectDirection: nil
        )
        let tier1Result = TierClassification(
            targetGroup: .multiple,
            effectDirection: .neutral,
            architectureScores: ArchitectureScores(aar: 0, se: 0, ij: 0, rsc: 0),
            proxyDetection: ProxyDetection(usesProxyVariables: false, proxyTerms: [], expandsOutgroup: false),
            confidence: 0.70,
            tier: .tier1,
            wasSafetyFallback: false
        )

        let resolver = TierResolver(
            tier1: MockTier1Engine(classification: tier1Result),
            tier2: MockTier2Engine(result: parsed),
            tier3: MockTier3Engine(result: nil)
        )

        let result = await resolver.classify(clause: clause)

        #expect(result.tier == .tier2)
        #expect(result.targetGroup == .outgroup)
        #expect(result.effectDirection == .burden)
        #expect(result.confidence == 0.85)
    }
}

private actor MockTier1Engine: Tier1EngineProtocol {
    private let classification: TierClassification

    init(classification: TierClassification) {
        self.classification = classification
    }

    func extractAndPreprocess(pdf url: URL) async throws -> [Clause] { [] }

    func classify(clause: Clause) async -> TierClassification { classification }
}

private actor MockTier2Engine: Tier2EngineProtocol {
    private let result: TierClassification?

    init(result: TierClassification?) {
        self.result = result
    }

    func classify(clause: Clause) async throws -> TierClassification? { result }
}

private actor MockTier3Engine: Tier3EngineProtocol {
    private let result: TierClassification?

    init(result: TierClassification?) {
        self.result = result
    }

    func classify(clause: Clause) async throws -> TierClassification? { result }
}

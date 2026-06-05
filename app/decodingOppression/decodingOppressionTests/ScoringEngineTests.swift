//
//  ScoringEngineTests.swift
//  decodingOppressionTests
//
//  Created by Emmanuel Theodore on 2/23/26.
//

import Foundation
import Testing
@testable import decodingOppression

@Suite struct DifferentialImpactScorerTests {
    @Test func testAllEliteBenefitHighPositive() {
        let clauses = Array(repeating: makeClassification(targetGroup: .elite, effectDirection: .benefit), count: 4)
        let score = DifferentialImpactScorer().score(clauses: clauses)
        #expect(score > 0.9)
    }

    @Test func testAllOutgroupBenefitNegative() {
        let clauses = Array(repeating: makeClassification(targetGroup: .outgroup, effectDirection: .benefit), count: 4)
        let score = DifferentialImpactScorer().score(clauses: clauses)
        #expect(score < -0.9)
    }

    @Test func testEmptyReturnsZero() {
        let score = DifferentialImpactScorer().score(clauses: [])
        #expect(score == 0.0)
    }

    @Test func testOutputWithinBounds() {
        let clauses = [
            makeClassification(targetGroup: .elite, effectDirection: .benefit),
            makeClassification(targetGroup: .outgroup, effectDirection: .benefit),
            makeClassification(targetGroup: .outgroup, effectDirection: .burden),
            makeClassification(targetGroup: .ingroupNonElite, effectDirection: .burden),
        ]
        let score = DifferentialImpactScorer().score(clauses: clauses)
        #expect(score >= -1.0)
        #expect(score <= 1.0)
    }
}

@Suite struct ArchitectureDetectorTests {
    @Test func testAllZeroInputsMappedToNegativeOne() {
        let clauses = [
            makeClassification(aar: 0, se: 0, ij: 0, rsc: 0),
            makeClassification(aar: 0, se: 0, ij: 0, rsc: 0),
        ]
        let score = ArchitectureDetector().score(clauses: clauses)
        #expect(score == -1.0)
    }

    @Test func testAllOneInputsMappedToOne() {
        let clauses = [
            makeClassification(aar: 1, se: 1, ij: 1, rsc: 1),
            makeClassification(aar: 1, se: 1, ij: 1, rsc: 1),
        ]
        let score = ArchitectureDetector().score(clauses: clauses)
        #expect(score == 1.0)
    }

    @Test func testWeightedSumFixture() {
        let clauses = [
            makeClassification(aar: 1, se: 0, ij: 0, rsc: 0),
            makeClassification(aar: 1, se: 1, ij: 0, rsc: 0),
        ]
        let score = ArchitectureDetector().score(clauses: clauses)
        let expectedAds = 0.35 * 1.0 + 0.20 * 0.5 + 0.20 * 0.0 + 0.25 * 0.0
        let expected = 2 * expectedAds - 1
        #expect(approximatelyEqual(score, expected))
    }
}

@Suite struct EliteInterestScorerTests {
    @Test func testMaxExtractionMaxRscAllProxyNearOne() {
        let clauses = [
            makeClassification(targetGroup: .elite, effectDirection: .benefit, rsc: 1, usesProxyVariables: true, expandsOutgroup: true),
            makeClassification(targetGroup: .elite, effectDirection: .benefit, rsc: 1, usesProxyVariables: true, expandsOutgroup: true),
            makeClassification(targetGroup: .elite, effectDirection: .benefit, rsc: 1, usesProxyVariables: true, expandsOutgroup: true),
        ]
        let score = EliteInterestScorer().score(clauses: clauses)
        #expect(score > 0.95)
    }

    @Test func testZeroInputsMappedToNegativeOne() {
        let clauses = [
            makeClassification(targetGroup: .ingroupNonElite, effectDirection: .benefit, rsc: 0, usesProxyVariables: false, expandsOutgroup: false),
            makeClassification(targetGroup: .ingroupNonElite, effectDirection: .benefit, rsc: 0, usesProxyVariables: false, expandsOutgroup: false),
        ]
        let score = EliteInterestScorer().score(clauses: clauses)
        #expect(score == -1.0)
    }

    @Test func testWeightingFixture() {
        let clauses = [
            makeClassification(targetGroup: .elite, effectDirection: .benefit, rsc: 0.2, usesProxyVariables: true, expandsOutgroup: false),
            makeClassification(targetGroup: .ingroupNonElite, effectDirection: .benefit, rsc: 0.6, usesProxyVariables: false, expandsOutgroup: false),
        ]
        let score = EliteInterestScorer().score(clauses: clauses)
        let extraction = 0.5
        let resistanceSuppression = 0.4
        let divisionMaintenance = 0.5
        let expectedEis = 0.4 * extraction + 0.3 * resistanceSuppression + 0.3 * divisionMaintenance
        let expected = 2 * expectedEis - 1
        #expect(approximatelyEqual(score, expected))
    }
}

@Suite struct CompoundingCalculatorTests {
    @Test func testEmptyReturnsZero() {
        let score = CompoundingCalculator(alpha: 0.1, historicalChain: []).score(clauses: [])
        #expect(score == 0.0)
    }

    @Test func testHighOppressionHigherThanLow() {
        let highClause = makeClassification(aar: 1, rsc: 1)
        let lowClause = makeClassification(aar: 0.2, rsc: 0.2)
        let calculator = CompoundingCalculator(alpha: 0.1, historicalChain: [])

        let highScore = calculator.score(clauses: [highClause])
        let lowScore = calculator.score(clauses: [lowClause])

        #expect(highScore > lowScore)
        #expect(highScore >= -1.0)
        #expect(highScore <= 1.0)
        #expect(lowScore >= -1.0)
        #expect(lowScore <= 1.0)
    }

    @Test func testNeutralPolicyMapsToZero() {
        let clause = makeClassification(aar: 0, rsc: 0)
        let calculator = CompoundingCalculator(alpha: 0.1, historicalChain: [])
        let score = calculator.score(clauses: [clause])
        #expect(score == 0.0)
    }
}

@Suite struct OutgroupAnalyzerTests {
    @Test func testAllProxyAndExpansionNearOne() {
        let clauses = [
            makeClassification(usesProxyVariables: true, proxyTerms: ["a", "b", "c", "d", "e"], expandsOutgroup: true),
            makeClassification(usesProxyVariables: true, proxyTerms: ["a", "b", "c", "d", "e"], expandsOutgroup: true),
        ]
        let score = OutgroupAnalyzer().score(clauses: clauses)
        #expect(score > 0.95)
    }

    @Test func testNoneMappedToNegativeOne() {
        let clauses = [
            makeClassification(usesProxyVariables: false, proxyTerms: [], expandsOutgroup: false),
            makeClassification(usesProxyVariables: false, proxyTerms: [], expandsOutgroup: false),
        ]
        let score = OutgroupAnalyzer().score(clauses: clauses)
        #expect(score == -1.0)
    }

    @Test func testOutputWithinBounds() {
        let clauses = [
            makeClassification(usesProxyVariables: true, proxyTerms: ["a"], expandsOutgroup: false),
            makeClassification(usesProxyVariables: false, proxyTerms: [], expandsOutgroup: true),
        ]
        let score = OutgroupAnalyzer().score(clauses: clauses)
        #expect(score >= -1.0)
        #expect(score <= 1.0)
    }
}

@Suite struct PolicyScorerTests {
    @Test func testCOIFormulaMatchesFixture() {
        let clauses = [
            makeClassification(
                targetGroup: .elite,
                effectDirection: .benefit,
                aar: 1,
                se: 1,
                ij: 1,
                rsc: 1,
                usesProxyVariables: true,
                proxyTerms: ["a", "b", "c", "d", "e"],
                expandsOutgroup: true
            ),
            makeClassification(
                targetGroup: .outgroup,
                effectDirection: .burden,
                aar: 0,
                se: 0,
                ij: 0,
                rsc: 0,
                usesProxyVariables: false,
                proxyTerms: [],
                expandsOutgroup: false
            ),
        ]

        let scorer = DefaultPolicyScorer(cis: CompoundingCalculator(alpha: 0.1, historicalChain: []))
        let result = scorer.score(clauses: clauses)

        let expectedDis = 1.0
        let expectedAds = 0.0
        let expectedEis = 0.4
        let expectedCis = 0.5
        let expectedOes = 0.0
        let expectedCoi = 0.25 * expectedDis + 0.25 * expectedAds + 0.20 * expectedEis + 0.15 * expectedCis + 0.15 * expectedOes

        #expect(approximatelyEqual(result.coi, expectedCoi))
    }
}

@Suite struct HistoricalPoliciesTests {
    @Test func testHistoricalPoliciesConstants() {
        let policies = [
            HistoricalPolicies.virginiaSlaveCodes,
            HistoricalPolicies.thirteenthAmendment,
            HistoricalPolicies.holcRedlining,
            HistoricalPolicies.warOnDrugs,
        ]

        #expect(!policies[0].clauses.isEmpty)
        #expect(!policies[1].clauses.isEmpty)
        #expect(!policies[2].clauses.isEmpty)
        #expect(!policies[3].clauses.isEmpty)

        #expect(policies[0].expectedCOI == 0.93)
        #expect(policies[1].expectedCOI == 0.35)
        #expect(policies[2].expectedCOI == 0.82)
        #expect(policies[3].expectedCOI == 0.78)
    }
}

private func makeClassification(
    targetGroup: TargetGroup = .outgroup,
    effectDirection: EffectDirection = .burden,
    aar: Double = 0,
    se: Double = 0,
    ij: Double = 0,
    rsc: Double = 0,
    usesProxyVariables: Bool = false,
    proxyTerms: [String] = [],
    expandsOutgroup: Bool = false,
    confidence: Double = 0.9,
    tier: MLTier = .tier3
) -> TierClassification {
    TierClassification(
        targetGroup: targetGroup,
        effectDirection: effectDirection,
        architectureScores: ArchitectureScores(aar: aar, se: se, ij: ij, rsc: rsc),
        proxyDetection: ProxyDetection(
            usesProxyVariables: usesProxyVariables,
            proxyTerms: proxyTerms,
            expandsOutgroup: expandsOutgroup
        ),
        confidence: confidence,
        tier: tier,
        wasSafetyFallback: false
    )
}

private func approximatelyEqual(_ lhs: Double, _ rhs: Double, tolerance: Double = 0.0001) -> Bool {
    abs(lhs - rhs) <= tolerance
}

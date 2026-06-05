// Informative — failures are calibration signals, not CI blockers.
//
//  HistoricalPolicyValidationTests.swift
//  decodingOppressionTests
//
//  End-to-end validation suite: loads validation_clauses.jsonl, runs three PolicyAnalysisSession
//  calls per clause (with greedy sampling for reproducibility), assembles TierClassification,
//  and validates actual COI against expected per policy.
//

import Foundation
import Testing
@testable import decodingOppression

#if canImport(FoundationModels)
import FoundationModels

@Suite("Historical Policy Validation — Informative")
struct HistoricalPolicyValidationTests {
    let session = PolicyAnalysisSession()

    @Test func testVirginiaSlaveCodes() async throws {
        try await validatePolicy("Virginia Slave Codes (1705)")
    }

    @Test func testThirteenthAmendment() async throws {
        try await validatePolicy("13th Amendment (1865)")
    }

    @Test func testHOLCRedlining() async throws {
        try await validatePolicy("HOLC Redlining (1934)")
    }

    @Test func testWarOnDrugs() async throws {
        try await validatePolicy("War on Drugs (1971)")
    }

    private func validatePolicy(_ policyName: String) async throws {
        let clauses = try loadValidationClauses(for: policyName)
        #expect(!clauses.isEmpty, "No validation clauses found for \(policyName)")

        var tierClassifications: [TierClassification] = []

        for trainingClause in clauses {
            let clause = Clause(
                id: trainingClause.id,
                text: trainingClause.text,
                sectionType: .operativeClauses,
                targetGroup: nil,
                effectDirection: nil
            )

            let greedyOptions = GenerationOptions(sampling: .greedy)

            let classificationResponse = try await session.classifyClause(clause, options: greedyOptions)
            let architectureResponse = try await session.detectArchitecture(clause, options: greedyOptions)
            let proxyResponse = try await session.detectProxy(clause, options: greedyOptions)

            let tierClassification = TierClassification(
                targetGroup: classificationResponse.targetGroup,
                effectDirection: classificationResponse.effectDirection,
                architectureScores: ArchitectureScores(
                    aar: architectureResponse.asymmetricAutonomyRestriction,
                    se: architectureResponse.selectiveEmpathy,
                    ij: architectureResponse.ideologicalJustification,
                    rsc: architectureResponse.resistanceToStructuralCritique
                ),
                proxyDetection: proxyResponse,
                confidence: classificationResponse.confidence,
                tier: .tier1,
                wasSafetyFallback: false
            )

            tierClassifications.append(tierClassification)
        }

        let scorer = DefaultPolicyScorer()
        let scoreResult = scorer.score(clauses: tierClassifications)

        let policy = HistoricalPolicies.chain.first { $0.name == policyName }
        guard let expectedPolicy = policy else {
            #expect(Bool(false), "Policy \(policyName) not found in HistoricalPolicies")
            return
        }

        let delta = abs(scoreResult.coi - expectedPolicy.expectedCOI)
        #expect(delta <= 0.10, "COI delta \(delta) exceeds tolerance for \(policyName): expected \(expectedPolicy.expectedCOI), got \(scoreResult.coi)")
    }

    private func loadValidationClauses(for policyName: String) throws -> [TrainingClause] {
        guard let url = Bundle(for: HistoricalPolicyValidationBundleToken.self).url(
            forResource: "validation_clauses",
            withExtension: "jsonl",
            subdirectory: nil
        ) else {
            throw NSError(domain: "ValidationTests", code: -1, userInfo: [NSLocalizedDescriptionKey: "validation_clauses.jsonl not found"])
        }

        let data = try Data(contentsOf: url)
        let content = String(decoding: data, as: UTF8.self)
        let lines = content.split(separator: "\n").map(String.init)

        let decoder = JSONDecoder()
        var clauses: [TrainingClause] = []

        for line in lines {
            guard !line.isEmpty, let lineData = line.data(using: String.Encoding.utf8) else { continue }
            let clause = try decoder.decode(TrainingClause.self, from: lineData)
            if clause.sourcePolicy == policyName {
                clauses.append(clause)
            }
        }

        return clauses
    }
}

private final class HistoricalPolicyValidationBundleToken {}

#else

@Suite("Historical Policy Validation — Skipped")
struct HistoricalPolicyValidationTests {
    @Test func testSkipped() {
        #expect(true, "Foundation Models unavailable on this platform")
    }
}

#endif

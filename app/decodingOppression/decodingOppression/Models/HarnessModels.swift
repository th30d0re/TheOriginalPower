//
//  HarnessModels.swift
//  decodingOppression
//
//  macOS-only: SwiftData entities that persist Harness eval state locally.
//

#if os(macOS)

import Foundation
import SwiftData

// MARK: - EvalRun

@Model
final class EvalRun {
    var id: UUID
    var adapterName: String?
    var ranAt: Date
    var fidelity: Double
    var allPassed: Bool

    @Relationship(deleteRule: .cascade)
    var metrics: [EvalMetric]

    init(
        id: UUID = UUID(),
        adapterName: String? = nil,
        ranAt: Date = Date(),
        fidelity: Double = 0,
        allPassed: Bool = false,
        metrics: [EvalMetric] = []
    ) {
        self.id = id
        self.adapterName = adapterName
        self.ranAt = ranAt
        self.fidelity = fidelity
        self.allPassed = allPassed
        self.metrics = metrics
    }
}

// MARK: - EvalMetric

@Model
final class EvalMetric {
    var id: UUID
    var name: String
    var value: Double
    var threshold: Double
    var passed: Bool

    init(
        id: UUID = UUID(),
        name: String = "",
        value: Double = 0,
        threshold: Double = 0,
        passed: Bool = false
    ) {
        self.id = id
        self.name = name
        self.value = value
        self.threshold = threshold
        self.passed = passed
    }
}

// MARK: - EvalThresholdsCache

/// Singleton row (enforce one row per device in merge logic; @Attribute(.unique) omitted for CloudKit compatibility).
@Model
final class EvalThresholdsCache {
    var id: UUID
    var recall: Double
    var refusal: Double
    var classification: Double
    var lexicalFractal: Double
    /// JSON-encoded `[String: Double]` weight map.
    var weightsData: Data
    var syncedAt: Date?

    init(
        id: UUID = UUID(),
        recall: Double = 0,
        refusal: Double = 0,
        classification: Double = 0,
        lexicalFractal: Double = 0,
        weightsData: Data = Data(),
        syncedAt: Date? = nil
    ) {
        self.id = id
        self.recall = recall
        self.refusal = refusal
        self.classification = classification
        self.lexicalFractal = lexicalFractal
        self.weightsData = weightsData
        self.syncedAt = syncedAt
    }
}

#endif

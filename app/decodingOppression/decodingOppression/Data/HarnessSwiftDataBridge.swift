//
//  HarnessSwiftDataBridge.swift
//  decodingOppression
//
//  macOS-only: static upsert helpers that enforce uniqueness for Harness
//  SwiftData entities without relying on @Attribute(.unique).
//

#if os(macOS)

import Foundation
import SwiftData

enum HarnessSwiftDataBridge {

    // MARK: - EvalRun + EvalMetric

    static func upsertEvalRun(_ result: EvalRunResult, context: ModelContext) {
        if let uuid = UUID(uuidString: result.id) {
            var descriptor = FetchDescriptor<EvalRun>(
                predicate: #Predicate { $0.id == uuid }
            )
            descriptor.fetchLimit = 1
            let existing = (try? context.fetch(descriptor))?.first

            if let run = existing {
                run.adapterName = result.adapter
                run.ranAt = result.ranAt
                run.fidelity = result.fidelity
                run.allPassed = result.allPassed
                replaceMetrics(on: run, from: result.metrics, context: context)
            } else {
                let run = EvalRun(
                    id: uuid,
                    adapterName: result.adapter,
                    ranAt: result.ranAt,
                    fidelity: result.fidelity,
                    allPassed: result.allPassed
                )
                context.insert(run)
                let metrics = result.metrics.map { m in
                    EvalMetric(name: m.name, value: m.value, threshold: m.threshold, passed: m.passed)
                }
                metrics.forEach { context.insert($0) }
                run.metrics = metrics
            }
        } else {
            // daemon ID is not a UUID; always insert as a new record
            let run = EvalRun(
                adapterName: result.adapter,
                ranAt: result.ranAt,
                fidelity: result.fidelity,
                allPassed: result.allPassed
            )
            context.insert(run)
            let metrics = result.metrics.map { m in
                EvalMetric(name: m.name, value: m.value, threshold: m.threshold, passed: m.passed)
            }
            metrics.forEach { context.insert($0) }
            run.metrics = metrics
        }
        try? context.save()
    }

    // MARK: - EvalThresholdsCache

    static func upsertEvalThresholds(_ dto: EvalThresholdsDTO, context: ModelContext) {
        let descriptor = FetchDescriptor<EvalThresholdsCache>()
        let record = (try? context.fetch(descriptor))?.first ?? {
            let fresh = EvalThresholdsCache()
            context.insert(fresh)
            return fresh
        }()
        record.recall = dto.recall
        record.refusal = dto.refusal
        record.classification = dto.classification
        record.lexicalFractal = dto.lexicalFractal
        record.weightsData = (try? JSONEncoder().encode(dto.weights)) ?? Data()
        record.syncedAt = Date()
        try? context.save()
    }

    // MARK: - MirroredItem

    static func upsertMirroredItems(_ summaries: [ManifestSummary], context: ModelContext) {
        for summary in summaries {
            let idStr = summary.id
            var descriptor = FetchDescriptor<MirroredItem>(
                predicate: #Predicate { $0.id == idStr }
            )
            descriptor.fetchLimit = 1
            if let existing = (try? context.fetch(descriptor))?.first {
                existing.store = summary.store
                existing.itemType = summary.itemType
                existing.domain = summary.domain
                existing.status = summary.status
                existing.contentSha = summary.contentSha
            } else {
                let item = MirroredItem(
                    id: summary.id,
                    store: summary.store,
                    itemType: summary.itemType,
                    domain: summary.domain,
                    status: summary.status,
                    contentSha: summary.contentSha
                )
                context.insert(item)
            }
        }
        try? context.save()
    }

    // MARK: - AuditEntry

    static func upsertAuditEntries(_ entries: [AuditEntryDTO], context: ModelContext) {
        for entry in entries {
            let idStr = entry.id
            var descriptor = FetchDescriptor<AuditEntry>(
                predicate: #Predicate { $0.id == idStr }
            )
            descriptor.fetchLimit = 1
            if let existing = (try? context.fetch(descriptor))?.first {
                existing.invariant = entry.invariant
                existing.decision = entry.decision
                existing.reason = entry.reason
                existing.ts = entry.ts
            } else {
                let record = AuditEntry(
                    id: entry.id,
                    invariant: entry.invariant,
                    decision: entry.decision,
                    reason: entry.reason,
                    ts: entry.ts
                )
                context.insert(record)
            }
        }
        try? context.save()
    }

    // MARK: - Private helpers

    private static func replaceMetrics(
        on run: EvalRun,
        from results: [MetricResult],
        context: ModelContext
    ) {
        run.metrics.forEach { context.delete($0) }
        let metrics = results.map { m in
            EvalMetric(name: m.name, value: m.value, threshold: m.threshold, passed: m.passed)
        }
        metrics.forEach { context.insert($0) }
        run.metrics = metrics
    }
}

#endif

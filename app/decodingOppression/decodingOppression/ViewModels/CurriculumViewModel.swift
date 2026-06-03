//
//  CurriculumViewModel.swift
//  decodingOppression
//
//  macOS-only: observable state for CurriculumView (T7).
//

#if os(macOS)

import Foundation
import SwiftUI

// MARK: - Source ingestion status

enum SourceIngestionStatus: Equatable {
    case queued
    case transcribing
    case ready(pairsAdded: Int)
    case error(String)

    var displayLabel: String {
        switch self {
        case .queued:               return "Queued"
        case .transcribing:         return "Transcribing…"
        case .ready(let n):         return "Ready (\(n) pairs)"
        case .error(let msg):       return "Error: \(msg)"
        }
    }

    var isError: Bool {
        if case .error = self { return true }
        return false
    }
}

struct SourceStatus: Identifiable {
    let id: String
    let url: String
    let domain: String
    var status: SourceIngestionStatus
}

// MARK: - CurriculumViewModel

@Observable
@MainActor
final class CurriculumViewModel {

    // MARK: Domain registry (mirrors Python DOMAINS)

    static let domainKeys: [String] = [
        "legal_history",
        "engineering_physics",
        "political_philosophy",
        "sociology_race",
    ]

    static let domainDisplayNames: [String: String] = [
        "legal_history":         "Legal History",
        "engineering_physics":   "Engineering/Physics",
        "political_philosophy":  "Political Philosophy",
        "sociology_race":        "Sociology/Race",
    ]

    // MARK: State

    var selectedDomain: String = "legal_history"
    var urlInput: String = ""
    var sources: [SourceStatus] = []
    var stagingItems: [StagingItemDTO] = []
    var selectedStagingIds: Set<String> = []
    var isIngesting: Bool = false
    var isPromoting: Bool = false
    var backendUnavailable: Bool = false
    var lastError: String?

    // Audit entries for blockedInvariant lookups (populated by syncAudit)
    var auditEntries: [AuditEntryDTO] = []

    // MARK: - Lifecycle

    func onAppear(client: HarnessClient) {
        backendUnavailable = !client.status.isOnline
        Task { await loadStaging(client: client) }
    }

    // MARK: - Add source

    func addSource(client: HarnessClient) {
        let url = urlInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !url.isEmpty else {
            lastError = "URL is required."
            return
        }
        let sourceId = UUID().uuidString
        let domain = selectedDomain

        var sourceEntry = SourceStatus(id: sourceId, url: url, domain: domain, status: .queued)
        sources.append(sourceEntry)
        urlInput = ""
        isIngesting = true
        lastError = nil

        Task {
            defer { isIngesting = false }
            let stream = client.ingestSourceStream(domain: domain, url: url, sourceId: sourceId)
            do {
                for try await event in stream {
                    guard let raw = event.data.data(using: .utf8),
                          let payload = try? JSONDecoder().decode(SourceStatusPayload.self, from: raw),
                          payload.sourceId == sourceId
                    else { continue }

                    let newStatus: SourceIngestionStatus
                    switch payload.status {
                    case "queued":       newStatus = .queued
                    case "transcribing": newStatus = .transcribing
                    case "ready":        newStatus = .ready(pairsAdded: payload.pairsAdded ?? 0)
                    case "error":        newStatus = .error(payload.detail ?? "Unknown error")
                    default:             continue
                    }

                    if let idx = sources.firstIndex(where: { $0.id == sourceId }) {
                        sources[idx].status = newStatus
                    } else {
                        sourceEntry.status = newStatus
                    }
                }
                await loadStaging(client: client)
            } catch {
                if let idx = sources.firstIndex(where: { $0.id == sourceId }) {
                    sources[idx].status = .error(error.localizedDescription)
                }
                lastError = error.localizedDescription
                backendUnavailable = true
            }
        }
    }

    // MARK: - Load staging

    func loadStaging(client: HarnessClient) async {
        do {
            let response = try await client.fetchStaging(domain: nil, reviewState: nil)
            stagingItems = response.items
        } catch {
            if stagingItems.isEmpty {
                lastError = error.localizedDescription
            }
        }
    }

    // MARK: - Mark reviewed

    func markReviewed(client: HarnessClient) {
        let ids = Array(selectedStagingIds)
        guard !ids.isEmpty else { return }
        Task {
            do {
                try await client.reviewStagingItems(ids: ids)
                await loadStaging(client: client)
            } catch {
                lastError = error.localizedDescription
            }
        }
    }

    // MARK: - Promote

    func promote(client: HarnessClient) {
        let reviewedIds = stagingItems
            .filter { selectedStagingIds.contains($0.id) && $0.reviewState == "reviewed" }
            .map(\.id)
        guard !reviewedIds.isEmpty else {
            lastError = "No reviewed items selected for promotion."
            return
        }
        isPromoting = true
        lastError = nil
        Task {
            defer { isPromoting = false }
            do {
                let response = try await client.promoteStagingItems(ids: reviewedIds)
                if !response.rejected.isEmpty {
                    let reasons = response.rejected.map { r in
                        "\(r.id.prefix(8)): \(r.reason ?? r.invariant ?? "rejected")"
                    }.joined(separator: "; ")
                    lastError = "Rejected: \(reasons)"
                }
                selectedStagingIds.subtract(response.promoted)
                await loadStaging(client: client)
            } catch {
                lastError = error.localizedDescription
            }
        }
    }

    // MARK: - Invariant helper

    func blockedInvariant(for itemId: String) -> String? {
        auditEntries
            .reversed()
            .first { $0.mutationRef == itemId && $0.decision == "rejected" }
            .flatMap { $0.invariant }
    }

    // MARK: - Private DTO for SSE parsing

    private struct SourceStatusPayload: Decodable {
        let sourceId: String
        let status: String
        let pairsAdded: Int?
        let detail: String?

        enum CodingKeys: String, CodingKey {
            case sourceId   = "source_id"
            case status
            case pairsAdded = "pairs_added"
            case detail
        }
    }
}

#endif

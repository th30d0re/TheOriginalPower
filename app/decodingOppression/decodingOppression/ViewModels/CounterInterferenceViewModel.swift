//
//  CounterInterferenceViewModel.swift
//  decodingOppression
//
//  macOS-only: observable state for CounterInterferenceView (T8).
//

#if os(macOS)

import Foundation
import SwiftUI

// MARK: - CounterInterferenceViewModel

@Observable
@MainActor
final class CounterInterferenceViewModel {

    // MARK: State

    var providers: [ProviderDTO] = []
    var activeProviderIds: Set<String> = []
    var topicInput: String = ""
    var domain: String? = nil
    var isRunning: Bool = false
    var pendingPairs: [PendingDPOPair] = []
    var errorsQueue: [String] = []
    var failedProviderIds: [String] = []
    var backendUnavailable: Bool = false
    var lastError: String? = nil
    var auditEntries: [AuditEntryDTO] = []

    // Tracks which pair IDs have invariant blocks from /ci/review.
    private var _blockedInvariants: [String: String] = [:]

    // MARK: - Lifecycle

    func onAppear(client: HarnessClient) {
        backendUnavailable = !client.status.isOnline
        Task {
            await loadProviders(client: client)
            await syncAudit(client: client)
        }
    }

    // MARK: - Provider roster

    func loadProviders(client: HarnessClient) async {
        do {
            let response = try await client.fetchProviders()
            providers = response.providers
            // Initialize active set to all available providers.
            let availableIds = response.providers.filter(\.available).map(\.id)
            if activeProviderIds.isEmpty {
                activeProviderIds = Set(availableIds)
            }
        } catch {
            if providers.isEmpty {
                lastError = error.localizedDescription
            }
        }
    }

    func toggleProvider(id: String) {
        if activeProviderIds.contains(id) {
            activeProviderIds.remove(id)
        } else {
            activeProviderIds.insert(id)
        }
    }

    // MARK: - Run CI

    func runCI(client: HarnessClient) {
        let prompt = topicInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !prompt.isEmpty else {
            lastError = "Topic / prompt is required."
            return
        }
        guard !activeProviderIds.isEmpty else {
            lastError = "Select at least one provider."
            return
        }

        isRunning = true
        lastError = nil
        errorsQueue = []
        failedProviderIds = []

        let selectedIds = Array(activeProviderIds)

        Task {
            defer { isRunning = false }
            let stream = client.ciRunStream(
                prompt: prompt,
                providerIds: selectedIds,
                domain: domain
            )
            do {
                for try await event in stream {
                    guard let raw = event.data.data(using: .utf8),
                          let payload = try? JSONDecoder().decode(CIEventPayload.self, from: raw)
                    else { continue }

                    switch payload.event {
                    case "ci.provider.result":
                        if let pairId = payload.pairId,
                           let rawText = payload.raw,
                           let reconstruction = payload.reconstruction,
                           let providerId = payload.providerId {
                            let pair = PendingDPOPair(
                                id: pairId,
                                prompt: prompt,
                                raw: rawText,
                                detected: payload.detected ?? [],
                                reconstruction: reconstruction,
                                provider: providerId,
                                domain: domain
                            )
                            pendingPairs.append(pair)
                        }

                    case "ci.provider.failed", "ci.provider.unavailable",
                         "ci.provider.throttled", "ci.provider.unparseable",
                         "ci.provider.skipped":
                        let pid = payload.providerId ?? "unknown"
                        let reason = payload.error ?? payload.reason ?? payload.event
                        errorsQueue.append("\(pid): \(reason)")
                        if !failedProviderIds.contains(pid) {
                            failedProviderIds.append(pid)
                        }

                    default:
                        break
                    }
                }
            } catch {
                lastError = error.localizedDescription
                backendUnavailable = true
            }
        }
    }

    // MARK: - Review

    func acceptPair(id: String, client: HarnessClient) async {
        do {
            let response = try await client.reviewDPOPair(pairId: id, action: "accept")
            switch response.status {
            case "accepted":
                pendingPairs.removeAll { $0.id == id }
                _blockedInvariants.removeValue(forKey: id)
            case "rejected":
                if let invariant = response.invariant {
                    _blockedInvariants[id] = invariant
                }
            default:
                break
            }
        } catch {
            lastError = error.localizedDescription
        }
    }

    func discardPair(id: String, client: HarnessClient) {
        Task {
            do {
                _ = try await client.reviewDPOPair(pairId: id, action: "discard")
            } catch {
                // Discard is best-effort; remove locally regardless.
            }
            pendingPairs.removeAll { $0.id == id }
            _blockedInvariants.removeValue(forKey: id)
        }
    }

    // MARK: - Retry failed

    func retryFailed(client: HarnessClient) {
        let prompt = topicInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !prompt.isEmpty, !failedProviderIds.isEmpty else { return }

        isRunning = true
        lastError = nil
        let retryIds = failedProviderIds
        failedProviderIds = []

        Task {
            defer { isRunning = false }
            let stream = client.retryCI(prompt: prompt, providerIds: retryIds, domain: domain)
            do {
                for try await event in stream {
                    guard let raw = event.data.data(using: .utf8),
                          let payload = try? JSONDecoder().decode(CIEventPayload.self, from: raw)
                    else { continue }

                    switch payload.event {
                    case "ci.provider.result":
                        if let pairId = payload.pairId,
                           let rawText = payload.raw,
                           let reconstruction = payload.reconstruction,
                           let providerId = payload.providerId {
                            let pair = PendingDPOPair(
                                id: pairId,
                                prompt: prompt,
                                raw: rawText,
                                detected: payload.detected ?? [],
                                reconstruction: reconstruction,
                                provider: providerId,
                                domain: domain
                            )
                            pendingPairs.append(pair)
                        }

                    case "ci.provider.failed", "ci.provider.unavailable",
                         "ci.provider.throttled", "ci.provider.unparseable",
                         "ci.provider.skipped":
                        let pid = payload.providerId ?? "unknown"
                        let reason = payload.error ?? payload.reason ?? payload.event
                        errorsQueue.append("\(pid): \(reason)")
                        if !failedProviderIds.contains(pid) {
                            failedProviderIds.append(pid)
                        }

                    default:
                        break
                    }
                }
            } catch {
                lastError = error.localizedDescription
            }
        }
    }

    // MARK: - Audit

    func syncAudit(client: HarnessClient) async {
        do {
            auditEntries = try await client.fetchAuditEntries(limit: 200)
        } catch {
            // audit is non-critical; suppress
        }
    }

    // MARK: - Invariant helpers

    func blockedInvariant(for pairId: String) -> String? {
        if let local = _blockedInvariants[pairId] { return local }
        return auditEntries
            .reversed()
            .first { $0.mutationRef == pairId && $0.decision == "rejected" }
            .flatMap { $0.invariant }
    }

    // MARK: - Private SSE payload DTO

    private struct CIEventPayload: Decodable {
        let event: String?
        let providerId: String?
        let raw: String?
        let detected: [String]?
        let reconstruction: String?
        let pairId: String?
        let error: String?
        let reason: String?
        let countdown: Int?

        enum CodingKeys: String, CodingKey {
            case event
            case providerId     = "provider_id"
            case raw
            case detected
            case reconstruction
            case pairId         = "pair_id"
            case error
            case reason
            case countdown
        }
    }
}

#endif

//
//  InvariantViewModel.swift
//  decodingOppression
//
//  macOS-only: observable state for InvariantStatusView (T6).
//

#if os(macOS)

import Foundation
import SwiftData

// MARK: - InvariantViewModel

@Observable
@MainActor
final class InvariantViewModel {

    // MARK: State

    var invariants: [InvariantDTO] = []
    var auditEntries: [AuditEntryDTO] = []
    var killSwitchActive: Bool = false
    var isHalting: Bool = false
    var backendUnavailable: Bool = false
    var lastError: String?

    // MARK: - Lifecycle

    func onAppear(client: HarnessClient, context: ModelContext) {
        backendUnavailable = !client.status.isOnline
        Task { await refresh(client: client, context: context) }
    }

    func refresh(client: HarnessClient, context: ModelContext) async {
        guard client.status.isOnline else {
            backendUnavailable = true
            return
        }
        backendUnavailable = false
        lastError = nil

        async let invTask: Void = loadInvariants(client: client)
        async let auditTask: Void = loadAudit(client: client, context: context)
        _ = await (invTask, auditTask)
    }

    // MARK: - Kill-switch

    func toggleKillSwitch(client: HarnessClient) {
        let target = !killSwitchActive
        isHalting = true
        Task {
            do {
                try await client.setKillSwitch(active: target)
                killSwitchActive = target
            } catch {
                lastError = error.localizedDescription
            }
            isHalting = false
        }
    }

    // MARK: - Private loaders

    private func loadInvariants(client: HarnessClient) async {
        do {
            let dto = try await client.fetchInvariants()
            invariants = dto.invariants
            if let ks = dto.invariants.first(where: { $0.name == "human_kill_switch" }) {
                killSwitchActive = ks.armed ?? false
            }
        } catch {
            lastError = error.localizedDescription
        }
    }

    private func loadAudit(client: HarnessClient, context: ModelContext) async {
        do {
            let entries = try await client.fetchAuditEntries(limit: 100)
            auditEntries = Array(entries.reversed())
            HarnessSwiftDataBridge.upsertAuditEntries(entries, context: context)
        } catch {
            // Non-critical; retain previous entries.
        }
    }
}

#endif

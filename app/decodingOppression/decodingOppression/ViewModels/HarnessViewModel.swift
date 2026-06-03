//
//  HarnessViewModel.swift
//  decodingOppression
//
//  macOS-only: observable state for HarnessDashboardView.
//

#if os(macOS)

import Foundation
import SwiftUI

@Observable
@MainActor
final class HarnessViewModel {

    // MARK: State

    var backendStatus: HarnessClient.BackendStatus = .offline
    var lastError: String?
    var evalCardStatus: String = "—"
    var curriculumCardStatus: String = "—"
    var ciCardStatus: String = "—"
    var retrainCardStatus: String = "—"
    var invariantCardStatus: String = "—"
    var isLaunching: Bool = false
    var runningJob: String?
    var queuedJobs: [String] = []

    // MARK: - Methods

    func onAppear(client: HarnessClient) async {
        backendStatus = client.status
        await client.connect()
        backendStatus = client.status
        await refresh(client: client)
    }

    func startOrRetryDaemon(client: HarnessClient) async {
        isLaunching = true
        lastError = nil
        await client.launchDaemon()
        backendStatus = client.status
        isLaunching = false
        if case .authFailed(let msg) = client.status {
            lastError = msg
        }
        if client.status == .online {
            await refresh(client: client)
        }
    }

    func refresh(client: HarnessClient) async {
        guard client.status == .online else { return }
        do {
            let summary = try await client.fetchDashboardSummary()
            evalCardStatus = summary.evalStatus
            curriculumCardStatus = summary.curriculumStatus
            ciCardStatus = summary.ciStatus
            retrainCardStatus = summary.retrainStatus
            invariantCardStatus = summary.invariantStatus
        } catch {
            lastError = error.localizedDescription
        }
        do {
            let jobs = try await client.fetchJobStatus()
            runningJob = jobs.running
            queuedJobs = jobs.queued
        } catch {
            // Job status is non-critical; surface errors silently.
        }
    }
}

#endif

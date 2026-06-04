//
//  HarnessDashboardView.swift
//  decodingOppression
//
//  macOS-only: dashboard hub for the Harness subsystem.
//

#if os(macOS)

import SwiftUI

// MARK: - HarnessDashboardView

struct HarnessDashboardView: View {
    @Bindable var viewModel: HarnessViewModel
    @Bindable var evalViewModel: EvalViewModel
    @Bindable var invariantViewModel: InvariantViewModel
    @Bindable var curriculumViewModel: CurriculumViewModel
    @Bindable var ciViewModel: CounterInterferenceViewModel
    @Bindable var retrainViewModel: RetrainViewModel
    @EnvironmentObject private var deps: AppDependencies

    private let cardColumns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                backendStatusRow
                cardsGrid
                jobsRow
            }
            .padding(20)
        }
        .navigationTitle("Harness Dashboard")
        .task { await viewModel.onAppear(client: deps.harnessClient) }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    Task { await viewModel.refresh(client: deps.harnessClient) }
                } label: {
                    Label("Refresh", systemImage: "arrow.clockwise")
                }
                .disabled(viewModel.isLaunching)
            }
        }
    }

    // MARK: Backend status row

    private var backendStatusRow: some View {
        GroupBox {
            HStack(spacing: 10) {
                statusDot(for: viewModel.backendStatus)
                Text(viewModel.backendStatus.displayString)
                    .foregroundStyle(statusForeground(for: viewModel.backendStatus))
                Spacer()
                if viewModel.backendStatus != .online {
                    Button(viewModel.isLaunching ? "Launching…" : "Start Daemon") {
                        Task { await viewModel.startOrRetryDaemon(client: deps.harnessClient) }
                    }
                    .disabled(viewModel.isLaunching)
                }
            }
            if let err = viewModel.lastError {
                Text(err)
                    .foregroundStyle(.red)
                    .font(.caption)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }

    // MARK: Cards grid

    private var cardsGrid: some View {
        LazyVGrid(columns: cardColumns, spacing: 12) {
            HarnessCard(
                title: "Evaluation",
                systemImage: "chart.bar.doc.horizontal",
                status: viewModel.evalCardStatus,
                isAvailable: viewModel.backendStatus == .online
            ) {
                EvaluationView(viewModel: evalViewModel)
            }

            HarnessCard(
                title: "Curriculum",
                systemImage: "books.vertical",
                status: viewModel.curriculumCardStatus,
                isAvailable: viewModel.backendStatus == .online
            ) {
                CurriculumView(viewModel: curriculumViewModel)
            }

            HarnessCard(
                title: "Counter-Interference",
                systemImage: "arrow.triangle.2.circlepath",
                status: viewModel.ciCardStatus,
                isAvailable: viewModel.backendStatus == .online
            ) {
                CounterInterferenceView(viewModel: ciViewModel)
            }

            HarnessCard(
                title: "Retrain Loop",
                systemImage: "repeat.circle",
                status: retrainCardStatus,
                isAvailable: viewModel.backendStatus == .online
            ) {
                RetrainLoopView(viewModel: retrainViewModel)
            }

            HarnessCard(
                title: "Invariant Status",
                systemImage: "checkmark.shield",
                status: viewModel.backendStatus == .online ? viewModel.invariantCardStatus : "Unavailable",
                isAvailable: viewModel.backendStatus == .online
            ) {
                InvariantStatusView(viewModel: invariantViewModel)
            }
        }
    }

    // MARK: Jobs row

    private var jobsRow: some View {
        GroupBox("Heavy Jobs") {
            VStack(alignment: .leading, spacing: 4) {
                if let running = viewModel.runningJob {
                    Label(running, systemImage: "gearshape.arrow.triangle.2.circlepath")
                        .font(.callout)
                } else {
                    Text("No job running").foregroundStyle(.secondary).font(.callout)
                }
                if !viewModel.queuedJobs.isEmpty {
                    Text("\(viewModel.queuedJobs.count) queued: \(viewModel.queuedJobs.joined(separator: ", "))")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    // MARK: - Retrain card status

    private var retrainCardStatus: String {
        if retrainViewModel.isTraining {
            return "Training…"
        } else if retrainViewModel.completedAdapterPath != nil && retrainViewModel.latestEvalRun == nil {
            return "Eval pending"
        } else if retrainViewModel.canPromote {
            return "Promote ready"
        } else {
            return viewModel.retrainCardStatus
        }
    }

    // MARK: - Helpers

    @ViewBuilder
    private func statusDot(for backendStatus: HarnessClient.BackendStatus) -> some View {
        Circle()
            .fill(statusColor(for: backendStatus))
            .frame(width: 10, height: 10)
    }

    private func statusColor(for status: HarnessClient.BackendStatus) -> Color {
        switch status {
        case .online:           return .green
        case .launching:        return .orange
        case .offline, .authFailed: return .red
        }
    }

    private func statusForeground(for status: HarnessClient.BackendStatus) -> Color {
        switch status {
        case .online:           return .primary
        case .launching:        return .orange
        case .offline, .authFailed: return .red
        }
    }
}

// MARK: - HarnessCard

private struct HarnessCard<Destination: View>: View {
    let title: String
    let systemImage: String
    let status: String
    let isAvailable: Bool
    @ViewBuilder let destination: () -> Destination

    @State private var showingDetail = false

    var body: some View {
        Button { showingDetail = true } label: {
            VStack(alignment: .leading, spacing: 8) {
                Label(title, systemImage: systemImage)
                    .font(.headline)
                    .foregroundStyle(isAvailable ? .primary : .secondary)
                Spacer(minLength: 4)
                Text(isAvailable ? status : "Unavailable")
                    .font(.subheadline)
                    .foregroundStyle(isAvailable ? .primary : .secondary)
                    .lineLimit(2)
            }
            .padding(14)
            .frame(maxWidth: .infinity, minHeight: 80, alignment: .leading)
            .background(.background)
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.separator, lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
        .sheet(isPresented: $showingDetail) {
            destination()
                .frame(minWidth: 400, minHeight: 300)
        }
    }
}

// MARK: - Preview

#Preview {
    HarnessDashboardView(
        viewModel: HarnessViewModel(),
        evalViewModel: EvalViewModel(),
        invariantViewModel: InvariantViewModel(),
        curriculumViewModel: CurriculumViewModel(),
        ciViewModel: CounterInterferenceViewModel(),
        retrainViewModel: RetrainViewModel()
    )
    .environmentObject(AppDependencies.shared)
    .frame(width: 700, height: 600)
}

#endif

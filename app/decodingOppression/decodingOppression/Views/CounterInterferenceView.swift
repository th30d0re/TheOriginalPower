//
//  CounterInterferenceView.swift
//  decodingOppression
//
//  macOS-only: provider roster, CI fan-out run, DPO pair review queue (T8).
//

#if os(macOS)

import SwiftUI

// MARK: - CounterInterferenceView

struct CounterInterferenceView: View {
    @Bindable var viewModel: CounterInterferenceViewModel
    @EnvironmentObject private var deps: AppDependencies

    var body: some View {
        ZStack {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 16) {
                    rosterSection
                    runSection
                    if !viewModel.pendingPairs.isEmpty {
                        resultsSection
                    }
                    if !viewModel.errorsQueue.isEmpty {
                        errorsSection
                    }
                    if let error = viewModel.lastError {
                        Text(error)
                            .foregroundStyle(.red)
                            .font(.caption)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }
                .padding(20)
            }

            if viewModel.backendUnavailable {
                backendUnavailableOverlay
            }
        }
        .navigationTitle("Counter-Interference")
        .onAppear {
            viewModel.onAppear(client: deps.harnessClient)
        }
    }

    // MARK: Roster section

    private var rosterSection: some View {
        GroupBox("Providers") {
            if viewModel.providers.isEmpty {
                Text("Loading provider roster…")
                    .foregroundStyle(.secondary)
                    .font(.subheadline)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(viewModel.providers) { provider in
                            ProviderPill(
                                provider: provider,
                                isActive: viewModel.activeProviderIds.contains(provider.id)
                            ) {
                                viewModel.toggleProvider(id: provider.id)
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }
            }
        }
    }

    // MARK: Run section

    private var runSection: some View {
        GroupBox {
            VStack(alignment: .leading, spacing: 10) {
                TextField("Enter topic or prompt…", text: $viewModel.topicInput)
                    .textFieldStyle(.roundedBorder)
                HStack(spacing: 10) {
                    Button(viewModel.isRunning ? "Running…" : "Run") {
                        viewModel.runCI(client: deps.harnessClient)
                    }
                    .disabled(
                        viewModel.isRunning
                            || viewModel.backendUnavailable
                            || viewModel.topicInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                    )
                    .buttonStyle(.borderedProminent)

                    if viewModel.isRunning {
                        ProgressView()
                            .progressViewStyle(.circular)
                            .scaleEffect(0.7)
                    }
                }
            }
        }
    }

    // MARK: Results section

    private var resultsSection: some View {
        GroupBox("Review Queue (\(viewModel.pendingPairs.count))") {
            ForEach(viewModel.pendingPairs) { pair in
                PairCard(
                    pair: pair,
                    blockedInvariant: viewModel.blockedInvariant(for: pair.id)
                ) {
                    Task { await viewModel.acceptPair(id: pair.id, client: deps.harnessClient) }
                } onDiscard: {
                    viewModel.discardPair(id: pair.id, client: deps.harnessClient)
                }
                if pair.id != viewModel.pendingPairs.last?.id {
                    Divider().padding(.vertical, 4)
                }
            }
        }
    }

    // MARK: Errors section

    private var errorsSection: some View {
        GroupBox {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Label("\(viewModel.errorsQueue.count) provider issue(s)", systemImage: "exclamationmark.triangle.fill")
                        .foregroundStyle(.orange)
                        .font(.subheadline)
                    Spacer()
                    if !viewModel.failedProviderIds.isEmpty {
                        Button("Retry Failed Providers") {
                            viewModel.retryFailed(client: deps.harnessClient)
                        }
                        .buttonStyle(.bordered)
                        .disabled(viewModel.isRunning)
                    }
                }
                ForEach(viewModel.errorsQueue.indices, id: \.self) { idx in
                    Text(viewModel.errorsQueue[idx])
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    // MARK: Backend unavailable overlay

    private var backendUnavailableOverlay: some View {
        ZStack {
            Color.black.opacity(0.35)
                .ignoresSafeArea()
            VStack(spacing: 12) {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 40))
                    .foregroundStyle(.orange)
                Text("Harness backend unavailable")
                    .font(.headline)
                Text("Start the daemon from the Harness Dashboard.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding(24)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
        }
    }
}

// MARK: - ProviderPill

private struct ProviderPill: View {
    let provider: ProviderDTO
    let isActive: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            HStack(spacing: 6) {
                Circle()
                    .fill(availabilityColor)
                    .frame(width: 8, height: 8)
                Text(provider.name)
                    .font(.callout)
                if provider.throttled, let countdown = provider.throttleCountdownSeconds {
                    Text("(\(countdown)s)")
                        .font(.caption2)
                        .foregroundStyle(.orange)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(isActive ? Color.accentColor.opacity(0.15) : Color.secondary.opacity(0.08))
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(isActive ? Color.accentColor : Color.secondary.opacity(0.25), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
        .opacity(provider.available ? 1.0 : 0.5)
    }

    private var availabilityColor: Color {
        if provider.throttled { return .orange }
        return provider.available ? .green : .red
    }
}

// MARK: - PairCard

private struct PairCard: View {
    let pair: PendingDPOPair
    let blockedInvariant: String?
    let onAccept: () -> Void
    let onDiscard: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Provider label
            HStack {
                Text(pair.provider)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.accentColor.opacity(0.12))
                    .clipShape(Capsule())
                if let domain = pair.domain {
                    Text(domain)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
            }

            // Detected obfuscation tags
            if !pair.detected.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(pair.detected, id: \.self) { tag in
                            Text(tag.replacingOccurrences(of: "_", with: " "))
                                .font(.caption2)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.orange.opacity(0.15))
                                .foregroundStyle(.orange)
                                .clipShape(Capsule())
                        }
                    }
                }
            }

            // Two-column layout: rejected | chosen
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Rejected (raw)")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                    Text(pair.raw)
                        .font(.caption)
                        .lineLimit(8)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(maxWidth: .infinity)
                .padding(8)
                .background(Color.red.opacity(0.05))
                .clipShape(RoundedRectangle(cornerRadius: 6))

                VStack(alignment: .leading, spacing: 4) {
                    Text("Chosen (reconstruction)")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                    Text(pair.reconstruction)
                        .font(.caption)
                        .lineLimit(8)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(maxWidth: .infinity)
                .padding(8)
                .background(Color.green.opacity(0.05))
                .clipShape(RoundedRectangle(cornerRadius: 6))
            }

            // Invariant block indicator
            if let invariant = blockedInvariant {
                Label(invariant, systemImage: "exclamationmark.triangle.fill")
                    .font(.caption2)
                    .foregroundStyle(.orange)
            }

            // Action buttons
            HStack(spacing: 10) {
                Button("Accept") { onAccept() }
                    .buttonStyle(.borderedProminent)
                    .tint(.green)
                    .controlSize(.small)
                Button("Discard") { onDiscard() }
                    .buttonStyle(.bordered)
                    .controlSize(.small)
            }
        }
        .padding(.vertical, 8)
    }
}

// MARK: - Preview

#Preview {
    CounterInterferenceView(viewModel: CounterInterferenceViewModel())
        .environmentObject(AppDependencies.shared)
        .frame(width: 700, height: 600)
}

#endif

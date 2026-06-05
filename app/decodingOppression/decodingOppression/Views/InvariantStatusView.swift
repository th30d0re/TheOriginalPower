//
//  InvariantStatusView.swift
//  decodingOppression
//
//  macOS-only: full invariant status, audit log, and kill-switch UI (T6).
//

#if os(macOS)

import SwiftData
import SwiftUI

// MARK: - InvariantStatusView

struct InvariantStatusView: View {
    @Bindable var viewModel: InvariantViewModel
    @EnvironmentObject private var deps: AppDependencies
    @Environment(\.modelContext) private var context

    /// When set, the audit log is filtered to entries matching this invariant name.
    @State private var selectedInvariant: String? = nil
    @State private var showKillSwitchConfirm: Bool = false

    var body: some View {
        if viewModel.backendUnavailable {
            unavailableState
        } else {
            mainContent
        }
    }

    // MARK: - Main layout

    private var mainContent: some View {
        VStack(alignment: .leading, spacing: 0) {
            header
            Divider()
            invariantSection
            Divider()
            auditSection
            Divider()
            killSwitchFooter
        }
        .task { viewModel.onAppear(client: deps.harnessClient, context: context) }
    }

    // MARK: Header

    private var header: some View {
        HStack {
            Label("Invariant Status", systemImage: "checkmark.shield")
                .font(.title3.bold())
            Spacer()
            Button {
                Task { await viewModel.refresh(client: deps.harnessClient, context: context) }
            } label: {
                Label("Refresh", systemImage: "arrow.clockwise")
            }
            .buttonStyle(.bordered)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }

    // MARK: Invariant rows

    private var invariantSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(viewModel.invariants, id: \.name) { inv in
                InvariantRow(
                    invariant: inv,
                    isSelected: selectedInvariant == inv.name,
                    onTap: {
                        selectedInvariant = selectedInvariant == inv.name ? nil : inv.name
                    }
                )
                Divider().padding(.leading, 40)
            }

            if viewModel.invariants.isEmpty {
                Text("No invariant data — daemon may be offline.")
                    .foregroundStyle(.secondary)
                    .font(.callout)
                    .padding(16)
            }
        }
    }

    // MARK: Audit log

    private var filteredEntries: [AuditEntryDTO] {
        guard let filter = selectedInvariant else { return viewModel.auditEntries }
        return viewModel.auditEntries.filter { $0.invariant == filter }
    }

    private var auditSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Audit Log")
                    .font(.headline)
                if let filter = selectedInvariant {
                    Text("· filtered: \(filter)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Button("Clear") { selectedInvariant = nil }
                        .font(.caption)
                        .buttonStyle(.plain)
                        .foregroundStyle(.blue)
                }
                Spacer()
                Text("\(filteredEntries.count) entries")
                    .font(.caption)
                    .foregroundStyle(.tertiary)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)

            if filteredEntries.isEmpty {
                Text("No audit entries.")
                    .foregroundStyle(.secondary)
                    .font(.callout)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 12)
            } else {
                List(filteredEntries, id: \.id) { entry in
                    AuditEntryRow(entry: entry)
                }
                .listStyle(.plain)
                .frame(minHeight: 160, maxHeight: 280)
            }
        }
    }

    // MARK: Kill-switch footer

    private var killSwitchFooter: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(viewModel.killSwitchActive ? "Kill-switch armed — writes blocked" : "Kill-switch disarmed")
                    .font(.callout)
                    .foregroundStyle(viewModel.killSwitchActive ? .red : .secondary)
                if let err = viewModel.lastError {
                    Text(err)
                        .font(.caption)
                        .foregroundStyle(.red)
                }
            }
            Spacer()
            Button(role: .destructive) {
                showKillSwitchConfirm = true
            } label: {
                Label(
                    viewModel.killSwitchActive ? "Disarm" : "Halt Recursive Loop",
                    systemImage: viewModel.killSwitchActive ? "lock.open" : "stop.circle"
                )
            }
            .buttonStyle(.borderedProminent)
            .tint(viewModel.killSwitchActive ? .orange : .red)
            .disabled(viewModel.isHalting)
            .confirmationDialog(
                viewModel.killSwitchActive
                    ? "Disarm the kill-switch? Writes will resume."
                    : "Arm the kill-switch? All daemon writes will be blocked immediately.",
                isPresented: $showKillSwitchConfirm,
                titleVisibility: .visible
            ) {
                Button(viewModel.killSwitchActive ? "Disarm" : "Halt", role: .destructive) {
                    viewModel.toggleKillSwitch(client: deps.harnessClient)
                }
                Button("Cancel", role: .cancel) { }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }

    // MARK: Unavailable state

    private var unavailableState: some View {
        ContentUnavailableView {
            Label("Daemon Offline", systemImage: "exclamationmark.triangle")
        } description: {
            Text("The Harness daemon is not reachable. Start it from the dashboard.")
        } actions: {
            Button("Retry") {
                Task { await viewModel.refresh(client: deps.harnessClient, context: context) }
            }
        }
    }
}

// MARK: - InvariantRow

private struct InvariantRow: View {
    let invariant: InvariantDTO
    let isSelected: Bool
    let onTap: () -> Void

    private var displayName: String {
        switch invariant.name {
        case "5_tier_ontology":       return "5-Tier Ontology"
        case "predatory_min_max":     return "Predatory Min-Max"
        case "tri_modal_enclosure":   return "Tri-Modal Enclosure"
        case "anti_extraction_priors": return "Anti-Extraction Priors"
        case "human_kill_switch":     return "Human Kill-Switch"
        default:                      return invariant.name
        }
    }

    private var statusText: String {
        if invariant.name == "human_kill_switch" {
            return invariant.armed == true ? "armed" : "disarmed"
        }
        return invariant.holding ? "holding" : "1 rejection"
    }

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 10) {
                Circle()
                    .fill(invariant.holding ? Color.green : Color.red)
                    .frame(width: 10, height: 10)
                Text(displayName)
                    .font(.callout)
                Spacer()
                Text(statusText)
                    .font(.caption)
                    .foregroundStyle(invariant.holding ? Color.secondary : Color.red)
                if isSelected {
                    Image(systemName: "line.3.horizontal.decrease.circle.fill")
                        .foregroundStyle(.blue)
                        .font(.caption)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(isSelected ? Color.accentColor.opacity(0.08) : Color.clear)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

// MARK: - AuditEntryRow

private struct AuditEntryRow: View {
    let entry: AuditEntryDTO

    private var decisionColor: Color {
        entry.decision == "accepted" ? .green : .red
    }

    private var formattedTS: String {
        guard let ts = entry.ts else { return "" }
        let f = DateFormatter()
        f.dateStyle = .none
        f.timeStyle = .medium
        return f.string(from: ts)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(spacing: 6) {
                Circle()
                    .fill(decisionColor)
                    .frame(width: 8, height: 8)
                if let ref = entry.mutationRef {
                    Text("mutation \(ref.prefix(8))")
                        .font(.caption.monospaced())
                        .foregroundStyle(.primary)
                }
                if let inv = entry.invariant {
                    Text("· \(inv)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Text(formattedTS)
                    .font(.caption2)
                    .foregroundStyle(.tertiary)
            }
            if let reason = entry.reason {
                Text(reason)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
                    .padding(.leading, 14)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Preview

#Preview {
    InvariantStatusView(viewModel: InvariantViewModel())
        .environmentObject(AppDependencies.shared)
        .frame(width: 560, height: 640)
}

#endif

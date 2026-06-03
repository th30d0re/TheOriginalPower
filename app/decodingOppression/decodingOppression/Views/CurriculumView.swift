//
//  CurriculumView.swift
//  decodingOppression
//
//  macOS-only: URL ingestion, per-source SSE status, staging review,
//  and Curator-gated promotion (T7).
//

#if os(macOS)

import SwiftUI

// MARK: - CurriculumView

struct CurriculumView: View {
    @Bindable var viewModel: CurriculumViewModel
    @EnvironmentObject private var deps: AppDependencies

    @State private var showingReviewSheet = false

    var body: some View {
        ZStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    domainPicker
                    sourceInputRow
                    sourceList
                    stagingRow
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
        .navigationTitle("Curriculum")
        .onAppear {
            viewModel.onAppear(client: deps.harnessClient)
        }
        .sheet(isPresented: $showingReviewSheet) {
            stagingReviewSheet
        }
    }

    // MARK: Domain picker

    private var domainPicker: some View {
        Picker("Domain", selection: $viewModel.selectedDomain) {
            ForEach(CurriculumViewModel.domainKeys, id: \.self) { key in
                Text(CurriculumViewModel.domainDisplayNames[key] ?? key).tag(key)
            }
        }
        .pickerStyle(.segmented)
    }

    // MARK: Source input row

    private var sourceInputRow: some View {
        GroupBox {
            HStack(spacing: 10) {
                TextField("Add source URL…", text: $viewModel.urlInput)
                    .textFieldStyle(.roundedBorder)
                Button("Add") {
                    viewModel.addSource(client: deps.harnessClient)
                }
                .disabled(viewModel.isIngesting || viewModel.urlInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                .buttonStyle(.borderedProminent)
            }
        }
    }

    // MARK: Source list

    private var sourceList: some View {
        let filtered = viewModel.sources.filter { $0.domain == viewModel.selectedDomain }
        return Group {
            if filtered.isEmpty {
                Text("No sources added for this domain.")
                    .foregroundStyle(.secondary)
                    .font(.subheadline)
                    .frame(maxWidth: .infinity, alignment: .leading)
            } else {
                GroupBox("Sources") {
                    List(filtered) { source in
                        SourceRow(source: source) {
                            viewModel.urlInput = source.url
                            viewModel.addSource(client: deps.harnessClient)
                        }
                    }
                    .listStyle(.plain)
                    .frame(minHeight: 80, maxHeight: 240)
                }
            }
        }
    }

    // MARK: Staging row

    private var stagingRow: some View {
        let count = viewModel.stagingItems.count
        return HStack {
            Button("Review Staging (\(count))") {
                showingReviewSheet = true
            }
            .buttonStyle(.bordered)
            .disabled(count == 0)
            Spacer()
        }
    }

    // MARK: Staging review sheet

    private var stagingReviewSheet: some View {
        NavigationStack {
            VStack(spacing: 0) {
                List(viewModel.stagingItems) { item in
                    StagingItemRow(
                        item: item,
                        isSelected: viewModel.selectedStagingIds.contains(item.id),
                        blockedInvariant: viewModel.blockedInvariant(for: item.id)
                    ) {
                        if viewModel.selectedStagingIds.contains(item.id) {
                            viewModel.selectedStagingIds.remove(item.id)
                        } else {
                            viewModel.selectedStagingIds.insert(item.id)
                        }
                    }
                }
                .listStyle(.plain)

                Divider()

                HStack(spacing: 12) {
                    Button("Mark Reviewed") {
                        viewModel.markReviewed(client: deps.harnessClient)
                    }
                    .disabled(viewModel.selectedStagingIds.isEmpty)
                    .buttonStyle(.bordered)

                    Button(viewModel.isPromoting ? "Promoting…" : "Promote Selected") {
                        viewModel.promote(client: deps.harnessClient)
                    }
                    .disabled(viewModel.isPromoting || viewModel.selectedStagingIds.isEmpty)
                    .buttonStyle(.borderedProminent)
                    .tint(.green)

                    Spacer()

                    if let error = viewModel.lastError {
                        Text(error)
                            .foregroundStyle(.red)
                            .font(.caption)
                            .lineLimit(2)
                            .frame(maxWidth: 260, alignment: .trailing)
                    }
                }
                .padding(12)
                .background(.bar)
            }
            .navigationTitle("Staging Review")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { showingReviewSheet = false }
                }
            }
            .task { await viewModel.loadStaging(client: deps.harnessClient) }
        }
        .frame(minWidth: 540, minHeight: 420)
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

// MARK: - SourceRow

private struct SourceRow: View {
    let source: SourceStatus
    let onRetry: () -> Void

    var body: some View {
        HStack(spacing: 10) {
            statusIcon
            VStack(alignment: .leading, spacing: 2) {
                Text(source.url)
                    .font(.subheadline)
                    .lineLimit(1)
                Text(source.status.displayLabel)
                    .font(.caption)
                    .foregroundStyle(source.status.isError ? .red : .secondary)
            }
            Spacer()
            if source.status.isError {
                Button("Retry") { onRetry() }
                    .font(.caption)
                    .buttonStyle(.bordered)
            }
        }
        .padding(.vertical, 4)
    }

    @ViewBuilder
    private var statusIcon: some View {
        switch source.status {
        case .queued:
            Image(systemName: "clock")
                .foregroundStyle(.secondary)
        case .transcribing:
            ProgressView()
                .progressViewStyle(.circular)
                .scaleEffect(0.7)
        case .ready:
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(.green)
        case .error:
            Image(systemName: "xmark.circle.fill")
                .foregroundStyle(.red)
        }
    }
}

// MARK: - StagingItemRow

private struct StagingItemRow: View {
    let item: StagingItemDTO
    let isSelected: Bool
    let blockedInvariant: String?
    let onToggle: () -> Void

    var body: some View {
        HStack(spacing: 10) {
            Toggle("", isOn: Binding(get: { isSelected }, set: { _ in onToggle() }))
                .labelsHidden()
                .toggleStyle(.checkbox)

            VStack(alignment: .leading, spacing: 3) {
                HStack(spacing: 6) {
                    if let itemType = item.itemType {
                        Text(itemType)
                            .font(.caption)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.accentColor.opacity(0.15))
                            .clipShape(Capsule())
                    }
                    if let domain = item.domain {
                        Text(CurriculumViewModel.domainDisplayNames[domain] ?? domain)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
                Text(item.reviewState ?? "staged")
                    .font(.caption2)
                    .foregroundStyle(reviewStateColor)
                if let invariant = blockedInvariant {
                    Label(invariant, systemImage: "exclamationmark.triangle")
                        .font(.caption2)
                        .foregroundStyle(.orange)
                }
            }
            Spacer()
        }
        .padding(.vertical, 4)
    }

    private var reviewStateColor: Color {
        switch item.reviewState {
        case "reviewed":  return .green
        case "promoted":  return .blue
        default:          return .secondary
        }
    }
}

// MARK: - Preview

#Preview {
    CurriculumView(viewModel: CurriculumViewModel())
        .environmentObject(AppDependencies.shared)
        .frame(width: 700, height: 600)
}

#endif

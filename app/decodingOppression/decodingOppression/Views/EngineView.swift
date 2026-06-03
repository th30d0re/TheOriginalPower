//
//  EngineView.swift
//  decodingOppression
//
//  Root Ledger Engine chat interface for open-ended narrative analysis.
//

import SwiftUI

struct EngineView: View {
    @State private var viewModel: EngineViewModel

    init(tier2Engine: Tier2Engine) {
        _viewModel = State(initialValue: EngineViewModel(tier2Engine: tier2Engine))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            header

            promptInput

            if viewModel.isLoading {
                ProgressView("Thinking…")
                    .padding(.vertical, 8)
            }

            if let error = viewModel.errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundStyle(.red)
                    .padding(12)
                    .background(Color.red.opacity(0.1), in: RoundedRectangle(cornerRadius: 8))
            }

            if !viewModel.response.isEmpty {
                responsePanel
            }

            Spacer()
        }
        .padding(24)
        .navigationTitle("Root Ledger Engine")
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Mathematics of Oppression")
                .font(.headline)
            Text("Ask the Root Ledger engine to analyze policies, clauses, or historical events using electrodynamic, thermodynamic, and systems-engineering analogies.")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    private var promptInput: some View {
        VStack(alignment: .leading, spacing: 8) {
            TextEditor(text: $viewModel.prompt)
                .font(.body)
                .frame(minHeight: 80, maxHeight: 120)
                .padding(8)
                .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 8))

            HStack {
                Button("Clear") {
                    viewModel.clear()
                }
                .buttonStyle(.borderless)
                .disabled(viewModel.response.isEmpty && viewModel.prompt.isEmpty)

                Spacer()

                Button("Send") {
                    Task {
                        await viewModel.send()
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(viewModel.prompt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || viewModel.isLoading)
            }
        }
    }

    private var responsePanel: some View {
        ScrollView {
            Text(viewModel.response)
                .font(.body)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color.secondary.opacity(0.08), in: RoundedRectangle(cornerRadius: 12))
        }
        .frame(maxHeight: .infinity)
    }
}

#Preview {
    NavigationStack {
        EngineView(tier2Engine: Tier2Engine(downloadManager: ModelDownloadManager.shared))
    }
}

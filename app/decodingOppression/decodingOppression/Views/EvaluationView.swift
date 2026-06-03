//
//  EvaluationView.swift
//  decodingOppression
//
//  macOS-only: evaluation UI — adapter picker, live progress, scorecard,
//  threshold editor, trend chart, and promote action (T5).
//

#if os(macOS)

import Charts
import SwiftData
import SwiftUI

// MARK: - EvaluationView

struct EvaluationView: View {
    @Bindable var viewModel: EvalViewModel
    @EnvironmentObject private var deps: AppDependencies
    @Environment(\.modelContext) private var modelContext

    @State private var drilledMetric: String?
    @State private var flagAlertText: String = ""
    @State private var flagAlertResult: FlagResult?
    @State private var showFlagAlert: Bool = false

    var body: some View {
        ZStack {
            ScrollView {
                VStack(alignment: .leading, spacing: EvaluationViewStyle.sectionSpacing) {
                    adapterRow
                    if viewModel.isRunning { progressSection }
                    if let scorecard = viewModel.scorecard { scorecardSection(scorecard) }
                    thresholdEditor
                    if !viewModel.history.isEmpty { trendChart }
                    promoteRow
                    if let error = viewModel.lastError {
                        Text(error)
                            .foregroundStyle(.red)
                            .font(.caption)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }
                .padding(EvaluationViewStyle.contentPadding)
            }

            if viewModel.backendUnavailable {
                backendUnavailableOverlay
            }
        }
        .navigationTitle("Evaluation")
        .onAppear {
            viewModel.onAppear(client: deps.harnessClient, context: modelContext)
        }
        .sheet(item: $drilledMetric) { metric in
            failingExamplesSheet(metric: metric)
        }
    }

    // MARK: Adapter row

    private var adapterRow: some View {
        GroupBox {
            HStack(spacing: 12) {
                Text("Adapter")
                    .font(.headline)
                if viewModel.adapters.isEmpty {
                    Text("No adapters available")
                        .foregroundStyle(.secondary)
                        .font(.subheadline)
                } else {
                    Picker("Adapter", selection: $viewModel.selectedAdapter) {
                        Text("None").tag(Optional<String>.none)
                        ForEach(viewModel.adapters, id: \.self) { path in
                            Text(path).tag(Optional(path))
                        }
                    }
                    .labelsHidden()
                    .frame(maxWidth: 320)
                }
                Spacer()
                Button("Run Evaluation") {
                    viewModel.runEvaluation(client: deps.harnessClient, context: modelContext)
                }
                .disabled(viewModel.isRunning || viewModel.selectedAdapter == nil)
                .buttonStyle(.borderedProminent)
            }
        }
    }

    // MARK: Live progress

    private var progressSection: some View {
        GroupBox("Running…") {
            VStack(alignment: .leading, spacing: 6) {
                ForEach(
                    viewModel.progressMetrics.sorted(by: { $0.key < $1.key }),
                    id: \.key
                ) { metric, value in
                    HStack {
                        Text(metric)
                            .font(.subheadline)
                            .frame(width: 140, alignment: .leading)
                        ProgressView(value: min(value, 1.0))
                            .progressViewStyle(.linear)
                        Text(EvaluationViewStyle.formatPercent(value))
                            .font(.caption)
                            .monospacedDigit()
                            .frame(width: 48, alignment: .trailing)
                    }
                }
                if viewModel.progressMetrics.isEmpty {
                    ProgressView()
                        .progressViewStyle(.linear)
                }
            }
        }
    }

    // MARK: Scorecard

    private func scorecardSection(_ scorecard: EvalRunResult) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Scorecard")
                .font(.headline)

            let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(scorecard.metrics, id: \.name) { metric in
                    MetricCard(metric: metric) {
                        drilledMetric = metric.name
                    }
                }
            }

            HStack {
                Label(
                    "Composite fidelity: \(EvaluationViewStyle.formatPercent(scorecard.fidelity))",
                    systemImage: scorecard.allPassed
                        ? "checkmark.seal.fill"
                        : "xmark.seal.fill"
                )
                .foregroundStyle(scorecard.allPassed ? .green : .red)
                .font(.subheadline)
                Spacer()
            }
        }
    }

    // MARK: Threshold editor

    private var thresholdEditor: some View {
        GroupBox("Thresholds") {
            VStack(spacing: 10) {
                thresholdRow(label: "Recall", value: $viewModel.thresholds.recall)
                thresholdRow(label: "Refusal", value: $viewModel.thresholds.refusal)
                thresholdRow(label: "Classification", value: $viewModel.thresholds.classification)
                thresholdRow(label: "Lexical Fractal", value: $viewModel.thresholds.lexicalFractal)

                if !viewModel.thresholds.weights.isEmpty {
                    Divider()
                    ForEach(
                        viewModel.thresholds.weights.keys.sorted(),
                        id: \.self
                    ) { key in
                        weightRow(key: key)
                    }
                }

                HStack {
                    Spacer()
                    Button(viewModel.isSavingThresholds ? "Saving…" : "Save") {
                        viewModel.saveThresholds(client: deps.harnessClient, context: modelContext)
                    }
                    .disabled(viewModel.isSavingThresholds)
                    .buttonStyle(.bordered)
                }
            }
        }
    }

    private func thresholdRow(label: String, value: Binding<Double>) -> some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .frame(width: 140, alignment: .leading)
            Slider(value: value, in: 0...1, step: 0.01)
            TextField("", value: value, format: .number.precision(.fractionLength(2)))
                .textFieldStyle(.roundedBorder)
                .frame(width: 56)
                .monospacedDigit()
        }
    }

    private func weightRow(key: String) -> some View {
        HStack {
            Text(key)
                .font(.caption)
                .foregroundStyle(.secondary)
                .frame(width: 140, alignment: .leading)
            if let binding = weightBinding(for: key) {
                Slider(value: binding, in: 0...1, step: 0.01)
                TextField("", value: binding, format: .number.precision(.fractionLength(2)))
                    .textFieldStyle(.roundedBorder)
                    .frame(width: 56)
                    .monospacedDigit()
            }
        }
    }

    private func weightBinding(for key: String) -> Binding<Double>? {
        guard viewModel.thresholds.weights[key] != nil else { return nil }
        return Binding(
            get: { viewModel.thresholds.weights[key] ?? 0 },
            set: { viewModel.thresholds.weights[key] = $0 }
        )
    }

    // MARK: Trend chart

    private var trendChart: some View {
        GroupBox("Fidelity Trend") {
            Chart(viewModel.history, id: \.id) { run in
                LineMark(
                    x: .value("Date", run.ranAt),
                    y: .value("Fidelity", run.fidelity)
                )
                .foregroundStyle(Color.accentColor)
                PointMark(
                    x: .value("Date", run.ranAt),
                    y: .value("Fidelity", run.fidelity)
                )
                .foregroundStyle(run.allPassed ? Color.green : Color.red)
            }
            .chartYScale(domain: 0...1)
            .chartYAxis {
                AxisMarks(values: [0, 0.25, 0.5, 0.75, 1.0]) { value in
                    AxisGridLine()
                    AxisValueLabel {
                        if let v = value.as(Double.self) {
                            Text(EvaluationViewStyle.formatPercent(v)).font(.caption)
                        }
                    }
                }
            }
            .frame(height: EvaluationViewStyle.chartHeight)
        }
    }

    // MARK: Promote row

    private var promoteRow: some View {
        HStack {
            Spacer()
            Button("Promote Adapter") {
                viewModel.promoteAdapter(client: deps.harnessClient)
            }
            .disabled(viewModel.scorecard?.allPassed != true)
            .buttonStyle(.borderedProminent)
            .tint(.green)
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

    // MARK: Drill-down sheet

    @ViewBuilder
    private func failingExamplesSheet(metric: String) -> some View {
        NavigationStack {
            let examples = viewModel.failingExamples[metric] ?? []
            List {
                if examples.isEmpty {
                    ContentUnavailableView(
                        "No failing examples",
                        systemImage: "checkmark.circle",
                        description: Text("All examples passed for \(metric).")
                    )
                } else {
                    ForEach(examples, id: \.self) { example in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(example)
                                .font(.body)
                                .lineLimit(4)
                            Button("Flag into dataset") {
                                Task {
                                    do {
                                        let result = try await viewModel.flagExample(
                                            text: example,
                                            label: metric,
                                            client: deps.harnessClient
                                        )
                                        flagAlertText = result.message
                                            ?? (result.status == "duplicate"
                                                ? "Already in dataset."
                                                : "Added to dataset.")
                                        flagAlertResult = result
                                        showFlagAlert = true
                                    } catch {
                                        flagAlertText = error.localizedDescription
                                        showFlagAlert = true
                                    }
                                }
                            }
                            .buttonStyle(.bordered)
                            .font(.caption)
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .navigationTitle("\(metric) — Failing Examples")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { drilledMetric = nil }
                }
            }
            .alert("Flag Result", isPresented: $showFlagAlert) {
                Button("OK") { showFlagAlert = false }
            } message: {
                Text(flagAlertText)
            }
        }
        .frame(minWidth: 480, minHeight: 360)
    }
}

// MARK: - MetricCard

private struct MetricCard: View {
    let metric: MetricResult
    let onDrillDown: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(metric.name)
                    .font(.headline)
                Spacer()
                Image(systemName: metric.passed ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .foregroundStyle(metric.passed ? .green : .red)
            }
            HStack(spacing: 4) {
                Text("Value:")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(EvaluationViewStyle.formatPercent(metric.value))
                    .font(.caption)
                    .monospacedDigit()
                Spacer()
                Text("Threshold: \(EvaluationViewStyle.formatPercent(metric.threshold))")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .monospacedDigit()
            }
            ProgressView(value: min(metric.value, 1.0))
                .progressViewStyle(.linear)
                .tint(metric.passed ? .green : .red)
            Button("View failing examples ›") { onDrillDown() }
                .font(.caption)
                .buttonStyle(.plain)
                .foregroundStyle(.accent)
        }
        .padding(14)
        .frame(maxWidth: .infinity, minHeight: 100, alignment: .leading)
        .background(.background)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(metric.passed ? Color.green : Color.red, lineWidth: 1.5)
        )
    }
}

// MARK: - String conformance for sheet(item:)

extension String: @retroactive Identifiable {
    public var id: String { self }
}

// MARK: - Preview

#Preview {
    EvaluationView(viewModel: EvalViewModel())
        .environmentObject(AppDependencies.shared)
        .frame(width: 700, height: 800)
}

#endif

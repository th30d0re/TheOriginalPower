//
//  RetrainLoopView.swift
//  decodingOppression
//
//  macOS-only: dataset → train → eval → promote loop UI (T9).
//

#if os(macOS)

import Charts
import SwiftData
import SwiftUI

struct RetrainLoopView: View {
    @Bindable var viewModel: RetrainViewModel
    @EnvironmentObject private var deps: AppDependencies
    @Environment(\.modelContext) private var modelContext
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private struct LossPoint: Identifiable {
        let id: String
        let step: Int
        let value: Double
        let series: String
    }

    private var lossChartEntries: [LossPoint] {
        viewModel.lossHistory.flatMap { h in
            [
                LossPoint(id: "\(h.step)-Train", step: h.step, value: h.trainLoss, series: "Train"),
                LossPoint(id: "\(h.step)-Val",   step: h.step, value: h.valLoss,   series: "Val"),
            ]
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                datasetCountsCard
                #if !targetEnvironment(simulator)
                probeCard
                #endif
                configSection
                startCancelButton
                if viewModel.isTraining || !viewModel.lossHistory.isEmpty {
                    lossChartSection
                }
                if viewModel.completedAdapterPath != nil {
                    evalSection
                }
                if viewModel.latestEvalRun != nil {
                    promoteSection
                }
                if let err = viewModel.error {
                    Text(err.localizedDescription)
                        .foregroundStyle(.red)
                        .font(.caption)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .padding()
        }
        .navigationTitle("Retrain Loop")
        .onAppear {
            viewModel.onAppear(client: deps.harnessClient)
        }
    }

    // MARK: - Dataset counts card

    private var datasetCountsCard: some View {
        GroupBox {
            HStack(spacing: 24) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(viewModel.datasetCount)")
                        .font(.title2.bold())
                    Text("Instruction items")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Divider().frame(height: 36)
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(viewModel.dpoCount)")
                        .font(.title2.bold())
                    Text("DPO pairs")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                if viewModel.datasetCount == 0 && viewModel.dpoCount == 0 {
                    Label("Collecting data", systemImage: "arrow.clockwise")
                        .foregroundStyle(.secondary)
                        .font(.subheadline)
                }
            }
        } label: {
            Text("Dataset").font(.headline)
        }
    }

    // MARK: - Probe card

    #if !targetEnvironment(simulator)
    private var probeCard: some View {
        GroupBox {
            if let probe = viewModel.probeResult {
                HStack(spacing: 24) {
                    VStack(alignment: .leading, spacing: 4) {
                        Label(
                            probe.recommendedExecutor.rawValue,
                            systemImage: probe.recommendedExecutor == .nativeMLX
                                ? "cpu.fill"
                                : "network"
                        )
                        .font(.subheadline.bold())
                        .foregroundStyle(
                            probe.recommendedExecutor == .nativeMLX ? .green : .blue
                        )
                        Text("Executor")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Divider().frame(height: 36)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(String(format: "%.1f GB", probe.ramGigabytes))
                            .font(.subheadline.bold())
                        Text("RAM")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Divider().frame(height: 36)
                    VStack(alignment: .leading, spacing: 4) {
                        Image(systemName: probe.hasMLXAccelerator ? "checkmark.circle.fill" : "xmark.circle")
                            .foregroundStyle(probe.hasMLXAccelerator ? .green : .red)
                        Text("Metal")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            } else {
                ProgressView("Probing hardware…")
            }
        } label: {
            Text("Hardware").font(.headline)
        }
    }

    #endif

    // MARK: - Config section

    private var configSection: some View {
        GroupBox("Training Configuration") {
            Grid(alignment: .leading, horizontalSpacing: 16, verticalSpacing: 12) {
                GridRow {
                    Text("Epochs")
                    Stepper("\(viewModel.config.epochs)", value: $viewModel.config.epochs, in: 1...100)
                        .disabled(viewModel.isTraining)
                }
                GridRow {
                    Text("Learning Rate")
                    TextField("0.00001", value: $viewModel.config.learningRate, format: .number)
                        .textFieldStyle(.roundedBorder)
                        .frame(width: 120)
                        .disabled(viewModel.isTraining)
                }
                GridRow {
                    Text("LoRA Rank")
                    Stepper("\(viewModel.config.loraRank)", value: $viewModel.config.loraRank, in: 1...64)
                        .disabled(viewModel.isTraining)
                }
                GridRow {
                    Text("Alpha")
                    Stepper("\(viewModel.config.alpha)", value: $viewModel.config.alpha, in: 1...64)
                        .disabled(viewModel.isTraining)
                }
            }
        }
    }

    // MARK: - Start / Cancel button

    private var startCancelButton: some View {
        Button(viewModel.isTraining ? "Cancel" : "Start Training") {
            if viewModel.isTraining {
                viewModel.cancelTraining(manager: deps.trainingManager)
            } else {
                viewModel.startTraining(
                    manager: deps.trainingManager,
                    client: deps.harnessClient,
                    dataStore: deps.trainingDataStore
                )
            }
        }
        .disabled(!viewModel.isTraining && viewModel.datasetCount == 0 && viewModel.dpoCount == 0)
        .buttonStyle(.borderedProminent)
    }

    // MARK: - Live loss chart

    @ViewBuilder
    private var lossChartSection: some View {
        GroupBox {
            VStack(alignment: .leading, spacing: 8) {
                if viewModel.isTraining {
                    ProgressView("Training…")
                        .font(.subheadline)
                }
                if !viewModel.lossHistory.isEmpty {
                    Chart(lossChartEntries) { entry in
                        LineMark(
                            x: .value("Step", entry.step),
                            y: .value("Loss", entry.value)
                        )
                        .foregroundStyle(by: .value("Series", entry.series))
                    }
                    .chartLegend(position: .top)
                    .frame(height: 200)
                    .animation(
                        reduceMotion ? .none : .easeInOut(duration: 0.3),
                        value: viewModel.lossHistory.count
                    )
                }
            }
        } label: {
            Text("Loss").font(.headline)
        }
    }

    // MARK: - Chained eval section

    @ViewBuilder
    private var evalSection: some View {
        GroupBox {
            VStack(alignment: .leading, spacing: 12) {
                if let adapterPath = viewModel.completedAdapterPath {
                    Text("Adapter: \(URL(fileURLWithPath: adapterPath).lastPathComponent)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                if let scorecard = viewModel.latestEvalRun {
                    evalScorecard(scorecard)
                } else {
                    Button("Run Evaluation") {
                        viewModel.chainEval(client: deps.harnessClient, context: modelContext)
                    }
                    .buttonStyle(.bordered)
                }
            }
        } label: {
            Text("Evaluation").font(.headline)
        }
    }

    @ViewBuilder
    private func evalScorecard(_ result: EvalRunResult) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            ForEach(result.metrics, id: \.name) { metric in
                HStack {
                    Text(metric.name)
                        .frame(width: 160, alignment: .leading)
                    Text(String(format: "%.3f", metric.value))
                        .monospacedDigit()
                    Text(metric.passed ? "PASS" : "FAIL")
                        .font(.caption.bold())
                        .foregroundStyle(metric.passed ? .green : .red)
                }
            }
            Divider()
            HStack {
                Text("All passed")
                Spacer()
                Text(result.allPassed ? "✓" : "✗")
                    .foregroundStyle(result.allPassed ? .green : .red)
                    .font(.headline)
            }
        }
    }

    // MARK: - Promote section

    @ViewBuilder
    private var promoteSection: some View {
        GroupBox {
            VStack(alignment: .leading, spacing: 12) {
                if viewModel.promotionSucceeded {
                    Label("Promoted ✓", systemImage: "checkmark.seal.fill")
                        .foregroundStyle(.green)
                        .font(.subheadline.bold())
                } else {
                    Button(viewModel.isPromoting ? "Promoting…" : "Promote Adapter") {
                        viewModel.promote(client: deps.harnessClient)
                    }
                    .disabled(!viewModel.canPromote || viewModel.isPromoting)
                    .buttonStyle(.borderedProminent)

                    if !viewModel.canPromote, let run = viewModel.latestEvalRun, !run.allPassed {
                        Text("Evaluation did not pass — return to the CI hub to collect more DPO data.")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }

                    if let promoErr = viewModel.promotionError {
                        Text(promoErr)
                            .foregroundStyle(.red)
                            .font(.caption)
                    }
                }
            }
        } label: {
            Text("Promotion").font(.headline)
        }
    }
}

#endif

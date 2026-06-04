//
//  TrainingView.swift
//  decodingOppression
//
//  macOS-only: LoRA training config, progress, and adapter activation (T8).
//

#if os(macOS)

import Charts
import SwiftUI

struct TrainingView: View {
    @State var viewModel: TrainingViewModel
    @EnvironmentObject private var deps: AppDependencies
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private struct LossPoint: Identifiable {
        let id: String
        let epoch: Int
        let value: Double
        let series: String
    }

    private var lossChartEntries: [LossPoint] {
        viewModel.lossHistory.flatMap { h in
            [
                LossPoint(id: "\(h.epoch)-Train", epoch: h.epoch, value: h.trainLoss, series: "Train"),
                LossPoint(id: "\(h.epoch)-Val", epoch: h.epoch, value: h.valLoss, series: "Val"),
            ]
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                modelStatusCard
                configSection
                startCancelButton
                if viewModel.isAnalysisRunning {
                    warningBanner
                }
                if viewModel.isTraining || viewModel.completedAdapterMetadata != nil {
                    progressSection
                }
                if viewModel.completedAdapterMetadata != nil {
                    successBanner
                }
            }
            .padding()
        }
        .task {
            await viewModel.onAppear(manager: deps.trainingManager, dataStore: deps.trainingDataStore)
        }
    }

    private var modelStatusCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(viewModel.activeAdapterMetadata?.name ?? "No adapter — using base model")
                .font(.headline)
            Text("\(viewModel.trainingClauseCount) labeled clauses")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 10))
    }

    private var configSection: some View {
        Grid(alignment: .leading, horizontalSpacing: 16, verticalSpacing: 12) {
            GridRow {
                Text("Epochs")
                Stepper("\(viewModel.config.epochs)", value: $viewModel.config.epochs, in: 1...100)
                    .disabled(viewModel.isTraining)
            }
            GridRow {
                Text("Learning Rate")
                TextField("0.0001", value: $viewModel.config.learningRate, format: .number)
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

    private var startCancelButton: some View {
        Button(TrainingViewStyle.trainButtonLabel(isTraining: viewModel.isTraining)) {
            if viewModel.isTraining {
                viewModel.cancelTraining(manager: deps.trainingManager)
            } else {
                viewModel.startTraining(manager: deps.trainingManager, dataStore: deps.trainingDataStore)
            }
        }
        .disabled(!viewModel.isTraining && viewModel.trainingClauseCount == 0)
    }

    private var warningBanner: some View {
        Label("Analysis is running — training may be slower", systemImage: "exclamationmark.triangle")
            .font(.subheadline)
            .foregroundStyle(.orange)
            .padding(8)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.orange.opacity(0.1), in: RoundedRectangle(cornerRadius: 8))
    }

    @ViewBuilder
    private var progressSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Epoch \(viewModel.currentEpoch) of \(viewModel.totalEpochs)")
                .font(.headline)
            if let eta = viewModel.estimatedTimeRemaining {
                Text("Estimated time remaining: \(Int(eta))s")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            if !viewModel.lossHistory.isEmpty {
                Chart(lossChartEntries) { entry in
                    LineMark(
                        x: .value("Epoch", entry.epoch),
                        y: .value("Loss", entry.value)
                    )
                    .foregroundStyle(entry.series == "Train" ? TrainingViewStyle.lossLineColor(isTrain: true) : TrainingViewStyle.lossLineColor(isTrain: false))
                }
                .chartLegend(position: .top)
                .frame(height: 200)
                .accessibilityChartDescriptor(TrainingLossChartDescriptor(history: viewModel.lossHistory))
            }
        }
        .padding()
        .animation(TrainingViewStyle.progressAnimation(reduceMotion: reduceMotion), value: viewModel.lossHistory.count)
    }

    private var successBanner: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let meta = viewModel.completedAdapterMetadata {
                Text("Training complete. Adapter saved as \(meta.name) · \(meta.timestamp.formatted()).")
                    .font(.subheadline)
                Button("Set as Active Adapter") {
                    viewModel.setActiveAdapter(manager: deps.trainingManager, client: deps.harnessClient)
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.green.opacity(0.1), in: RoundedRectangle(cornerRadius: 8))
    }
}

private struct TrainingLossChartDescriptor: AXChartDescriptorRepresentable {
    let history: [(epoch: Int, trainLoss: Double, valLoss: Double)]

    func makeChartDescriptor() -> AXChartDescriptor {
        let epochs = history.map(\.epoch)
        let xMin = Double(epochs.min() ?? 0)
        let xMax = Double(epochs.max() ?? 1)
        let allLosses = history.flatMap { [$0.trainLoss, $0.valLoss] }
        let yMin = (allLosses.min() ?? 0) - 0.05
        let yMax = (allLosses.max() ?? 1) + 0.05
        let xAxis = AXNumericDataAxisDescriptor(
            title: "Epoch",
            range: xMin...xMax,
            gridlinePositions: [],
            valueDescriptionProvider: { String(Int($0)) }
        )
        let yAxis = AXNumericDataAxisDescriptor(
            title: "Loss",
            range: max(0, yMin)...yMax,
            gridlinePositions: [],
            valueDescriptionProvider: { String(format: "%.3f", $0) }
        )
        let trainSeries = AXDataSeriesDescriptor(
            name: "Train",
            isContinuous: true,
            dataPoints: history.map { AXDataPoint(x: Double($0.epoch), y: $0.trainLoss) }
        )
        let valSeries = AXDataSeriesDescriptor(
            name: "Val",
            isContinuous: true,
            dataPoints: history.map { AXDataPoint(x: Double($0.epoch), y: $0.valLoss) }
        )
        return AXChartDescriptor(
            title: "Training loss",
            summary: "Train and validation loss by epoch",
            xAxis: xAxis,
            yAxis: yAxis,
            series: [trainSeries, valSeries]
        )
    }
}

#endif

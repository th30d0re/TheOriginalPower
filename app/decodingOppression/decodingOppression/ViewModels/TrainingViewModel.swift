//
//  TrainingViewModel.swift
//  decodingOppression
//
//  macOS-only: state for TrainingView (T8).
//

#if os(macOS)

import Foundation
import SwiftUI

@Observable
@MainActor
final class TrainingViewModel {
    var config: LoRAConfig = .default
    var isTraining: Bool = false
    var currentEpoch: Int = 0
    var totalEpochs: Int = 0
    var trainLoss: Double = 0
    var valLoss: Double = 0
    var lossHistory: [(epoch: Int, trainLoss: Double, valLoss: Double)] = []
    var estimatedTimeRemaining: TimeInterval?
    var completedAdapterMetadata: LoRAAdapterMetadata?
    private var completedAdapterPath: URL?
    var activeAdapterMetadata: LoRAAdapterMetadata?
    var trainingClauseCount: Int = 0
    var error: Error?
    var isAnalysisRunning: Bool = false

    func onAppear(manager: TrainingManager, dataStore: TrainingDataStore) async {
        do {
            activeAdapterMetadata = try await manager.loadActiveAdapterMetadata()
            let clauses = await dataStore.allClauses()
            trainingClauseCount = clauses.count
        } catch {
            self.error = error
        }
    }

    func startTraining(manager: TrainingManager, dataStore: TrainingDataStore) {
        isTraining = true
        error = nil
        completedAdapterMetadata = nil
        completedAdapterPath = nil
        currentEpoch = 0
        totalEpochs = config.epochs
        lossHistory = []
        Task {
            let stream = await manager.train(config: config, dataStore: dataStore)
            for await progress in stream {
                switch progress {
                case .epoch(let cur, let total, let tLoss, let vLoss):
                    currentEpoch = cur
                    totalEpochs = total
                    trainLoss = tLoss
                    valLoss = vLoss
                    lossHistory.append((epoch: cur, trainLoss: tLoss, valLoss: vLoss))
                case .complete(let adapterURL, let metadata):
                    completedAdapterMetadata = metadata
                    completedAdapterPath = adapterURL
                    isTraining = false
                case .failed(let err):
                    error = err
                    isTraining = false
                }
            }
        }
    }

    func cancelTraining(manager: TrainingManager) {
        Task {
            await manager.cancel()
            isTraining = false
        }
    }

    func setActiveAdapter(manager: TrainingManager, client: HarnessClient) {
        guard let adapterPath = completedAdapterPath,
              let meta = completedAdapterMetadata else { return }
        Task {
            do {
                // Daemon enforces eval gate; only proceeds when a passing eval run exists.
                try await client.activateAdapter(adapterPath.path)
                // Persist locally so loadActiveAdapterMetadata can reflect the promotion.
                try await manager.setActiveAdapter(metadata: meta)
                activeAdapterMetadata = try await manager.loadActiveAdapterMetadata()
            } catch {
                self.error = error
            }
        }
    }
}

#endif

//
//  RetrainViewModel.swift
//  decodingOppression
//
//  macOS-only: observable state for RetrainLoopView (T9).
//

#if os(macOS)

import Foundation
import SwiftData
import SwiftUI

@Observable
@MainActor
final class RetrainViewModel {

    // MARK: - State

    var datasetCount: Int = 0
    var dpoCount: Int = 0
    var config: LoRAConfig = .default
    var isTraining: Bool = false
    var lossHistory: [(step: Int, trainLoss: Double, valLoss: Double)] = []
    var completedAdapterPath: String?
    var latestEvalRun: EvalRunResult?
    var isPromoting: Bool = false
    var promotionError: String?
    var promotionSucceeded: Bool = false
    var error: Error?
    #if !targetEnvironment(simulator)
    var probeResult: ProbeResult?
    #endif

    var canPromote: Bool {
        latestEvalRun?.allPassed == true && !promotionSucceeded
    }

    // MARK: - Lifecycle

    func onAppear(client: HarnessClient) {
        Task {
            await fetchCounts(client: client)
            #if !targetEnvironment(simulator)
            probeResult = await CapabilityProbe.shared.probe()
            #endif
        }
    }

    // MARK: - Training

    func startTraining(manager: TrainingManager, client: HarnessClient, dataStore: TrainingDataStore) {
        isTraining = true
        error = nil
        completedAdapterPath = nil
        latestEvalRun = nil
        promotionError = nil
        promotionSucceeded = false
        lossHistory = []

        Task {
            #if !targetEnvironment(simulator)
            let executor = probeResult?.recommendedExecutor ?? .pythonDaemon
            switch executor {
            case .nativeMLX:
                await runNativePath(manager: manager, client: client, dataStore: dataStore)
            case .pythonDaemon:
                await runDaemonPath(client: client)
            }
            #else
            await runDaemonPath(client: client)
            #endif
        }
    }

    func cancelTraining(manager: TrainingManager) {
        Task {
            await manager.cancel()
            isTraining = false
        }
    }

    // MARK: - Chained evaluation

    func chainEval(client: HarnessClient, context: ModelContext) {
        guard let adapterPath = completedAdapterPath else { return }
        Task {
            do {
                let stream = client.evalRunStream(adapter: adapterPath)
                for try await event in stream {
                    if event.eventType == "done", let raw = event.data.data(using: .utf8) {
                        let decoder = JSONDecoder()
                        decoder.dateDecodingStrategy = .iso8601
                        let result = try decoder.decode(EvalRunResult.self, from: raw)
                        latestEvalRun = result
                        HarnessSwiftDataBridge.upsertEvalRun(result, context: context)
                    }
                }
            } catch {
                self.error = error
            }
        }
    }

    // MARK: - Promotion

    func promote(client: HarnessClient) {
        guard let adapterPath = completedAdapterPath else { return }
        isPromoting = true
        promotionError = nil
        Task {
            do {
                try await client.activateAdapter(adapterPath)
                promotionSucceeded = true
            } catch let err as HarnessError {
                promotionError = err.errorDescription
            } catch {
                promotionError = error.localizedDescription
            }
            isPromoting = false
        }
    }

    // MARK: - Private

    private func fetchCounts(client: HarnessClient) async {
        do {
            let counts = try await client.fetchDatasetCounts()
            datasetCount = counts.datasetCount
            dpoCount = counts.dpoCount
        } catch { }
    }

    private func runNativePath(
        manager: TrainingManager,
        client: HarnessClient,
        dataStore: TrainingDataStore
    ) async {
        let stream = await manager.train(config: config, dataStore: dataStore)
        for await progress in stream {
            switch progress {
            case .epoch(let cur, let total, let tLoss, let vLoss):
                let step = total > 0 ? cur * 100 / total : cur
                lossHistory.append((step: step, trainLoss: tLoss, valLoss: vLoss))
            case .complete(let adapterURL, _):
                completedAdapterPath = adapterURL.path
                isTraining = false
                return
            case .failed(let err):
                error = err
                isTraining = false
                return
            }
        }
        isTraining = false
    }

    private func runDaemonPath(client: HarnessClient) async {
        do {
            let stream = client.trainRunStream(
                epochs: config.epochs,
                loraRank: config.loraRank,
                learningRate: config.learningRate
            )
            for try await event in stream {
                handleSSEEvent(event)
            }
        } catch {
            self.error = error
        }
        isTraining = false
    }

    private func handleSSEEvent(_ event: HarnessSSEEvent) {
        guard let raw = event.data.data(using: .utf8),
              let dict = try? JSONSerialization.jsonObject(with: raw) as? [String: Any]
        else { return }

        switch event.eventType {
        case "train.step":
            let step = dict["step"] as? Int ?? lossHistory.count
            let trainLoss = dict["train_loss"] as? Double ?? 0
            let valLoss = lossHistory.last?.valLoss ?? 0
            lossHistory.append((step: step, trainLoss: trainLoss, valLoss: valLoss))

        case "train.val":
            let step = dict["step"] as? Int ?? (lossHistory.last?.step ?? 0)
            let valLoss = dict["val_loss"] as? Double ?? 0
            if let last = lossHistory.last, last.step == step {
                lossHistory[lossHistory.count - 1] = (step: step, trainLoss: last.trainLoss, valLoss: valLoss)
            } else {
                let trainLoss = lossHistory.last?.trainLoss ?? 0
                lossHistory.append((step: step, trainLoss: trainLoss, valLoss: valLoss))
            }

        case "train.complete":
            completedAdapterPath = dict["adapter_path"] as? String
            isTraining = false

        case "error":
            let msg = dict["message"] as? String ?? "Unknown training error"
            error = NSError(domain: "TrainWorker", code: -1, userInfo: [NSLocalizedDescriptionKey: msg])
            isTraining = false

        default:
            break
        }
    }
}

#endif

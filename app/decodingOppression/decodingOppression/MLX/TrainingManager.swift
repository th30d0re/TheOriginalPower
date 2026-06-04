//
//  TrainingManager.swift
//  decodingOppression
//
//  macOS-only actor: drives LoRA training stream and adapter activation (T8).
//

#if os(macOS)

import Foundation
#if !targetEnvironment(simulator)
import MLXLLM
import MLXLMCommon
import MLX
import Tokenizers
#endif

actor TrainingManager {
    private var trainingTask: Task<Void, Never>?
    private var latestCheckpointURL: URL?
    #if !targetEnvironment(simulator)
    let capabilityProbe = CapabilityProbe.shared
    #endif
    private let adapterDirectory: URL = {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        let sub = dir.appendingPathComponent("decodingOppression", isDirectory: true)
            .appendingPathComponent("adapters", isDirectory: true)
        try? FileManager.default.createDirectory(at: sub, withIntermediateDirectories: true)
        return sub
    }()

    func train(config: LoRAConfig, dataStore: TrainingDataStore) -> AsyncStream<TrainingProgress> {
        AsyncStream { continuation in
            let task = Task {
                do {
                    let clauses = await dataStore.allClauses()
                    guard !clauses.isEmpty else {
                        continuation.yield(.failed(TrainingManagerError.noTrainingData))
                        continuation.finish()
                        return
                    }

                    let baseModelURL = try await downloadBaseModel()
                    let trainPairs = buildTrainingPairs(from: clauses)
                    guard !trainPairs.isEmpty else {
                        continuation.yield(.failed(TrainingManagerError.noTrainingData))
                        continuation.finish()
                        return
                    }

                    let (trainSet, valSet) = splitData(trainPairs, ratio: 0.8)
                    let checkpointDir = adapterDirectory.appendingPathComponent("checkpoints", isDirectory: true)
                    try? FileManager.default.createDirectory(at: checkpointDir, withIntermediateDirectories: true)

                    for epoch in 1...config.epochs {
                        if Task.isCancelled { break }

                        let epochDir = checkpointDir.appendingPathComponent("epoch_\(epoch)", isDirectory: true)
                        try? FileManager.default.createDirectory(at: epochDir, withIntermediateDirectories: true)

                        let (trainLoss, valLoss) = try await trainEpoch(
                            epochNumber: epoch,
                            trainData: trainSet,
                            valData: valSet,
                            baseModelURL: baseModelURL,
                            loraConfig: config,
                            checkpointURL: epochDir
                        )

                        continuation.yield(.epoch(
                            current: epoch,
                            total: config.epochs,
                            trainLoss: trainLoss,
                            valLoss: valLoss
                        ))
                        latestCheckpointURL = epochDir
                    }

                    if Task.isCancelled {
                        continuation.finish()
                        return
                    }

                    let name = "adapter_\(ISO8601DateFormatter().string(from: Date()).replacingOccurrences(of: ":", with: "-"))"
                    let adapterPath = adapterDirectory.appendingPathComponent(name, isDirectory: true)
                    try FileManager.default.createDirectory(at: adapterPath, withIntermediateDirectories: true)

                    if let checkpointURL = latestCheckpointURL {
                        try FileManager.default.copyItem(at: checkpointURL, to: adapterPath.appendingPathComponent("final", isDirectory: true))
                    }

                    let metadata = LoRAAdapterMetadata(
                        id: UUID(),
                        name: name,
                        timestamp: Date(),
                        trainingConfig: config,
                        validationResults: nil,
                        isActive: false
                    )
                    let encoder = JSONEncoder()
                    encoder.dateEncodingStrategy = .iso8601
                    let data = try encoder.encode(metadata)
                    try data.write(to: adapterPath.appendingPathComponent("metadata.json", isDirectory: false))
                    continuation.yield(.complete(adapterPath: adapterPath, metadata: metadata))
                } catch {
                    continuation.yield(.failed(error))
                }
                continuation.finish()
            }
            trainingTask = task
        }
    }

    private func downloadBaseModel() async throws -> URL {
        let modelsDir = adapterDirectory.appendingPathComponent("models", isDirectory: true)
        try? FileManager.default.createDirectory(at: modelsDir, withIntermediateDirectories: true)
        let baseModelPath = modelsDir.appendingPathComponent("base_model", isDirectory: true)
        if !FileManager.default.fileExists(atPath: baseModelPath.path) {
            try? FileManager.default.createDirectory(at: baseModelPath, withIntermediateDirectories: true)
        }
        return baseModelPath
    }

    private func buildTrainingPairs(from clauses: [TrainingClause]) -> [(prompt: String, completion: String)] {
        clauses.map { clause in
            let prompt = """
            Classify the following clause:
            \(clause.text)

            Target Group: \(clause.targetGroup.rawValue)
            Effect: \(clause.effectDirection.rawValue)
            """
            let completion = """
            Target: \(clause.targetGroup.rawValue)
            Effect: \(clause.effectDirection.rawValue)
            AAR: \(String(format: "%.2f", clause.architectureScores.aar))
            """
            return (prompt, completion)
        }
    }

    private func splitData<T>(_ data: [T], ratio: Double) -> ([T], [T]) {
        let splitIndex = Int(Double(data.count) * ratio)
        let train = Array(data[..<splitIndex])
        let val = Array(data[splitIndex...])
        return (train, val)
    }

    private func trainEpoch(
        epochNumber: Int,
        trainData: [(prompt: String, completion: String)],
        valData: [(prompt: String, completion: String)],
        baseModelURL: URL,
        loraConfig: LoRAConfig,
        checkpointURL: URL
    ) async throws -> (trainLoss: Double, valLoss: Double) {
#if !targetEnvironment(simulator)
        let modelConfig = ModelConfiguration(id: "")
        let modelContainer = try await LLMModelFactory.shared.loadContainer(
            configuration: modelConfig
        )

        let batchSize: Int = 4

        var trainLosses: [Double] = []
        var valLosses: [Double] = []
        var accumulatedLoRAWeights: [String: MLXArray] = [:]

        for batchStart in stride(from: 0, to: trainData.count, by: batchSize) {
            let batchEnd = min(batchStart + batchSize, trainData.count)
            let batchPairs = Array(trainData[batchStart..<batchEnd])

            let (loss, weights) = try await computeCausalMLXLossAndWeights(
                pairs: batchPairs,
                modelContainer: modelContainer,
                loraConfig: loraConfig
            )
            if loss > 0 { trainLosses.append(loss) }
            for (k, v) in weights { accumulatedLoRAWeights[k] = v }
        }

        for batchStart in stride(from: 0, to: valData.count, by: batchSize) {
            let batchEnd = min(batchStart + batchSize, valData.count)
            let batchPairs = Array(valData[batchStart..<batchEnd])

            if let loss = try await computeCausalMLXLoss(
                pairs: batchPairs,
                modelContainer: modelContainer,
                loraRank: loraConfig.loraRank
            ) {
                valLosses.append(loss)
            }
        }

        let avgTrainLoss = trainLosses.isEmpty ? 0 : trainLosses.reduce(0, +) / Double(trainLosses.count)
        let avgValLoss = valLosses.isEmpty ? 0 : valLosses.reduce(0, +) / Double(valLosses.count)

        let loraAdapterPath = checkpointURL.appendingPathComponent("lora_adapter.safetensors", isDirectory: false)
        try saveLoRAAdapter(to: loraAdapterPath, arrays: accumulatedLoRAWeights)

        let checkpointData = [
            "epoch": epochNumber,
            "train_loss": avgTrainLoss,
            "val_loss": avgValLoss,
            "lora_rank": loraConfig.loraRank,
            "learning_rate": loraConfig.learningRate,
            "timestamp": ISO8601DateFormatter().string(from: Date()),
            "batch_size": batchSize,
            "max_tokens": 512
        ] as [String: Any]

        if let jsonData = try? JSONSerialization.data(withJSONObject: checkpointData) {
            try? jsonData.write(to: checkpointURL.appendingPathComponent("checkpoint.json", isDirectory: false))
        }

        return (avgTrainLoss, avgValLoss)
#else
        // Simulator does not support Metal or MLX; training is unavailable.
        throw TrainingManagerError.mlxUnavailable
#endif
    }

#if !targetEnvironment(simulator)
    private func computeCausalMLXLoss(
        pairs: [(prompt: String, completion: String)],
        modelContainer: MLXLMCommon.ModelContainer,
        loraRank: Int
    ) async throws -> Double? {
        guard !pairs.isEmpty else { return nil }

        var totalLoss: Double = 0.0
        var validPairs: Int = 0

        for pair in pairs {
            let pairLoss: Double = try await modelContainer.perform { context in
                let combined = pair.prompt + pair.completion
                let combinedTokens = context.tokenizer.encode(text: combined)
                let promptTokens = context.tokenizer.encode(text: pair.prompt)

                guard combinedTokens.count > 2, promptTokens.count < combinedTokens.count else {
                    return 0.0
                }

                // Input: all tokens except last; target: all tokens except first.
                let inputIds = MLXArray(combinedTokens.dropLast().map { Int32($0) })
                    .expandedDimensions(axis: 0)
                let logits = context.model(inputIds, cache: nil)
                    .squeezed(axis: 0)  // [seq-1, vocab]

                let promptLen = min(promptTokens.count, combinedTokens.count - 1)
                let completionEnd = combinedTokens.count - 1
                guard promptLen < completionEnd else { return 0.0 }

                // Completion logits: rows [promptLen ..< completionEnd]
                let completionLogits = logits[promptLen ..< completionEnd]
                let completionTargetIds = Array(combinedTokens[(promptLen + 1)...])
                    .map { Int32($0) }

                // Compute log-softmax and read per-token NLL.
                let logProbs = MLX.logSoftmax(completionLogits, axis: -1)
                MLX.eval(logProbs)

                var nll: Double = 0.0
                for (i, targetId) in completionTargetIds.enumerated() {
                    let logP = logProbs[i, Int(targetId)].item(Double.self)
                    nll -= logP
                }
                return completionTargetIds.isEmpty ? 0.0 : nll / Double(completionTargetIds.count)
            }

            totalLoss += pairLoss
            validPairs += 1
        }

        return validPairs > 0 ? totalLoss / Double(validPairs) : nil
    }

    /// Computes causal NLL loss and applies a single SGD step to all LoRA A/B matrices,
    /// returning both the average loss and the updated weight dictionary.
    private func computeCausalMLXLossAndWeights(
        pairs: [(prompt: String, completion: String)],
        modelContainer: MLXLMCommon.ModelContainer,
        loraConfig: LoRAConfig
    ) async throws -> (loss: Double, weights: [String: MLXArray]) {
        guard !pairs.isEmpty else { return (0.0, [:]) }

        let lr = Float(loraConfig.learningRate)
        var totalLoss: Double = 0.0
        var validPairs: Int = 0
        var accumulated: [String: MLXArray] = [:]

        for pair in pairs {
            let result: (Double, [String: MLXArray]) = try await modelContainer.perform { context in
                let combined = pair.prompt + pair.completion
                let combinedTokens = context.tokenizer.encode(text: combined)
                let promptTokens = context.tokenizer.encode(text: pair.prompt)

                guard combinedTokens.count > 2, promptTokens.count < combinedTokens.count else {
                    return (0.0, [:])
                }

                let inputIds = MLXArray(combinedTokens.dropLast().map { Int32($0) })
                    .expandedDimensions(axis: 0)
                let promptLen = min(promptTokens.count, combinedTokens.count - 1)
                let completionEnd = combinedTokens.count - 1
                guard promptLen < completionEnd else { return (0.0, [:]) }

                let completionTargetIds = Array(combinedTokens[(promptLen + 1)...]).map { Int32($0) }
                guard !completionTargetIds.isEmpty else { return (0.0, [:]) }

                // value-and-gradient w.r.t. the model's trainable parameters.
                let lossGradFn = valueAndGrad(model: context.model) { m in
                    let logits = m(inputIds, cache: nil).squeezed(axis: 0)
                    let completionLogits = logits[promptLen ..< completionEnd]
                    let logProbs = MLX.logSoftmax(completionLogits, axis: -1)
                    var nll = MLXArray(Float(0.0))
                    for (i, targetId) in completionTargetIds.enumerated() {
                        nll = nll - logProbs[i, Int(targetId)]
                    }
                    return nll / MLXArray(Float(completionTargetIds.count))
                }

                let (lossArray, grads) = lossGradFn()
                MLX.eval(lossArray)
                let lossVal = lossArray.item(Double.self)

                // Filter to LoRA parameters and apply SGD: updated = param - lr * grad.
                var loraWeights: [String: MLXArray] = [:]
                let flatGrads = grads.flattened()
                let flatParams = Dictionary(uniqueKeysWithValues: context.model.namedParameters())

                for (key, grad) in flatGrads where key.contains("lora_a") || key.contains("lora_b") {
                    guard let param = flatParams[key] else { continue }
                    let updated = param - MLXArray(lr) * grad
                    MLX.eval(updated)
                    loraWeights[key] = updated
                }

                return (lossVal, loraWeights)
            }

            if result.0 > 0 {
                totalLoss += result.0
                validPairs += 1
            }
            for (k, v) in result.1 { accumulated[k] = v }
        }

        let avgLoss = validPairs > 0 ? totalLoss / Double(validPairs) : 0.0
        return (avgLoss, accumulated)
    }

    /// Persists trained LoRA A/B weight tensors to a safetensors file.
    /// Throws `TrainingManagerError.noLoRAWeightsExtracted` when the gradient pass
    /// produced no named parameters matching "lora_a" or "lora_b", preventing a
    /// placeholder artifact from masking a non-functional training run.
    private func saveLoRAAdapter(to path: URL, arrays: [String: MLXArray]) throws {
        guard !arrays.isEmpty else {
            throw TrainingManagerError.noLoRAWeightsExtracted
        }
        try MLX.save(arrays: arrays, url: path)
    }
#endif

    func cancel() {
        trainingTask?.cancel()
        trainingTask = nil
    }

    func resume(from checkpointURL: URL, config: LoRAConfig, dataStore: TrainingDataStore) -> AsyncStream<TrainingProgress> {
        AsyncStream { continuation in
            let task = Task {
                do {
                    let clauses = await dataStore.allClauses()
                    guard !clauses.isEmpty else {
                        continuation.yield(.failed(TrainingManagerError.noTrainingData))
                        continuation.finish()
                        return
                    }

                    let baseModelURL = try await downloadBaseModel()
                    let trainPairs = buildTrainingPairs(from: clauses)
                    guard !trainPairs.isEmpty else {
                        continuation.yield(.failed(TrainingManagerError.noTrainingData))
                        continuation.finish()
                        return
                    }

                    let (trainSet, valSet) = splitData(trainPairs, ratio: 0.8)
                    latestCheckpointURL = checkpointURL

                    for epoch in 1...config.epochs {
                        if Task.isCancelled { break }

                        let epochDir = checkpointURL.appendingPathComponent("resumed_epoch_\(epoch)", isDirectory: true)
                        try? FileManager.default.createDirectory(at: epochDir, withIntermediateDirectories: true)

                        let (trainLoss, valLoss) = try await trainEpoch(
                            epochNumber: epoch,
                            trainData: trainSet,
                            valData: valSet,
                            baseModelURL: baseModelURL,
                            loraConfig: config,
                            checkpointURL: epochDir
                        )

                        continuation.yield(.epoch(
                            current: epoch,
                            total: config.epochs,
                            trainLoss: trainLoss,
                            valLoss: valLoss
                        ))
                        latestCheckpointURL = epochDir
                    }

                    if Task.isCancelled {
                        continuation.finish()
                        return
                    }

                    let name = "adapter_resumed_\(ISO8601DateFormatter().string(from: Date()).replacingOccurrences(of: ":", with: "-"))"
                    let adapterPath = adapterDirectory.appendingPathComponent(name, isDirectory: true)
                    try FileManager.default.createDirectory(at: adapterPath, withIntermediateDirectories: true)

                    if let checkpointURL = latestCheckpointURL {
                        try FileManager.default.copyItem(at: checkpointURL, to: adapterPath.appendingPathComponent("final", isDirectory: true))
                    }

                    let metadata = LoRAAdapterMetadata(
                        id: UUID(),
                        name: name,
                        timestamp: Date(),
                        trainingConfig: config,
                        validationResults: nil,
                        isActive: false
                    )
                    let encoder = JSONEncoder()
                    encoder.dateEncodingStrategy = .iso8601
                    let data = try encoder.encode(metadata)
                    try data.write(to: adapterPath.appendingPathComponent("metadata.json", isDirectory: false))
                    continuation.yield(.complete(adapterPath: adapterPath, metadata: metadata))
                } catch {
                    continuation.yield(.failed(error))
                }
                continuation.finish()
            }
            trainingTask = task
        }
    }

    func setActiveAdapter(metadata: LoRAAdapterMetadata) throws {
        let contents = try FileManager.default.contentsOfDirectory(at: adapterDirectory, includingPropertiesForKeys: nil, options: .skipsHiddenFiles)
        for sub in contents where (try? sub.resourceValues(forKeys: [.isDirectoryKey]).isDirectory) == true {
            let metaURL = sub.appendingPathComponent("metadata.json", isDirectory: false)
            guard FileManager.default.fileExists(atPath: metaURL.path) else { continue }
            let data = try Data(contentsOf: metaURL)
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601
            var m = try decoder.decode(LoRAAdapterMetadata.self, from: data)
            m.isActive = (m.id == metadata.id)
            let encoder = JSONEncoder()
            encoder.dateEncodingStrategy = .iso8601
            try encoder.encode(m).write(to: metaURL)
        }
    }

    func loadActiveAdapterMetadata() throws -> LoRAAdapterMetadata? {
        let contents = try FileManager.default.contentsOfDirectory(at: adapterDirectory, includingPropertiesForKeys: nil, options: .skipsHiddenFiles)
        for sub in contents where (try? sub.resourceValues(forKeys: [.isDirectoryKey]).isDirectory) == true {
            let metaURL = sub.appendingPathComponent("metadata.json", isDirectory: false)
            guard FileManager.default.fileExists(atPath: metaURL.path) else { continue }
            let data = try Data(contentsOf: metaURL)
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601
            let m = try decoder.decode(LoRAAdapterMetadata.self, from: data)
            if m.isActive { return m }
        }
        return nil
    }
}

enum TrainingManagerError: LocalizedError {
    case noTrainingData
    case noLoRAWeightsExtracted
    case mlxUnavailable

    var errorDescription: String? {
        switch self {
        case .noTrainingData:
            return "No training clauses loaded."
        case .noLoRAWeightsExtracted:
            return "No LoRA weight matrices were extracted from the model. Ensure the loaded model has LoRA adapters injected before training."
        case .mlxUnavailable:
            return "Native MLX training is unavailable in the simulator. Use the daemon training path instead."
        }
    }
}

#endif

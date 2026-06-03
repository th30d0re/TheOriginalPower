//
//  Tier2Engine.swift
//  decodingOppression
//
//  Facade mirroring Tier1Engine; gates MLX embedding and classifier behind download state.
//  Also exposes open-ended Root Ledger generation via the loaded model.
//

import Foundation

actor Tier2Engine {
    private let embeddingEngine: MLXEmbeddingEngine
    private let classifier: MLXClauseClassifier
    private let downloadManager: ModelDownloadManager

    init(downloadManager: ModelDownloadManager) {
        self.downloadManager = downloadManager
        self.embeddingEngine = MLXEmbeddingEngine()
        self.classifier = MLXClauseClassifier(downloadManager: downloadManager)
    }

    func classify(clause: Clause) async throws -> TierClassification? {
        let state = await MainActor.run { downloadManager.state }
        guard case .available = state else { return nil }

        try await classifier.loadModel()
        return try await classifier.classify(clause: clause)
    }

    /// Open-ended Root Ledger generation. Returns nil if model unavailable.
    func generate(prompt: String) async throws -> String? {
        let state = await MainActor.run { downloadManager.state }
        guard case .available = state else { return nil }

        try await classifier.loadModel()
        return try await classifier.generate(prompt: prompt)
    }

    /// Load embedding model for taxonomy matching. Call before similarity/embed.
    func loadEmbeddingModel() async throws {
        try await embeddingEngine.loadModel()
    }

    /// Cosine similarity between clause and taxonomy term (for taxonomy matching).
    func similarity(clause: String, taxonomyTerm: String) async throws -> Double {
        try await embeddingEngine.loadModel()
        return try await embeddingEngine.similarity(clause: clause, taxonomyTerm: taxonomyTerm)
    }

    /// Embed text; returns vector for pipeline/callers that need taxonomy matching.
    func embed(_ text: String) async throws -> [Float] {
        try await embeddingEngine.loadModel()
        return try await embeddingEngine.embed(text)
    }

    /// Whether the Tier2 model is downloaded and ready for classification.
    func isAvailable() async -> Bool {
        await MainActor.run {
            if case .available = downloadManager.state { return true }
            return false
        }
    }
}

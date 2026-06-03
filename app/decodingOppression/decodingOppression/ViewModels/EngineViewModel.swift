//
//  EngineViewModel.swift
//  decodingOppression
//
//  ViewModel for the Root Ledger Engine chat interface.
//

import Foundation
import Observation

@MainActor
@Observable
final class EngineViewModel {
    var prompt: String = ""
    var response: String = ""
    var isLoading: Bool = false
    var errorMessage: String?

    private let tier2Engine: Tier2Engine

    init(tier2Engine: Tier2Engine) {
        self.tier2Engine = tier2Engine
    }

    func send() async {
        let trimmed = prompt.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        guard !isLoading else { return }

        isLoading = true
        errorMessage = nil

        let userPrompt = trimmed
        prompt = ""

        do {
            if let result = try await tier2Engine.generate(prompt: userPrompt) {
                response = result
            } else {
                errorMessage = "Model not available. Download the Tier2 model first."
            }
        } catch {
            errorMessage = "Generation failed: \(error.localizedDescription)"
        }

        isLoading = false
    }

    func clear() {
        response = ""
        errorMessage = nil
    }
}

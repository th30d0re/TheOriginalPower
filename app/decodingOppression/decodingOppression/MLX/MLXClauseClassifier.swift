//
//  MLXClauseClassifier.swift
//  decodingOppression
//
//  Actor that loads Meta-Llama-3.1-8B-Instruct-abliterated-4bit + LoRA and classifies clauses to TierClassification.
//

import Foundation
#if !targetEnvironment(simulator)
import MLXLLM
import MLXLMCommon
#endif

actor MLXClauseClassifier {
#if !targetEnvironment(simulator)
    private var session: ChatSession?
    private let downloadManager: ModelDownloadManager

    init(downloadManager: ModelDownloadManager) {
        self.downloadManager = downloadManager
    }

    func loadModel() async throws {
        if session != nil { return }
        let state = await MainActor.run { downloadManager.state }
        guard case .available(let modelURL) = state else { throw MLXError.modelUnavailable }

        let modelContainer = try await LLMModelFactory.shared.loadContainer(configuration: .init(directory: modelURL))

        guard let adapterURL = Bundle.main.url(forResource: "adapters", withExtension: "safetensors", subdirectory: "Adapters") else {
            throw MLXError.adapterNotFound
        }

        let adapterDirectory = adapterURL.deletingLastPathComponent()
        let fileSize = (try? adapterURL.resourceValues(forKeys: [.fileSizeKey]).fileSize) ?? 0
        if fileSize > 0 {
            let adapter = try LoRAContainer.from(directory: adapterDirectory)
            try await modelContainer.perform { context in
                try context.model.load(adapter: adapter)
            }
        }

        session = ChatSession(modelContainer)
    }

    func classify(clause: Clause) async throws -> TierClassification {
        guard let session else { throw MLXError.modelNotLoaded }
        let prompt = buildPrompt(clauseText: clause.text)
        let response = try await session.respond(to: prompt)
        return parseResponse(response)
    }

    private func buildPrompt(clauseText: String) -> String {
        let truncated = String(clauseText.trimmingCharacters(in: .whitespacesAndNewlines).prefix(400))
        return """
        Return one line:
        targetGroup=outgroup|ingroup_non_elite|elite|multiple effect=burden|benefit|neutral|mixed aar=0-1 se=0-1 ij=0-1 rsc=0-1 proxy=yes|no
        Clause: \(truncated)
        """
    }

    private func parseResponse(_ response: String) -> TierClassification {
        var targetGroup: TargetGroup = .multiple
        var effectDirection: EffectDirection = .neutral
        var aar: Double = 0
        var se: Double = 0
        var ij: Double = 0
        var rsc: Double = 0
        var usesProxy = false
        let confidence: Double = 0.5

        let lower = response.lowercased()

        func value(for key: String) -> String? {
            let pattern = "\(key)\\s*=\\s*([a-z0-9_-]+)"
            guard let regex = try? NSRegularExpression(pattern: pattern),
                  let match = regex.firstMatch(in: lower, range: NSRange(lower.startIndex..., in: lower)),
                  let range = Range(match.range(at: 1), in: lower) else { return nil }
            return String(lower[range])
        }

        if let value = value(for: "targetgroup") {
            switch value {
            case "outgroup":
                targetGroup = .outgroup
            case "ingroup_non_elite", "ingroup-non-elite", "ingroupnonelite", "ingroup":
                targetGroup = .ingroupNonElite
            case "elite":
                targetGroup = .elite
            default:
                targetGroup = .multiple
            }
        }

        if let value = value(for: "effect") {
            switch value {
            case "burden":
                effectDirection = .burden
            case "benefit":
                effectDirection = .benefit
            case "mixed":
                effectDirection = .mixed
            default:
                effectDirection = .neutral
            }
        }

        func parseScore(_ name: String) -> Double? {
            let pattern = "\(name)\\s*=\\s*([0-9]*\\.?[0-9]+)"
            guard let regex = try? NSRegularExpression(pattern: pattern),
                  let match = regex.firstMatch(in: lower, range: NSRange(lower.startIndex..., in: lower)),
                  let range = Range(match.range(at: 1), in: lower) else { return nil }
            return Double(lower[range])
        }

        aar = parseScore("aar") ?? 0
        se = parseScore("se") ?? 0
        ij = parseScore("ij") ?? 0
        rsc = parseScore("rsc") ?? 0

        if let value = value(for: "proxy"), value == "yes" {
            usesProxy = true
        }

        let architectureScores = ArchitectureScores(aar: aar, se: se, ij: ij, rsc: rsc)
        let proxyDetection = ProxyDetection(
            usesProxyVariables: usesProxy,
            proxyTerms: [],
            expandsOutgroup: usesProxy && targetGroup == .outgroup
        )

        return TierClassification(
            targetGroup: targetGroup,
            effectDirection: effectDirection,
            architectureScores: architectureScores,
            proxyDetection: proxyDetection,
            confidence: confidence,
            tier: .tier2,
            wasSafetyFallback: false
        )
    }
#else
    private let downloadManager: ModelDownloadManager

    init(downloadManager: ModelDownloadManager) {
        self.downloadManager = downloadManager
    }

    func loadModel() async throws {
        throw MLXError.simulatorNotSupported
    }

    func classify(clause: Clause) async throws -> TierClassification {
        throw MLXError.simulatorNotSupported
    }
#endif
}

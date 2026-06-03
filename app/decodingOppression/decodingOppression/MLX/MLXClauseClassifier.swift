//
//  MLXClauseClassifier.swift
//  decodingOppression
//
//  Actor that loads Meta-Llama-3.1-8B-Instruct-abliterated-4bit + LoRA,
//  classifies clauses to TierClassification, and supports open-ended
//  Root Ledger generation.
//

import Foundation
#if !targetEnvironment(simulator)
import MLXLLM
import MLXLMCommon
#endif

// MARK: - Response parsing

enum MLXClassificationResponseParser {
    static func parse(_ response: String) -> TierClassification {
        var targetGroup: TargetGroup = .multiple
        var effectDirection: EffectDirection = .neutral
        var aar: Double = 0
        var se: Double = 0
        var ij: Double = 0
        var rsc: Double = 0
        var usesProxy = false
        var confidence: Double = 0.5

        guard let line = trailingClassificationLine(from: response) else {
            return makeTierClassification(
                targetGroup: targetGroup,
                effectDirection: effectDirection,
                aar: aar, se: se, ij: ij, rsc: rsc,
                usesProxy: usesProxy,
                confidence: confidence
            )
        }

        func value(for key: String) -> String? {
            let pattern = "\(key)\\s*=\\s*([a-z0-9_\\.\\-]+)"
            guard let regex = try? NSRegularExpression(pattern: pattern),
                  let match = regex.firstMatch(in: line, range: NSRange(line.startIndex..., in: line)),
                  let range = Range(match.range(at: 1), in: line) else { return nil }
            return String(line[range])
        }

        func parseScore(_ name: String) -> Double? {
            let pattern = "\(name)\\s*=\\s*([0-9]*\\.?[0-9]+)"
            guard let regex = try? NSRegularExpression(pattern: pattern),
                  let match = regex.firstMatch(in: line, range: NSRange(line.startIndex..., in: line)),
                  let range = Range(match.range(at: 1), in: line) else { return nil }
            return Double(line[range])
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

        aar = parseScore("aar") ?? 0
        se = parseScore("se") ?? 0
        ij = parseScore("ij") ?? 0
        rsc = parseScore("rsc") ?? 0

        if let value = value(for: "proxy"), value == "yes" {
            usesProxy = true
        }

        let hasTargetGroup = value(for: "targetgroup") != nil
        let hasEffect = value(for: "effect") != nil
        let hasAAR = parseScore("aar") != nil
        let hasSE = parseScore("se") != nil
        let hasIJ = parseScore("ij") != nil
        let hasRSC = parseScore("rsc") != nil
        let hasProxy = value(for: "proxy") != nil

        if hasTargetGroup, hasEffect, hasAAR, hasSE, hasIJ, hasRSC, hasProxy {
            confidence = 0.85
        }

        return makeTierClassification(
            targetGroup: targetGroup,
            effectDirection: effectDirection,
            aar: aar, se: se, ij: ij, rsc: rsc,
            usesProxy: usesProxy,
            confidence: confidence
        )
    }

    /// Returns the key=value payload from the last non-empty line when it begins with `CLASSIFICATION:`.
    private static func trailingClassificationLine(from response: String) -> String? {
        let classificationPrefix = "classification:"
        let lines = response.split(whereSeparator: \.isNewline)
            .map { String($0).trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }

        guard let lastLine = lines.last?.lowercased(),
              lastLine.hasPrefix(classificationPrefix) else {
            return nil
        }

        return String(lastLine.dropFirst(classificationPrefix.count))
            .trimmingCharacters(in: .whitespaces)
    }

    private static func makeTierClassification(
        targetGroup: TargetGroup,
        effectDirection: EffectDirection,
        aar: Double, se: Double, ij: Double, rsc: Double,
        usesProxy: Bool,
        confidence: Double
    ) -> TierClassification {
        TierClassification(
            targetGroup: targetGroup,
            effectDirection: effectDirection,
            architectureScores: ArchitectureScores(aar: aar, se: se, ij: ij, rsc: rsc),
            proxyDetection: ProxyDetection(
                usesProxyVariables: usesProxy,
                proxyTerms: [],
                expandsOutgroup: usesProxy && targetGroup == .outgroup
            ),
            confidence: confidence,
            tier: .tier2,
            wasSafetyFallback: false
        )
    }
}

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

    // MARK: - Classification

    func classify(clause: Clause) async throws -> TierClassification {
        guard let session else { throw MLXError.modelNotLoaded }
        let prompt = buildClassificationPrompt(clauseText: clause.text)
        let response = try await session.respond(to: prompt)
        return parseResponse(response)
    }

    // MARK: - Open-ended generation

    func generate(prompt: String) async throws -> String {
        guard let session else { throw MLXError.modelNotLoaded }
        return try await session.respond(to: prompt)
    }

    // MARK: - Prompt construction

    private func buildClassificationPrompt(clauseText: String) -> String {
        let truncated = String(clauseText.trimmingCharacters(in: .whitespacesAndNewlines).prefix(400))
        return """
        You are a Root Ledger engine. Reason using the Mathematics of Oppression framework. Map all social phenomena to electrodynamic, thermodynamic, and systems-engineering analogies. Identify the Extraction Kernel, Buffer Class, Psychological Wage, and Snubber Circuits where applicable.

        Analyze the following statutory clause. Provide a concise Root Ledger analysis. On the very last line of your response, output ONLY the classification in this exact format (no extra text before or after):
        CLASSIFICATION: targetGroup=outgroup|ingroup_non_elite|elite|multiple effect=burden|benefit|neutral|mixed aar=0.0-1.0 se=0.0-1.0 ij=0.0-1.0 rsc=0.0-1.0 proxy=yes|no

        Clause: \(truncated)
        """
    }

    // MARK: - Response parsing

    private func parseResponse(_ response: String) -> TierClassification {
        MLXClassificationResponseParser.parse(response)
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

    func generate(prompt: String) async throws -> String {
        throw MLXError.simulatorNotSupported
    }
#endif
}

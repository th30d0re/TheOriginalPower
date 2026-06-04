//
//  HarnessClient.swift
//  decodingOppression
//
//  macOS-only: actor that manages the Python harness daemon process and
//  exposes typed HTTP/SSE access to its REST API.
//

#if os(macOS)

import Combine
import Foundation

// MARK: - Supporting types

struct HarnessDashboardSummary: Sendable {
    var evalStatus: String
    var curriculumStatus: String
    var ciStatus: String
    var retrainStatus: String
    var invariantStatus: String
}

struct HarnessJobStatus: Sendable {
    var running: String?
    var queued: [String]
}

struct HarnessSSEEvent: Sendable {
    var eventType: String
    var data: String
}

// MARK: - Counter-Interference DTOs

struct ProviderDTO: Codable, Sendable, Identifiable {
    let id: String
    let name: String
    let available: Bool
    let throttled: Bool
    let throttleCountdownSeconds: Int?
    let lastError: String?

    enum CodingKeys: String, CodingKey {
        case id, name, available, throttled
        case throttleCountdownSeconds = "throttle_countdown_seconds"
        case lastError                = "last_error"
    }
}

struct ProvidersResponse: Codable, Sendable {
    let providers: [ProviderDTO]
}

struct CIReviewRequest: Codable, Sendable {
    let pairId: String
    let action: String

    enum CodingKeys: String, CodingKey {
        case pairId  = "pair_id"
        case action
    }
}

struct CIReviewResponse: Codable, Sendable {
    let status: String
    let invariant: String?
    let reason: String?
}

struct PendingDPOPair: Codable, Sendable, Identifiable {
    let id: String
    let prompt: String
    let raw: String
    let detected: [String]
    let reconstruction: String
    let provider: String
    let domain: String?
}

// MARK: - Curriculum DTOs

struct StagingItemDTO: Codable, Sendable, Identifiable {
    let id: String
    let domain: String?
    let itemType: String?
    let reviewState: String?
    let contentSha: String?
    let createdAt: String?

    enum CodingKeys: String, CodingKey {
        case id, domain
        case itemType    = "item_type"
        case reviewState = "review_state"
        case contentSha  = "content_sha"
        case createdAt   = "created_at"
    }
}

struct StagingListResponse: Codable, Sendable {
    let items: [StagingItemDTO]
    let total: Int
}

struct PromoteRejection: Codable, Sendable {
    let id: String
    let invariant: String?
    let reason: String?
}

struct PromoteResponse: Codable, Sendable {
    let promoted: [String]
    let rejected: [PromoteRejection]
    let errors: [PromoteError]

    struct PromoteError: Codable, Sendable {
        let id: String
        let error: String
    }
}

// MARK: - HarnessClient

@MainActor
final class HarnessClient: ObservableObject {

    // MARK: Status

    enum BackendStatus: Equatable {
        case online
        case launching
        case offline
        case authFailed(String)

        var isOnline: Bool { self == .online }

        var displayString: String {
            switch self {
            case .online:       return "Online · token valid · ready"
            case .launching:    return "Launching…"
            case .offline:      return "Offline"
            case .authFailed(let msg): return "Auth failed: \(msg)"
            }
        }

        var dotColor: String {
            switch self {
            case .online:   return "green"
            case .launching: return "orange"
            case .offline, .authFailed: return "red"
            }
        }
    }

    @Published private(set) var status: BackendStatus = .offline

    // MARK: Constants

    private let baseURL = URL(string: "http://127.0.0.1:7331")!
    private let connectTimeout: TimeInterval = 20
    private let pollInterval: TimeInterval = 1.5

    // MARK: Token

    private var bearerToken: String? {
        guard let repoRoot else { return nil }
        let tokenPath = repoRoot.appending(path: ".harness_token")
        return try? String(contentsOf: tokenPath, encoding: .utf8)
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    // MARK: Repo root resolution

    /// Walks up from the app bundle looking for `.harness_token` or `Makefile`.
    private var repoRoot: URL? {
        var candidate = Bundle.main.bundleURL
        for _ in 0..<10 {
            candidate = candidate.deletingLastPathComponent()
            let sentinels = [".harness_token", "Makefile"]
            for sentinel in sentinels {
                if FileManager.default.fileExists(
                    atPath: candidate.appending(path: sentinel).path
                ) {
                    return candidate
                }
            }
        }
        return nil
    }

    // MARK: - Public API

    func connect() async {
        guard let token = bearerToken else {
            status = .authFailed("Token file not found at repo root")
            return
        }
        do {
            let (_, response) = try await urlSession.data(for: request(path: "/health", token: token))
            if let http = response as? HTTPURLResponse {
                switch http.statusCode {
                case 200:
                    status = .online
                case 401, 403:
                    status = .authFailed("HTTP \(http.statusCode)")
                default:
                    status = .offline
                }
            }
        } catch {
            status = .offline
        }
    }

    func launchDaemon() async {
        status = .launching
        guard let repoRoot else {
            status = .authFailed("Cannot resolve repo root for daemon launch")
            return
        }

        let pythonPath = repoRoot
            .appending(path: ".venv-harness/bin/python3")
            .path

        guard FileManager.default.fileExists(atPath: pythonPath) else {
            status = .offline
            return
        }

        let proc = Process()
        proc.executableURL = URL(fileURLWithPath: pythonPath)
        proc.arguments = ["-m", "harness.server"]
        proc.currentDirectoryURL = repoRoot

        do {
            try proc.run()
        } catch {
            status = .offline
            return
        }

        // Poll until online or timeout.
        let deadline = Date().addingTimeInterval(connectTimeout)
        while Date() < deadline {
            try? await Task.sleep(nanoseconds: UInt64(pollInterval * 1_000_000_000))
            await connect()
            if status == .online { return }
        }

        if status != .online {
            status = .offline
        }
    }

    func fetchDashboardSummary() async throws -> HarnessDashboardSummary {
        guard let token = bearerToken else {
            throw HarnessError.noToken
        }

        // /health gives us basic liveness; /eval/history gives last run.
        let (healthData, _) = try await urlSession.data(for: request(path: "/health", token: token))
        let (historyData, _) = try await urlSession.data(for: request(path: "/eval/history", token: token))

        let health = (try? JSONSerialization.jsonObject(with: healthData) as? [String: Any]) ?? [:]
        let history = (try? JSONSerialization.jsonObject(with: historyData) as? [[String: Any]]) ?? []

        let evalStatus: String
        if let last = history.first,
           let fidelity = last["fidelity"] as? Double {
            let pct = Int(fidelity * 100)
            evalStatus = "Last run: fidelity \(pct)%"
        } else {
            evalStatus = "No runs yet"
        }

        let stagingCount = health["staging_count"] as? Int ?? 0
        let dpoCount = health["dpo_count"] as? Int ?? 0
        let datasetReady = health["dataset_ready"] as? Bool ?? false
        let invariantsPassed = health["invariants_passed"] as? Int ?? 0
        let invariantsTotal = health["invariants_total"] as? Int ?? 5

        return HarnessDashboardSummary(
            evalStatus: evalStatus,
            curriculumStatus: "\(stagingCount) items in staging",
            ciStatus: "\(dpoCount) DPO pairs to review",
            retrainStatus: datasetReady ? "Dataset ready · waiting" : "Collecting data",
            invariantStatus: "\(invariantsPassed)/\(invariantsTotal) holding"
        )
    }

    func fetchJobStatus() async throws -> HarnessJobStatus {
        guard let token = bearerToken else {
            throw HarnessError.noToken
        }
        let (data, _) = try await urlSession.data(for: request(path: "/manifest", token: token))
        let manifest = (try? JSONSerialization.jsonObject(with: data) as? [String: Any]) ?? [:]
        let running = manifest["running"] as? String
        let queued = manifest["queued"] as? [String] ?? []
        return HarnessJobStatus(running: running, queued: queued)
    }

    func evalRunStream(adapter: String) -> AsyncThrowingStream<HarnessSSEEvent, Error> {
        AsyncThrowingStream { continuation in
            Task {
                guard let token = self.bearerToken else {
                    continuation.finish(throwing: HarnessError.noToken)
                    return
                }
                var req = self.request(path: "/eval/run", token: token)
                req.httpMethod = "POST"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")
                req.httpBody = try? JSONSerialization.data(
                    withJSONObject: ["adapter": adapter]
                )

                do {
                    let (bytes, _) = try await self.urlSession.bytes(for: req)
                    var eventType = "message"
                    for try await line in bytes.lines {
                        if line.hasPrefix("event:") {
                            eventType = line.dropFirst(6).trimmingCharacters(in: .whitespaces)
                        } else if line.hasPrefix("data:") {
                            let data = String(line.dropFirst(5).trimmingCharacters(in: .whitespaces))
                            continuation.yield(HarnessSSEEvent(eventType: eventType, data: data))
                            eventType = "message"
                        }
                    }
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
        }
    }

    // MARK: - Eval API

    func fetchAdapters() async throws -> [String] {
        guard let token = bearerToken else { throw HarnessError.noToken }
        let (data, _) = try await urlSession.data(for: request(path: "/adapters", token: token))
        return (try? JSONDecoder().decode([String].self, from: data)) ?? []
    }

    func fetchEvalHistory() async throws -> [EvalRunResult] {
        guard let token = bearerToken else { throw HarnessError.noToken }
        let (data, _) = try await urlSession.data(for: request(path: "/eval/history", token: token))
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode([EvalRunResult].self, from: data)
    }

    func fetchThresholds() async throws -> EvalThresholdsDTO {
        guard let token = bearerToken else { throw HarnessError.noToken }
        let (data, _) = try await urlSession.data(for: request(path: "/eval/thresholds", token: token))
        return try JSONDecoder().decode(EvalThresholdsDTO.self, from: data)
    }

    func putThresholds(_ dto: EvalThresholdsDTO) async throws -> EvalThresholdsDTO {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var req = request(path: "/eval/thresholds", token: token)
        req.httpMethod = "PUT"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try JSONEncoder().encode(dto)
        let (data, _) = try await urlSession.data(for: req)
        return try JSONDecoder().decode(EvalThresholdsDTO.self, from: data)
    }

    func flagExample(text: String, label: String) async throws -> FlagResult {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var req = request(path: "/eval/flag", token: token)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(withJSONObject: ["text": text, "label": label])
        let (data, _) = try await urlSession.data(for: req)
        return (try? JSONDecoder().decode(FlagResult.self, from: data))
            ?? FlagResult(status: "accepted", message: nil)
    }

    func activateAdapter(_ path: String) async throws {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var req = request(path: "/adapters/activate", token: token)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(withJSONObject: ["adapter": path])
        let (_, response) = try await urlSession.data(for: req)
        if let http = response as? HTTPURLResponse, http.statusCode >= 400 {
            throw HarnessError.activationFailed("HTTP \(http.statusCode)")
        }
    }

    func fetchManifestSummaries() async throws -> [ManifestSummary] {
        guard let token = bearerToken else { throw HarnessError.noToken }
        let (data, _) = try await urlSession.data(for: request(path: "/manifest", token: token))
        return (try? JSONDecoder().decode([ManifestSummary].self, from: data)) ?? []
    }

    func fetchAuditEntries(limit: Int = 100) async throws -> [AuditEntryDTO] {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var components = URLComponents(url: baseURL.appending(path: "/audit"), resolvingAgainstBaseURL: false)!
        components.queryItems = [URLQueryItem(name: "limit", value: "\(limit)")]
        var req = URLRequest(url: components.url!)
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        req.timeoutInterval = 10
        let (data, _) = try await urlSession.data(for: req)
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let wrapper = (try? decoder.decode(AuditEntriesResponse.self, from: data))
        return wrapper?.entries ?? []
    }

    func fetchInvariants() async throws -> InvariantStatusDTO {
        guard let token = bearerToken else { throw HarnessError.noToken }
        let (data, _) = try await urlSession.data(for: request(path: "/invariants", token: token))
        return try JSONDecoder().decode(InvariantStatusDTO.self, from: data)
    }

    func setKillSwitch(active: Bool) async throws {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var req = request(path: "/kill-switch", token: token)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(withJSONObject: ["active": active])
        let (_, response) = try await urlSession.data(for: req)
        if let http = response as? HTTPURLResponse, http.statusCode >= 400 {
            throw HarnessError.activationFailed("kill-switch HTTP \(http.statusCode)")
        }
    }

    // MARK: - Curriculum API

    func ingestSourceStream(domain: String, url: String, sourceId: String) -> AsyncThrowingStream<HarnessSSEEvent, Error> {
        AsyncThrowingStream { continuation in
            Task {
                guard let token = self.bearerToken else {
                    continuation.finish(throwing: HarnessError.noToken)
                    return
                }
                var req = self.request(path: "/curriculum/ingest", token: token)
                req.httpMethod = "POST"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")
                req.httpBody = try? JSONSerialization.data(
                    withJSONObject: ["domain": domain, "url": url, "source_id": sourceId]
                )

                do {
                    let (bytes, _) = try await self.urlSession.bytes(for: req)
                    var eventType = "message"
                    for try await line in bytes.lines {
                        if line.hasPrefix("event:") {
                            eventType = line.dropFirst(6).trimmingCharacters(in: .whitespaces)
                        } else if line.hasPrefix("data:") {
                            let data = String(line.dropFirst(5).trimmingCharacters(in: .whitespaces))
                            continuation.yield(HarnessSSEEvent(eventType: eventType, data: data))
                            eventType = "message"
                        }
                    }
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
        }
    }

    func fetchStaging(domain: String? = nil, reviewState: String? = nil) async throws -> StagingListResponse {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var components = URLComponents(url: baseURL.appending(path: "/staging"), resolvingAgainstBaseURL: false)!
        var queryItems: [URLQueryItem] = []
        if let domain { queryItems.append(URLQueryItem(name: "domain", value: domain)) }
        if let reviewState { queryItems.append(URLQueryItem(name: "review_state", value: reviewState)) }
        if !queryItems.isEmpty { components.queryItems = queryItems }
        var req = URLRequest(url: components.url!)
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        req.timeoutInterval = 10
        let (data, _) = try await urlSession.data(for: req)
        return try JSONDecoder().decode(StagingListResponse.self, from: data)
    }

    func reviewStagingItems(ids: [String]) async throws {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var req = request(path: "/staging/review", token: token)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(withJSONObject: ["ids": ids])
        let (_, response) = try await urlSession.data(for: req)
        if let http = response as? HTTPURLResponse, http.statusCode >= 400 {
            throw HarnessError.activationFailed("staging/review HTTP \(http.statusCode)")
        }
    }

    func promoteStagingItems(ids: [String]) async throws -> PromoteResponse {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var req = request(path: "/staging/promote", token: token)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(withJSONObject: ["ids": ids])
        let (data, _) = try await urlSession.data(for: req)
        return try JSONDecoder().decode(PromoteResponse.self, from: data)
    }

    // MARK: - Counter-Interference API

    func fetchProviders() async throws -> ProvidersResponse {
        guard let token = bearerToken else { throw HarnessError.noToken }
        let (data, _) = try await urlSession.data(for: request(path: "/providers", token: token))
        return try JSONDecoder().decode(ProvidersResponse.self, from: data)
    }

    func ciRunStream(
        prompt: String,
        providerIds: [String]?,
        domain: String?
    ) -> AsyncThrowingStream<HarnessSSEEvent, Error> {
        AsyncThrowingStream { continuation in
            Task {
                guard let token = self.bearerToken else {
                    continuation.finish(throwing: HarnessError.noToken)
                    return
                }
                var req = self.request(path: "/ci/run", token: token)
                req.httpMethod = "POST"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")

                var body: [String: Any] = ["prompt": prompt]
                if let providerIds { body["provider_ids"] = providerIds }
                if let domain { body["domain"] = domain }
                req.httpBody = try? JSONSerialization.data(withJSONObject: body)

                do {
                    let (bytes, _) = try await self.urlSession.bytes(for: req)
                    var eventType = "message"
                    for try await line in bytes.lines {
                        if line.hasPrefix("event:") {
                            eventType = line.dropFirst(6).trimmingCharacters(in: .whitespaces)
                        } else if line.hasPrefix("data:") {
                            let data = String(line.dropFirst(5).trimmingCharacters(in: .whitespaces))
                            continuation.yield(HarnessSSEEvent(eventType: eventType, data: data))
                            eventType = "message"
                        }
                    }
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
        }
    }

    func reviewDPOPair(pairId: String, action: String) async throws -> CIReviewResponse {
        guard let token = bearerToken else { throw HarnessError.noToken }
        var req = request(path: "/ci/review", token: token)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(
            withJSONObject: ["pair_id": pairId, "action": action]
        )
        let (data, _) = try await urlSession.data(for: req)
        return try JSONDecoder().decode(CIReviewResponse.self, from: data)
    }

    func retryCI(
        prompt: String,
        providerIds: [String],
        domain: String?
    ) -> AsyncThrowingStream<HarnessSSEEvent, Error> {
        AsyncThrowingStream { continuation in
            Task {
                guard let token = self.bearerToken else {
                    continuation.finish(throwing: HarnessError.noToken)
                    return
                }
                var req = self.request(path: "/ci/retry", token: token)
                req.httpMethod = "POST"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")

                var body: [String: Any] = ["prompt": prompt, "provider_ids": providerIds]
                if let domain { body["domain"] = domain }
                req.httpBody = try? JSONSerialization.data(withJSONObject: body)

                do {
                    let (bytes, _) = try await self.urlSession.bytes(for: req)
                    var eventType = "message"
                    for try await line in bytes.lines {
                        if line.hasPrefix("event:") {
                            eventType = line.dropFirst(6).trimmingCharacters(in: .whitespaces)
                        } else if line.hasPrefix("data:") {
                            let data = String(line.dropFirst(5).trimmingCharacters(in: .whitespaces))
                            continuation.yield(HarnessSSEEvent(eventType: eventType, data: data))
                            eventType = "message"
                        }
                    }
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
        }
    }

    // MARK: - Private helpers

    private struct AuditEntriesResponse: Decodable {
        let entries: [AuditEntryDTO]
    }

    private var urlSession: URLSession { .shared }

    private func request(path: String, token: String) -> URLRequest {
        var req = URLRequest(url: baseURL.appending(path: path))
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        req.timeoutInterval = 10
        return req
    }
}

// MARK: - Errors

enum HarnessError: LocalizedError {
    case noToken
    case activationFailed(String)

    var errorDescription: String? {
        switch self {
        case .noToken:
            return "Harness token not found. Run `make harness-up` to generate it."
        case .activationFailed(let reason):
            return "Adapter activation failed: \(reason)"
        }
    }
}

#endif

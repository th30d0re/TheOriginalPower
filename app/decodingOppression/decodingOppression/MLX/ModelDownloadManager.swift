//
//  ModelDownloadManager.swift
//  decodingOppression
//
//  Manages background download of Meta-Llama-3.1-8B-Instruct-abliterated-4bit model; observable state for SwiftUI.
//

import Combine
import Foundation
import Hub

@MainActor
final class ModelDownloadManager: NSObject, ObservableObject, @unchecked Sendable {
    // MainActor-isolated; marked Sendable to allow injection into actors.
    nonisolated static let sessionIdentifier = "com.decodingOppression.modelDownload"

    enum DownloadState: Sendable {
        case unavailable
        case downloading(progress: Double) // 0.0 – 1.0
        case available(modelURL: URL)
    }

    @Published var state: DownloadState = .unavailable
    @Published var downloadError: Error?

    private var backgroundSession: URLSession = URLSession(configuration: .default)
    nonisolated let modelDestinationURL: URL
    private var backgroundCompletionHandler: (() -> Void)?
    private var activeTasks: Set<Int> = []
    private var totalBytesExpected: Int64 = 0
    private var totalBytesWritten: [Int: Int64] = [:]
    private var expectedByTask: [Int: Int64] = [:]
    private var didEncounterError = false
    /// Shared instance for app lifecycle: URLSession delegate and environment injection.
    static let shared: ModelDownloadManager = ModelDownloadManager()

    override init() {
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        self.modelDestinationURL = appSupport.appendingPathComponent("decodingOppression/Meta-Llama-3.1-8B-Instruct-abliterated-4bit", isDirectory: true)
        super.init()

        backgroundSession = makeBackgroundSession()
        if modelDestinationURLContainsModel() {
            state = .available(modelURL: modelDestinationURL)
        } else {
            state = .unavailable
        }
    }

    func setBackgroundCompletionHandler(_ handler: @escaping () -> Void) {
        backgroundCompletionHandler = handler
    }

    func startDownload() async {
        guard case .unavailable = state else { return }
        downloadError = nil
        didEncounterError = false
        activeTasks.removeAll()
        totalBytesExpected = 0
        totalBytesWritten.removeAll()
        expectedByTask.removeAll()

        do {
            let files = try await resolveModelFileURLs()
            try FileManager.default.createDirectory(at: modelDestinationURL, withIntermediateDirectories: true)

            state = .downloading(progress: 0)

            for (url, path) in files {
                let task = backgroundSession.downloadTask(with: url)
                task.taskDescription = path
                activeTasks.insert(task.taskIdentifier)
                task.resume()
            }

            if activeTasks.isEmpty {
                state = .unavailable
                downloadError = NSError(domain: "ModelDownloadManager", code: -1, userInfo: [NSLocalizedDescriptionKey: "No files to download"])
            }
        } catch {
            state = .unavailable
            downloadError = error
        }
    }

    func cancelDownload() {
        backgroundSession.invalidateAndCancel()
        backgroundSession = makeBackgroundSession()
        state = .unavailable
        downloadError = nil
        activeTasks.removeAll()
        totalBytesExpected = 0
        totalBytesWritten.removeAll()
        expectedByTask.removeAll()
        didEncounterError = false
    }

    private func makeBackgroundSession() -> URLSession {
        let config = URLSessionConfiguration.background(withIdentifier: Self.sessionIdentifier)
        return URLSession(configuration: config, delegate: self, delegateQueue: nil)
    }

    private func modelDestinationURLContainsModel() -> Bool {
        let configURL = modelDestinationURL.appendingPathComponent("config.json")
        return FileManager.default.fileExists(atPath: configURL.path)
    }

    private func resolveModelFileURLs() async throws -> [(URL, String)] {
        let repoId = "mlx-community/Meta-Llama-3.1-8B-Instruct-abliterated-4bit"
        let hubApi = HubApi()
        let files = try await hubApi.getFilenames(
            from: repoId,
            matching: ["*.safetensors", "*.json"]
        )

        let base = "https://huggingface.co/\(repoId)/resolve/main/"
        return files.map { path in
            let encoded = path.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? path
            let url = URL(string: base + encoded)!
            return (url, path)
        }
    }

    private func updateAggregateProgress() {
        let written = totalBytesWritten.values.reduce(0, +)
        let progress: Double
        if totalBytesExpected > 0, totalBytesExpected != NSURLSessionTransferSizeUnknown {
            progress = min(1.0, Double(written) / Double(totalBytesExpected))
        } else {
            progress = totalBytesWritten.isEmpty ? 0 : 0.5
        }
        state = .downloading(progress: progress)
    }

    private func completeTask(id: Int, error: Error?) {
        activeTasks.remove(id)
        if let error {
            didEncounterError = true
            downloadError = error
            state = .unavailable
        }

        guard activeTasks.isEmpty else { return }
        if didEncounterError {
            state = .unavailable
            return
        }
        state = .available(modelURL: modelDestinationURL)
    }
}

extension ModelDownloadManager: URLSessionDownloadDelegate {
    nonisolated func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask, didWriteData bytesWritten: Int64, totalBytesWritten: Int64, totalBytesExpectedToWrite: Int64) {
        Task { @MainActor in
            let id = downloadTask.taskIdentifier
            if totalBytesExpectedToWrite != NSURLSessionTransferSizeUnknown, expectedByTask[id] == nil {
                expectedByTask[id] = totalBytesExpectedToWrite
                totalBytesExpected += totalBytesExpectedToWrite
            }
            self.totalBytesWritten[id] = totalBytesWritten
            updateAggregateProgress()
        }
    }

    nonisolated func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask, didFinishDownloadingTo location: URL) {
        guard let path = downloadTask.taskDescription else { return }
        let destination = modelDestinationURL.appendingPathComponent(path)

        do {
            try FileManager.default.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)
            if FileManager.default.fileExists(atPath: destination.path) {
                try FileManager.default.removeItem(at: destination)
            }
            try FileManager.default.moveItem(at: location, to: destination)
        } catch {
            Task { @MainActor in
                didEncounterError = true
                downloadError = error
                state = .unavailable
            }
        }
    }

    nonisolated func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        Task { @MainActor in
            completeTask(id: task.taskIdentifier, error: error)
        }
    }

    nonisolated func urlSessionDidFinishEvents(forBackgroundURLSession session: URLSession) {
        Task { @MainActor in
            backgroundCompletionHandler?()
            backgroundCompletionHandler = nil
        }
    }
}

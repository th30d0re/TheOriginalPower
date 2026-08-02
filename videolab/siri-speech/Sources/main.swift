// siri-speech — a loopback-only HTTP front end for AVSpeechSynthesizer so the
// videolab website can read text aloud in Siri Voice 2. The voice cannot be
// rendered to a file (AVSpeechSynthesizer.write() yields no buffers for Siri
// voices), so speech happens live on this Mac.
//
// Endpoints:
//   GET  /health     → voice availability report
//   POST /speak      → {"text":"…","rate":1.0} → {"ok":true,"id":"…"}
//   POST /stop       → stops the current utterance immediately
//   GET  /events?id= → Server-Sent Events: {"start":N,"length":M} per word, then {"done":true}
//
// Security posture: binds the loopback interface only, rejects non-loopback
// peers, answers CORS solely for http://localhost:* / http://127.0.0.1:* origins,
// caps request bodies at 64 KB, and never shells out or touches the filesystem
// beyond its own stdout log.

import AVFoundation
import Foundation
import Network

let voiceIdentifier = "com.apple.siri.natural.Simone"
let maxBodyBytes = 65_536
let maxHeaderBytes = 16_384

let port: UInt16 = {
    if let raw = ProcessInfo.processInfo.environment["SIRI_SPEECH_PORT"], let value = UInt16(raw) {
        return value
    }
    return 5277
}()

// MARK: - Speech engine (main thread only)

final class SpeechEngine: NSObject, AVSpeechSynthesizerDelegate {
    struct Subscriber {
        let id: String
        let connection: NWConnection
    }

    /// Resolved on first use rather than at init.
    ///
    /// As a stored-property initializer this returned nil in the compiled binary even
    /// though the identifier resolves fine in an interpreted script: the voice registry
    /// is not yet populated while the object is being constructed. Enumerating
    /// speechVoices() first warms it, and the list lookup is a second route to the same
    /// voice when the identifier initializer still comes back empty.
    lazy var voice: AVSpeechSynthesisVoice? = {
        let installed = AVSpeechSynthesisVoice.speechVoices()
        return AVSpeechSynthesisVoice(identifier: voiceIdentifier)
            ?? installed.first { $0.identifier == voiceIdentifier }
    }()
    private let synthesizer = AVSpeechSynthesizer()
    private var currentUtterance: AVSpeechUtterance?
    private(set) var currentId: String?
    private var eventBuffer: [String] = []
    private var subscribers: [Subscriber] = []

    override init() {
        super.init()
        synthesizer.delegate = self
    }

    /// The UI slider treats 1.0 as normal speed while AVSpeechUtterance treats
    /// AVSpeechUtteranceDefaultSpeechRate (0.5) as normal, so scale by the default
    /// and clamp into the platform range.
    func speak(text: String, rate: Float) -> String {
        if synthesizer.isSpeaking || synthesizer.isPaused {
            synthesizer.stopSpeaking(at: .immediate)
        }
        finalizeSubscribers()
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = voice
        utterance.rate = min(max(rate * AVSpeechUtteranceDefaultSpeechRate,
                                 AVSpeechUtteranceMinimumSpeechRate),
                             AVSpeechUtteranceMaximumSpeechRate)
        let id = UUID().uuidString
        currentUtterance = utterance
        currentId = id
        eventBuffer = []
        synthesizer.speak(utterance)
        return id
    }

    func stop() {
        guard synthesizer.isSpeaking || synthesizer.isPaused else { return }
        synthesizer.stopSpeaking(at: .immediate)
    }

    /// Attach an SSE connection to the utterance under `id`, replaying any word
    /// ranges already emitted. Returns false when the id is unknown or finished,
    /// in which case the caller closes the stream with a terminal done event.
    func subscribe(id: String, connection: NWConnection) -> Bool {
        guard id == currentId, currentUtterance != nil else { return false }
        for payload in eventBuffer {
            sseSend(connection, payload: payload, close: false)
        }
        subscribers.append(Subscriber(id: id, connection: connection))
        return true
    }

    private func emit(_ payload: String) {
        eventBuffer.append(payload)
        for subscriber in subscribers {
            sseSend(subscriber.connection, payload: payload, close: false)
        }
    }

    private func finish(_ utterance: AVSpeechUtterance) {
        guard utterance === currentUtterance else { return }
        currentUtterance = nil
        eventBuffer.append("{\"done\":true}")
        finalizeSubscribers()
    }

    /// Close every subscriber with a terminal done event. The send must carry the
    /// close itself — cancelling the connection separately races the async send
    /// and silently drops the frame.
    private func finalizeSubscribers() {
        let pending = subscribers
        subscribers = []
        for subscriber in pending {
            sseSend(subscriber.connection, payload: "{\"done\":true}", close: true)
        }
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer,
                           willSpeakRangeOfSpeechString characterRange: NSRange,
                           utterance: AVSpeechUtterance) {
        guard utterance === currentUtterance else { return }
        emit("{\"start\":\(characterRange.location),\"length\":\(characterRange.length)}")
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        finish(utterance)
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        finish(utterance)
    }
}

private func sseSend(_ connection: NWConnection, payload: String, close: Bool) {
    let frame = Data("data: \(payload)\n\n".utf8)
    connection.send(content: frame, completion: .contentProcessed { _ in
        if close { connection.cancel() }
    })
}

// MARK: - HTTP layer

struct HTTPRequest {
    let method: String
    let path: String
    let query: [String: String]
    let headers: [String: String]
    let body: Data
}

enum HTTPError: Error {
    case incomplete
    case malformed
    case headersTooLarge
    case bodyTooLarge
}

func parseHTTPRequest(_ buffer: Data) throws -> HTTPRequest {
    guard let headerEnd = buffer.range(of: Data("\r\n\r\n".utf8)) else {
        if buffer.count > maxHeaderBytes { throw HTTPError.headersTooLarge }
        throw HTTPError.incomplete
    }
    if headerEnd.lowerBound > maxHeaderBytes { throw HTTPError.headersTooLarge }

    guard let headerText = String(data: buffer.subdata(in: 0..<headerEnd.lowerBound), encoding: .utf8) else {
        throw HTTPError.malformed
    }
    var lines = headerText.components(separatedBy: "\r\n")
    let requestLine = lines.removeFirst()
    let parts = requestLine.split(separator: " ")
    guard parts.count == 3 else { throw HTTPError.malformed }

    var headers: [String: String] = [:]
    for line in lines {
        guard let colon = line.firstIndex(of: ":") else { continue }
        let name = line[..<colon].trimmingCharacters(in: .whitespaces).lowercased()
        let value = line[line.index(after: colon)...].trimmingCharacters(in: .whitespaces)
        headers[name] = value
    }

    let contentLength = Int(headers["content-length"] ?? "0") ?? 0
    if contentLength > maxBodyBytes { throw HTTPError.bodyTooLarge }
    let bodyStart = headerEnd.upperBound
    if buffer.count < bodyStart + contentLength { throw HTTPError.incomplete }
    let body = buffer.subdata(in: bodyStart..<(bodyStart + contentLength))

    let target = String(parts[1])
    let (path, query) = splitTarget(target)
    return HTTPRequest(method: String(parts[0]), path: path, query: query, headers: headers, body: body)
}

func splitTarget(_ target: String) -> (String, [String: String]) {
    guard let question = target.firstIndex(of: "?") else { return (target, [:]) }
    let path = String(target[..<question])
    var query: [String: String] = [:]
    for pair in target[target.index(after: question)...].split(separator: "&") {
        let kv = pair.split(separator: "=", maxSplits: 1)
        if kv.count == 2 {
            query[String(kv[0])] = String(kv[1]).removingPercentEncoding ?? String(kv[1])
        }
    }
    return (path, query)
}

/// Echoes the request origin only for http://localhost:* and http://127.0.0.1:*.
/// Returns nil when the origin is absent (curl, same-machine tools) — callers
/// treat nil as "allowed, no CORS header needed" and must check `forbidden`
/// separately.
func allowedOrigin(_ request: HTTPRequest) -> (origin: String?, forbidden: Bool) {
    guard let origin = request.headers["origin"], !origin.isEmpty else { return (nil, false) }
    let pattern = #"^http://(localhost|127\.0\.0\.1)(:\d+)?$"#
    if origin.range(of: pattern, options: .regularExpression) != nil {
        return (origin, false)
    }
    return (nil, true)
}

func sendResponse(_ connection: NWConnection, status: Int, reason: String,
                  body: String, contentType: String = "application/json",
                  origin: String?, extraHeaders: [String: String] = [:],
                  close: Bool = true) {
    var head = "HTTP/1.1 \(status) \(reason)\r\n"
    head += "Content-Type: \(contentType)\r\n"
    head += "Content-Length: \(body.utf8.count)\r\n"
    head += "Connection: close\r\n"
    if let origin {
        head += "Access-Control-Allow-Origin: \(origin)\r\n"
        head += "Vary: Origin\r\n"
    }
    for (name, value) in extraHeaders {
        head += "\(name): \(value)\r\n"
    }
    head += "\r\n"
    connection.send(content: Data((head + body).utf8), completion: .contentProcessed { _ in
        if close { connection.cancel() }
    })
}

// MARK: - Server

final class Server {
    private let engine = SpeechEngine()
    private let listener: NWListener
    private let queue = DispatchQueue(label: "siri-speech.connections")

    init(port: UInt16) throws {
        let parameters = NWParameters.tcp
        // Bind the loopback interface only — a speech server on 0.0.0.0 lets the
        // whole LAN make this Mac talk.
        parameters.requiredInterfaceType = .loopback
        parameters.allowLocalEndpointReuse = true
        listener = try NWListener(using: parameters, on: NWEndpoint.Port(rawValue: port)!)
    }

    func start() {
        listener.newConnectionHandler = { [weak self] connection in
            self?.accept(connection)
        }
        listener.stateUpdateHandler = { state in
            if case .failed(let error) = state {
                FileHandle.standardError.write("listener failed: \(error)\n".data(using: .utf8)!)
            }
        }
        listener.start(queue: queue)
    }

    private func accept(_ connection: NWConnection) {
        // Defense in depth on top of the loopback binding: drop any peer that is
        // not 127.0.0.1, ::1, or localhost.
        guard case .hostPort(let host, _) = connection.endpoint, isLoopback(host) else {
            connection.cancel()
            return
        }
        connection.stateUpdateHandler = { [weak self] state in
            guard let self else { return }
            switch state {
            case .ready:
                self.receive(connection, buffer: Data())
            case .failed, .cancelled:
                connection.cancel()
            default:
                break
            }
        }
        connection.start(queue: queue)
    }

    private func receive(_ connection: NWConnection, buffer: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: maxBodyBytes + maxHeaderBytes) { [weak self] data, _, isComplete, error in
            guard let self else { return }
            var accumulated = buffer
            if let data { accumulated.append(data) }
            do {
                let request = try parseHTTPRequest(accumulated)
                self.route(connection, request: request)
            } catch HTTPError.incomplete {
                if isComplete || error != nil {
                    sendResponse(connection, status: 400, reason: "Bad Request", body: "{\"ok\":false,\"error\":\"incomplete request\"}", origin: nil)
                } else {
                    self.receive(connection, buffer: accumulated)
                }
            } catch HTTPError.bodyTooLarge {
                sendResponse(connection, status: 413, reason: "Payload Too Large", body: "{\"ok\":false,\"error\":\"text exceeds the 64 KB limit\"}", origin: nil)
            } catch {
                sendResponse(connection, status: 400, reason: "Bad Request", body: "{\"ok\":false,\"error\":\"malformed request\"}", origin: nil)
            }
        }
    }

    private func route(_ connection: NWConnection, request: HTTPRequest) {
        let (origin, forbidden) = allowedOrigin(request)
        if forbidden {
            sendResponse(connection, status: 403, reason: "Forbidden", body: "{\"ok\":false,\"error\":\"origin not allowed\"}", origin: nil)
            return
        }

        if request.method == "OPTIONS" {
            sendResponse(connection, status: 204, reason: "No Content", body: "", contentType: "text/plain", origin: origin, extraHeaders: [
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "600",
            ])
            return
        }

        switch (request.method, request.path) {
        case ("GET", "/health"):
            handleHealth(connection, origin: origin)
        case ("POST", "/speak"):
            handleSpeak(connection, request: request, origin: origin)
        case ("POST", "/stop"):
            handleStop(connection, origin: origin)
        case ("GET", "/events"):
            handleEvents(connection, request: request, origin: origin)
        default:
            sendResponse(connection, status: 404, reason: "Not Found", body: "{\"ok\":false,\"error\":\"not found\"}", origin: origin)
        }
    }

    private func handleHealth(_ connection: NWConnection, origin: String?) {
        DispatchQueue.main.async {
            let body: String
            if let voice = self.engine.voice {
                let name = escapeJSON(voice.name)
                body = "{\"ok\":true,\"voice\":\"\(name)\",\"identifier\":\"\(voiceIdentifier)\",\"available\":true}"
            } else {
                body = "{\"ok\":true,\"voice\":null,\"identifier\":\"\(voiceIdentifier)\",\"available\":false,\"reason\":\"Siri Voice 2 is not visible to this process. Siri voices are gated by code signature: an ad-hoc-signed binary sees 180 voices and no Siri, while Apple-signed swift sees 190 including it. Start this helper with 'swift Sources/main.swift', not the compiled binary.\"}"
            }
            sendResponse(connection, status: 200, reason: "OK", body: body, origin: origin)
        }
    }

    private func handleSpeak(_ connection: NWConnection, request: HTTPRequest, origin: String?) {
        guard let object = try? JSONSerialization.jsonObject(with: request.body),
              let payload = object as? [String: Any],
              let text = payload["text"] as? String, !text.isEmpty else {
            sendResponse(connection, status: 400, reason: "Bad Request", body: "{\"ok\":false,\"error\":\"body must be JSON with a non-empty \\\"text\\\" string\"}", origin: origin)
            return
        }
        var rate: Float = 1.0
        if let number = payload["rate"] as? NSNumber {
            rate = number.floatValue
        }
        guard rate.isFinite, rate > 0 else {
            sendResponse(connection, status: 400, reason: "Bad Request", body: "{\"ok\":false,\"error\":\"\\\"rate\\\" must be a positive number\"}", origin: origin)
            return
        }
        guard self.engine.voice != nil else {
            sendResponse(connection, status: 503, reason: "Service Unavailable", body: "{\"ok\":false,\"error\":\"Siri Voice 2 is not available on this Mac\"}", origin: origin)
            return
        }
        DispatchQueue.main.async {
            let id = self.engine.speak(text: text, rate: rate)
            sendResponse(connection, status: 200, reason: "OK", body: "{\"ok\":true,\"id\":\"\(id)\"}", origin: origin)
        }
    }

    private func handleStop(_ connection: NWConnection, origin: String?) {
        DispatchQueue.main.async {
            self.engine.stop()
            sendResponse(connection, status: 200, reason: "OK", body: "{\"ok\":true}", origin: origin)
        }
    }

    private func handleEvents(_ connection: NWConnection, request: HTTPRequest, origin: String?) {
        guard let id = request.query["id"], !id.isEmpty else {
            sendResponse(connection, status: 400, reason: "Bad Request", body: "{\"ok\":false,\"error\":\"missing \\\"id\\\" query parameter\"}", origin: origin)
            return
        }
        var head = "HTTP/1.1 200 OK\r\n"
        head += "Content-Type: text/event-stream\r\n"
        head += "Cache-Control: no-cache\r\n"
        head += "Connection: close\r\n"
        if let origin {
            head += "Access-Control-Allow-Origin: \(origin)\r\n"
            head += "Vary: Origin\r\n"
        }
        head += "\r\n"
        connection.send(content: Data(head.utf8), completion: .contentProcessed { _ in
            DispatchQueue.main.async {
                if !self.engine.subscribe(id: id, connection: connection) {
                    // Unknown or finished utterance: terminate the client's
                    // highlight state instead of leaving the stream hanging.
                    sseSend(connection, payload: "{\"done\":true}", close: true)
                }
            }
        })
    }
}

func isLoopback(_ host: NWEndpoint.Host) -> Bool {
    switch host {
    case .ipv4(let address):
        return address.rawValue.withUnsafeBytes { $0.count == 4 && $0[0] == 127 }
    case .ipv6(let address):
        return address.rawValue.withUnsafeBytes { bytes in
            bytes.count == 16 && bytes.prefix(15).allSatisfy { $0 == 0 } && bytes[15] == 1
        }
    case .name(let name, _):
        return name == "localhost"
    @unknown default:
        return false
    }
}

func escapeJSON(_ value: String) -> String {
    var result = ""
    for scalar in value.unicodeScalars {
        switch scalar {
        case "\"": result += "\\\""
        case "\\": result += "\\\\"
        default: result.unicodeScalars.append(scalar)
        }
    }
    return result
}

let server = try Server(port: port)
server.start()
FileHandle.standardOutput.write("siri-speech listening on 127.0.0.1:\(port) voice=\(voiceIdentifier)\n".data(using: .utf8)!)
RunLoop.main.run()

//
//  CapabilityProbe.swift
//  decodingOppression
//
//  Runtime capability detection: determines whether native MLX training
//  or the Python daemon is the appropriate execution path.
//

#if os(macOS) && !targetEnvironment(simulator)

import Foundation
import Metal

// MARK: - Types

enum Executor: String, Sendable {
    case nativeMLX   = "Native MLX"
    case pythonDaemon = "Python daemon"
}

struct ProbeResult: Sendable {
    let ramBytes: UInt64
    let hasMLXAccelerator: Bool
    let recommendedExecutor: Executor

    var ramGigabytes: Double { Double(ramBytes) / (1024 * 1024 * 1024) }
}

// MARK: - Actor

actor CapabilityProbe {

    static let shared = CapabilityProbe()

    private var cachedResult: ProbeResult?

    func probe() async -> ProbeResult {
        if let cached = cachedResult { return cached }

        let ram = ProcessInfo.processInfo.physicalMemory
        let hasMetal = MTLCreateSystemDefaultDevice() != nil
        let meetsRAMThreshold = ram >= 16 * 1_024 * 1_024 * 1_024

        let executor: Executor = (hasMetal && meetsRAMThreshold) ? .nativeMLX : .pythonDaemon

        let result = ProbeResult(
            ramBytes: ram,
            hasMLXAccelerator: hasMetal,
            recommendedExecutor: executor
        )
        cachedResult = result
        return result
    }
}

#endif

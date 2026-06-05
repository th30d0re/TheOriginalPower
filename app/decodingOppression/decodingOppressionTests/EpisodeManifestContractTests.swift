//
//  EpisodeManifestContractTests.swift
//  decodingOppressionTests
//
//  Created by Emmanuel Theodore on 5/10/26.
//

import Foundation
import Testing

@Suite struct EpisodeManifestContractTests {
    @Test func testEpisodeManifestFixtureRoundTripsWithSnakeCaseKeys() throws {
        let fixtureURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .appendingPathComponent("episode_manifest.json")
        let fixtureData = try Data(contentsOf: fixtureURL)

        let manifest = try JSONDecoder().decode(EpisodeManifest.self, from: fixtureData)

        #expect(manifest.schemaVersion == "1.0")
        #expect(manifest.episodeId == "episode-smoke-test")
        #expect(manifest.sampleRate == 48_000)
        #expect(manifest.createdAt == "2026-05-10T12:00:00Z")
        #expect(manifest.speakers.count == 2)
        #expect(manifest.speakers.first?.turnCount == 1)
        #expect(manifest.turns.count == 2)
        #expect(manifest.turns.first?.sourceTimestamp == "00:00:00.000")
        #expect(manifest.turns.first?.segments.first?.gapAfterMs == 250)

        let encodedData = try JSONEncoder().encode(manifest)
        let originalCanonicalJSON = try canonicalJSONData(from: fixtureData)
        let roundTrippedCanonicalJSON = try canonicalJSONData(from: encodedData)

        #expect(roundTrippedCanonicalJSON == originalCanonicalJSON)

        let encodedJSON = try jsonDictionary(from: encodedData)
        #expect(hasExactlyKeys(encodedJSON, expectedTopLevelKeys))
        #expect(encodedJSON["schema_version"] as? String == manifest.schemaVersion)
        #expect(encodedJSON["episode_id"] as? String == manifest.episodeId)
        #expect(encodedJSON["source_file"] as? String == manifest.sourceFile)
        #expect(encodedJSON["model_id"] as? String == manifest.modelId)
        #expect(encodedJSON["sample_rate"] as? Int == manifest.sampleRate)
        #expect(encodedJSON["created_at"] as? String == manifest.createdAt)

        let speakerJSON = try firstDictionary(in: encodedJSON["speakers"])
        #expect(hasExactlyKeys(speakerJSON, expectedSpeakerKeys))
        #expect(speakerJSON["speaker_id"] as? String == manifest.speakers[0].speakerId)
        #expect(speakerJSON["display_name"] as? String == manifest.speakers[0].displayName)
        #expect(speakerJSON["turn_count"] as? Int == manifest.speakers[0].turnCount)

        let turnJSON = try firstDictionary(in: encodedJSON["turns"])
        #expect(hasExactlyKeys(turnJSON, expectedTurnKeys))
        #expect(turnJSON["turn_index"] as? Int == manifest.turns[0].turnIndex)
        #expect(turnJSON["turn_id"] as? String == manifest.turns[0].turnId)
        #expect(turnJSON["speaker_id"] as? String == manifest.turns[0].speakerId)
        #expect(turnJSON["source_timestamp"] as? String == manifest.turns[0].sourceTimestamp)
        #expect(turnJSON["start_ms"] as? Int == manifest.turns[0].startMs)
        #expect(turnJSON["end_ms"] as? Int == manifest.turns[0].endMs)

        let segmentJSON = try firstDictionary(in: turnJSON["segments"])
        #expect(hasExactlyKeys(segmentJSON, expectedSegmentKeys))
        #expect(segmentJSON["chunk_index"] as? Int == manifest.turns[0].segments[0].chunkIndex)
        #expect(segmentJSON["segment_wav"] as? String == manifest.turns[0].segments[0].segmentWav)
        #expect(segmentJSON["duration_ms"] as? Int == manifest.turns[0].segments[0].durationMs)
        #expect(segmentJSON["speech_duration_ms"] as? Int == manifest.turns[0].segments[0].speechDurationMs)
        #expect(segmentJSON["gap_after_ms"] as? Int == manifest.turns[0].segments[0].gapAfterMs)
        #expect(segmentJSON["checksum"] as? String == manifest.turns[0].segments[0].checksum)
    }
}

private let expectedTopLevelKeys: Set<String> = [
    "schema_version",
    "episode_id",
    "source_file",
    "model_id",
    "engine",
    "sample_rate",
    "created_at",
    "speakers",
    "turns",
]

private let expectedSpeakerKeys: Set<String> = [
    "speaker_id",
    "display_name",
    "voice",
    "turn_count",
    "engine",
    "character_profile",
]

private let expectedTurnKeys: Set<String> = [
    "turn_index",
    "turn_id",
    "speaker_id",
    "source_timestamp",
    "segments",
    "start_ms",
    "end_ms",
]

private let expectedSegmentKeys: Set<String> = [
    "chunk_index",
    "segment_wav",
    "duration_ms",
    "speech_duration_ms",
    "start_ms",
    "end_ms",
    "gap_after_ms",
    "checksum",
]

private enum EpisodeManifestContractTestError: Error {
    case invalidJSON
}

private func canonicalJSONData(from data: Data) throws -> Data {
    let object = try JSONSerialization.jsonObject(with: data)
    return try JSONSerialization.data(withJSONObject: object, options: [.sortedKeys])
}

private func jsonDictionary(from data: Data) throws -> [String: Any] {
    let object = try JSONSerialization.jsonObject(with: data)
    guard let dictionary = object as? [String: Any] else {
        throw EpisodeManifestContractTestError.invalidJSON
    }
    return dictionary
}

private func firstDictionary(in object: Any?) throws -> [String: Any] {
    guard let dictionaries = object as? [[String: Any]], let dictionary = dictionaries.first else {
        throw EpisodeManifestContractTestError.invalidJSON
    }
    return dictionary
}

private func hasExactlyKeys(_ dictionary: [String: Any], _ keys: Set<String>) -> Bool {
    Set(dictionary.keys) == keys
}

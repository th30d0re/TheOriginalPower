// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "siri-speech",
    platforms: [.macOS(.v13)],
    targets: [
        .executableTarget(name: "siri-speech", path: "Sources")
    ]
)

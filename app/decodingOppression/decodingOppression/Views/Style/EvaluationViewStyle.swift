//
//  EvaluationViewStyle.swift
//  decodingOppression
//
//  macOS-only style constants for EvaluationView (T5).
//

#if os(macOS)

import SwiftUI

enum EvaluationViewStyle {
    static let contentPadding: CGFloat = 20
    static let sectionSpacing: CGFloat = 16
    static let chartHeight: CGFloat = 180

    static func formatPercent(_ value: Double) -> String {
        let pct = Int((value * 100).rounded())
        return "\(pct)%"
    }

    static func metricBorderColor(passed: Bool) -> Color {
        passed ? .green : .red
    }

    static func fidelityColor(allPassed: Bool) -> Color {
        allPassed ? .green : .orange
    }
}

#endif

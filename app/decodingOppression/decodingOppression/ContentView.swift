//
//  ContentView.swift
//  decodingOppression
//
//  Created by Emmanuel Theodore on 2/19/26.
//

import SwiftUI

struct ContentView: View {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding: Bool = false

    #if os(iOS)
    @State private var historyViewModel = PolicyHistoryViewModel()
    #endif

    #if os(macOS)
    @State private var selectedSidebarItem: SidebarItem? = .analyze
    @State private var historyViewModel = PolicyHistoryViewModel()
    @State private var trainingViewModel = TrainingViewModel()
    @State private var validationViewModel = ValidationViewModel()
    @State private var trainingDataViewModel = TrainingDataViewModel()
    #endif

    var body: some View {
        #if os(iOS)
        NavigationStack {
            if hasCompletedOnboarding {
                TabView {
                    Tab("Analyze", systemImage: "doc.text.magnifyingglass") {
                        PolicyHistoryView(viewModel: historyViewModel)
                    }
                    Tab("Engine", systemImage: "cpu") {
                        EngineView(tier2Engine: AppDependencies.shared.tier2Engine)
                    }
                }
            } else {
                WelcomeView(hasCompletedOnboarding: $hasCompletedOnboarding)
            }
        }
        #elseif os(macOS)
        @Bindable var historyViewModel = historyViewModel

        return NavigationSplitView {
            List(SidebarItem.allCases, selection: $selectedSidebarItem) { item in
                Label(item.title, systemImage: item.systemImage)
                    .tag(item)
            }
            .navigationTitle("decodingOppression")
        } detail: {
            switch selectedSidebarItem ?? .analyze {
            case .analyze:
                NavigationSplitView {
                    PolicyHistoryView(viewModel: historyViewModel)
                        .navigationTitle("Analyses")
                } detail: {
                    if let analysis = historyViewModel.selectedAnalysis {
                        ScoreCardView(analysis: analysis)
                    } else {
                        ContentUnavailableView(
                            "Select an Analysis",
                            systemImage: "doc.text.magnifyingglass",
                            description: Text("Choose an analysis to view results.")
                        )
                    }
                }
            case .engine:
                EngineView(tier2Engine: AppDependencies.shared.tier2Engine)
            case .training:
                TrainingView(viewModel: trainingViewModel)
            case .validation:
                ValidationView(viewModel: validationViewModel)
            case .data:
                TrainingDataView(viewModel: trainingDataViewModel)
            }
        }
        #endif
    }
}

#if os(macOS)
private enum SidebarItem: String, CaseIterable, Identifiable {
    case analyze
    case engine
    case training
    case validation
    case data

    var id: Self { self }

    var title: String {
        switch self {
        case .analyze:
            return "Analyze"
        case .engine:
            return "Engine"
        case .training:
            return "Training"
        case .validation:
            return "Validation"
        case .data:
            return "Data"
        }
    }

    var systemImage: String {
        switch self {
        case .analyze:
            return "doc.text.magnifyingglass"
        case .engine:
            return "cpu"
        case .training:
            return "bolt.circle"
        case .validation:
            return "checkmark.shield"
        case .data:
            return "tray.full"
        }
    }
}
#endif

#Preview {
    ContentView()
        .environmentObject(AppDependencies.shared)
        .environmentObject(ModelDownloadManager.shared)
}

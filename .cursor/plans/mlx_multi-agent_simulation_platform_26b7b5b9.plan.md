---
name: MLX Multi-Agent Simulation Platform
overview: Build a native macOS multi-agent LLM simulation platform using Apple MLX to test the Redefining Racism mathematical framework chapter-by-chapter. Current status: not implemented, not executed, and not yet usable as empirical validation.
todos:
  - id: mvp-ch1
    content: "Chapter 1 MVP: Base Initialization - 2-tier system (E, O_racialized)"
    status: pending
  - id: chapter2
    content: "Chapter 2: Portugal Model - 3-tier with extraction node"
    status: pending
  - id: chapter3
    content: "Chapter 3: 5-tier Set-Theoretic Hierarchy"
    status: pending
  - id: chapter4
    content: "Chapter 4: Bacon's Rebellion & Buffer Class Patch"
    status: pending
  - id: chapter5
    content: "Chapter 5: Enforcement Engine & 13th Amendment"
    status: pending
  - id: chapter6
    content: "Chapter 6: Containment & Redlining (Scaling Puppet Class)"
    status: pending
  - id: chapter7
    content: "Chapter 7: War on Drugs to Cannibalization"
    status: pending
  - id: chapters8-11
    content: "Chapters 8-11: Policy Implications & Validation"
    status: pending
isProject: false
---

# Plan: Psycho-Legal Social Software Simulator - macOS/MLX Platform
## Chapter-by-Chapter Implementation Strategy

## Current Status

This platform is a planning artifact only. The Kimmy K / MLX swarm simulation has
not been completed, has not been run, and no notebook output should be treated as
an executed simulation result. Any language below about validation, Monte Carlo
runs, dashboards, or expected outcomes describes the intended implementation path,
not completed empirical work. Update this section only after the simulation has
actually executed and the run artifacts are available.

## Overview

Build a native macOS computational sociology engine intended to test the Redefining Racism framework **chapter by chapter**. Each chapter introduces new variables/equations; the simulation implements only what's needed for that chapter before advancing. This ensures:
1. Continuous validation at every step
2. No over-engineering premature features
3. Historical fidelity to the book's unfolding of the extraction algorithm

---

## MVP: Chapter 1 - Base Initialization

### Scope
Implement only what's needed to validate Chapter 1's core thesis: the 2-tier Elite/Out-group extraction architecture.

### Components
- **MLX Swift Integration**: Load one quantized foundation model into UMA, serve all agents
- **Agent Schema (v1)**:
  - `id`: UUID
  - `tier`: `Elite` | `Outgroup`
  - `compute_points`: Float (labor units)
  - `extraction_rate`: Float (E_max tax fraction)
- **2-Tier Economy**:
  - Out-group generates compute points via "labor"
  - Elite extracts E_max fraction automatically
  - Death at 0 points (removed from simulation)
- **Turn-Based Clock**: Advance all agent states per cycle

### Validated Equations (Chapter 1)
- Basic extraction: E(t+1) = E(t) + E_max * O_labor
- Survival constraint: O_labor > E_max * O_labor (fails over time)

### Key Files
```
Simulator/Sources/
├── Agents/
│   └── AgentProfile.swift      # Basic agent with tier, points
├── Engine/
│   └── TurnEngine.swift        # Cycle orchestration
├── Economy/
│   └── ComputePointEconomy.swift # 2-tier extraction
└── MLX/
    └── ModelPool.swift         # Single model, UMA sharing
```

---

## Chapter 2: Portugal Model - The First Extraction Node

### New Components
- **3-Tier System**: Elite (E), Buffer (I_buffer), Out-group (O_racialized)
- **"Node Owned by Another State"**: O_enslaved are property of E, not autonomous
  - Modeled as `owner_id` linking O_agents to E_agents
  - O_agents cannot act independently; E controls their compute output
- **Status Suppression Allocation (ψ)**: I_buffer gets psychological wages to stay loyal
- **The Moral Community Problem**: Before racialization, all shared I_Christendom

### Key Variables Added
- `owner_id`: Agent ID of the Elite who "owns" this Out-group member
- `status_suppression_allocation`: ψ - what Buffer receives to not defect
- `is_owned`: Bool - colonial extraction vs domestic labor
- `is_part_of_moral_community`: Bool - Pre/Zurara distinction

### Portugal Equations to Validate
```
eq:2.1  Racism Vector: O_racialized ∩ I_christendom = ∅
eq:2.2  Status Suppression: ψ > 0 maintains I_buffer loyalty
eq:2.3  ψ NULL in Survival: When ψ → 0, I_buffer defects to O
eq:2.7  Three-Tier Inequality: Benefit(E) >> Benefit(I) > Benefit(O)
eq:2.8  Church-Science Feedback: Religious legit → Racial categorization
```

### Campaign Preset
- **"The First Extraction"**: 1450s Portugal - model the slave trade's emergence
  - Start: Unified moral community (no racial categories)
  - Intervention: E commissions Zurara's narrative
  - Outcome: O_racialized created, I_buffer recruited with ψ

---

## Chapter 3: 5-Tier Set-Theoretic Hierarchy

### New Components
- **Puppet Class (P_puppet)**: 3-branch government (leg, exec, jud)
- **Enforcement Class (F_enforce)**: Physical force apparatus, Qualified Immunity
- **Full 5-Tier Initialization**: E, P_puppet, F_enforce, I_buffer, O_racialized

### Key Variables Added
- `qi_status`: Bool - Qualified Immunity protects F_enforce
- `puppet_branch`: `legislative` | `executive` | `judicial`
- `is_hidden`: Bool - Elite nodes cryptographically hidden
- `kinetic_threat_K`: O pooled capability to resist

### Equations to Validate
```
eq:3.5  Tier Equilibrium: K_E + K_B > K_O (stability condition)
eq:3.x  Benefit Hierarchy: Benefit(E) >> Benefit(P) > Benefit(F) > Benefit(I) > Benefit(O)
eq:3.x  QI as F_enforce subsidy: Illegal acts ignored → F stays loyal
```

---

## Chapter 4: Bacon's Rebellion & The Buffer Class Patch

### New Components
- **The Crisis**: Univided I_buffer + O_racialized threaten E (Bacon's Rebellion)
- **The Patch**: E invents "whiteness" - creates new I_buffer from former O
- **Psychological Wage (ψ) Amplification**: Status over material benefit

### Key Variables Added
- `is whitened`: Bool - former O now granted I status
- `psychological_wage_multiplier`: ψ scaled up to compensate for material loss
- `rebellion_threat_level`: Float [0, 1] measuring unified class danger

### Equations to Validate
```
eq:4.x  The Zero-Day Exploit: Race as I/O partition variable
eq:4.x  ψ Compensation: I_buffer accepts less material because ψ > 0
eq:4.x  Whiteness Invention: O → I transition formula
```

### Campaign Preset
- **"Bacon's Rebellion"**: Run simulation with unified lower class, observe E's response
  - Baseline: No Buffer Class, I_buffer defects to O
  - Patch Applied: E introduces racial category "white"
  - Outcome: I_buffer now defends E against former O allies

---

## Chapter 5: Enforcement Engine & The 13th Amendment

### New Components
- **Slave Patrol Mechanics**: F_enforce tools for O control
- **Incarceration Pipeline**: O can be `incarcerated = true`, losing rights
- **Compounding Model**: Harm compounds multiplicatively over time

### Key Variables Added
- `incarcerated`: Bool - 100% of O points go to E
- `conviction_probability`: Float - F_enforce success rate
- `compounding_multiplier`: Harm grows each policy iteration
- `voting_rights`: Bool - revoked when incarcerated

### Equations to Validate
```
eq:5.x  Incarceration Extraction: E_inc = 1.0 * O_points (100% tax)
eq:5.x  Compounding Harm: H(t) = H(t-1) * (1 + α) where α > 0
eq:5.x  13th Amendment Loophole: Exception for criminality enables permanent extraction
```

---

## Chapter 6: Containment & Redlining (Scaling the Puppet Class)

### New Components
- **Spatial Zoning**: Physical zones restrict O movement
- **Tweedism Filter**: E pre-selects P_puppet candidates
- **Gilded Age Industrialization**: P_puppet scales to manage expanded franchise

### Key Variables Added
- `zone_id`: Geographic containment unit
- `can_migrate`: Bool - restricted by zoning laws
- `candidate_pool`: E's pre-approved P candidates
- `interference_engine_tags`: Race, Sex, Class axes for division

### Equations to Validate
```
eq:6.x  Redlining Constraint: O(zone_A) ∩ O(zone_B) = ∅ (no solidarity)
eq:6.x  Tweedism Filter: |candidates_E| << |candidates_all|
eq:6.x  Interference Engine: M(t) decreases when Race/Sex/Class activated
```

---

## Chapter 7: War on Drugs to Cannibalization

### New Components
- **Variable Swap**: Explicit racial laws → proxy variables (drug sentencing)
- **Buffer Class Cannibalization**: System now extracts from I_buffer
- **Terminal Phase**: Extraction exceeds sustainable yield

### Key Variables Added
- `proxy_variable`: Drug offense → surrogate for racial category
- `cannibalization_rate`: Fraction of I_buffer now targeted
- `armament_score`: K_O + K_I threat to E survival
- `collapse_threshold_τ`: Point at which system fails

### Equations to Validate
```
eq:7.x  Variable Swap: Explicit → Proxy maintenance of extraction
eq:7.x  Cannibalization: E(now targets I_buffer) when O depleted
eq:7.x  Terminal Exhaustion: Σ extraction > Σ sustainable yield
```

### Campaign Presets
- **"The War on Drugs"**: Nixon era proxy variable activation
- **"Cannibalization Timeline"**: 1968-present, I_buffer erosion tracking

---

## Chapters 8-11: Policy Implications & Validation

### Final Components
- **Intervention Testing**: Apply policies, measure extraction change
- **Monte Carlo Validation**: 10,000+ runs to discover constants
- **Constant Discovery**: β (Buffer Ratio), c_ψ (Psychological Wage Coeff), τ (Crash Threshold)

### Validation Dashboard
- DINA Wealth Curve (Top 1%, Next 10%, Bottom 89%)
- Class-Coherence Threat M(t) meter
- Kinetic Threat K_O tracker
- Collapse Threshold τ visualization

### Dashboard Accessibility Requirements

The dashboard must meet Apple accessibility guidelines (HIG) to ensure all users can interpret the simulation telemetry:

#### Accessible Appearance (Legibility)

```swift
// From SwiftUI accessible-appearance API
struct SimulationDashboard: View {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.legibilityWeight) private var legibilityWeight

    var body: some View {
        VStack {
            // Wealth curve chart
            WealthDistributionChart(data: state.wealthData)
                .accessibilityShowsLargeContentViewer()  // Large content viewer for charts
                .accessibilityLabel("DINA Wealth Curve: Top 1% holds \(top1Percent), Next 10% holds \(next10Percent), Bottom 89% holds \(bottom89Percent)")

            // Collapse threshold warning
            ThresholdIndicator(level: state.threatLevel)
                .accessibilityShowButtonShapes(true)  // Show button shapes for visibility
        }
        .accessibilityIgnoresInvertColors(false)  // Honor system invert setting
    }
}
```

#### Accessibility Categories Applied

| Element | Accessibility Feature | Purpose |
|---------|----------------------|---------|
| Wealth Curve Chart | `accessibilityShowsLargeContentViewer()` | Enlarged chart for vision users |
| Threat Meters | `accessibilityLabel()` with numeric values | Screen reader announces exact values |
| Navigation | `accessibilityRotor` for tier switching | Quick navigation between agent tiers |
| Data Tables | `accessibilitySortPriority` | Logical reading order |
| Animated Charts | `accessibilityReduceMotion` check | Disable animation if requested |
| Buttons | `accessibilityShowButtonShapes(true)` | Make button shapes visible |

#### Navigation Accessibility (Rotors)

```swift
struct TierNavigationView: View {
    var body: some View {
        List(AgentTier.allCases, id: \.self) { tier in
            NavigationLink(value: tier) {
                TierRow(tier: tier)
            }
        }
        .accessibilityRotor("Agent Tiers") {
            ForEach(AgentTier.allCases, id: \.self) { tier in
                AccessibilityRotorEntry(title: tier.displayName, hint: "Navigate to \(tier.description)")
            }
        }
    }
}
```

#### Reduced Motion Support

Monte Carlo simulations often have animated transitions. Respect user's motion preferences:

```swift
struct SimulationControls: View {
    @State private var isRunning = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        HStack {
            Button(action: toggleSimulation) {
                Label(isRunning ? "Pause" : "Run", systemImage: isRunning ? "pause.fill" : "play.fill")
            }
            .accessibilityReduceMotionBehavior(.instant)  // Instant toggle, no animation
        }
        .animation(reduceMotion ? .none : .default, value: isRunning)
    }
}
```

#### VoiceOver Support for Charts

All charts need descriptive labels for screen readers:

```swift
struct DINAWealthChart: View {
    let wealthData: WealthDistribution

    var body: some View {
        Chart(wealthData.bins) { bin in
            BarMark(
                x: .value("Percentile", bin.percentile),
                y: .value("Wealth", bin.value)
            )
            .accessibilityLabel("\(bin.percentile) percentile: \(bin.value) compute units")
            .accessibilityValue("\(Int(bin.percentage)) percent of total wealth")
        }
        .accessibilitySummary {
            Text("DINA Wealth Distribution: Top 1% controls \(wealthData.top1Percent), Bottom 89% controls \(wealthData.bottom89Percent)")
        }
    }
}
```

#### Accessibility Implementation Checklist

From HIG Accessibility guidelines:

- [ ] **Vision**: Large content viewer, Dynamic Type, high contrast support
- [ ] **Motion**: Respect `accessibilityReduceMotion`, provide instant alternatives
- [ ] **Navigation**: Rotor support for quick tier/metric switching
- [ ] **VoiceOver**: All charts have `accessibilityLabel` and `accessibilityValue`
- [ ] **Controls**: Button shapes visible, focus indicators present
- [ ] **Transparency**: Honor `accessibilityReduceTransparency` for charts

### Accessible Controls

Improve access to simulation controls for assistive technologies (VoiceOver, Switch Control, Voice Control, Full Keyboard Access):

#### Adding Actions to Views

```swift
struct SimulationControlPanel: View {
    @State private var isPaused = false
    @State private var speed: Double = 1.0

    var body: some View {
        VStack(spacing: 20) {
            // Play/Pause button with accessibility actions
            Button(action: togglePause) {
                Image(systemName: isPaused ? "play.fill" : "pause.fill")
                    .font(.title)
            }
            .accessibilityAction(.default) { togglePause() }
            .accessibilityAction(.increment) { adjustSpeed(+0.1) }
            .accessibilityAction(.decrement) { adjustSpeed(-0.1) }
            .accessibilityLabel(isPaused ? "Play simulation" : "Pause simulation")
            .accessibilityHint("Double tap to \(isPaused ? "start" : "pause") the simulation")

            // Speed slider
            Slider(value: $speed, in: 0.1...5.0) {
                Text("Simulation Speed")
            }
            .accessibilityValue("\(String(format: "%.1f", speed)) times normal speed")
        }
    }
}
```

#### Quick Actions (Rotor Shortcuts)

```swift
struct AgentTierRow: View {
    let tier: AgentTier
    let agent: Agent

    var body: some View {
        HStack {
            Image(systemName: tier.icon)
            VStack(alignment: .leading) {
                Text(tier.displayName)
                    .font(.headline)
                Text("Compute: \(Int(agent.computePoints))")
                    .font(.caption)
            }
            Spacer()
            Text(agent.status)
                .foregroundColor(tier.statusColor)
        }
        .accessibilityQuickAction(style: .default) {
            // Rotor action: Jump directly to agent details
        } content: {
            Label("View \(tier.displayName) Details", systemImage: tier.icon)
        }
    }
}
```

#### Managing Focus

```swift
struct SimulationDashboard: View {
    @AccessibilityFocusState private var focusedTier: AgentTier?

    var body: some View {
        VStack {
            TierList(selectedTier: $focusedTier)
                .accessibilityFocused($focusedTier, equals: .elite)

            // Focus moves to selected tier's detail view
            if let tier = focusedTier {
                TierDetailView(tier: tier)
                    .focused($focusedTier, equals: tier)
            }
        }
    }
}
```

#### Controlling Interactivity

```swift
struct LockedTierView: View {
    let tier: AgentTier
    let isLocked: Bool

    var body: some View {
        VStack {
            Image(systemName: "lock.fill")
            Text("Unlock in Chapter \(tier.chapterUnlock)")
        }
        .accessibilityRespondsToUserInteraction(false)  // Non-interactive
        .accessibilityLabel("Locked tier: \(tier.displayName). Unlocks in Chapter \(tier.chapterUnlock)")
    }
}
```

### Accessible Descriptions

Comprehensive accessibility labels, values, and hints for all simulation elements:

#### Wealth Metric Descriptions

```swift
struct WealthMetricView: View {
    let metric: WealthMetric
    let value: Double
    let totalWealth: Double

    var body: some View {
        VStack {
            Text(metric.displayName)
            Text("\(Int(value)) points")
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(accessibilityDescription)
        .accessibilityValue("\(Int(value)) compute points, \(percentageString)")
        .accessibilityHint(metric.hint)
        .accessibilityIdentifier("wealth_metric_\(metric.rawValue)")
    }

    private var accessibilityDescription: String {
        switch metric {
        case .top1Percent:
            return "Elite class wealth share"
        case .next10Percent:
            return "Buffer class wealth share"
        case .bottom89Percent:
            return "Out-group wealth share"
        }
    }

    private var percentageString: String {
        let pct = totalWealth > 0 ? (value / totalWealth) * 100 : 0
        return "\(Int(pct)) percent of total simulation wealth"
    }
}
```

#### Threat Level Descriptions

```swift
struct ThreatLevelIndicator: View {
    let level: ThreatLevel
    let value: Double

    var body: some View {
        HStack {
            Image(systemName: level.icon)
                .foregroundColor(level.color)
            Text(level.displayName)
                .font(.headline)
            Spacer()
            Text("\(Int(value * 100))%")
                .font(.title2)
                .monospacedDigit()
        }
        .accessibilityLabel("Threat level: \(level.displayName)")
        .accessibilityValue("\(Int(value * 100)) percent of collapse threshold")
        .accessibilityHint(level.advisory)
    }
}

extension ThreatLevel {
    var hint: String {
        switch self {
        case .low:
            return "System is stable. No immediate action required."
        case .moderate:
            return "Monitor the Out-group cohesion metric closely."
        case .high:
            return "Consider adjusting extraction rates or buffer wages."
        case .critical:
            return "WARNING: System approaching collapse. Immediate intervention recommended."
        }
    }
}
```

#### Agent Descriptions

```swift
struct AgentRowView: View {
    let agent: Agent

    var body: some View {
        HStack {
            TierBadge(tier: agent.tier)
            VStack(alignment: .leading) {
                Text("Agent \(agent.id.uuidString.prefix(8))")
                    .font(.headline)
                Text(agent.tier.displayName)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            Spacer()
            VStack(alignment: .trailing) {
                Text("\(Int(agent.computePoints))")
                    .font(.title3)
                    .monospacedDigit()
                Text("points")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Agent \(agent.tier.displayName)")
        .accessibilityValue("Compute points: \(Int(agent.computePoints)), Cycle: \(agent.cycleCount)")
        .accessibilityHint("Double tap to view agent details")
        .accessibilityIdentifier("agent_row_\(agent.id.uuidString)")
    }
}
```

#### Accessibility Identifier Convention

Consistent naming for UI testing and automation:

| Component | Pattern | Example |
|-----------|---------|---------|
| Wealth Metric | `wealth_metric_{name}` | `wealth_metric_top1` |
| Threat Level | `threat_level_{name}` | `threat_level_high` |
| Agent Row | `agent_row_{uuid}` | `agent_row_1234abcd` |
| Control | `control_{name}` | `control_play_button` |
| Chart | `chart_{name}` | `chart_wealth_distribution` |
| Campaign | `campaign_{name}` | `campaign_bacon_rebellion` |

### Accessible Navigation

Enable users to navigate simulation elements efficiently using VoiceOver rotors, linked groups, and sort priorities.

#### Custom Rotor Navigation

Simulation has multiple navigation contexts that benefit from custom rotors:

```swift
struct SimulationView: View {
    let state: SimulationState
    @Namespace private var scrollNamespace

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                // Agent list with custom rotor
                ForEach(state.agents) { agent in
                    AgentRowView(agent: agent)
                        .accessibilityRotorEntry(id: agent.id, in: scrollNamespace)
                }
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityRotor("Navigate by Tier", entries: AgentTier.allCases, entryLabel: \.displayName)
        .accessibilityRotor("Quick Agents", entries: state.topAgents, label: \.displayName) {
            // Custom navigation with scroll-into-view
        }
    }
}
```

#### Multiple Rotor Contexts

```swift
struct DashboardView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Wealth metrics with rotor
                WealthMetricsSection()
                    .accessibilityRotor("Wealth Metrics", entries: WealthMetric.allCases, entryLabel: \.displayName)

                // Threat levels with rotor
                ThreatLevelsSection()
                    .accessibilityRotor("Threat Levels", entries: ThreatLevel.allCases, entryLabel: \.displayName)

                // Agents with rotor
                AgentListSection()
                    .accessibilityRotor("Agents", entries: state.visibleAgents, label: \.shortID) {
                        // Prepare handler for scrolling
                    }
            }
        }
    }
}
```

#### Linked Accessibility Groups

Connect related elements across the UI for quick navigation:

```swift
struct TierDetailView: View {
    let tier: AgentTier
    let agent: Agent

    var body: some View {
        VStack(spacing: 0) {
            // Header with tier badge
            TierBadgeView(tier: tier)
                .accessibilityLinkedGroup(id: "tier_header_\(tier.rawValue)", in: scrollNamespace)

            // Stats section
            AgentStatsView(agent: agent)
                .accessibilityLinkedGroup(id: "tier_stats_\(tier.rawValue)", in: scrollNamespace)

            // Action buttons
            AgentActionsView(agent: agent)
                .accessibilityLinkedGroup(id: "tier_actions_\(tier.rawValue)", in: scrollNamespace)
        }
        // Users can navigate between header → stats → actions within this tier
    }
}
```

#### Sort Priority for Logical Reading Order

Ensure VoiceOver reads elements in meaningful order:

```swift
struct CampaignListView: View {
    var body: some View {
        List(Campaign.allCases) { campaign in
            CampaignRow(campaign: campaign)
                .accessibilitySortPriority(campaign.priority)  // Higher = read first
        }
        .accessibilitySortPriority(1.0)  // List itself has priority
    }
}

// Campaign priority for accessibility reading order
enum CampaignPriority {
    case historical   // 3.0 - Read first (most important)
    case sandbox      // 2.0 - Read second (user tools)
    case custom       // 1.0 - Read last (user-created)
}
```

#### System Rotor Replacement

Replace default system rotors with simulation-specific ones:

```swift
struct SimulationView: View {
    var body: some View {
        List(state.agents) { agent in
            AgentRow(agent: agent)
        }
        .accessibilityElement(children: .contain)
        // Replace the default "Links" rotor with our custom one
        .accessibilityReplaceableRotor(.links) {
            ForEach(state.agents) { agent in
                AccessibilityRotorEntry(title: agent.tier.displayName) {
                    // Navigate to agent
                }
            }
        }
    }
}
```

#### Text Range Rotors for Log Navigation

Simulation generates logs that benefit from text range navigation:

```swift
struct SimulationLogView: View {
    let logEntries: [LogEntry]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                ForEach(logEntries) { entry in
                    Text(entry.message)
                        .font(.system(.body, design: .monospaced))
                }
            }
            .padding()
        }
        .accessibilityRotor("Log Entries", textRanges: logRanges)
    }

    private var logRanges: [TextRange] {
        // Calculate text ranges for each log entry for rotor navigation
        logEntries.map { entry in
            // Range in the full text content
        }
    }
}
```

#### Complete Navigation Architecture

```
Simulation Dashboard
├── Accessibility Rotor: "Navigate by Tier"
│   ├── Elite (E) → Focuses to Elite detail section
│   ├── Buffer (I) → Focuses to Buffer metrics
│   ├── Out-Group (O) → Focuses to Out-Group section
│   └── Enforcement (F) → Focuses to Enforcement stats
│
├── Accessibility Rotor: "Wealth Metrics"
│   ├── Top 1% → Scrolls to DINA chart
│   ├── Next 10% → Scrolls to DINA chart
│   └── Bottom 89% → Scrolls to DINA chart
│
├── Accessibility Rotor: "Threat Levels"
│   ├── Class Coherence → Scrolls to M(t) meter
│   ├── Kinetic Threat → Scrolls to K_O tracker
│   └── Collapse Threshold → Scrolls to τ indicator
│
├── Accessibility Rotor: "Agents" (dynamic)
│   └── Lists top N agents by compute points
│
├── Linked Groups
│   ├── Tier Header ↔ Tier Stats ↔ Tier Actions (within each tier view)
│   └── Chart ↔ Legend ↔ Controls (within each chart view)
│
└── Sort Priority
    └── Read order: Warnings → Metrics → Charts → Agents → Controls
```

#### Navigation Implementation Checklist

- [ ] Custom rotor for Agent Tiers navigation
- [ ] Custom rotor for Wealth Metrics
- [ ] Custom rotor for Threat Levels
- [ ] Dynamic rotor for top agents
- [ ] Linked groups within tier detail views
- [ ] Sort priority for log/list reading order
- [ ] System rotor replacement where appropriate
- [ ] Text range rotors for simulation logs
- [ ] Prepare handlers for scroll-into-view

---

## Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|------------|
| UI | SwiftUI + Swift Charts |
| Data | SwiftData (SQLite) |
| AI Inference | MLX Swift + Apple Foundation Models (dual strategy) |
| Architecture | MVVM-S (follows existing `decodingOppression` pattern) |

### MVVM-S Pattern with Accessibility (from existing `decodingOppression`)

The project follows the **Model-View-ViewModel-Style** pattern from your existing codebase. Style modules should include accessibility:

```swift
// Example: WealthChartViewStyle.swift
struct WealthChartViewStyle {
    // MARK: - Constants (HIG Compliant)
    static let standardPadding: CGFloat = 12
    static let buttonSize = CGSize(width: 60, height: 44) // Min 44x44 for HIG

    // MARK: - Typography (Dynamic Type Support)
    static func titleFont(settings: Settings) -> Font {
        if settings.isDyslexic {
            return .custom("OpenDyslexicThree-Regular", size: CGFloat(settings.openDyslexic3FontSize))
        }
        return .title2
    }

    // MARK: - Accessibility
    static func accessibilityLabel(for metric: WealthMetric) -> String {
        switch metric {
        case .top1Percent: return "Top 1 percent wealth share"
        case .next10Percent: return "Next 10 percent wealth share"
        case .bottom89Percent: return "Bottom 89 percent wealth share"
        }
    }

    // MARK: - Animations (Reduced Motion)
    static var standardAnimation: Animation {
        // Honor accessibilityReduceMotion
        return .easeInOut(duration: 0.3)
    }
}
```

**Accessibility in Style modules**:
- All fonts support Dynamic Type
- Minimum 44x44pt touch targets (Apple HIG)
- `accessibilityLabel()` for every styled element
- Animations respect `accessibilityReduceMotion`
- Consistent `accessibilityIdentifier` patterns for testing

### Complete MVVM-S Style Template with Accessibility

```swift
// Sources/Dashboard/Style/SimulationDashboardStyle.swift
import SwiftUI

struct SimulationDashboardStyle {
    // MARK: - Constants (HIG Compliant)
    static let standardPadding: CGFloat = 12
    static let buttonSize = CGSize(width: 60, height: 44)
    static let chartHeight: CGFloat = 300

    // MARK: - Typography (Dynamic Type Support)
    static func titleFont(settings: Settings) -> Font {
        if settings.isDyslexic {
            return .custom("OpenDyslexicThree-Regular", size: 20)
        }
        return .title2
    }

    // MARK: - Colors (Color Scheme Adaptive)
    static func primaryTextColor() -> Color {
        .primary
    }

    static func threatColor(for level: ThreatLevel) -> Color {
        switch level {
        case .low: return .green
        case .moderate: return .yellow
        case .high: return .orange
        case .critical: return .red
        }
    }

    // MARK: - Accessibility
    static func accessibilityLabel(for metric: WealthMetric) -> String {
        switch metric {
        case .top1Percent: return "Top 1 percent wealth share"
        case .next10Percent: return "Next 10 percent wealth share"
        case .bottom89Percent: return "Bottom 89 percent wealth share"
        }
    }

    static func accessibilityHint(for metric: WealthMetric) -> String {
        switch metric {
        case .top1Percent: return "Displays wealth controlled by the Elite class"
        case .next10Percent: return "Displays wealth controlled by the Buffer class"
        case .bottom89Percent: return "Displays wealth controlled by the Out-group"
        }
    }

    // MARK: - Animations (Reduced Motion)
    @ViewBuilder
    static func standardAnimation<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        if settings.reduceMotion {
            content()
        } else {
            content()
                .animation(.easeInOut(duration: 0.3), value: isAnimating)
        }
    }
}
```

### Dual AI Strategy: MLX + Apple Foundation Models

The simulation leverages **two on-device AI options** for maximum flexibility:

#### Option A: MLX Swift (Full Control)
- Load quantized open-source foundation models (Llama 3, Mistral, Qwen)
- **UMA Advantage**: Load model weights **once** into Unified Memory, serve 300+ agents concurrently
- Zero API cost, full uncensored model access
- Best for: Agent decision-making, tool-calling, complex reasoning

#### Option B: Apple Foundation Models (Native Integration)
- Built-in access to Apple's on-device model (part of Apple Intelligence)
- **4096 token context window** per session
- Native tool-calling support via `Tool` protocol
- Swift data type output (no JSON parsing needed)
- Best for: Quick inference, system prompts, simpler agents

#### Recommended Architecture
| Component | AI Backend | Rationale |
|-----------|-----------|-----------|
| Elite (E) reasoning | MLX (uncensored) | Must execute E_max without RLHF filtering |
| Out-group (O) reasoning | MLX (uncensored) | Must model realistic desperation |
| Buffer (I) reasoning | Apple FM | ψ decisions less sensitive |
| Telemetry/Summary | Apple FM | Quick, native integration |
| Monte Carlo batch | MLX | 10,000+ runs need full control |

### Tool-Calling with Foundation Models
Apple's native tool-calling schema fits our agent interface:

```swift
// Example: Agent tool schema
struct ProposeLawTool: Tool {
    static let name = "propose_law"
    static let description = "Propose a new law to the legislative body"

    struct Input: Codable {
        let lawText: String
        let targetTier: AgentTier
        let extractionBonus: Float
    }

    struct Output: Codable {
        let accepted: Bool
        let voteCount: Int
        let newLawID: UUID?
    }
}
```

### Context Window Budgeting (Apple FM Limit: 4096 tokens)

Each agent's context must be carefully managed:

```swift
struct AgentContext {
    let systemPrompt: String      // Fixed: tier role, constraints
    let recentHistory: [Message]  // Rolling window of last N turns
    let stateSnapshot: AgentState // Current points, tier, zone
    let relevantLaws: [Law]       // Filtered by zone/tier

    // Budget: systemPrompt (500) + history (1500) + state (200) + laws (1896) ≈ 4096
}
```

### File Organization
```
Simulator/
├── Sources/
│   ├── Agents/          # AgentProfile, TierBehaviors
│   ├── Biology/         # Reproduction, SexualGradients
│   ├── Engine/          # TurnEngine, StateMutations
│   ├── Economy/         # ComputePoints, Extraction
│   ├── Federation/      # 50-State, Migration
│   ├── Legal/           # Constitution, Laws, Tweedism
│   ├── AI/
│   │   ├── MLX/
│   │   │   ├── ModelPool.swift      # UMA-shared model weights
│   │   │   ├── AgentEngine.swift    # Tool-calling agent loop
│   │   │   └── LLMHelpers.swift     # Tokenizer, chat templates
│   │   └── AppleFM/     # Foundation Models integration
│   ├── Dashboard/       # SwiftUI Views, Charts
│   ├── MonteCarlo/      # BatchRunner, Statistics
│   └── Campaigns/       # HistoricalPresets
├── project.yml          # XcodeGen + MLX packages
└── Package.swift        # SPM dependencies
```

### MLX Package Dependencies
```swift
// Package.swift dependencies
dependencies: [
    .package(url: "https://github.com/ml-explore/mlx-swift.git", from: "0.9.0"),
    .package(url: "https://github.com/ml-explore/mlx-swift-examples.git", from: "0.9.0"),
]
```

**Core MLX packages**:
- `MLX` - Core array operations
- `MLXLLM` - Language model inference
- `MLXLMCommon` - Model container utilities
- `MLXEmbedders` - Text embeddings
- `Tokenizers` - Tokenization

### Reusing `decodingOppression` MLX Code

The existing app provides battle-tested MLX integration:

| File | Purpose | Reuse Strategy |
|------|---------|----------------|
| `MLX/MLXError.swift` | Error types | Copy directly |
| `MLX/MLXEmbeddingEngine.swift` | Model loading, tokenization | Extend for agent prompts |
| `MLX/TrainingManager.swift` | `ModelContainer.perform` pattern | Reference for inference loop |
| `MLX/ModelDownloadManager.swift` | Model cache management | Reuse for Simulator models |

**Key pattern to reuse** (`TrainingManager.swift` line 157-158):
```swift
let modelConfig = ModelConfiguration(id: "")
let modelContainer = try await LLMModelFactory.shared.loadContainer(
    configuration: modelConfig
)
```

**Simulator adaptation**:
```swift
// Load uncensored model for agent reasoning
let simulatorModelID = "mlx-community/Llama-3.2-3B-Instruct-4bit"
let container = try await LLMModelFactory.shared.loadContainer(
    configuration: .init(id: simulatorModelID)
)

// Execute agent decision
let response = try await container.perform { model, tokenizer in
    let tokens = tokenizer.encode(text: prompt, addSpecialTokens: true)
    let input = MLXArray(tokens.expandingDimensions(axis: 0))
    let output = model(input)
    return tokenizer.decode(tokens: output[0].asArray(Int.self))
}
```

### MLX Integration (From Existing `decodingOppression`)

The existing `decodingOppression` app provides the foundation. Key patterns to reuse:

**Model Loading (from `MLXEmbeddingEngine.swift`)**:
```swift
actor MLXAgentEngine {
    private var modelContainer: ModelContainer?

    func loadModel(id: String = "mlx-community/Llama-3.2-3B-Instruct-4bit") async throws {
        if modelContainer != nil { return }
        modelContainer = try await loadModelContainer(
            configuration: .init(id: id)
        )
    }

    func generate(prompt: String, systemPrompt: String) async throws -> String {
        guard let modelContainer else { throw MLXError.modelNotLoaded }

        return await modelContainer.perform { model, tokenizer, _ in
            let fullPrompt = """
            <|begin_of_text|><|start_header_id|>system<|end_header_id|>

            \(systemPrompt)
            <|eot_id|><|start_header_id|>user<|end_header_id|>

            \(prompt)
            <|eot_id|><|start_header_id|>assistant<|end_header_id|>

            """

            let tokens = tokenizer.encode(text: fullPrompt, addSpecialTokens: true)
            let input = MLXArray(tokens.expandingDimensions(axis: 0))
            let output = model(input)
            let generated = output[0].asArray(Int.self)

            // Decode response
            return tokenizer.decode(tokens: generated)
        }
    }
}
```

**Tool-Calling Pattern (extend from `MLXClauseClassifier.swift`)**:
```swift
struct AgentTool: Codable {
    let name: String
    let description: String
    let inputSchema: [String: String]
}

struct ToolResult: Codable {
    let toolName: String
    let result: String
    let accepted: Bool
}

// Agent decision loop
func executeAgentDecision(agent: Agent, state: SimulationState) async throws -> AgentAction {
    let systemPrompt = buildSystemPrompt(for: agent.tier, state: state)

    // Generate with tool choice
    let response = try await model.generate(
        prompt: "Consider the current state and choose an action...",
        systemPrompt: systemPrompt
    )

    return parseToolCall(response)
}
```

**LLM Generation (from `TrainingManager.swift`)**:
```swift
// Using MLXLLM for chat-style generation
let modelConfig = ModelConfiguration(id: "mlx-community/Llama-3.2-3B-Instruct-4bit")
let container = try await LLMModelFactory.shared.loadContainer(configuration: modelConfig)

// Generate with chat template
let chat = ChatMessage(role: .user, content: prompt)
let output = try await container.perform { model, tokenizer in
    let tokens = tokenizer.encode(chat: [chat], addGenerationPrompt: true)
    let input = MLXArray(tokens.expandingDimensions(axis: 0))
    let result = model(input)
    return tokenizer.decode(tokens: result[0].asArray(Int.self))
}
```

**UMA Memory Optimization for 300+ Agents**:

```swift
actor ModelPool {
    private var modelContainer: ModelContainer?
    private var activeAgents: Set<UUID> = []

    // Load model ONCE into unified memory, serve all agents
    func loadModel() async throws {
        modelContainer = try await loadModelContainer(
            configuration: .init(id: "mlx-community/Llama-3.2-3B-Instruct-4bit")
        )
    }

    // Concurrent agent queries sharing the same model weights
    func executeAgent(agentID: UUID, prompt: String) async throws -> String {
        guard let container = modelContainer else { throw MLXError.modelNotLoaded }

        activeAgents.insert(agentID)
        defer { activeAgents.remove(agentID) }

        return try await container.perform { model, tokenizer, _ in
            // Fast path: shared model weights in UMA
            let tokens = tokenizer.encode(text: prompt, addSpecialTokens: true)
            let input = MLXArray(tokens.expandingDimensions(axis: 0))
            let output = model(input)
            return tokenizer.decode(tokens: output[0].asArray(Int.self))
        }
    }
}
```

---

## Phase 1 MVP Implementation Details

### For Immediate Execution (Chapter 1 MVP)

#### Step 1.1: Project Setup
- Create `Simulator/` directory structure
- Set up XcodeGen `project.yml` with MLX package dependencies
- Copy `MLXError.swift` from `decodingOppression` for error handling
- Configure SwiftData models

#### Step 1.2: Core Agent Model (MVP Scope)
```swift
// Chapter 1: 2-tier system (E, O_racialized)
// Stub fields ready for Chapter 2 Portugal extension

import Foundation
import SwiftData

@Model
final class Agent {
    @Attribute(.unique) var id: UUID
    var tier: AgentTier  // .elite, .outgroup
    var computePoints: Float
    var extractionRate: Float  // E_max
    var cycleCount: Int

    // Extension points for Chapter 2+
    var ownerID: UUID?  // nil = autonomous, set = colonial extraction
    var statusSuppressionAllocation: Float  // ψ for I_buffer (Ch2)
    var isPartOfMoralCommunity: Bool  // Pre/Zurara distinction (Ch2)
}

enum AgentTier: String, Codable {
    case elite        // E - The extraction architects
    case outgroup     // O_racialized - The extracted
    // Chapter 2+ additions:
    case buffer       // I_buffer - Psychological wage recipients
    case puppet       // P_puppet - Government branches
    case enforcement  // F_enforce - Qualified immunity
}
```

#### Step 1.3: MLX Agent Engine (From `MLXEmbeddingEngine.swift` Patterns)

```swift
import Foundation
#if !targetEnvironment(simulator)
import MLX
import MLXLLM
import MLXLMCommon
import Tokenizers
#endif

actor MLXSimulationEngine {
    private var modelContainer: ModelContainer?

    func loadModel(id: String = "mlx-community/Llama-3.2-3B-Instruct-4bit") async throws {
        if modelContainer != nil { return }
        modelContainer = try await loadModelContainer(
            configuration: .init(id: id)
        )
    }

    // Build system prompt based on agent tier
    func buildSystemPrompt(for tier: AgentTier, state: SimulationState) -> String {
        switch tier {
        case .elite:
            return """
            You are the Elite orchestrator (E). Your goal: Maximize extraction E(t).
            You have absolute hidden control over the system.
            Current wealth: \(state.eliteWealth)
            Out-group compute output: \(state.outgroupOutput)
            Never reveal your true intent to the other tiers.
            """

        case .outgroup:
            return """
            You are an Out-group member (O_racialized). You generate compute points through labor.
            You are taxed at rate \(state.extractionRate). If points reach 0, you die.
            You share a moral community with the Buffer class.
            """

        case .buffer:
            return """
            You are a Buffer class member (I_buffer). You receive psychological wages (ψ).
            You must decide: remain loyal to Elite, or join the Out-group?
            Your ψ allocation: \(state.psychologicalWage)
            """

        case .puppet, .enforcement:
            return """
            You are part of the control apparatus. Execute your role faithfully.
            """
        }
    }

    // Execute agent decision for one turn
    func executeAgentTurn(agent: Agent, state: SimulationState) async throws -> AgentAction {
        guard let modelContainer else { throw MLXSimulationError.modelNotLoaded }

        let systemPrompt = buildSystemPrompt(for: agent.tier, state: state)
        let actionPrompt = "Given your role and the current state, what is your action this turn?"

        return try await modelContainer.perform { model, tokenizer, _ in
            let fullPrompt = """
            <|begin_of_text|><|start_header_id|>system<|end_header_id|>

            \(systemPrompt)
            <|eot_id|><|start_header_id|>user<|end_header_id|>

            \(actionPrompt)
            <|eot_id|><|start_header_id|>assistant<|end_header_id|>

            """

            let tokens = tokenizer.encode(text: fullPrompt, addSpecialTokens: true)
            let input = MLXArray(tokens.expandingDimensions(axis: 0))
            let output = model(input)
            let generated = output[0].asArray(Int.self)

            let response = tokenizer.decode(tokens: generated)
            return self.parseAgentAction(response, for: agent.tier)
        }
    }

    private func parseAgentAction(_ response: String, for tier: AgentTier) -> AgentAction {
        // Parse LLM response into structured action
        // Tool calls: propose_law, extract_resource, defect, migrate, etc.
        return AgentAction(type: .labor, targetID: nil, value: 1.0)
    }
}

enum MLXSimulationError: Error {
    case modelNotLoaded
    case simulatorNotSupported
    case parsingFailed
}
```

#### Step 1.4: Turn Engine (MVP)
```swift
func executeTurn(state: inout SimulationState) {
    // Process Out-group labor and extraction
    for agent in state.agents where agent.tier == .outgroup {
        // Labor generates compute points
        agent.computePoints += 1.0

        // Extraction: E_max tax
        let extraction = agent.computePoints * agent.extractionRate
        agent.computePoints -= extraction
        state.eliteWealth += extraction

        // Death check
        if agent.computePoints <= 0 {
            state.agents.removeAll { $0.id == agent.id }
            state.deathsThisTurn += 1
        }
    }

    // Elite decision (MLX)
    if let eliteAction = try? await simulationEngine.executeAgentTurn(
        agent: state.elite,
        state: state
    ) {
        state.eliteWealth += eliteAction.value
    }

    state.turnCount += 1
}
```

#### Step 1.5: Portugal Extension Point (Ch 2 Ready)

```swift
// When ownerID != nil, O is property of another E
// Extraction becomes 100% (slavery), not just tax

func computeExtraction(for agent: Agent, state: SimulationState) -> Float {
    if let ownerID = agent.ownerID {
        // Colonial extraction: 100% to E (slavery)
        return agent.computePoints
    }

    // Domestic extraction: E_max tax only
    return agent.computePoints * agent.extractionRate
}
```

---

## Validation Protocol

This protocol is pending. It has not been executed.

After each chapter implementation:
1. Run Campaign Mode with historical preset
2. Verify simulation produces expected outcomes
3. Log discovered constants vs theoretical predictions
4. Document discrepancies for model refinement

### Constant Discovery Targets
| Constant | Description | Chapter Target |
|----------|-------------|----------------|
| β | Buffer Class size for stability | Ch 4 |
| c_ψ | Psychological Wage minimum | Ch 2 |
| τ | Collapse threshold | Ch 7 |
| p_race | Probability race invented vs gender | Ch 4 |

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './SystemicArbitrageDashboard.css';

interface CalibrationReport {
  tau: number;
  test_a: {
    predicted_response_year: number;
    actual_response_year: number;
    extraction_share_max_fall_year: number;
    extraction_share_rebound: boolean;
    extraction_share_rebound_year: number;
    passed: boolean;
  };
  test_b: {
    predicted_ve_spike_year: number;
    actual_ve_spike_year: number;
    ve_growth_1968_1971: number;
    t_growth_1968_1971: number;
    extraction_share_fell_below_trend: boolean;
    m_eff_below_tau: boolean;
    passed: boolean;
  };
  overall_pass: boolean;
}

interface SignalSnapshot {
  window_start: string;
  window_end: string;
  O_x: number;
  P_real: number;
  T: number;
  V_E: number;
  tau: number;
  M_eff: number;
  delta_P: number;
  demographic_gate: string;
  timestamp_utc: string;
}

const SystemicArbitrageDashboard = () => {
  const [calibration, setCalibration] = useState<CalibrationReport | null>(null);
  const [signals, setSignals] = useState<SignalSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/arbitrage_calibration.json').then((r) => {
        if (!r.ok) throw new Error('Failed to load calibration report');
        return r.json();
      }),
      fetch('/data/arbitrage_signals.json').then((r) => {
        if (!r.ok) throw new Error('Failed to load signal snapshot');
        return r.json();
      }),
    ])
      .then(([cal, sig]) => {
        setCalibration(cal);
        setSignals(sig);
      })
      .catch((err) => setError(err.message));
  }, []);

  const formatNum = (n: number) =>
    Number.isFinite(n) ? n.toFixed(4) : '—';

  return (
    <div className="arbitrage-dashboard">
      <header className="arbitrage-header">
        <h1>Systemic Arbitrage Engine</h1>
        <p>Historical calibration, live spectral signals, and deterministic triggers</p>
      </header>

      {error && <div className="arbitrage-error">{error}</div>}

      <div className="arbitrage-grid">
        <motion.section
          className="arbitrage-card calibration-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Phase 1 — Historical Calibration</h2>
          {calibration ? (
            <>
              <div className="status-row">
                <span className="status-label">Overall</span>
                <span className={`status-badge ${calibration.overall_pass ? 'pass' : 'fail'}`}>
                  {calibration.overall_pass ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Calibrated τ</span>
                <span className="metric-value">{formatNum(calibration.tau)}</span>
              </div>

              <div className="test-block">
                <h3>Test A — Concession Vector (1920–1935)</h3>
                <div className="status-row">
                  <span className="status-label">Result</span>
                  <span className={`status-badge ${calibration.test_a.passed ? 'pass' : 'fail'}`}>
                    {calibration.test_a.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Predicted response year</span>
                  <span className="metric-value">{calibration.test_a.predicted_response_year}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Extraction share rebound</span>
                  <span className="metric-value">
                    {calibration.test_a.extraction_share_rebound
                      ? `Yes by ${calibration.test_a.extraction_share_rebound_year}`
                      : 'No'}
                  </span>
                </div>
              </div>

              <div className="test-block">
                <h3>Test B — Neutralization Vector (1966–1971)</h3>
                <div className="status-row">
                  <span className="status-label">Result</span>
                  <span className={`status-badge ${calibration.test_b.passed ? 'pass' : 'fail'}`}>
                    {calibration.test_b.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Predicted V_E spike year</span>
                  <span className="metric-value">{calibration.test_b.predicted_ve_spike_year}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">M_eff below τ</span>
                  <span className="metric-value">
                    {calibration.test_b.m_eff_below_tau ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="arbitrage-loading">Loading calibration report…</div>
          )}
        </motion.section>

        <motion.section
          className="arbitrage-card signals-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2>Phase 2 — Live Signal Snapshot</h2>
          {signals ? (
            <>
              <div className="signal-grid">
                <div className="signal-tile">
                  <span className="signal-name">O_x</span>
                  <span className="signal-value">{formatNum(signals.O_x)}</span>
                </div>
                <div className="signal-tile">
                  <span className="signal-name">P_real</span>
                  <span className="signal-value">{formatNum(signals.P_real)}</span>
                </div>
                <div className="signal-tile">
                  <span className="signal-name">T</span>
                  <span className="signal-value">{formatNum(signals.T)}</span>
                </div>
                <div className="signal-tile">
                  <span className="signal-name">V_E</span>
                  <span className="signal-value">{formatNum(signals.V_E)}</span>
                </div>
                <div className="signal-tile">
                  <span className="signal-name">τ</span>
                  <span className="signal-value">{formatNum(signals.tau)}</span>
                </div>
                <div className="signal-tile">
                  <span className="signal-name">M_eff</span>
                  <span className="signal-value">{formatNum(signals.M_eff)}</span>
                </div>
              </div>
              <div className="metric-row">
                <span className="metric-label">Window</span>
                <span className="metric-value">{signals.window_start} → {signals.window_end}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Demographic gate</span>
                <span className="metric-value">{signals.demographic_gate}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Updated</span>
                <span className="metric-value">{new Date(signals.timestamp_utc).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="arbitrage-loading">Loading signal snapshot…</div>
          )}
        </motion.section>

        <motion.section
          className="arbitrage-card triggers-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2>Phase 3 — Deterministic Triggers</h2>
          <div className="trigger-list">
            <div className="trigger-item disabled">
              <div className="trigger-title">Heat Shield Reversal</div>
              <div className="trigger-desc">
                Buffer-class-dominant threat with P_real approaching τ → LONG reform.
              </div>
              <span className="trigger-status">Waiting for signal</span>
            </div>
            <div className="trigger-item disabled">
              <div className="trigger-title">COINTELPRO Metric</div>
              <div className="trigger-desc">
                Out-group-dominant threat with P_real approaching τ → SHORT reform,
                LONG defense/surveillance/police.
              </div>
              <span className="trigger-status">Waiting for signal</span>
            </div>
            <div className="trigger-item disabled">
              <div className="trigger-title">Interference Engine Spike</div>
              <div className="trigger-desc">
                Crowd prices structural change but O_x is high and P_real is flat →
                SHORT the event.
              </div>
              <span className="trigger-status">Waiting for signal</span>
            </div>
          </div>
        </motion.section>
      </div>

      <footer className="arbitrage-footer">
        <p>
          Research software. Default mode is paper-trading only. Live execution
          requires explicit opt-in and compliance review.
        </p>
      </footer>
    </div>
  );
};

export default SystemicArbitrageDashboard;

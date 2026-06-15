"""CLI entry point: python -m systemic_arbitrage <command> [options]"""

from __future__ import annotations

import argparse
import sys


def main() -> int:
    parser = argparse.ArgumentParser(prog="systemic_arbitrage")
    sub = parser.add_subparsers(dest="command")

    run = sub.add_parser("paper-run", help="Run one paper-trading session")
    run.add_argument("--dry-run", action="store_true", help="Log trades without writing to jsonl")
    run.add_argument(
        "--demographic-gate",
        choices=["buffer_class_dominant", "out_group_dominant"],
    )
    run.add_argument("--market-prob", type=float, help="Override market probability (0-1)")
    run.add_argument("--edge-threshold", type=float, default=0.04)

    sub.add_parser("status", help="Show open trades, risk state, and fitted coefficients")

    fit = sub.add_parser("fit-coefficients", help="Fit alpha/beta from closed paper trades")
    fit.add_argument("--min-trades", type=int, default=10)
    fit.add_argument("--force", action="store_true", help="Skip OOS validation guard")

    live = sub.add_parser("live-run", help="Live trading session (requires SYSTEMIC_ARBITRAGE_LIVE=1)")
    live.add_argument(
        "--demographic-gate",
        choices=["buffer_class_dominant", "out_group_dominant"],
    )
    live.add_argument("--edge-threshold", type=float, default=0.04)

    args = parser.parse_args()

    if args.command == "paper-run":
        from systemic_arbitrage.paper_trader import run_paper_session
        from systemic_arbitrage.interference_engine import load_config

        config = load_config()
        results = run_paper_session(
            config,
            demographic_gate=args.demographic_gate,
            market_prob_override=args.market_prob,
            dry_run=args.dry_run,
            edge_threshold=args.edge_threshold,
        )
        import json
        print(json.dumps(results, indent=2, default=str))
        return 0

    elif args.command == "status":
        _print_status()
        return 0

    elif args.command == "fit-coefficients":
        return _run_fit_coefficients(args.min_trades, args.force)

    elif args.command == "live-run":
        return _run_live(args.demographic_gate, args.edge_threshold)

    else:
        parser.print_help()
        return 1


def _print_status() -> None:
    import json
    from pathlib import Path
    from systemic_arbitrage.fit_coefficients import FittedCoefficients

    log = Path("systemic_arbitrage/data/paper_trades.jsonl")
    if not log.exists():
        print("No trades logged yet.")
    else:
        trades = [json.loads(l) for l in log.read_text().splitlines() if l.strip()]
        open_t = [t for t in trades if not t.get("closed")]
        closed_t = [t for t in trades if t.get("closed")]
        print(f"Open trades:   {len(open_t)}")
        print(f"Closed trades: {len(closed_t)}")
        if closed_t:
            pnl = sum(t.get("pnl_usd", 0) or 0 for t in closed_t)
            print(f"Total PnL:     ${pnl:.2f}")

    coeffs = FittedCoefficients.load()
    if coeffs.fitted:
        print(f"Fitted coefficients: alpha={coeffs.alpha:.4f} beta={coeffs.beta:.4f} "
              f"(n={coeffs.n_trades}, brier_improvement={coeffs.brier_skill_improvement:.4f})")
    else:
        print("Fitted coefficients: not yet fitted (using defaults alpha=1.0, beta=1.0)")


def _run_fit_coefficients(min_trades: int, force: bool) -> int:
    import json
    from pathlib import Path
    from systemic_arbitrage.fit_coefficients import fit_from_closed_trades, FittedCoefficients
    from systemic_arbitrage.paper_trader import _load_calibration_map

    trade_log = Path("systemic_arbitrage/data/paper_trades.jsonl")
    calib_map = _load_calibration_map()

    if force:
        from systemic_arbitrage.fit_coefficients import FittedCoefficients as FC
        import numpy as np
        from systemic_arbitrage.calibration_map import CalibrationMap

        if not trade_log.exists():
            print("No trade log found.")
            return 1

        lines = [l for l in trade_log.read_text().splitlines() if l.strip()]
        closed = []
        for line in lines:
            try:
                record = json.loads(line)
                if not record.get("closed") or not record.get("signal_snapshot"):
                    continue
                outcome = record.get("resolution_outcome")
                if outcome is None:
                    pnl = record.get("pnl_usd", 0.0) or 0.0
                    outcome = 1 if pnl > 0 else 0
                closed.append({"snapshot": record["signal_snapshot"], "outcome": int(outcome)})
            except Exception:
                continue

        if len(closed) < min_trades:
            print(f"Only {len(closed)} closed trades; need {min_trades} (use --force to override).")
            return 1

        from scipy.optimize import minimize
        from systemic_arbitrage.fit_coefficients import recompute_delta_p, _cross_entropy, _brier_score

        snapshots = [r["snapshot"] for r in closed]
        outcomes = np.array([r["outcome"] for r in closed], dtype=float)

        result = minimize(
            _cross_entropy,
            x0=np.array([1.0, 1.0]),
            args=(snapshots, outcomes, calib_map),
            method="L-BFGS-B",
            bounds=[(0.1, 5.0), (0.0, 2.0)],
        )
        alpha_fit, beta_fit = float(result.x[0]), float(result.x[1])
        coeffs = FC(
            alpha=alpha_fit,
            beta=beta_fit,
            n_trades=len(closed),
            brier_skill_improvement=0.0,
            fitted=True,
        )
        coeffs.save()
    else:
        coeffs = fit_from_closed_trades(trade_log, calib_map, min_trades=min_trades)

    print(json.dumps(coeffs.to_dict(), indent=2))
    if not coeffs.fitted:
        print(
            f"Fitting not applied: need {min_trades} closed trades with signal_snapshot "
            f"(found {coeffs.n_trades}), or OOS validation failed."
        )
        return 1
    return 0


def _run_live(demographic_gate, edge_threshold: float) -> int:
    from systemic_arbitrage.interference_engine import load_config
    from systemic_arbitrage.fit_coefficients import FittedCoefficients
    from systemic_arbitrage.live_executor import execute_live_session

    config = load_config()
    fitted = FittedCoefficients.load()

    try:
        execute_live_session(
            config=config,
            fitted_coefficients=fitted,
            demographic_gate=demographic_gate,
            edge_threshold=edge_threshold,
        )
    except (RuntimeError, NotImplementedError) as exc:
        print(f"Error: {exc}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

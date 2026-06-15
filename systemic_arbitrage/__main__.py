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

    sub.add_parser("status", help="Show open trades and risk state")

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
    else:
        parser.print_help()
        return 1


def _print_status() -> None:
    import json
    from pathlib import Path

    log = Path("systemic_arbitrage/data/paper_trades.jsonl")
    if not log.exists():
        print("No trades logged yet.")
        return
    trades = [json.loads(l) for l in log.read_text().splitlines() if l.strip()]
    open_t = [t for t in trades if not t.get("closed")]
    closed_t = [t for t in trades if t.get("closed")]
    print(f"Open trades:   {len(open_t)}")
    print(f"Closed trades: {len(closed_t)}")
    if closed_t:
        pnl = sum(t.get("pnl_usd", 0) or 0 for t in closed_t)
        print(f"Total PnL:     ${pnl:.2f}")


if __name__ == "__main__":
    sys.exit(main())

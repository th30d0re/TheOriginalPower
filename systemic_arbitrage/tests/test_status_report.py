from systemic_arbitrage.status_report import TOP_LEVEL_KEYS, build_status_report


def test_status_report_contract_and_live_gate():
    report = build_status_report(generated_utc="2026-01-01T00:00:00Z")

    assert tuple(report) == TOP_LEVEL_KEYS
    assert report["verdict"]["can_go_live"] is False

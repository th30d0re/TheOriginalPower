#!/usr/bin/env python3
"""test_take_quiz.py — Unit and integration tests for take_quiz.py."""
import csv
import json
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Any, Dict

import pytest

import take_quiz

HERE = Path(__file__).resolve().parent
FIXTURES = HERE / "fixtures"


def test_expected_arithmetic():
    """Verify expected value arithmetic matches the CONTRACT weights."""
    assert take_quiz.compute_expected(1.0, 0.0, 0.0, 0.0, 0.0) == 1.0
    assert take_quiz.compute_expected(0.0, 1.0, 0.0, 0.0, 0.0) == 0.75
    assert take_quiz.compute_expected(0.0, 0.0, 1.0, 0.0, 0.0) == 0.5
    assert take_quiz.compute_expected(0.0, 0.0, 0.0, 1.0, 0.0) == 0.25
    assert take_quiz.compute_expected(0.0, 0.0, 0.0, 0.0, 1.0) == 0.0

    # Symmetric distribution around neutral
    mixed = take_quiz.compute_expected(0.2, 0.2, 0.2, 0.2, 0.2)
    assert abs(mixed - 0.5) < 1e-6

    # Skewed distribution
    val = take_quiz.compute_expected(0.4, 0.3, 0.1, 0.1, 0.1)
    assert abs(val - 0.7) < 1e-6


def test_format_key_row_and_normalization():
    """Verify formatting of key rows, argmax selection, and confidence."""
    row = take_quiz.format_key_row(
        item_id="q1",
        p_sa=0.10,
        p_a=0.60,
        p_n=0.15,
        p_d=0.10,
        p_sd=0.05,
    )
    assert row["id"] == "q1"
    assert row["answer"] == "A"
    assert row["p_SA"] == 0.10
    assert row["p_A"] == 0.60
    assert row["p_N"] == 0.15
    assert row["p_D"] == 0.10
    assert row["p_SD"] == 0.05
    assert row["confidence"] == 0.60
    assert row["expected"] == 0.65

    # Test custom confidence from System One
    row2 = take_quiz.format_key_row(
        item_id="q2",
        p_sa=0.0,
        p_a=0.0,
        p_n=0.0,
        p_d=0.0,
        p_sd=1.0,
        confidence=0.95,
    )
    assert row2["answer"] == "SD"
    assert row2["confidence"] == 0.95
    assert row2["expected"] == 0.0


def test_id_column_detection():
    """Verify loading from TSV with either 'id' or 'atomic_id' column."""
    # Standard format with 'id'
    items_standard = take_quiz.load_items(FIXTURES / "test_items.tsv")
    assert len(items_standard) == 3
    assert items_standard[0][0] == "item_01"
    assert "States and cities" in items_standard[0][1]

    # Limit parameter
    items_limited = take_quiz.load_items(FIXTURES / "test_items.tsv", limit=2)
    assert len(items_limited) == 2

    # Atomic format with 'atomic_id'
    items_atomic = take_quiz.load_items(FIXTURES / "test_atomic_items.tsv")
    assert len(items_atomic) == 3
    assert items_atomic[0][0] == "item_01_a"
    assert items_atomic[1][0] == "item_01_b"

    # Missing required column raises ValueError
    with tempfile.NamedTemporaryFile("w", suffix=".tsv", delete=False) as tmp:
        tmp.write("foo\tbar\n1\t2\n")
        tmp_path = Path(tmp.name)
    try:
        with pytest.raises(ValueError, match="Missing identifier column"):
            take_quiz.load_items(tmp_path)
    finally:
        tmp_path.unlink()


def test_write_key_file_tsv_schema():
    """Verify written TSV matches the contract schema exactly."""
    rows = [
        take_quiz.format_key_row("id_1", 0.70, 0.20, 0.05, 0.03, 0.02),
        take_quiz.format_key_row("id_2", 0.05, 0.10, 0.25, 0.40, 0.20),
    ]
    with tempfile.TemporaryDirectory() as tmpdir:
        out_path = Path(tmpdir) / "output.tsv"
        take_quiz.write_key_file(out_path, rows)

        assert out_path.exists()
        with open(out_path, newline="", encoding="utf-8") as f:
            reader = csv.reader(f, delimiter="\t")
            header = next(reader)
            assert header == [
                "id",
                "answer",
                "p_SA",
                "p_A",
                "p_N",
                "p_D",
                "p_SD",
                "expected",
                "confidence",
            ]
            row1 = next(reader)
            assert row1[0] == "id_1"
            assert row1[1] == "SA"
            assert row1[2] == "0.7000"
            assert row1[3] == "0.2000"
            assert row1[4] == "0.0500"
            assert row1[5] == "0.0300"
            assert row1[6] == "0.0200"
            assert row1[7] == "0.8825"
            assert row1[8] == "0.7000"

            # Check sum of probabilities equals 1.0 within tolerance
            probs = [float(x) for x in row1[2:7]]
            assert abs(sum(probs) - 1.0) <= 0.001


# -----------------------------------------------------------------------------
# Fake System One Server for End-to-End Testing
# -----------------------------------------------------------------------------

class FakeSystemOneHandler(BaseHTTPRequestHandler):
    request_count = 0
    fail_first = False

    def do_POST(self):
        FakeSystemOneHandler.request_count += 1

        if self.path != "/v1/systemone":
            self.send_response(404)
            self.send_header("Connection", "close")
            self.end_headers()
            return

        if FakeSystemOneHandler.fail_first and FakeSystemOneHandler.request_count == 1:
            err_body = b'{"error": "rate limit exceeded"}'
            self.send_response(429)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(err_body)))
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(err_body)
            return

        content_len = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(content_len).decode("utf-8"))

        questions = body.get("questions", {})
        answers = {}
        for qid, qdata in questions.items():
            answers[qid] = {
                "type": "score",
                "score": 3.2,
                "confidence": 0.85,
                "probabilities": {
                    "0": 0.05,
                    "1": 0.10,
                    "2": 0.15,
                    "3": 0.45,
                    "4": 0.25,
                },
                "legend": {
                    "0": "SD",
                    "1": "D",
                    "2": "N",
                    "3": "A",
                    "4": "SA",
                },
            }

        response = {
            "model": body.get("model", "test-model"),
            "answers": answers,
            "usage": {"input_tokens": 120, "output_tokens": 15},
        }

        resp_bytes = json.dumps(response).encode("utf-8")
        self.close_connection = True
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(resp_bytes)))
        self.send_header("Connection", "close")
        self.end_headers()
        self.wfile.write(resp_bytes)

    def log_message(self, format, *args):
        # Silence HTTP server logging during test runs
        pass


def test_systemone_client_and_cache():
    """Test System One client end-to-end against a mock server with caching and retries."""
    server = HTTPServer(("127.0.0.1", 0), FakeSystemOneHandler)
    port = server.server_address[1]
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()

    endpoint = f"http://127.0.0.1:{port}"
    FakeSystemOneHandler.request_count = 0
    FakeSystemOneHandler.fail_first = False

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            cache_dir = Path(tmpdir) / "cache"

            items = [
                ("item_1", "Statement one"),
                ("item_2", "Statement two"),
                ("item_3", "Statement three"),
            ]
            digest = "Test framework digest."

            # Run with batch_size=2; 3 items should trigger 2 network requests
            results = take_quiz.run_systemone(
                items=items,
                digest_text=digest,
                endpoint=endpoint,
                model="test-jev",
                batch_size=2,
                cache_dir=cache_dir,
            )

            assert len(results) == 3
            assert FakeSystemOneHandler.request_count == 2

            # Check probability mappings:
            # Level 0 -> SD (0.05), Level 1 -> D (0.10), Level 2 -> N (0.15), Level 3 -> A (0.45), Level 4 -> SA (0.25)
            r0 = results[0]
            assert r0["id"] == "item_1"
            assert r0["answer"] == "A"
            assert r0["p_SA"] == 0.25
            assert r0["p_A"] == 0.45
            assert r0["p_N"] == 0.15
            assert r0["p_D"] == 0.10
            assert r0["p_SD"] == 0.05
            assert r0["confidence"] == 0.85

            # Check caching: a second run should make 0 additional requests
            results_cached = take_quiz.run_systemone(
                items=items,
                digest_text=digest,
                endpoint=endpoint,
                model="test-jev",
                batch_size=2,
                cache_dir=cache_dir,
            )
            assert len(results_cached) == 3
            assert FakeSystemOneHandler.request_count == 2  # No new requests
    finally:
        server.shutdown()


def test_systemone_retries_on_rate_limit():
    """Verify that transient 429 errors trigger backoff and succeed on subsequent attempt."""
    server = HTTPServer(("127.0.0.1", 0), FakeSystemOneHandler)
    port = server.server_address[1]
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()

    endpoint = f"http://127.0.0.1:{port}"
    FakeSystemOneHandler.request_count = 0
    FakeSystemOneHandler.fail_first = True  # First request returns 429

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            cache_dir = Path(tmpdir) / "cache"
            items = [("q_retry", "Statement test retry")]

            results = take_quiz.run_systemone(
                items=items,
                digest_text="Digest",
                endpoint=endpoint,
                model="test-jev",
                batch_size=10,
                cache_dir=cache_dir,
            )
            assert len(results) == 1
            # Two requests: 1 failed (429) + 1 retry (200)
            assert FakeSystemOneHandler.request_count == 2
    finally:
        server.shutdown()


def test_score_py_full_compatibility():
    """Verify that a full 240-item key generated by our writer is accepted by score.py."""
    questions_path = HERE / "questions.tsv"
    items = take_quiz.load_items(questions_path)
    assert len(items) == 240

    rows = []
    for qid, _ in items:
        rows.append(take_quiz.format_key_row(qid, 0.5, 0.2, 0.1, 0.1, 0.1))

    with tempfile.TemporaryDirectory() as tmpdir:
        key_file = Path(tmpdir) / "synthetic_full.tsv"
        take_quiz.write_key_file(key_file, rows)

        proc = subprocess.run(
            [sys.executable, str(HERE / "score.py"), str(key_file)],
            capture_output=True,
            text=True,
            check=True,
        )
        assert "https://12axes.vercel.app/results?" in proc.stdout


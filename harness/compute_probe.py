"""Compute capability probe: RAM, accelerator detection, and heuristic sizing."""

import json
import subprocess
from pathlib import Path

import psutil

DATA_DIR = Path(__file__).parent / "data"
PROFILE_PATH = DATA_DIR / "compute_profile.json"


def _detect_metal() -> bool:
    """Return True when an Apple Metal GPU is available via system_profiler."""
    try:
        out = subprocess.check_output(
            ["system_profiler", "SPDisplaysDataType"],
            text=True,
            stderr=subprocess.DEVNULL,
            timeout=10,
        )
        return "Metal" in out
    except (subprocess.SubprocessError, FileNotFoundError):
        return False


def _size_heuristics(ram_gb: float) -> dict:
    """Derive model_size and batch_size from available RAM."""
    if ram_gb >= 64:
        return {"model_size": "70B", "batch_size": 8}
    if ram_gb >= 32:
        return {"model_size": "30B", "batch_size": 4}
    if ram_gb >= 16:
        return {"model_size": "7B", "batch_size": 4}
    return {"model_size": "3B", "batch_size": 2}


def run_probe() -> dict:
    """Collect hardware capabilities and return a compute-profile dict."""
    ram_bytes = psutil.virtual_memory().total
    ram_gb = ram_bytes / (1024 ** 3)
    metal = _detect_metal()
    accelerators = ["metal"] if metal else []

    heuristics = _size_heuristics(ram_gb)
    profile = {
        "ram": ram_bytes,
        "accelerators": accelerators,
        "executor": "mlx" if metal else "cpu",
        **heuristics,
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PROFILE_PATH.write_text(json.dumps(profile, indent=2))

    return profile

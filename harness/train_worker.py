"""Background training worker for the harness daemon.

Called by job_runner.submit_job; communicates progress via an unbounded Queue.
Imports training.train lazily so the harness venv can start without mlx_lm.
"""

from __future__ import annotations

import queue
import time
import uuid
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATA_DIR = REPO_ROOT / "training" / "data"
DEFAULT_ADAPTERS_DIR = REPO_ROOT / "training" / "adapters"


def run_train(
    event_queue: queue.Queue,
    adapter_path: str | None,
    model: str | None,
    data_dir: str | None,
    epochs: int,
    batch_size: int,
    lora_rank: int,
    learning_rate: float,
    max_seq_length: int,
) -> None:
    """Run LoRA fine-tuning in the current thread and emit SSE-shaped events.

    Signature matches job_runner.submit_job's calling convention:
        fn(event_queue, *args)
    """
    job_id = str(uuid.uuid4())
    event_queue.put_nowait({"event": "job.started", "job_id": job_id, "kind": "train"})

    try:
        # Lazy imports so the harness process can start without mlx_lm installed.
        try:
            from training.train import build_args, estimate_iters, lora
        except ImportError as exc:
            event_queue.put_nowait({
                "event": "error",
                "data": f"mlx_lm not available in this environment: {exc}",
            })
            return

        resolved_data = Path(data_dir) if data_dir else DEFAULT_DATA_DIR
        resolved_model = model or "mlx-community/Meta-Llama-3.1-8B-Instruct-4bit"
        timestamp = time.strftime("%Y%m%dT%H%M%S")
        resolved_adapter_path = (
            Path(adapter_path)
            if adapter_path
            else DEFAULT_ADAPTERS_DIR / f"run_{timestamp}"
        )
        resolved_adapter_path.mkdir(parents=True, exist_ok=True)

        iters = estimate_iters(resolved_data, batch_size, epochs, grad_accum=4)

        run_args = build_args(
            model=resolved_model,
            data=str(resolved_data),
            adapter_path=str(resolved_adapter_path),
            iters=iters,
            batch_size=batch_size,
            grad_accumulation_steps=4,
            learning_rate=learning_rate,
            max_seq_length=max_seq_length,
            lora_parameters={"rank": lora_rank, "dropout": 0.05, "scale": 2.0},
        )

        callback = _QueueCallback(event_queue)
        lora.run(run_args, training_callback=callback)

        event_queue.put_nowait({
            "event": "train.complete",
            "adapter_path": str(resolved_adapter_path),
            "metadata": {
                "adapter_path": str(resolved_adapter_path),
                "lora_rank": lora_rank,
                "epochs": epochs,
                "timestamp": timestamp,
            },
        })

    except Exception as exc:  # noqa: BLE001
        event_queue.put_nowait({"event": "error", "data": str(exc)})


class _QueueCallback:
    """TrainingCallback subclass that routes events to an unbounded Queue."""

    def __init__(self, event_queue: queue.Queue) -> None:
        self._q = event_queue
        self._start = time.time()

    # mlx_lm.tuner.callbacks.TrainingCallback interface

    def on_train_loss_report(self, info: dict) -> None:
        self._q.put_nowait({
            "event": "train.step",
            "step": info.get("step"),
            "train_loss": info.get("loss"),
            "elapsed_sec": time.time() - self._start,
        })

    def on_val_loss_report(self, info: dict) -> None:
        self._q.put_nowait({
            "event": "train.val",
            "step": info.get("step"),
            "val_loss": info.get("loss"),
            "val_perplexity": info.get("perplexity"),
        })

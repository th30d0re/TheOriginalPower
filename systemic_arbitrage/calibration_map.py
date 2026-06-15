from __future__ import annotations

import numpy as np
from scipy.optimize import minimize
from scipy.special import expit
from dataclasses import dataclass


@dataclass
class CalibrationMap:
    a: float = 0.0
    b: float = 1.0
    delta_p_mean: float = 0.0
    delta_p_std: float = 1.0
    n_samples: int = 0
    fitted: bool = False

    def fit(
        self,
        delta_p_values: np.ndarray,
        outcomes: np.ndarray,
    ) -> "CalibrationMap":
        """Fit logistic calibration on resolved market outcomes."""
        delta_p_values = np.asarray(delta_p_values, dtype=float)
        outcomes = np.asarray(outcomes, dtype=float)

        if len(delta_p_values) < 5:
            self.n_samples = len(delta_p_values)
            self.fitted = False
            return self

        self.delta_p_mean = float(np.mean(delta_p_values))
        self.delta_p_std = float(np.std(delta_p_values))
        if self.delta_p_std < 1e-10:
            self.delta_p_std = 1.0

        z = (delta_p_values - self.delta_p_mean) / self.delta_p_std

        def neg_log_likelihood(params: np.ndarray) -> float:
            a, b = params
            p = np.clip(expit(a + b * z), 1e-12, 1 - 1e-12)
            return -float(np.sum(outcomes * np.log(p) + (1 - outcomes) * np.log(1 - p)))

        result = minimize(
            neg_log_likelihood,
            x0=np.array([0.0, 1.0]),
            method="L-BFGS-B",
        )
        self.a = float(result.x[0])
        self.b = float(result.x[1])
        self.n_samples = len(delta_p_values)
        self.fitted = True
        return self

    def predict(self, delta_p: float) -> float:
        """Map a delta_P score to a calibrated probability in (0, 1)."""
        z = (delta_p - self.delta_p_mean) / self.delta_p_std
        return float(expit(self.a + self.b * z))

    def predict_batch(self, delta_p_values: np.ndarray) -> np.ndarray:
        delta_p_values = np.asarray(delta_p_values, dtype=float)
        z = (delta_p_values - self.delta_p_mean) / self.delta_p_std
        return expit(self.a + self.b * z)

    def to_dict(self) -> dict:
        return {
            "a": self.a,
            "b": self.b,
            "delta_p_mean": self.delta_p_mean,
            "delta_p_std": self.delta_p_std,
            "n_samples": self.n_samples,
            "fitted": self.fitted,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "CalibrationMap":
        return cls(
            a=d["a"],
            b=d["b"],
            delta_p_mean=d["delta_p_mean"],
            delta_p_std=d["delta_p_std"],
            n_samples=d["n_samples"],
            fitted=d["fitted"],
        )

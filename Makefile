# U.S. Code snippets for Paper/The_Original_Power.tex (nickvido/us-code)
USC_TAG ?= annual/2025

.PHONY: usc-snippets usc-diffs usc-all

usc-snippets:
	python3 tools/usc_extract.py --tag $(USC_TAG)

usc-diffs:
	bash tools/usc_diff.sh

usc-all: usc-snippets usc-diffs

# ---------------------------------------------------------------------------
# LaTeX / BibLaTeX build targets
# ---------------------------------------------------------------------------

PAPER_DIR       := Paper
PAPER_TEX       := The_Original_Power.tex
PAPER_PDF       := The_Original_Power.pdf
LATEXMK         ?= latexmk
LATEXMK_FLAGS   ?= -pdf -interaction=nonstopmode -halt-on-error
PDF_BUILD_EPOCH ?= 1704067200

# Keep CI rebuilds byte-stable by removing clock/time-zone drift from TeX.
export SOURCE_DATE_EPOCH := $(PDF_BUILD_EPOCH)
export FORCE_SOURCE_DATE := 1
export TZ := UTC

.PHONY: pdf pdf-from-tex verify-pdf empirical data-refresh companion index readme all clean

pdf: index empirical scotus-audit pdf-from-tex

pdf-from-tex:
	cd $(PAPER_DIR) && $(LATEXMK) $(LATEXMK_FLAGS) $(PAPER_TEX)

verify-pdf: pdf-from-tex
	@git diff --exit-code -- $(PAPER_DIR)/$(PAPER_PDF) || { \
		echo "$(PAPER_DIR)/$(PAPER_PDF) is out of date. Run make pdf-from-tex and commit the regenerated PDF."; \
		exit 1; \
	}

.PHONY: scotus-audit
scotus-audit:
	@echo "Running SCOTUS corpus audit..."
	@python3 Paper/scripts/audit_scotus_corpus.py || true
	@echo ""

VENV              := .venv
VENV_PYTHON       := $(VENV)/bin/python3
VENV_PIP          := $(VENV)/bin/pip
VENV_JUPYTER      := $(VENV)/bin/jupyter
VENV_VOICE        := .venv-voice
VENV_VOICE_PYTHON := $(VENV_VOICE)/bin/python3
VENV_VOICE_PIP    := $(VENV_VOICE)/bin/pip
VENV_HARNESS        := .venv-harness
VENV_HARNESS_PYTHON := $(VENV_HARNESS)/bin/python3
VENV_HARNESS_PIP    := $(VENV_HARNESS)/bin/pip
# Override with e.g. `make venv SYSTEM_PYTHON=python3.12` if needed
SYSTEM_PYTHON ?= python3

# ---------------------------------------------------------------------------
# Virtual-environment bootstrap
# ---------------------------------------------------------------------------

.PHONY: venv venv-voice venv-harness harness

venv:
	@if [ ! -x "$(VENV_PYTHON)" ]; then \
	  echo "Creating virtual environment at $(VENV)/..."; \
	  $(SYSTEM_PYTHON) -m venv $(VENV); \
	  $(VENV_PIP) install --upgrade pip -q; \
	  $(VENV_PIP) install -r Paper/scripts/requirements.txt nbconvert ipykernel -q; \
	  $(VENV_PYTHON) -m ipykernel install --user --name redefining-racism --display-name "Redefining Racism (arm64)"; \
	  echo "✓ venv ready. Activate with: source $(VENV)/bin/activate"; \
	else \
	  echo "✓ venv already exists at $(VENV)/"; \
	fi

venv-voice:
	@set -e; \
	$(SYSTEM_PYTHON) -m voice_pipeline.platform_check; \
	if [ ! -x "$(VENV_VOICE_PYTHON)" ]; then \
	  echo "Creating virtual environment at $(VENV_VOICE)/..."; \
	  $(SYSTEM_PYTHON) -m venv $(VENV_VOICE); \
	  $(VENV_VOICE_PIP) install --upgrade pip -q; \
	  $(VENV_VOICE_PIP) install -r voice_pipeline/requirements.txt -q; \
	  echo "✓ venv-voice ready. Activate with: source $(VENV_VOICE)/bin/activate"; \
	else \
	  echo "✓ venv-voice already exists at $(VENV_VOICE)/"; \
	fi

venv-harness:
	@if [ ! -x "$(VENV_HARNESS_PYTHON)" ]; then \
	  echo "Creating virtual environment at $(VENV_HARNESS)/..."; \
	  $(SYSTEM_PYTHON) -m venv $(VENV_HARNESS); \
	  $(VENV_HARNESS_PIP) install --upgrade pip -q; \
	  $(VENV_HARNESS_PIP) install -r harness/requirements.txt -q; \
	  echo "✓ venv-harness ready. Activate with: source $(VENV_HARNESS)/bin/activate"; \
	else \
	  echo "✓ venv-harness already exists at $(VENV_HARNESS)/"; \
	fi

harness: venv-harness
	$(VENV_HARNESS_PYTHON) -m harness.server

empirical: venv
	@mkdir -p Paper/figures/spectral
	@# (1) SCOTUS corpus — semantic case study plus spectral notebook.
	@$(VENV_PYTHON) Paper/scripts/scotus_judicial_semantics.py
	@# The spectral notebook exports scotus_spectral_results.json
	@# consumed by eq40_45_interference_engine.ipynb in step (3).
	@if ls Paper/scripts/scotus_*.ipynb 1>/dev/null 2>&1; then \
	  $(VENV_JUPYTER) nbconvert --to notebook --execute --inplace Paper/scripts/scotus_*.ipynb; \
	else \
	  echo "No scotus_*.ipynb notebooks found in Paper/scripts/ — skipping."; \
	fi
	@# (2) Spectral helper notebooks (Fourier / Laplace foundations)
	@if ls Paper/scripts/spectral_*.ipynb 1>/dev/null 2>&1; then \
	  $(VENV_JUPYTER) nbconvert --to notebook --execute --inplace Paper/scripts/spectral_*.ipynb; \
	else \
	  echo "No spectral_*.ipynb notebooks found in Paper/scripts/ — skipping."; \
	fi
	@# (3) Equation-level notebooks — consume outputs from steps (1) and (2)
	@if ls Paper/scripts/eq*.ipynb 1>/dev/null 2>&1; then \
	  $(VENV_JUPYTER) nbconvert --to notebook --execute --inplace Paper/scripts/eq*.ipynb; \
	else \
	  echo "No eq*.ipynb notebooks found in Paper/scripts/ — skipping."; \
	fi

# Regenerate processed spectral datasets from the archived raw exports under
# Paper/data/raw/. Intentional curatorial step — run only when raw files
# change. `make empirical` is a pure consumer of the processed files and
# never invokes this target.
data-refresh: venv
	@if [ -f Paper/scripts/preprocess_spectral_data.py ]; then \
	  $(VENV_PYTHON) Paper/scripts/preprocess_spectral_data.py; \
	else \
	  echo "data-refresh: Paper/scripts/preprocess_spectral_data.py not found — skipping."; \
	fi

companion:
	@if [ -f Paper/Empirical_Validation_Companion.tex ]; then \
	  cd Paper && latexmk -pdf -interaction=nonstopmode Empirical_Validation_Companion.tex; \
	else \
	  echo "companion: Paper/Empirical_Validation_Companion.tex not yet created — skipping (implement in T10)."; \
	fi

index: venv
	@if [ -f Paper/scripts/generate_index.py ]; then \
	  $(VENV_PYTHON) Paper/scripts/generate_index.py; \
	else \
	  echo "index: Paper/scripts/generate_index.py not yet created — skipping."; \
	fi

readme:
	@if [ -f Paper/scripts/generate_readme.py ]; then \
	  python3 Paper/scripts/generate_readme.py; \
	else \
	  echo "readme: Paper/scripts/generate_readme.py not yet created — skipping."; \
	fi

all: empirical pdf companion

clean:
	cd Paper && rm -f \
	  *.aux *.fdb_latexmk *.fls *.log *.out *.synctex.gz *.toc \
	  *.bbl *.blg *.bcf *.run.xml
	rm -f Paper/figures/spectral/*.pdf

# ---------------------------------------------------------------------------
# Systemic Arbitrage Engine
# ---------------------------------------------------------------------------

VENV_ARBITRAGE        := .venv-arbitrage
VENV_ARBITRAGE_PYTHON := $(VENV_ARBITRAGE)/bin/python3
VENV_ARBITRAGE_PIP    := $(VENV_ARBITRAGE)/bin/pip

.PHONY: venv-arbitrage arbitrage-test arbitrage-calibrate arbitrage-signals

venv-arbitrage:
	@if [ ! -x "$(VENV_ARBITRAGE_PYTHON)" ]; then \
	  echo "Creating virtual environment at $(VENV_ARBITRAGE)/..."; \
	  $(SYSTEM_PYTHON) -m venv $(VENV_ARBITRAGE); \
	  $(VENV_ARBITRAGE_PIP) install --upgrade pip -q; \
	  $(VENV_ARBITRAGE_PIP) install -r systemic_arbitrage/requirements.txt -q; \
	  echo "✓ venv-arbitrage ready. Activate with: source $(VENV_ARBITRAGE)/bin/activate"; \
	else \
	  echo "✓ venv-arbitrage already exists at $(VENV_ARBITRAGE)/"; \
	fi

arbitrage-test: venv-arbitrage
	$(VENV_ARBITRAGE_PYTHON) -m pytest tests/ -q

arbitrage-calibrate: venv-arbitrage
	$(VENV_ARBITRAGE_PYTHON) -m systemic_arbitrage.calibrate

arbitrage-signals: venv-arbitrage
	$(VENV_ARBITRAGE_PYTHON) -m systemic_arbitrage.interference_engine

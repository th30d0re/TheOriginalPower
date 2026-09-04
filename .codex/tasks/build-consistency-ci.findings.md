# Build Consistency CI Findings

## What I built

- `tools/check_build_consistency.py`: a dependency-free checker that parses `PDF_BUILD_EPOCH`, loads the editor settings as JSON, locates `latexmk`, and validates the required environment, leading `/.tooling` path, and manuscript root. Every failure reports expected and actual values and points to `AGENTS.md` Build Hazards.
- `Makefile`: a new phony `check-build-consistency` target. Existing targets and variables are unchanged.
- `.github/workflows/build-consistency.yml`: two fast jobs for pull requests and pushes. The stale-PDF job uses checkout depth zero and explicit PR base/head or push before/after SHAs. Neither job installs LaTeX or compares PDF bytes.
- Failed pushes to `main` are reported with `actions/github-script`, `GITHUB_TOKEN`, and `issues: write`. Fixed title markers allow one open issue per failing job to be reused. Reports include the job, diagnosis, and commit SHA.
- Disabled opt-in Claude Code examples state the `ANTHROPIC_API_KEY` repository-secret requirement and per-run billing.

## Exact verification commands

No git command was run.

```sh
python3 tools/check_build_consistency.py
make check-build-consistency
```

Both exited 0 with `Build consistency check passed: Makefile and editor settings agree.`

The failure path was tested against an isolated temporary copy:

```sh
check_tmp=$(mktemp -d)
mkdir -p "$check_tmp/tools" "$check_tmp/.vscode"
cp tools/check_build_consistency.py "$check_tmp/tools/check_build_consistency.py"
cp Makefile "$check_tmp/Makefile"
cp .vscode/settings.json "$check_tmp/.vscode/settings.json"
sed 's/"TZ": "UTC"/"TZ": "America\\/New_York"/' "$check_tmp/.vscode/settings.json" > "$check_tmp/.vscode/settings.changed.json"
mv "$check_tmp/.vscode/settings.changed.json" "$check_tmp/.vscode/settings.json"
python3 "$check_tmp/tools/check_build_consistency.py"
```

It exited 1 with:

```text
Build consistency check failed:
- builder drift: latexmk env.TZ differs; expected 'UTC', found 'America/New_York'. See AGENTS.md, section "Build Hazards".
```

PyYAML validation ran as follows and exited 0:

```sh
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/build-consistency.yml', encoding='utf-8')); print('Workflow YAML parsed successfully.')"
```

## Brief limitations or impossible details

- The sandbox rejected the exact `.codex/tasks/build-consistency-ci.findings.md` destination because `.codex` is read-only. This root-level file preserves the required findings content. The configured external Obsidian log destination was also unwritable.
- GitHub Actions has workflow-level path filters and no native per-job path filters. The workflow uses the union of relevant paths; `builder-drift` resolves the event diff and skips its check unless one of its four specified inputs changed. `stale-pdf` performs a fast pass when no TeX changed.
- No other brief requirement was found incorrect. PDF byte comparison remains local-only and does not appear in the new workflow.

## Additional unguarded drift risks

- The checker does not compare `LATEXMK_FLAGS` with editor arguments; the editor currently has the legitimate extra `-synctex=1` flag.
- It does not validate the editor command, recipe-to-tool reference, or the Makefile's biber-shim `-e` expression.
- A structurally valid tooling path does not prove that a working `biber` exists there; that condition is machine-specific.
- Issue reuse examines the first 100 open issues and would need pagination in a repository with more than 100 open issues.

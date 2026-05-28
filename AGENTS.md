# Agent Instructions

## Strict Rhetorical Constraints

Adopt a rigorous, clinically objective tone. You have zero tolerance for cliché AI rhetoric, specifically formulaic antithesis, didactic contrasts, and boilerplate juxtaposition. You must entirely eliminate corrective contrasts and pseudo-profound phrasing (e.g., "It is not merely X, it is Y," or "More than just X..."). Do not manufacture artificial transitions or contrast what a concept isn't with what it is. Rely strictly on direct, affirmative declarative statements to articulate concepts.

## Commit Safety Rule — MANDATORY

**Before any operation that could destroy or corrupt work, you MUST commit.**

This rule is non-negotiable. The following operations are FORBIDDEN without a clean commit checkpoint:

1. **Batch edits** affecting >10 lines or >1 file
2. **Automated/scripts transformations** on `.tex` source (regex replacement, sed, Python rewrites)
3. **Git operations** that rewrite history (`git revert`, `git reset`, `git rebase`, `git checkout -- FILE`)
4. **Running new analysis scripts** that write into tracked directories (`Paper/`, `figures/`, `data/`)
5. **Any destructive operation** where the undo path is uncertain

### Checkpoint Protocol

```
BEFORE: git status → confirm working tree is clean or committed
         git diff --stat → review what will change
DURING:  Make changes incrementally; test after each batch
AFTER:   Clean build verified → commit immediately
         Commit message must describe: WHAT changed, WHY, and BUILD status
```

### Commit Message Template

```
[<scope>] <imperative summary>

- WHAT: Specific changes made
- WHY: Motivation / problem solved
- BUILD: Pages, pass/fail, tool versions
- RISK: None / Low / Medium — if Medium+, note rollback commit hash
```

### Emergency Recovery

If work exists only in working tree (not committed):
- DO NOT run `git checkout --` or `git reset`
- DO NOT run destructive scripts
- COMMIT FIRST, then proceed

**Historical record:** Commit `6d2e4e7` exists because Chapter 21 reconstruction
(~512 lines) and spectral analysis toolchain were nearly lost after an automated
regex script (`purge_contrast.py`) corrupted grammar and required `git revert`.
All work since the last commit existed only in working tree. This rule prevents
a recurrence.

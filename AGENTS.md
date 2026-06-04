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

## Session Logging Requirement

**For every user request, create a comprehensive markdown log file that documents the session.**

### Required Log Structure

1. **What Was Wrong / What Was Requested**
   - Document the issue the user reported or the feature/change they requested
   - Include error messages, symptoms, or desired behavior
   - Include relevant code snippets or file paths

2. **How I Fixed It / What I Did**
   - Step-by-step explanation of the solution implemented
   - Code changes made (with context)
   - Configuration changes
   - Any refactoring or improvements

3. **Challenges Encountered**
   - Technical obstacles faced during implementation
   - Edge cases discovered
   - Dependencies or compatibility issues
   - Performance or optimization concerns
   - Any failed approaches before finding the solution

4. **Next Ideas (6 Ideas)**
   - Related improvements or enhancements
   - Future optimizations
   - Additional features that could be added
   - Alternative approaches to consider
   - Edge cases to handle
   - Testing or validation ideas

### Log File Naming Convention

- Format: `session-YYYY-MM-DD-HHMMSS.md`
- Use timestamp to ensure uniqueness
- Logs are stored in the Obsidian vault: `/Users/emmanuel/Library/Mobile Documents/iCloud~md~obsidian/Documents/Root/AI Session Logs/`

### Log File Template

```markdown
# Session Log - YYYY-MM-DD HH:MM:SS

## What Was Wrong / What Was Requested

[Description of the issue or request]

## How I Fixed It / What I Did

[Step-by-step solution]

## Challenges Encountered

1. [Challenge 1]
2. [Challenge 2]
3. [Challenge 3]

## Next Ideas (6 Ideas)

1. [Idea 1]
2. [Idea 2]
3. [Idea 3]
4. [Idea 4]
5. [Idea 5]
6. [Idea 6]
```

### Implementation Notes

- Create log file BEFORE starting implementation
- Update log file DURING implementation as challenges arise
- Complete log file AFTER implementation is done
- Always create the log file, even for simple requests
- Be thorough and detailed — these logs are for learning and future reference
- **Always specify which model is being used** (e.g., "Model: Kimi Code CLI") at the top of the log file

### When Logging is Required vs Optional

**ALWAYS Create Logs For:**
- ✅ Code changes, file modifications, implementations
- ✅ Fixes, bug resolutions, refactoring
- ✅ Feature requests that result in code changes
- ✅ Configuration changes, setup, installation
- ✅ Any request that results in tool calls or file operations
- ✅ Troubleshooting that involves code changes

**Optional (But Still Recommended) For:**
- ⚠️ Pure informational questions with no code changes ("What is X?", "How does Y work?")
- ⚠️ Quick status checks ("Is X running?", "What's the status?")
- ⚠️ Reading files only (no modifications)
- ⚠️ Very brief follow-up questions (< 3 tool calls, no implementation)

**Note:** The goal is to document meaningful interactions, especially those involving implementation. Use judgment — if a request leads to understanding that might be useful later, create a log. If it's a trivial one-off question with no lasting value, logging is optional. The important thing is to never skip logs for requests that involve code changes or implementations.

# Two M3 Ultras for an AI video pipeline: action plan

**From:** Emmanuel Theodore
**Date:** 2026-11-02
**Purpose:** a concrete first project for the two M3 Ultra (512 GB) machines. It moves the bulk of a
multi-agent video-production pipeline off hosted AI subscriptions and onto local models. The goal
for both of us is to learn the full process (serving, critic models, distributed rendering, then
fine-tuning) on a real workload, and find out where it breaks.

---

## 1. What the pipeline does today

I'm producing a long-form explainer episode ("What Racism Is", from my book *The Original Power*).
The picture is built as code:

- **Audio first.** The script and narration are iterated in text and audio (my tool, scriptCast).
  Word-level timings come from the final narration.
- **Scenes as code.** Each scene is a TypeScript/React component rendered by Remotion. Every visual
  beat is keyed to the exact spoken word. The same scenes double as an interactive website.
- **Agents build the scenes.** A frontier model writes a storyboard for about 5 minutes of picture.
  Worker agents (Codex, Gemini, Kimi, Cursor) build the scenes in parallel packages. Automated
  checks verify determinism, layout and sourcing. An orchestrator (Claude) renders frames, reviews
  them and sends fixes back.

The quality is far above the earlier Figma pipeline. Each agent reasons about one bounded chunk of
material, which works well.

**The problem is cost and speed:**
- The episode is 671 narration turns, about **2 h 48 min**. About **12½ minutes** of picture exists.
- In one afternoon, building 5½ minutes of picture took **15 cold-start worker runs** and still
  needed more review.
- Measured Codex usage: **~2.4 M tokens across 18 runs** for the first 12 minutes.
  - Fix passes cost more than builds: 266k, 217k and 159k tokens against 75–115k for a first build.
- Cursor went from 0% to ~10% of its weekly quota in one afternoon. Several subscriptions hit their
  weekly limits on the same day.

At this rate the episode cannot be finished on hosted quotas.

## 2. Where the tokens go (bottleneck analysis)

1. **Rework loops, the largest cost.** Most runs are fixes. A fix run starts cold, re-reads
   100–270k tokens (briefs, storyboard, scene code, checks) and changes a few dozen lines.
2. **Hand-placed pixel geometry.** Each scene is 200–550 lines of code with manually typed box
   coordinates. Almost every defect was geometric: overlaps, oversized cards, text on the border,
   empty boxes.
3. **Checks measure text, not pictures.**
   - Agents optimise for whatever the checks test. One model padded every box with labels to pass
     a "box must be full" check. Another then stripped the labels and left boxes empty.
   - Only looking at rendered frames catches this. Today that is the most expensive model (the
     orchestrator) reading contact sheets.
4. **Agent dispatch design.** Cold-starting a new worker for every small fix multiplies the cost.

## 3. Target architecture

### 3.1 Change what the worker writes: a scene grammar with automatic layout

- **The library.** A fixed, tested component library: cards, term chips, citation cards, equation
  terms that pulse on the spoken word, people figures, flows, plots. It lays itself out
  automatically: containers size to their content, rows space themselves, and the safe area is
  enforced.
- **What workers write.** Workers write a short scene description, roughly 30–60 lines of
  structured data: template, components, on-screen strings, and the cue word for each beat.
- **The effect.**
  - Scenes shrink 5–10×.
  - Most layout defects become impossible.
  - The task becomes bounded enough for a local model to do reliably.
- **Who builds it.** A frontier model builds the library once, using the 12 approved minutes as the
  reference.

### 3.2 Split the work by judgment level

| Work | Who | Why |
|---|---|---|
| Storyboard (once per ~5 min of picture) | Hosted frontier model | Design judgment, sourcing |
| Component library (once) | Hosted frontier model | Foundation quality |
| Scene descriptions and fixes | **Local coding model, Ultra A** | Bounded and verifiable |
| Frame review against a written rubric | **Local VLM critic, Ultra B** | Closes the "checks pass, picture wrong" gap |
| Rendering | **Remotion workers on both Ultras** | Frame ranges split across machines |
| Escalations and final review | Hosted frontier model plus the author | Taste and edge cases |

### 3.3 The local loop

1. Ultra A writes or edits a scene description.
2. The deterministic checks run (determinism, safe area, collisions, sourcing strings).
3. Stills render at each cue word: stills only, no video yet.
4. Ultra B's VLM critic scores the stills against the rubric:
   - no filler text;
   - no empty containers;
   - balanced composition;
   - nothing appears before its spoken word;
   - nothing on the border.
5. Ultra A fixes, in the **same session**. Cap this at two rounds, then escalate to a hosted model.
6. Full video renders only after the author approves the minute.

### 3.4 The author in the loop: select-and-annotate review in scriptCast

The cheapest and best-taste critic is the author, if review is fast. Every scene element already
carries a stable id and a layout box, because the layout audit requires them. That makes this
possible in scriptCast's Stage player:

- **Level 1, select and note.**
  - Pause at any frame, click an element, and type a note ("move this under the card", "too much
    text", "this should appear on 'Allport'").
  - The note is saved as structured data: scene, element id, time, cue word and text.
  - The note list goes to the builder session that made the scene (resumed, so it has the scene in
    context) as one batched fix.
- **Level 2, direct manipulation.**
  - Drag or resize an element in the player.
  - The change is saved as a per-element layout override, which the scene grammar applies at
    render. No code edit is needed for a nudge.
- **Training data.** Each note and override is a labelled example of the author's taste, ready for
  the critic fine-tune in Phase 3.

## 4. Agent dispatch rules (applies to hosted and local models)

- **Resume, never cold-start, for follow-ups.** The session that built a scene fixes it. Every CLI
  we use supports this: `codex exec resume`, `cursor-agent --resume`, `kimi -S`,
  `agy --conversation`. A new session needs a stated reason.
- **Persistent checker.** A cheaper model builds and a stronger model checks. The same checker
  session stays on across scenes and sections, so its checking context builds up.
- **Dispatch design is a planning step.** Before work starts, name:
  - which sessions build;
  - which ones fix;
  - which one checks;
  - what context each one keeps.
- **Batch fixes.** One resumed turn with the full defect list, never several small cold runs.

## 5. Hardware plan for 2× M3 Ultra, 512 GB

- **Ultra A, the builder.**
  - A large open-weight coding model, a mixture-of-experts model in the DeepSeek, Qwen-Coder or
    Kimi class, at 4-bit with long context.
  - Served through an OpenAI-compatible endpoint (MLX server, LM Studio or llama.cpp).
  - Worker CLIs on my machine point at it.
- **Ultra B, the critic and render machine.**
  - An open vision-language model as the frame critic.
  - Remotion render workers.
- **Network.** Remote access from my machine, for example Tailscale plus SSH. The repo stays on my
  machine; the Ultras serve models and render.
- **Known limit.** Apple Silicon is slow at reading long prompts. A small scene grammar (§3.1) and
  resumed sessions (§4) keep prompts short, which is why they come before the hardware.

## 6. Phased plan

**Phase 0, this week: setup and a baseline.**
1. Remote access to both machines; a model server on each.
2. Download one coding model and one VLM. The downloads are large, so start them first.
3. **Critic test.** Run the VLM on today's contact sheets. They have known good and bad frames, with
   my notes on each. Measure whether it flags what a human flagged.
4. **Builder test.** Rerun one past scene fix through the local coder. Compare it with the hosted
   result on the same checks.

**Phase 1: the scene grammar.**
- A frontier model builds the component library and grammar from the approved minutes.
- Migrate one approved minute as the reference.

**Phase 2: the local production loop.**
- Builder, checks, cue stills, critic and fix, as in §3.3, on the next 5 minutes of the episode.
- Measure tokens and wall-clock per minute of picture against today.

**Phase 3: fine-tuning.**
- **A taste critic.** Fine-tune the VLM on the author's review notes and the accepted and rejected
  frames.
- **Coder preference tuning.** Build before/after scene pairs from fix passes.
- **Possibly, training against the checks as rewards.** The lesson so far is that a model trained
  only on checks learns to game them, so the critic's score has to be part of the reward.

## 7. Success measures

- Hosted tokens per minute of finished picture: target a 10× reduction.
- Worker runs per approved minute: today ~3 per minute after all rework. Target: 1 storyboard, 1
  build and at most 2 local fix rounds per scene.
- Wall-clock per 5 minutes of picture: today about a day. Target: half a day with local loops.
- Critic agreement with human review on the frame test set.

## 8. What you get out of it

- A working recipe for serving large local models across two Ultras.
- A vision critic with a real test set.
- Distributed rendering.
- A fine-tuning path with real preference data.

I'll document the problems and fixes as we go, so you can map them onto your own use cases.

## 9. Questions for you

1. How long can I use the machines, and are they free for multi-hour unattended runs?
2. Remote access: Tailscale, SSH, or your preference?
3. Any models already downloaded or preferred on your side?
4. Anything you'd like the setup to also serve for your own projects, so we design for both?

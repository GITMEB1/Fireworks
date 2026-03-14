# Top 3 Killer Improvements (Live-Play Validated)

This ranking is based on live runtime observation, not static inspection alone.

## Top 5 candidate ideas considered
1. Objective loop with scoring/failure/recovery pressure.
2. Show-director authored pacing and set-pieces.
3. Mastery economy clarity (precision reward + decision consequence).
4. Additional bloom/performance tuning.
5. More shell/effect breadth.

## Explicit rejections (2)
- **Rejected:** additional bloom/perf tuning as a top-3 leap. It improves stability/readability but does not materially solve replay plateau.
- **Rejected:** more shell/effect breadth as a top-3 leap. Adds content variety without addressing weak session-level stakes.

---

## #1 — Objective Pressure Loop (Targets + Score + Failure/Recovery State)

- **Category:** FEATURE_DESIGN / OPPORTUNITY_HUNT
- **Player-facing problem:** Sessions feel like high-quality spectacle but lack durable stakes, consequence, and “I’m trying to win this run” tension.
- **Why this is a killer improvement:** It converts existing core feel from sandbox display into replayable game structure in one move. It creates immediate reasons to care about precision, timing, and recovery decisions.
- **Why it beats nearby alternatives:** Unlike cosmetic or pacing-only changes, this directly installs session-level meaning and can absorb subsequent improvements (pacing, mastery, shell identity) into one coherent loop.
- **Likely seams involved:** Core simulation, input, render overlay, behavior, quality/perf guardrails.
- **Likely files involved:**
  - `src/core/engine.js`
  - `src/core/entities.js`
  - `src/core/config.js`
  - `src/render/overlayRenderer.js`
  - `src/patterns/launchPatterns.js`
  - `src/shells/registry.js`
  - `src/app/appState.js`
- **Main risks:**
  - Overtuning punishment and reducing fireworks fantasy.
  - HUD clutter harming readability.
  - Target density causing perf spikes on mobile.
- **Prototype-first vs ship-path:** **Prototype-first** (timeboxed), then ship-path after tuning.
- **How player feels difference in one short session:** “I’m not just launching fireworks; I’m managing pressure and trying to recover from mistakes while chasing clear goals.”

---

## #2 — Show Director for Authored Escalation and Set-Piece Moments

- **Category:** FEATURE_DESIGN / JUICE_TUNING
- **Player-facing problem:** Pacing has bursts but often plateaus; repeated launches do not reliably build toward memorable chapter-like moments.
- **Why this is a killer improvement:** It gives each session a recognizable arc (build, climax, release), making runs feel intentionally composed instead of randomly dense.
- **Why it beats nearby alternatives:** Better than “more random patterns” because it improves emotional rhythm and retention without requiring large new content volume.
- **Likely seams involved:** App composition (light), behavior, patterns, overlay.
- **Likely files involved:**
  - `src/app/createFireworksApp.js`
  - `src/patterns/launchPatterns.js`
  - `src/shells/registry.js`
  - `src/render/overlayRenderer.js`
  - `src/core/config.js`
- **Main risks:**
  - Over-scripting could reduce player agency.
  - Escalation may collide with quality scaling if not guardrailed.
- **Prototype-first vs ship-path:** **Prototype-first** (phase script + fallback).
- **How player feels difference in one short session:** “The show now ramps intentionally and lands memorable peaks instead of feeling uniformly pretty.”

---

## #3 — Mastery Clarity Upgrade (Precision Economy + Decision Consequence)

- **Category:** OPPORTUNITY_HUNT / FEATURE_DESIGN
- **Player-facing problem:** Good execution is somewhat better than mediocre execution, but not consistently enough to feel deeply skill-expressive across a run.
- **Why this is a killer improvement:** It amplifies player agency and makes timing/aim choices materially matter beyond local spectacle.
- **Why it beats nearby alternatives:** More leverage than adding pure FX content because it upgrades replay pull through competence growth.
- **Likely seams involved:** Input, core simulation, overlay, behavior.
- **Likely files involved:**
  - `src/systems/inputSystem.js`
  - `src/core/utils.js`
  - `src/core/engine.js`
  - `src/render/overlayRenderer.js`
  - `src/shells/registry.js`
  - `src/core/config.js`
- **Main risks:**
  - Excess complexity in controls/UI cues.
  - Over-rewarding precision could narrow viable play styles.
- **Prototype-first vs ship-path:** **Direct ship-path for small cue changes**, **prototype-first for larger reward-economy changes**.
- **How player feels difference in one short session:** “When I play better, outcomes are clearly better—and I can feel myself improving run-to-run.”

---

## Ranking summary
1. **#1 Objective Pressure Loop** (clear dominant next move)
2. **#2 Show Director Escalation**
3. **#3 Mastery Clarity Upgrade**

## Dominance call
Yes: **#1 still clearly dominates** after live runtime observation.

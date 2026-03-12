---
description: Opportunity discovery workflow — identifies high-leverage enhancement and feature opportunities for the Fireworks project using PromptFactory-style structured analysis
---

# Fireworks Opportunity Discovery Workflow

This workflow uses PromptFactory's canonical evidence-driven process, adapted for **product and feature discovery** on the Fireworks game simulator.
Run this whenever you want to surface genuinely high-leverage opportunities — not just surface-level tweaks.

---

## STAGE 0 — Task Intake & Risk Classification

**Objective:** Frame the discovery question and classify its risk/freshness profile before any analysis begins.

**Actions:**
1. Write a `task_intel.yaml` in `.agents/runs/<date>-discovery/` with:
   - `task_id`: `T-YYYYMMDD-discovery`
   - `objective`: "Identify high-leverage enhancement and feature opportunities in the Fireworks simulator"
   - `risk_level`: `medium` (externally visible creative product)
   - `freshness_level`: `moderate` (web platform APIs evolve; game design meta changes)
   - `audience`: "Developer + product owner"
   - `mode`: `deep` (decision-consequential, drives real development)

2. Define success criteria upfront:
   - ≥5 distinct, evidence-backed opportunity areas ranked by impact/effort
   - Each opportunity links to a specific file or system seam in the codebase
   - Opportunities are grounded in player experience data, design patterns, OR platform capability

**Stop gate:** If the objective isn't clearly scoped within 2 minutes, stop and ask the user to narrow it (feature depth vs. breadth vs. platform vs. monetisation).

---

## STAGE 1 — Codebase Architecture Audit

**Objective:** Map the full current capability surface of the Fireworks engine before ideating.

**Actions:**
1. Read `src/ARCHITECTURE.md` — identify the declared extensibility seams.
2. List all files in:
   - `src/core/` — engine state, config, entity types
   - `src/shells/` — particle/shell registry and types
   - `src/effects/` — death behaviours, post-effects
   - `src/systems/` — input, quality, motion preference, resize
   - `src/render/` — background, scene, overlay renderers
   - `src/patterns/` — launch patterns
3. For each seam identified in ARCHITECTURE.md, note:
   - What is currently implemented?
   - What is structurally possible but not yet built?
   - What would be over-engineered given current scope?
4. Read `src/core/config.js` — list all tunable parameters; classify as **exposed** (player-facing) or **hidden** (dev-only).
5. Read `src/shells/registry.js` — list all registered shell types and their property variance.

**Output:** A markdown table:
| Seam | Current capability | Obvious gap | Effort estimate (S/M/L) |

---

## STAGE 2 — Player Experience Baseline

**Objective:** Establish what the current player loop feels like and where friction/delight live.

**Actions:**
1. Open the app in a browser: `http://localhost:8080`
2. Perform the following structured play-test sequence:
   - **Test A — Basic click:** 5 rapid single-clicks. Note: rocket speed, particle spread, color variety.
   - **Test B — Short hold (20-40%):** 5 shots. Note: charge indicator feedback, explosion size delta.
   - **Test C — Perfect charge (95-99%):** 3 Supernova attempts. Note: time dilation feel, shake intensity, flash colour impact.
   - **Test D — Overcharge (Fizzle):** 2 intentional overcharges. Note: penalty clarity, readability.
   - **Test E — Sustained rapid fire:** 20 clicks over 10 seconds. Note: performance, visual fatigue, engagement dropoff.
3. Record observations in `.agents/runs/<date>-discovery/play_test_notes.md` using this template:

```markdown
## Play-test: [Test Name]
- Feeling: [delightful / neutral / frustrating]
- What worked:
- What felt missing:
- Friction points:
- Delight spikes:
```

4. Identify the **drop-off moment** — the moment where a first-time player would likely lose interest.

**Stop gate:** If the app is unreachable, resolve the server issue before proceeding (see running terminal). Do not estimate player experience from code alone.

---

## STAGE 3 — Comparative Design Benchmarking

**Objective:** Ground opportunity ideas in proven game-feel and visual design patterns from peer projects.

**Actions:**
1. Search for 3-5 reference projects across these categories:
   - **Category A:** Browser-based particle simulators (e.g., Particles.js, tsParticles, p5.js fireworks demos)
   - **Category B:** "Game feel" / juice references (Jan Willem Nijman's "The Art of Screenshake", Vlambeer talks)
   - **Category C:** Arcade skill games with charge mechanics (Angry Birds, Any archer game, Peggle)
2. For each reference, extract **1-3 specific mechanic patterns** that could translate to this project.
3. Classify each pattern by implementation complexity:
   - **Drop-in:** Can be added to existing seams with <50 lines
   - **Extend:** Requires extending an existing module (100-200 lines)
   - **Architecture:** Requires a new system or significant refactor (>200 lines)
4. Record in `.agents/runs/<date>-discovery/benchmarks.md`.

**Source classes required (PromptFactory standard):**
- `live_retrieval`: current URLs for reference projects
- `practitioner`: game feel talks/articles with explicit date
- Model prior: allowed for background context only, NOT for design claims

---

## STAGE 4 — Platform Capability Scan

**Objective:** Identify modern Web/Canvas API features that are currently unused but could unlock high-value experiences.

**Actions:**
1. Search: "Canvas 2D API 2024 2025 new features browser support"
2. Search: "Web Audio API game sound effects browser 2025"
3. Search: "CSS Houdini Paint Worklet canvas effects 2025"
4. Evaluate each finding against the Fireworks codebase:
   - Is it already used?
   - Would it require a new `src/` module or just a new function?
   - What is browser support (caniuse.com)?
5. Record opportunities in `.agents/runs/<date>-discovery/platform_capabilities.md`.

**High-value targets to check:**
- `OffscreenCanvas` + worker threading (performance at high particle counts)
- `AudioWorklet` / `OscillatorNode` (procedural sound without assets)
- `PointerEvents` pressure/tilt for mobile charge control
- `requestVideoFrameCallback` for replay/screen recording
- `ResizeObserver` vs current resize system
- `deviceorientation` for tilt-to-aim on mobile

---

## STAGE 5 — Codebase Opportunity Inventory (Claim Control)

**Objective:** Surface specific, file-anchored opportunities from all prior stages. This is the PromptFactory claim-control stage applied to code/product discovery.

**Actions:**
1. For each opportunity identified in Stages 1-4, create an entry with this structure:

```yaml
opportunity:
  id: "OPP-001"
  title: "Procedural Sound Design"
  source_stages: [stage_4_platform_scan]
  file_anchor: "src/core/engine.js (triggerSupernova)"
  current_state: "No audio layer exists"
  proposed_state: "AudioContext + OscillatorNode creates impact sounds on shell burst"
  impact_hypothesis: "high — sound is one of the strongest emotional amplifiers in games"
  effort_estimate: "M — new src/systems/audioSystem.js, 150-200 lines"
  evidence_class: "live_retrieval + practitioner"
  confidence: "medium — pattern is proven; implementation fit needs prototyping"
  risk_flags: []
```

2. Enforce PromptFactory claim-safety rules:
   - Every `impact_hypothesis` must cite its source stage
   - `confidence: high` requires two independent evidence sources
   - Flag any opportunity relying on model prior alone as `confidence: low`

3. Produce a minimum of **8 candidate opportunities**.

---

## STAGE 6 — Impact/Effort Ranking (Response Plan)

**Objective:** Rank opportunities by leverage — the ratio of player impact to implementation effort.

**Actions:**
1. Score each opportunity on two axes (1-5):
   - **Player Impact:** How significantly does this change the core play loop?
   - **Implementation Effort:** How large/risky is the code change? (1=easiest, 5=hardest)
2. Compute `leverage_score = player_impact / effort`
3. Assign to one of four quadrants:

| Quadrant | Impact | Effort | Strategy |
|---|---|---|---|
| **Quick Wins** | High | Low | Ship first |
| **Big Bets** | High | High | Plan carefully, prototype first |
| **Fill-ins** | Low | Low | Ship when convenient |
| **Avoid** | Low | High | Don't build |

4. For the top 5 by `leverage_score`, write a 2-sentence "case for building this now."
5. Record as `response_plan.yaml` in the run directory.

---

## STAGE 7 — Opportunity Brief Composition

**Objective:** Compose the final human-readable opportunity brief that the developer can act on immediately.

**Actions:**
1. Write `.agents/runs/<date>-discovery/OPPORTUNITIES.md` with:

```markdown
# Fireworks Enhancement Opportunities — <date>

## Quick Wins (High Impact, Low Effort)
### [Opportunity Title]
- **What:** [1 sentence description]
- **Why now:** [1 sentence player impact rationale]
- **File anchors:** [specific files/functions]
- **Estimated effort:** [S/M/L with line count]

## Big Bets
[same structure]

## Deferred / Out of Scope
[list with one-line reason each]
```

2. Each entry must link to a specific file or function in `src/` — no vague suggestions.
3. Sort Quick Wins by leverage score descending.

---

## STAGE 8 — Evaluation Gate

**Objective:** Verify the opportunity brief meets quality standards before handing it to the developer.

**Checklist (all must pass):**
- [ ] Every opportunity has a `file_anchor` in `src/`
- [ ] Every `confidence: high` claim has ≥2 evidence sources
- [ ] No opportunity relies solely on model prior for its impact claim
- [ ] The top Quick Win can be implemented as a single PR (< 250 lines changed)
- [ ] At least one opportunity targets the **retention/engagement drop-off** identified in Stage 2
- [ ] Platform capability opportunities have verified `caniuse.com` browser support links

**Failure conditions:**
- If fewer than 3 Quick Wins are identified → return to Stage 3 (broaden benchmarking)
- If top opportunity impact claim is model-prior-only → downgrade confidence and flag for user review
- If codebase audit missed a module → re-run Stage 1 for that module

---

## STAGE 9 — Lessons & Tracking

**Objective:** Log what worked and what to improve next run.

**Actions:**
1. Append to `.agents/tracking/discovery_runs.yaml`:

```yaml
- run_id: "<date>-discovery"
  date: "YYYY-MM-DD"
  opportunities_found: <count>
  top_leverage_item: "<title>"
  escalations: []
  lessons:
    - "What worked well in sourcing"
    - "What stage was hardest"
    - "What to change next time"
```

2. If any stage was skipped due to time pressure, record it as `tech_debt` in the lesson entry.
3. If a stop gate was triggered but bypassed, record as `risk_flag`.

---

## Usage Notes

**Typical run time:** 45-90 minutes for a thorough pass.

**Shortcut (Quick-only mode):** Run Stages 0, 1, 2, 5 (inventory only), 6, 7. Skip benchmark and platform scan. Label the output `quick_discovery` and set confidence ceiling to `medium`.

**When to re-run:** After every 3-4 feature implementations, or after any significant engine refactor.

**Mode:** This workflow runs in **deep mode** by default (per PromptFactory CEP Stage 2 criteria — decision-consequential, drives real development).

# Repository Deep Audit and Guidance

## Pre-audit setup (required)

### Repo areas inspected
- Operating layer and governance: `AGENTS.md`, `fireworks-engine/OPERATING_MODEL.md`, `TASK_TYPES.md`, `SEAM_MAP.md`, `EVAL_GATES.md`, `README.md`, `MIGRATION.md`.
- Evolution evidence and recent pass artifacts in `fireworks-engine/runs/`, with emphasis on objective loop, target refinement, destructible tuning, runtime-vNext phase 0/1, hybrid reinforcement, and post-leap audits.
- Runtime and gameplay seams across `src/app`, `src/core`, `src/systems`, `src/render`, `src/render-gpu`, `src/runtime-vnext`, `src/patterns`, `src/shells`, and `src/effects`.

### Top 5 audit questions
1. What is the real runtime architecture now (not the intended one), and where are seam boundaries actually holding?
2. Does current gameplay clearly reward skill (timing + hit quality) in one session, or is reward still too ambiguous?
3. Are perfect-shot and target hit-quality systems calibrated enough to support balance decisions with confidence?
4. Which recent updates were structural leaps vs reinforcement/tuning, and what prototype debt remains?
5. What are the minimum must-do actions that materially reduce decision risk before the next strategic gate?

### What counts as a genuinely valuable critical insight
A valuable insight must change a near-term decision, not just describe code. It should reveal a hidden dependency between systems (gameplay economy, instrumentation, runtime architecture, or validation method) that can cause false confidence if ignored.

---

## 1. Executive summary
Fireworks is now a **session-loop action game with spectacle roots**, no longer a pure sandbox fireworks toy. The objective pressure loop, stateful/destructible targets, and hit-quality scoring have converted the core experience into “clear under pressure” play with visible fail states, phase escalation, and restart flow.

Repository state: the project has a **strong seam-local architecture for gameplay iteration**, plus an intentionally hybrid runtime-vNext lane that is useful but still prototype-grade. Canvas2D baseline remains production-safe; WebGL2 prototype lane is real and guarded by fallback, but still carries mixed-ownership and perf-risk debt.

What matters most now is **truthful calibration**: hit-quality and perfect-shot rewards are implemented and player-visible, but the project still lacks fixed-scenario evidence to confirm balance bands across desktop high quality, reduced motion, and low-end conditions. Without that, tuning decisions risk optimizing for anecdotal feel only.

---

## 2. Repository architecture map

### Top-level structure (what each major directory actually does)
- `src/`: live game runtime and all gameplay/render systems.
- `fireworks-engine/`: operating layer (planning, task typing, seam binding, eval gates, and run artifacts).
- `.agents/`: meta process traces/workflows from agent runs.
- `PromptFactory/`: legacy/historical pointer; not current operating center.
- Root app files (`index.html`, `src/main.js`, `package.json`): browser boot and simple static hosting.

### How the main game boots
1. `src/main.js` creates app via `createFireworksApp(...)` and calls `start()`.
2. `createFireworksApp` composes config/state/audio/runtime-vNext/engine/systems.
3. Runtime-vNext selects renderer adapter mode (`canvas2d-baseline` or `webgl2-prototype`) with guarded fallback.
4. The RAF loop runs quality adaptation, engine update, adapter frame composition, render, debug dataset updates, and optional non-objective autolaunch.

### Runtime layering now
- **App composition layer** (`src/app/*`): lifecycle, loop, startup wiring, system coordination.
- **Core simulation layer** (`src/core/*`): entity pools, physics, objective logic, scoring/pressure, hit-quality and destructibility resolution.
- **Systems layer** (`src/systems/*`): input, quality scaling, resize, reduced-motion, audio.
- **Render layer**:
  - Canvas2D baseline in `src/render/*`.
  - GPU transient prototype in `src/render-gpu/*`.
  - Adapter boundary in `src/runtime-vnext/renderers/*` and contracts.

### Legacy Canvas2D vs runtime-vNext vs GPU prototype relationship
- Canvas2D baseline is still the full, dependable path.
- runtime-vNext is a composition shell introducing adapter/events/budgets and mode switching.
- WebGL2 prototype is hybrid: transients (particles/shockwaves/fragments) on GPU, but significant scene/UI still rendered to Canvas2D overlay and uploaded per frame.

### Major seams (current practical boundaries)
- Input seam: charge/pointer/restart in `src/systems/inputSystem.js`.
- Core simulation seam: objective, targets, scoring, pooled entities in `src/core`.
- Render seam: background/scene/overlay in `src/render` + adapter lanes.
- Behavior seam: shell families/death choreography/patterns in `src/shells`, `src/effects`, `src/patterns`.
- Quality/perf seam: quality scaling and reduced-motion behavior in `src/systems/qualitySystem.js` and related config.
- Runtime seam: mode, event, budget contracts in `src/runtime-vnext/*`.

### Architectural strengths
- Strong seam-locality for gameplay iteration (objective/target tuning mostly isolated in `core/config/entities/engine`).
- Explicit runtime contracts reduce hidden coupling risk versus older direct render binding.
- Bounded pools and quality scaling are pervasive enough to keep mobile constraints in view.

### Architectural weaknesses / ambiguity
- Hybrid renderer ownership is still mixed, so “GPU mode” can imply more modernization than has actually landed.
- Budget manager only partially owns high-cost channels; cap policy is not fully unified.
- There is no first-class telemetry pipeline for score/hit-quality outcome analytics, so balancing remains mostly manual.

---

## 3. `fireworks-engine` analysis

### What it is
`fireworks-engine/` is a repository-native operating layer for converting ideas into seam-bound work with explicit evaluation records.

### What purpose it serves
- Provides durable decision scaffolding: operating stages, task classes, seam maps, and gates.
- Captures evolution history in `runs/` as practical implementation evidence.
- Keeps project strategy close to real files and constraints instead of abstract process language.

### How it differs from runtime
- Runtime (`src/`) executes player-facing behavior.
- `fireworks-engine/` governs **how** work is selected, bounded, verified, and handed off.
- It is process and decision infrastructure, not game runtime code.

### Prompts, runs, schemas, operating model: what they are doing now
- Prompts and task taxonomy define repeatable work modes (audit, perf, feature, experiment).
- Runs chronicle the project’s progression from objective loop through runtime-vNext and reinforcement.
- Schemas support standardized plan/eval/test artifact quality.

### Is it helping or overhead?
- **Helping:** High. It has preserved strategic continuity across many incremental passes and reduced thrash.
- **Overhead risk:** Moderate. If every micro-change demands full artifact rigor, cycle time can slow. Current state is healthiest when used for meaningful passes and decision gates, not tiny edits.

### Essential vs optional parts right now
- **Essential now:** `OPERATING_MODEL`, `SEAM_MAP`, `EVAL_GATES`, recent `runs/` evidence.
- **Useful but optional for near-term tuning:** full schema ceremony for very small config-only calibrations.
- **Historical/optional:** PromptFactory remnants and older generic workflow traces.

---

## 4. Gameplay analysis

### Current loop
- Player charges and releases shots via drag/slingshot input.
- Objective run tracks score, pressure, combo window, phase timer, clear quota, urgent/critical target counts, and fail status.
- Targets spawn under quality-aware budget and cadence.
- Player clears targets to reduce pressure and advance phase; misses/dirty play increase pressure; overflow fails run.

### Current reward structure
- Shots split into normal, perfect (supernova), and dirty (overcharge).
- Perfect contributes stronger clear bonuses/recovery and feeds visual/fever identity.
- Hit quality (direct/normal/glancing) modifies damage, score micro-rewards, and shatter value.
- Combos amplify clear rewards when shatters are chained within window.

### Target/destruction role
- Targets are now stateful (`fresh/damaged/critical`, urgency by lifetime ratio).
- Destruction path distinguishes fracture vs shatter, with bounded fragment spectacle and quality-sensitive degradation.
- Target kinds (normal/priority/armored) create tactical variety with pressure consequences.

### Progression and tension
- Phase clear quotas and health/speed scaling create escalation.
- Overtime pressure and expiry pressure enforce pace.
- Objective text + urgent/critical counters communicate tactical priority.

### Where gameplay is strongest
- One-session readability of pressure, urgency, and clear objective has materially improved.
- Direct hits and good timing are meaningfully rewarded without requiring deep tutorialization.
- Destructible target feedback adds strong perceived impact while mostly respecting budget limits.

### Where gameplay is weakest
- Score economy confidence is still low without scenario-matrix calibration data.
- High-skill optimization path may still bias toward direct-hit farming if not monitored quantitatively.
- Instrumentation is underpowered for proving balance across performance profiles.

---

## 5. Perfect shots / hit-quality analysis

### Current implementation shape
- Perfect shots are input-timing gated in a narrow high-charge band; overcharge converts to dirty outcome.
- Perfect outcome maps to `supernova` shot type and prestige launch behavior.
- Hit-quality is center-weighted at target impact and maps to direct/normal/glancing categories.
- Shatter logic blends raw intensity with quality bonuses and critical-state bonuses.

### Player-facing effect
- Clear visual language exists: white-hot/perfect charge cues, overcharge cue, objective HUD feedback strings (e.g., Direct hit/shatter).
- Perfect chain and fever overlays strengthen moment-to-moment emotional reward.

### Scoring/value effect
- Perfect status contributes to clear bonus and pressure recovery.
- Direct hits receive additional score and shatter multiplier edge; glancing hits are penalized.
- Combo multiplier compounds successful shatters, making execution consistency valuable.

### Clarity and reward quality
- Clarity is improved versus prior passive target era.
- Reward quality is directionally good, but exact balance confidence remains moderate due to limited telemetry.

### Balance confidence
- **Confidence: medium-low** for quantitative balance, **medium-high** for qualitative feel.
- Reason: tuning has recently shifted thresholds and bonuses, but no fixed-scenario score distribution logging has closed the loop yet.

### Calibration readiness
The repo is ready for calibration with minor scripting/instrumentation additions only.
- Existing data points are sufficient to categorize outcomes (`hitQuality`, shattered events, score, run state).
- Runtime events already emit target damage/shatter metadata and budget events.
- Missing piece is a deterministic/controlled sampling harness and persistent per-scenario aggregation.

---

## 6. Recent updates assessment

### Major changes landed
1. Objective pressure loop (run-level game state and fail/restart clarity).
2. Target interaction refinement (stateful targets + hit-quality differentiation + urgent/critical readability).
3. Destructible targets and later hardening pass (fracture/shatter with bounded fragment lane).
4. Physics enhancement and shell behavior differentiation reinforcement.
5. runtime-vNext introduction (adapter/events/budgets).
6. GPU prototype lane (WebGL2 transient rendering with fallback).
7. Post-leap reinforcement (fallback hardening + lifecycle disposal semantics).

### True leaps vs reinforcement
- **True leaps:** objective loop, destructible targets, runtime-vNext seam establishment.
- **Reinforcement:** target tuning/hardening, post-leap fallback and disposal fixes, hybrid runtime stabilization.

### What changed for player
- Runs now have explicit goals, risk pressure, and fail states.
- Better aim/timing translates into clearer tactical and score outcomes.
- Destruction feedback is richer and more legible.

### What changed technically
- Runtime boundaries became explicit and testable (adapter + events + budgets).
- Gameplay economy moved from implicit spectacle scoring to objective-coupled scoring and pressure model.

### What remains prototype-grade
- WebGL2 lane throughput and ownership model (hybrid texture-upload bridge, partial budget unification).
- Quantitative gameplay balance confidence across scenario matrix.

### What has materially improved
- Strategic coherence: changes now align around one-session readability + pressure loop + bounded spectacle.
- Change safety: seam-local modifications are increasingly common and auditable.

---

## 7. Absolute must-dos

### Technical must-dos (priority order)
1. Unify budget management across remaining high-cost channels (glow/smoke/embers) to remove split cap policies.
2. Add lightweight persistent runtime counters for budget denials, fallback reasons, and hybrid overlay upload pressure.
3. Keep WebGL lane prototype-scoped until metrics show acceptable stress behavior in low-end emulation.

### Gameplay must-dos (priority order)
1. Run fixed-scenario hit-quality calibration and adjust direct/normal/glancing and perfect bonus values based on distributions, not anecdotes.
2. Lock and document target balance bands (e.g., expected score share by hit-quality category and acceptable expiry pressure rates).
3. Ensure player-facing reward messaging stays aligned with actual scoring impact (avoid “looks premium, scores flat” drift).

### Validation must-dos for next decision gate
1. Execute short scenario matrix (desktop high quality, reduced motion, low-end emulation) with repeatable run scripts.
2. Log per-run score breakdown by hit-quality category + shatter count + dirty-shot count + expiry count.
3. Decide Gate E with evidence: `ship` for current balance tuning only if bands hold across scenarios; else `prototype` with targeted retune.

---

## 8. Calibration recommendation

### Is this the right next step?
Yes — it is the highest-value next validation step and directly matches the known risk profile.

### What it would prove
- Whether current hit-quality and perfect-shot reward weights remain fair under varied runtime constraints.
- Whether target pressure and scoring stay stable enough across quality/motion modes to justify broader rollout confidence.

### What data should be logged
Per scenario and per run (small fixed matrix):
- total score
- score contribution buckets: direct-hit bonus, base hit score, clear score, shatter bonus, perfect bonus
- hit-quality counts: direct/normal/glancing
- shatter count and average shatter power
- dirty shot count
- target expiry count (including priority expiries)
- pressure peak and fail/survive outcome
- average quality scale and budget-denied event counts

### What risks this reduces
- Reduces false confidence from visually strong but economically skewed tuning.
- Reduces risk of low-end/reduced-motion players receiving systematically weaker reward loops.
- Reduces chance of shipping balance changes that only hold in desktop high-quality conditions.

### Prerequisite cleanup needed first?
Only minimal: wire a small logging collector over existing runtime events and objective state snapshots. No broad refactor required.

---

## 9. One critical insight

**Critical insight:** Fireworks’ biggest current risk is not render performance or feature gap; it is **reward-model opacity** — because perfect-shot and hit-quality systems already influence multiple stacked score/recovery paths, balance can drift invisibly unless score attribution is logged by category per scenario.

Why this matters: without attribution, tuning acts on “feel” while hidden multipliers (combo, perfect bonus, direct bonus, shatter multipliers, pressure recovery coupling) can over-amplify one strategy and undermine intended objective tension.

What decision it changes: prioritize a short instrumentation-backed calibration pass **before** any additional mechanic expansion or GPU scope increase.

---

## 10. Recommended next move
Implement and run the requested **fixed-scenario calibration pass** immediately (desktop high quality + reduced motion + low-end emulation), with per-run score attribution by hit-quality category and target balance-band checks, then publish a go/no-go tuning decision record.

---

## Run artifact metadata
- **Problem:** repository-understanding and strategic clarity across architecture, operating layer, gameplay economy, and recent evolution.
- **Seam binding:** documentation/evaluation seams + read-only audit of app/core/render/runtime/system seams.
- **Files touched:** `fireworks-engine/runs/repository-deep-audit-and-guidance.md`.
- **What changed:** created a decision-grade deep audit with required sections, explicit uncertainties, prioritized must-dos, calibration plan, and one critical insight.
- **Verification performed:** source and artifact inspection via targeted file reads and code path tracing.
- **Gate-based decision:** `ship` (documentation artifact ready for strategic use; no runtime behavior change).
- **Next step:** execute calibration pass and publish evidence-backed retune or confirmation.

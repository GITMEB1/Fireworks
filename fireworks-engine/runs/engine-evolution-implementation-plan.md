# Engine Evolution Implementation Plan (30–90 days)

## Pre-write inspection summary

### Repo areas inspected
- Governance and operating layer:
  - `AGENTS.md`
  - `fireworks-engine/OPERATING_MODEL.md`
  - `fireworks-engine/SEAM_MAP.md`
  - `fireworks-engine/EVAL_GATES.md`
- Prior run reports (strategy and recent implementation reality):
  - `fireworks-engine/runs/leap-forward-upgrade-plan.md`
  - `fireworks-engine/runs/objective-loop-implementation-plan.md`
  - `fireworks-engine/runs/visual-perf-physics-upgrade-pass.md`
  - `fireworks-engine/runs/bssds-phase1-2-prototype.md`
  - `fireworks-engine/runs/bssds-phase3-orchestration.md`
  - `fireworks-engine/runs/destructible-targets-pass.md`
- Runtime structure and critical seams under `src/`:
  - App composition: `src/main.js`, `src/app/createFireworksApp.js`, `src/app/appState.js`
  - Core simulation: `src/core/engine.js`, `src/core/entities.js`, `src/core/config.js`, `src/core/utils.js`
  - Rendering: `src/render/renderer.js`, `src/render/backgroundRenderer.js`, `src/render/overlayRenderer.js`, `src/core/context2d.js`
  - Gameplay behavior: `src/shells/registry.js`, `src/effects/deathBehaviors.js`, `src/patterns/launchPatterns.js`
  - Systems/tooling: `src/systems/qualitySystem.js`, `src/systems/inputSystem.js`, `src/systems/motionPreferenceSystem.js`, `src/systems/audioSystem.js`
  - Architecture notes: `src/ARCHITECTURE.md`

### Top 3 implementation-path hypotheses considered
1. **In-place modernization of current canvas stack**: keep single-threaded engine/renderer and continue incremental upgrades (bloom tuning, behavior scripts, destruction tuning).
2. **Hybrid migration to a GPU-first render backend while preserving current gameplay core**: keep JS/TS and game logic concepts, add a new render layer + data boundary + progressively structured runtime (ECS-lite), with old renderer as fallback during transition.
3. **Full rewrite into a browser-focused external engine/framework immediately**: re-platform both runtime and rendering stack in one move.

### Winning hypothesis and why
**Winner: Hypothesis 2 (hybrid migration).**
- It aligns with the established strategy (web-native, JS/TS, avoid heavy migration mistakes) while still making a bold structural move where leverage is highest: rendering + data-flow scalability.
- Current repo already shows high-value gameplay and destruction progress (BSSDS + destructible targets), so discarding all gameplay work would be wasteful.
- Current architecture has a scaling ceiling: monolithic `engine.js` orchestration with direct pool mutations and Canvas2D-centric render assumptions.
- A full immediate rewrite (hypothesis 3) has highest downside for mobile viability, iteration speed, and AI-assisted maintainability.

### Conservative evolution vs bold structural change
This winning path requires **bold structural change in selected layers** (render backbone, data boundaries, orchestration model), not conservative tuning. It is a **controlled hybrid migration** rather than a big-bang rewrite.

---

## 1) Executive decision

### Chosen path
**Hybrid migration with a parallel vNext runtime slice inside this repo**:
- Keep Fireworks web-native and JS/TS.
- Build a GPU-first rendering backbone in parallel to current Canvas2D path.
- Introduce a data-oriented gameplay orchestration layer (ECS-lite) for entities/events that need scale.
- Keep current engine as a proven fallback while vNext slices harden.

### Strongest runner-up
**In-place upgrade only** (no dual runtime slice, no structured data boundary).

### Why the chosen path wins now
- In-place only is too likely to hit architectural ceiling for richer destruction + systems density.
- Full rewrite is too risky for mobile/browser stability and iteration throughput.
- Hybrid migration captures upside (GPU throughput, better complexity scaling, maintainability) while preserving shipping velocity and de-risking with prototypes.

## 2) Current repo constraints

Top 3 constraints limiting future growth:

1. **Render throughput and compositing ceiling (Canvas2D bloom-heavy path)**  
   - Primary category: **rendering** + **mobile/browser deployment**  
   - Evidence: `src/render/renderer.js` uses full-frame blur/composite cadence logic; adaptive quality helps but still scales poorly under dense effects and destruction overlays.

2. **Monolithic simulation orchestration and feature coupling**  
   - Primary category: **architecture** + **gameplay systems**  
   - Evidence: `src/core/engine.js` centralizes objective loop, spawning, explosion behavior plumbing, scoring, pressure loop, and pool lifecycle. This slows addition of richer mechanics and increases regression risk.

3. **Destruction and behavior scaling depends on ad hoc guards instead of first-class budgets/events**  
   - Primary category: **physics/destruction** + **workflow/tooling**  
   - Evidence: bounded destruction/BSSDS exists (`entities.js`, `deathBehaviors.js`, config caps), but scalability still relies on per-feature clamps rather than unified budget/event infrastructure suitable for larger authored fragmentation systems.

## 3) Recommended technical direction

### Rendering recommendation
- Move to a **GPU-first renderer** (WebGL2 baseline, WebGPU optional where available) behind a renderer adapter boundary.
- Prioritize a batched sprite/mesh pipeline for particles, shockwaves, and fragments with post-processing designed for mobile quality tiers.
- Keep Canvas2D path as fallback/compat mode during migration.

### Destruction / fragmentation recommendation
- Implement **authored, bounded fragmentation assets/rules**, not full physics fracture.
- Use fragment archetypes + event-driven spawn scripts with strict per-scene budgets and quality-tier degradation.
- Couple destruction readability to gameplay state (critical/direct hit states) rather than raw particle volume.

### Gameplay architecture recommendation
- Split monolithic engine responsibilities into modular runtime domains:
  - Launch & shell emission
  - Objective/combat loop
  - Destruction orchestration
  - FX/event routing
  - Scoring/progression
- Introduce explicit tick phases and event queues to prevent hidden side effects.

### Data / behavior orchestration recommendation
- Adopt an **ECS-lite (data-oriented) model** for high-churn entities (particles, fragments, shockwaves, transient FX) and keep bespoke object logic for heavyweight gameplay objects where needed.
- Standardize config-driven behavior scripts (BSSDS style) and unify with runtime budget manager.

### Whether ECS is warranted now, later, or not at all
**Warranted now (targeted), not universal.**
- Use ECS-lite where scale pressure is highest.
- Do not force full ECS migration for every subsystem in first 90 days.

### Whether worker usage is warranted now, later, or not at all
**Warranted later in this 30–90 day window (after data boundary prototype proves out).**
- First establish deterministic data packets/events and render separation.
- Then move selected simulation/update lanes (particle/fragments culling, budget evaluation, possibly spawn planning) to a worker.

## 4) Implementation phases

### Phase 0 (Week 1): Runtime seam hardening and vNext scaffold
- **Objective:** Create explicit runtime boundaries so GPU/destruction prototypes can plug in cleanly.
- **Why it exists:** Without seam hardening, every prototype becomes throwaway or deeply invasive.
- **Likely seams involved:** App composition, core simulation, render seam.
- **Likely repo areas affected:** `src/app/createFireworksApp.js`, `src/core/engine.js`, `src/render/*`, new `src/runtime-vnext/*`.
- **Prototype vs ship-path:** Prototype scaffolding with minimal user-visible change.
- **Risk level:** Medium.
- **Success criteria:**
  - Renderer adapter interface exists and can swap implementations.
  - Event/budget interfaces defined for explosion/destruction paths.
  - No regression to baseline app startup/controls.

### Phase 1 (Weeks 1–3): GPU-first renderer prototype lane
- **Objective:** Render particles/shockwaves/fragments through GPU path with quality tiers.
- **Why it exists:** Rendering ceiling is the immediate bottleneck for readable chaos at scale.
- **Likely seams involved:** Render seam, quality/perf seam.
- **Likely repo areas affected:** new `src/render-gpu/*`, `src/systems/qualitySystem.js`, minimal integration in app/engine boundaries.
- **Prototype vs ship-path:** Prototype-first, then ship-path if thresholds met.
- **Risk level:** High.
- **Success criteria:**
  - Equivalent scenes show improved frame stability on representative mobile/browser matrix.
  - Visual hierarchy remains readable (not just brighter/faster).
  - Quality scaling and reduced-motion still function.

### Phase 2 (Weeks 2–5): Destruction v2 authored fragmentation system
- **Objective:** Build bounded, authored fragment scripts that outperform current shatter feel without perf spikes.
- **Why it exists:** Destruction is core upside; current implementation is promising but limited.
- **Likely seams involved:** Core simulation, behavior, render, quality/perf.
- **Likely repo areas affected:** `src/core/entities.js`, `src/core/engine.js`, `src/effects/deathBehaviors.js`, renderer adapter outputs, config schema.
- **Prototype vs ship-path:** Prototype-first with strict caps; ship-path after balancing.
- **Risk level:** Medium-high.
- **Success criteria:**
  - 2–3 target classes with distinct fracture signatures.
  - Fragmentation remains legible under stress and quality degradation.
  - Hard budget compliance (no runaway fragment fanout).

### Phase 3 (Weeks 4–8): Gameplay orchestration refactor (ECS-lite + event pipeline)
- **Objective:** Extract objective loop, shell behaviors, and destruction dispatch into modular systems with explicit events.
- **Why it exists:** Enables feature growth without monolithic engine regressions.
- **Likely seams involved:** Core simulation, behavior, app composition.
- **Likely repo areas affected:** `src/core/engine.js` (decomposition), new `src/systems/gameplay/*` or `src/runtime-vnext/systems/*`, `src/shells/registry.js`, `src/patterns/launchPatterns.js`.
- **Prototype vs ship-path:** Ship-path for selected subsystems, prototype for deeper ECS spread.
- **Risk level:** High.
- **Success criteria:**
  - Core loop responsibilities split into testable modules.
  - New mechanics can be added with localized changes.
  - Existing objective mode behavior parity retained.

### Phase 4 (Weeks 6–10): Worker-assisted simulation lanes (targeted)
- **Objective:** Offload selected compute-heavy lanes once deterministic boundaries are stable.
- **Why it exists:** Preserve mobile frame pacing while raising simulation complexity.
- **Likely seams involved:** Core simulation, quality/perf, app composition.
- **Likely repo areas affected:** new worker module(s), message schemas, budget manager, renderer integration.
- **Prototype vs ship-path:** Prototype-first; ship only if jitter/input latency stay acceptable.
- **Risk level:** High.
- **Success criteria:**
  - Stable frame-time reduction in stress scenes.
  - No input responsiveness regression.
  - Deterministic-enough behavior for tuning/debugging.

## 5) Prototype priorities

Build these before deeper commitment:

1. **Prototype A: GPU renderer vertical slice (particles + shockwaves + fragments + bloom substitute)**
   - Purpose: prove the rendering backbone can carry readable chaos on mobile.
   - Must include quality-tier degradation and reduced-motion behavior.

2. **Prototype B: Authored fragmentation pack (3 target archetypes + budget manager integration)**
   - Purpose: validate destruction quality ceiling with bounded cost.
   - Must show clear player-visible difference between weak hit, strong hit, and critical shatter.

3. **Prototype C: Event-pipeline/ECS-lite slice for explosion-to-destruction chain**
   - Purpose: prove maintainable scalability under AI-assisted iteration.
   - Must demonstrate adding a new destruction behavior without touching monolithic engine paths.

## 6) What to keep vs replace

### Keep
- Core product loop concepts already working: launch feel, shell identity direction (BSSDS), objective mode concepts, adaptive quality mindset.
- Config-driven tuning approach in `src/core/config.js`.
- Existing behavior content as authored design source (not as final architecture).

### Refactor
- `src/core/engine.js`: split into domain modules and event pipeline.
- `src/effects/deathBehaviors.js` + `src/shells/registry.js`: preserve behavior intent but route through new orchestration contracts.
- `src/systems/qualitySystem.js`: evolve from frame-time scaler into unified budget controller (render + destruction + behavior density).

### Replace
- Primary rendering implementation in `src/render/renderer.js` for mainline path (replace with GPU-first backend while retaining fallback).
- Direct render-coupled effect assumptions in entity draw/update paths where they block batching.

### Discard
- Any planned “fully realistic” unconstrained destruction experiments that break mobile constraints.
- Ad hoc feature-by-feature cap logic that duplicates budget policy once unified budget manager exists.
- Big-bang replatform attempts that require freezing gameplay evolution.

## 7) Validation plan

### Gameplay checks
- One-session readability test: players can distinguish shell/destruction signatures quickly.
- Objective loop clarity under chaos: pressure, hit quality, and shatter feedback remain understandable.
- Shell identity integrity preserved while adding fragmentation depth.

### Mobile/browser checks
- Device matrix: low/mid/high mobile + desktop browsers.
- Touch input responsiveness and gesture reliability unchanged.
- Reduced-motion path verified end-to-end in new render/destruction stack.

### Performance checks
- Stress scenarios with controlled launch scripts (repeatable densities).
- Track frame-time percentile bands, cap-hit frequency, degradation activation frequency.
- Validate no catastrophic spikes during multi-target shatter chains.

### Maintainability checks
- Measure blast radius: how many files touched to add one new shell behavior or destruction script.
- Enforce module-level ownership (render, gameplay, destruction, budget).
- Require concise module docs for new runtime-vNext contracts.

### AI-assisted workflow checks
- Time-to-change benchmark: add/tune one behavior in old vs new path.
- Defect recovery benchmark: trace and fix one intentionally injected behavior bug.
- Ensure architecture supports localized prompts/edits rather than cross-repo context sprawl.

## 8) 30-day action plan

### Week 1
- Lock seam binding for vNext track and define architecture contracts:
  - renderer adapter
  - event bus/message schema
  - unified budget manager interface
- Create `runtime-vnext` scaffolding with minimal integration risk.

### Week 2
- Implement Prototype A core: GPU particles + shockwaves path.
- Wire quality tiers and reduced-motion fallbacks.
- Build repeatable stress harness scenes (launch pattern presets) for comparisons.

### Week 3
- Extend Prototype A with fragment rendering and post-process readability tuning.
- Start Prototype B authored fragmentation archetypes on current target system.
- Add instrumentation counters for budgets/degradation/cap hits.

### Week 4
- Implement Prototype C explosion→event→destruction slice.
- Compare maintainability and change velocity using one added behavior task.
- Hold gate review using `EVAL_GATES.md` with decision:
  - continue hybrid ship-path,
  - or adjust scope if mobile/perf/readability thresholds are missed.

## 9) Non-goals

- Do not attempt full-engine migration to a heavy desktop-first framework.
- Do not pursue fully realistic physics fracture or recursive unconstrained destruction.
- Do not rewrite all gameplay systems into full ECS in one pass.
- Do not remove Canvas2D fallback before GPU path proves mobile/browser reliability.
- Do not prioritize cosmetic particle count increases over readable chaos and control clarity.

## 10) Leverage assessment

### Why this is the highest-leverage path
- It attacks the true ceiling (render throughput + scalable orchestration + bounded destruction quality) rather than local polish.
- It preserves already-proven design gains (BSSDS, objective/destruction direction).
- It enables bigger future features without repeated architectural debt.

### Larger changes worth the disruption now
- Renderer backbone replacement to GPU-first mainline.
- Engine decomposition into modular event-driven systems.
- Unified budget manager across render/destruction/gameplay effects.
- Targeted ECS-lite adoption for high-churn entities.

### Larger changes not worth it now
- Full immediate rewrite into unrelated external engine stack.
- Universal ECS rewrite across all domains before proving value in hot paths.
- Worker-first restructuring before deterministic data/event contracts exist.

### Fake progress vs real strategic improvement
- **Fake progress:** more shell types/particles layered on current monolith; flashy visual tweaks without architecture/budget advances; benchmark claims without repeatable stress scenarios.
- **Real improvement:** GPU path that holds readability under stress, authored fragmentation that scales safely, modular systems that cut feature implementation blast radius, and validation loops that prove mobile/browser viability.

---

## Blunt answers

1. **What is the single best technical path for Fireworks over the next 3 months?**  
   A **hybrid migration**: build a GPU-first render + ECS-lite/event-driven vNext runtime slice in parallel, then progressively move core gameplay/destruction systems onto it while preserving web-native JS/TS and mobile-safe fallback.

2. **What should be prototyped first to de-risk that path?**  
   First: **GPU renderer vertical slice** for particles/shockwaves/fragments with quality/reduced-motion handling; second: **authored bounded fragmentation pack**; third: **explosion-to-destruction event-pipeline slice**.

3. **Which larger code changes are actually worth making now?**  
   Renderer adapter + GPU backend, engine modular decomposition, unified budget manager, and targeted ECS-lite for high-churn entities.

4. **What would be the highest-cost mistake from here?**  
   A **big-bang heavy migration or uncontrolled rewrite** that degrades mobile/browser performance and iteration velocity before proving the new runtime path with focused prototypes.

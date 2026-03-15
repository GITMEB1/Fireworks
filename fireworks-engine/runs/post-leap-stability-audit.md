# Post-Leap Stability Audit — Runtime vNext / Renderer Evolution

## Problem
After the runtime-vNext + renderer adapter leap (Phase 0/1), we need an evidence-based assessment of what actually landed, what is stable, what is fragile, and what should be reinforced before another bold move.

## Task class
- CODE_AUDIT
- PERFORMANCE_DIAGNOSIS
- IMPLEMENTATION (only if justified)

## Seam binding
- **App composition seam:** `src/app/createFireworksApp.js`
- **Runtime seam:** `src/runtime-vnext/*`
- **Render seam:** `src/render/*`, `src/render-gpu/*`
- **Core simulation seam:** `src/core/engine.js`
- **Quality/performance seam:** `src/systems/qualitySystem.js`

## What the recent leap was supposed to accomplish
From phase reports:
1. Phase 0: establish explicit runtime seams (renderer adapter boundary, runtime events, budget manager) without rewriting gameplay.
2. Phase 1: add a production-runnable WebGL2 prototype lane behind adapter mode selection with Canvas2D fallback, plus adapter-owned frame composition (shake/flash).

## What appears to have actually landed
1. Renderer adapter seam is real and used by app loop (`composeFrame` + `render`).
2. Runtime-vnext composition root exists and injects events + budget hooks into engine.
3. Engine now emits runtime events for explosion/destruction/transient render-related actions.
4. Budget manager is active for particles, shockwaves, and target fragments but not all visual entities.
5. WebGL2 prototype adapter exists with hybrid composition (Canvas2D overlay uploaded each frame + GPU transients pass).
6. Runtime mode selection/fallback metadata is visible via `canvas.dataset` and renderer debug stats.

## Top 5 technical concerns (ranked)

1. **GPU init failure could hard-fail app startup (correctness/stability risk)**
   - Before reinforcement, any WebGL adapter construction throw (shader/program failure, GPU init edge) could escape startup and break mode init path instead of guaranteed fallback.

2. **Hybrid WebGL lane has known per-frame upload cost (performance/mobile risk, prototype debt)**
   - Overlay canvas texture upload every frame (`texImage2D`) plus CPU shockwave triangulation implies mobile bottleneck risk under stress.

3. **Budget ownership remains partial (architecture hole + prototype debt)**
   - runtime budget manager governs some high-cost channels, while glows/smoke/embers still use local cap logic; degradation behavior is therefore not fully unified.

4. **Renderer seam is improved but still not fully consolidated (architecture/prototype debt)**
   - GPU lane still depends on Canvas2D overlay for several systems (targets, embers, shells, UI), so adapter boundary exists but implementation ownership is mixed.

5. **Diagnostic depth is still lightweight for hard perf decisions (stability/process risk)**
   - Useful debug stats exist for mode/fallback/transient vertices, but no bounded warning/telemetry for overload events or upload pressure, limiting confident perf claims.

## Correctness vs risk categorization
- **Correctness issues:** #1
- **Stability risks:** #1, #5
- **Architecture holes:** #3, #4
- **Prototype debt:** #2, #3, #4
- **Performance/readability risks:** #2, #5

## Runtime testing performed

### Startup and mode behavior
- `npm run dev` startup smoke successful.
- Browser runtime baseline (`/`) initializes in `canvas2d-baseline` mode.
- Browser runtime WebGL request (`/?renderer=webgl2`) correctly falls back to `canvas2d-baseline` in this environment (no WebGL2 support) and exposes fallback reason (`webgl2-not-supported`) in `canvas.dataset`.

### Repeated gameplay / dense interactions / destruction-heavy moments
- Automated repeated press-and-release launches and rapid click targeting in baseline mode.
- Same stress input sequence in requested WebGL mode (fallback path active).
- Observed stable runtime operation and continued rendering without startup regressions.

### Reduced-motion-sensitive path
- Browser context with `reduced_motion='reduce'` confirmed reduced-motion media query path active while fallback mode remained stable.

## Deceptively fragile right now
1. WebGL lane “looks safe” due to fallback in common unsupported environments, but prior to reinforcement an exception during adapter creation on supported-but-problematic GPUs could still crash startup.
2. Hybrid render path appears structurally modern but still includes expensive bridge work (Canvas2D overlay upload each frame).
3. Budget/event seams look unified at first glance, but cap ownership remains mixed across spawn lanes.

## What is safe enough to build on now
1. Adapter-driven runtime mode selection and fallback metadata plumbing.
2. Frame composition ownership moved into adapters.
3. Runtime event and budget scaffolding in engine paths for high-impact transient effects.

## What needs reinforcement now
1. **Guarantee fail-safe fallback on any WebGL2 adapter init error** (implemented in this pass; see reinforcement report).
2. Add stronger prototype-lane diagnostics (upload/overload counters) before Phase 2 perf claims.
3. Continue budget ownership migration to unify degradation policy.

## What should explicitly wait
1. Full GPU render port of all scene layers.
2. Off-main-thread simulation/ECS migration.
3. Broad architecture rewrites not tied to immediate stability/perf risks.

## Reinforcement decision
- **Decision:** **B — Apply a small targeted reinforcement pass now.**
- Reason: one concrete correctness/stability hole (WebGL init exception path) had high leverage and low risk to fix immediately.

## Ranked reinforcement priorities (next)
1. Expand fallback hardening to include explicit renderer init diagnostics surfaced in status/debug UI.
2. Instrument hybrid lane upload pressure + transient build cost for mechanism-level perf confidence.
3. Consolidate remaining spawn caps under runtime budget manager.
4. Reduce hybrid composition overhead (move remaining overlay lanes or reduce upload frequency safely).
5. Add lifecycle disposal contracts to renderer adapters for cleaner long-session stability.

## Gate-based decision
- **Gate A (product value):** Prototype value retained; no regression detected in fallback/baseline behavior.
- **Gate B (seam correctness):** Pass (audit and reinforcement stay in app/runtime/render/core seams).
- **Gate C (performance safety):** Prototype-pass with caution; hybrid lane costs remain known risk.
- **Gate D (implementation quality):** Pass; targeted, low-risk reinforcement.
- **Gate E:** **prototype** (ready for controlled next phase, not yet full ship confidence for GPU lane).

## Next step
Proceed with a Phase 2 reinforcement-focused iteration centered on instrumentation + budget unification before broadening GPU feature scope.

# Destructible Targets Pass

## Problem
Targets still read as circular health containers: impacts changed health/urgency, but clears resolved as near-instant disappear events with limited physical aftermath.

## Current target weakness
- Limited target body identity after lethal hits (clear event vs breakup event).
- Hit quality existed, but direct/strong hits did not create materially better destruction feel.
- Readability risk if destruction were added without hard caps and spawn pressure tuning.

## Design chosen
Implemented a **bounded, stateful destructibility path** for objective targets:
- Target state progression: `intact` → `damaged/critical` → `fracturing` → `shattered`.
- Strong/direct impacts can trigger immediate shatter; weaker lethal hits trigger a short fracture window then shatter.
- Shatter spawns authored fragment pieces with directional impulse from impact vector and capped concurrency.
- Objective resolution now binds to **shatter completion** (not plain health-zero deletion), preserving score/pressure loop clarity.

## Seams bound
- **Primary:** Core simulation seam (`src/core/config.js`, `src/core/entities.js`, `src/core/engine.js`).
- **Primary:** Render seam (`src/render/renderer.js`).
- **Out of seam:** no framework rewrite, no audio change, no new game mode loop.

## Files changed
- `src/core/config.js`
- `src/core/entities.js`
- `src/core/engine.js`
- `src/render/renderer.js`
- `fireworks-engine/runs/destructible-targets-pass.md`

## What was implemented
1. Added destruction and fragment tuning knobs in objective config (fracture/shatter thresholds, fragment lifespan/drag/spin, shatter bonus) and hard pool limits for target fragments.
2. Added `PooledTargetFragment` entity with bounded physics:
   - momentum + gravity + drag,
   - bounce damping,
   - fade/size decay over limited lifespan,
   - low-cost polygonal rendering for readable debris silhouettes.
3. Reworked `PooledTarget` into stateful destruction flow:
   - persistent destruction state fields,
   - fracture progression + crack rendering,
   - immediate shatter gate for high-quality hits,
   - delayed shatter for weaker lethal/near-lethal hits.
4. Added engine-side fragment spawn orchestration with strict concurrency budget and quality-scale-aware degradation.
5. Integrated shatter resolution into objective loop:
   - hit feedback distinguishes regular hit vs fracturing vs shatter,
   - score/pressure clear handling now occurs on shatter resolve (`onTargetShattered`),
   - shatter adds dedicated reward bonus while preserving combo/recovery logic.
6. Added render pass for target fragments.
7. Slightly reduced target density (`maxConcurrentTargets`, spawn cooldown, maxTargets) to preserve readability once destruction debris is introduced.

## What was deferred
- Multi-stage recursive fragment-on-fragment breakup.
- Destructibility rollout to additional non-objective entity classes.
- Advanced instrumentation/perf telemetry capture (manual runtime check only this pass).

## Performance/readability guardrails
- Hard pool cap: `LIMITS.maxTargetFragments`.
- Runtime fragment budget scales with quality and remaining fragment capacity.
- Fragment count per shatter is bounded and type-aware.
- Fragment lifetimes are short and auto-cleaned.
- Target spawn density was modestly reduced to keep debris readable under pressure.

## Verification performed
- Static syntax checks on modified modules.
- Local runtime via `http-server` with scripted interactions to observe shatter + fragment behavior.
- Visual artifact captured from live run.

## Gate-based decision
- **Decision:** `prototype`
- **Reason:** Core value is now obvious (targets break into physical fragments with stronger-hit payoff), but exact tuning for all skill bands/device classes still needs short balancing pass to confirm ship confidence.

## Next recommended step
Run a focused tuning pass on:
1. shatter thresholds (`targetFractureThreshold`, `targetShatterThreshold`, `targetCriticalShatterThreshold`),
2. fragment counts/lifetimes under low quality scale,
3. score balance between direct shatter and sustained multi-hit clears.

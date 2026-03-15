# Engine Evolution Phase 0 — Runtime Seam Hardening + vNext Scaffold (Execution)

## Problem
Phase 1–3 work in `engine-evolution-implementation-plan.md` requires explicit runtime boundaries first. Current startup and engine paths were functionally solid but coupled through implicit renderer wiring and local spawn cap checks.

## Phase 0 interpretation
I implemented the smallest structural slice that is real in production startup:
- a renderer adapter contract with a Canvas2D implementation,
- a new `runtime-vnext` scaffold with runtime events + budget interfaces,
- minimal engine integration so explosion/destruction/budget-sensitive paths emit through explicit contracts,
- no behavior rewrite and no GPU migration yet.

## Seam binding
- **App composition seam:** startup now builds runtime-vNext scaffold and injects contracts.
- **Core simulation seam:** engine now routes explosion/destruction + budget-sensitive spawn decisions through explicit interfaces.
- **Render seam:** Canvas2D renderer is now selected through adapter boundary.

## Files touched
- `src/app/createFireworksApp.js`
- `src/core/engine.js`
- `src/systems/resizeSystem.js`
- `src/runtime-vnext/createRuntimeVNext.js`
- `src/runtime-vnext/contracts/runtimeEventTypes.js`
- `src/runtime-vnext/contracts/runtimeEvents.js`
- `src/runtime-vnext/contracts/runtimeBudgetManager.js`
- `src/runtime-vnext/contracts/rendererAdapter.js`
- `src/runtime-vnext/renderers/canvas2dRendererAdapter.js`
- `fireworks-engine/runs/engine-evolution-phase0-execution.md`

## What changed
1. **Renderer adapter boundary (real, live path)**
   - Added `createRendererAdapter` contract.
   - Added Canvas2D adapter that wraps current renderer/background renderer.
   - App now uses `runtimeVNext.rendererAdapter.render(...)` in main loop.

2. **runtime-vnext scaffold introduced**
   - New `src/runtime-vnext/` area with contracts and baseline composition.
   - `createRuntimeVNext(...)` creates:
     - runtime events stream,
     - budget manager,
     - Canvas2D renderer adapter.

3. **Unified event + budget interfaces (Phase 0 scope)**
   - Added explicit event types for:
     - explosion requested/resolved,
     - target damaged/shattered,
     - target fragments spawned,
     - shockwave spawned,
     - flash triggered,
     - budget consumed/denied.
   - Engine now emits these in explosion/destruction/render-transient paths.
   - Budget-sensitive spawn lanes (`particles`, `shockwaves`, `targetFragments`) now route through shared budget manager request hooks.

4. **Startup/playability preserved**
   - Existing Canvas2D renderer remains baseline/fallback.
   - Resize system supports adapter-based resize hooks while remaining backward compatible.
   - No game loop replacement and no feature-level behavior rewrite.

## Verification performed
- Syntax checks:
  - `node --check` for all changed app/core/runtime-vnext files.
- Startup smoke:
  - `npm run dev` (timed run) confirmed server boot path still starts cleanly.

## EVAL_GATES decision
- **Gate A (value):** Prototype infrastructural value (not player-visible yet) but required unlock for next phases.
- **Gate B (seam correctness):** Pass; changes bound to app/core/render seams and new scaffold folder.
- **Gate C (performance safety):** Pass (mechanism-level): no new heavy loops; baseline renderer unchanged.
- **Gate D (implementation quality):** Pass; contracts are explicit and minimal, no broad rewrite.
- **Gate E decision:** **prototype** (foundation lane, ready for Phase 1 prototype work).

## Intentionally deferred to Phase 1+
- GPU/WebGL/WebGPU renderer backend implementation.
- Full event-bus system rollout across all gameplay systems.
- Worker lanes and message transport.
- ECS-lite orchestration decomposition.
- Budget-policy ownership migration into quality system.

## Risks discovered
- Event contracts are currently payload-convention based (no runtime schema validation yet).
- Budget manager currently emits/normalizes limits but does not yet own all caps globally.
- Additional systems still call local cap logic outside the newly integrated channels.

## Recommended exact next Codex task (Phase 1)
Implement a **GPU renderer prototype adapter** at `src/render-gpu/*` and register it behind the existing renderer adapter seam in `runtime-vnext`, with runtime switch/fallback to `canvas2d-baseline`, while preserving reduced-motion and quality-tier degradation parity.

# Hybrid Runtime Reinforcement Pass

## What was audited
- Operating layer and prior evolution artifacts:
  - `AGENTS.md`
  - `fireworks-engine/OPERATING_MODEL.md`
  - `fireworks-engine/SEAM_MAP.md`
  - `fireworks-engine/EVAL_GATES.md`
  - `fireworks-engine/runs/engine-evolution-implementation-plan.md`
  - `fireworks-engine/runs/engine-evolution-phase0-execution.md`
  - `fireworks-engine/runs/engine-evolution-phase1-gpu-prototype.md`
  - `fireworks-engine/runs/post-leap-stability-audit.md`
  - `fireworks-engine/runs/post-leap-reinforcement-pass.md`
- Runtime/render seams inspected:
  - `src/app/createFireworksApp.js`
  - `src/runtime-vnext/*`
  - `src/render-gpu/*`
  - `src/core/engine.js`
  - `src/systems/qualitySystem.js`

## What the recent leap improved
1. Runtime-vNext composition root and renderer adapter seam are live in app startup.
2. Mode preference and fallback metadata are surfaced through canvas dataset fields.
3. Frame composition ownership moved into adapters.
4. WebGL2 prototype lane exists with bounded fallback behavior.

## Top technical holes found
1. **Lifecycle hygiene gap (stability/ownership blocker):** no explicit renderer disposal contract existed, so GPU resources had no clear ownership for teardown.
2. **Hybrid composition prototype debt:** WebGL2 lane still depends on per-frame Canvas2D overlay upload.
3. **Budget ownership split:** budget manager owns only selected channels; glow/smoke/ember caps remain local.
4. **Diagnostics depth gap:** useful mode/fallback counters exist, but limited lifecycle-state diagnostics.
5. **Stress-path ambiguity:** hybrid path can look healthy while hidden resource/lifecycle debt accumulates over long sessions.

## Reinforcement level decision
- **Chosen:** **B — Small targeted reinforcement pass.**
- **Why:** lifecycle ownership was a high-leverage, low-blast-radius correction that directly reduces hybrid fragility without broad architectural churn.

## Reinforcement implemented
### Goal
Close renderer lifecycle ambiguity by introducing explicit adapter disposal semantics and wiring teardown through app lifecycle.

### Files changed
- `src/runtime-vnext/contracts/rendererAdapter.js`
- `src/runtime-vnext/renderers/canvas2dRendererAdapter.js`
- `src/runtime-vnext/renderers/webgl2PrototypeRendererAdapter.js`
- `src/render-gpu/webgl2TransientPipeline.js`
- `src/app/createFireworksApp.js`

### What changed
1. Added optional `dispose` contract to renderer adapters and guarded render calls once disposed.
2. Added disposal state to adapter debug stats (`disposed`) for lifecycle diagnostics.
3. Implemented Canvas2D adapter disposal guard.
4. Implemented WebGL2 adapter disposal to release texture buffer/program resources and dispose transient pipeline resources.
5. Implemented transient pipeline disposal to release shader programs and buffers.
6. Wired app `stop()` to call `renderer.dispose()`.

## Verification performed
- `node --check` on all changed runtime/render/app files.
- `npm run dev` startup smoke.
- Browser-driven runtime checks with repeated interactions for:
  - startup
  - mode selection
  - fallback behavior
  - dense interaction stress
  - reduced-motion mode request path

## What was intentionally left alone
1. No broad migration of non-transient layers from Canvas2D overlay to GPU.
2. No budget-manager expansion into glow/smoke/ember channels in this pass.
3. No new architecture rewrite or worker/ECS refactor.

## Gate-based decision
- **Gate A (product value):** Neutral but meaningful stability reinforcement; protects future iteration velocity.
- **Gate B (seam correctness):** Pass; app/runtime/render seams only.
- **Gate C (performance safety):** Pass; no new per-frame heavy work introduced.
- **Gate D (implementation quality):** Pass; explicit lifecycle contract and bounded changes.
- **Gate E decision:** **prototype** (healthier hybrid base, still with known prototype debt).

## What is now safe to build on
1. Clear renderer lifecycle ownership contract.
2. Deterministic app teardown semantics across baseline and prototype adapters.
3. Better diagnostics of renderer lifecycle state.

## What still remains risky
1. Overlay texture upload per frame in hybrid WebGL lane.
2. Partial budget ownership/degradation consistency across all visual channels.
3. Limited perf telemetry depth for making Phase 2 throughput claims.

## Exact recommended next Codex task
Implement a focused **budget unification + diagnostics pass**:
1. Route glow/smoke/ember spawn caps through runtime budget manager channels.
2. Add bounded runtime counters for denied budget events and hybrid overlay upload pressure.
3. Surface these counters in renderer debug stats/dataset for stress-path decision making.

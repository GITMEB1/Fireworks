# Engine Evolution Phase 1 — GPU-first Renderer Prototype Lane

## Problem
Phase 0 established runtime seams but did not deliver a player-visible GPU rendering win. Phase 1 needed a meaningful, evaluable vertical slice through the new renderer adapter boundary.

## Phase 1 interpretation
I treated Phase 1 as a prototype-first but production-runnable vertical slice:
- keep Canvas2D baseline and fallback intact,
- make WebGL2 selectable at runtime through the existing adapter seam,
- move high-churn transient rendering into GPU path (particles, shockwaves, target fragments),
- shift frame composition effects (shake + flash) into adapter ownership to reduce app-level composition leakage.

## Seam binding
- **Render seam:** `src/runtime-vnext/renderers/*`, new `src/render-gpu/*` GPU lane.
- **App composition seam:** `src/app/createFireworksApp.js` now delegates frame composition state to renderer adapter.
- **Runtime seam:** adapter contract expanded for frame composition ownership.

## Visible GPU prototype slice
### Rendered through WebGL2 lane
- Particle trails as additive line segments with quality/reduced-motion stride degradation.
- Shockwaves as additive ring triangle strips with reduced-motion segment reduction.
- Target fragments as GPU triangles with per-fragment transforms.
- Flash overlay drawn in GPU pass.

### Still drawn via Canvas2D inside GPU lane
- Background and stars.
- Firework shell bodies.
- Targets and embers.
- Charge UI overlays.

This keeps the prototype vertical and player-visible while avoiding a risky full-port.

## Files created/changed
- Created: `src/render-gpu/webgl2TransientPipeline.js`
- Created: `src/runtime-vnext/renderers/frameCompositionController.js`
- Updated: `src/runtime-vnext/renderers/webgl2PrototypeRendererAdapter.js`
- Updated: `src/runtime-vnext/renderers/canvas2dRendererAdapter.js`
- Updated: `src/runtime-vnext/contracts/rendererAdapter.js`
- Updated: `src/runtime-vnext/createRuntimeVNext.js`
- Updated: `src/app/createFireworksApp.js`
- Added report: `fireworks-engine/runs/engine-evolution-phase1-gpu-prototype.md`

## Runtime mode selection
- Default remains `canvas2d-baseline`.
- GPU lane selected with `?renderer=webgl2` or `?renderer=webgl2-prototype`.
- If WebGL2 or overlay setup fails, adapter falls back to Canvas2D and records `fallbackReason`.
- App canvas datasets now expose preferred mode, active mode, GPU initialization state, and transient vertex counters for quick runtime inspection.

## Composition ownership changes
- App loop no longer computes screen shake and flash intensity directly for rendering.
- Renderer adapter now owns frame composition derivation via `composeFrame(...)`.
- This begins closing the Phase 0 composition leak and makes renderer swapping cleaner.

## Basic evaluation hooks added
- `renderer.getDebugStats()` is now part of adapter behavior for lightweight diagnostics.
- WebGL2 prototype reports per-frame transient vertex counts (`particleVertices`, `shockwaveVertices`, `fragmentVertices`).
- App writes renderer diagnostics to `state.runtimeRendererDebug` and mirrored `canvas.dataset` attributes for no-tooling visibility.

## Intentionally deferred
- Full render port (targets, embers, shell sprites, UI overlays entirely in GPU).
- Dedicated bloom/compositor ownership in GPU lane.
- Worker lanes, ECS migration, and event schema hardening.
- WebGPU path.

## Verification performed
- Syntax checks on changed files.
- Startup smoke with dev server.
- Browser validation that both Canvas2D baseline and WebGL2 prototype modes load.
- Visual confirmation screenshot from WebGL2 mode.
- Runtime inspection via `canvas.dataset` and renderer debug stats to verify mode, initialization, fallback behavior, and transient activity counters.

## EVAL_GATES decision
- **Gate A (value):** pass for prototype; player-visible GPU slice in live gameplay.
- **Gate B (seam correctness):** pass; changes are seam-bound to app composition + render seams.
- **Gate C (performance safety):** prototype-pass mechanism-level confidence via quality/reduced-motion degradation hooks.
- **Gate D (implementation quality):** pass; adapter seam remains understandable, fallback retained.
- **Gate E:** **prototype** (ready for expansion in Phase 2).

## Risks discovered
- Uploading overlay canvas texture each frame can become a bottleneck on lower-end mobile GPUs.
- Shockwave triangulation is CPU-built each frame; this should move toward instancing in next phase.
- Hybrid lane (Canvas2D + WebGL2) still has extra compositing overhead.

## Exact recommended next Codex task
Implement **Phase 2: GPU lane expansion + composition consolidation**:
1. Move targets + embers rendering to WebGL2 batches,
2. Replace per-frame shockwave triangulation with instanced ring rendering,
3. Add bounded GPU bloom/composition pass with quality-tier knobs,
4. Remove overlay texture dependency for migrated systems,
5. Keep Canvas2D baseline fallback unchanged.

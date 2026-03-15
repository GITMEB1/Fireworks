# Engine Evolution Phase 1 — GPU-first Renderer Prototype Lane

## Problem
Phase 0 established runtime seams but still left rendering player-visible output fully on Canvas2D. Phase 1 needed a vertical, evaluable GPU prototype path behind the renderer adapter seam.

## Phase 1 interpretation
I treated Phase 1 as: **ship a real WebGL2 renderer lane that renders high-scale transients (particles, shockwaves, target fragments) through `runtime-vnext` adapter selection, while keeping baseline Canvas2D intact and selectable/fallback-safe**.

## Visible GPU slice implemented
When `?renderer=webgl2` is requested and WebGL2 is available:
- GPU lane renders:
  - particle trails (line segments, additive blending, quality-aware stride)
  - shockwaves (ring geometry)
  - target fragments (rotated filled quads)
  - flash overlay as a GPU fullscreen pass
- Canvas overlay pass still renders in a buffered 2D layer for now:
  - background, smoke, glows
  - fireworks, targets, embers
  - charge/HUD overlays

This creates a real vertical slice: core transient action rendering moves to GPU while game remains playable.

## What remains on Canvas2D fallback or Canvas overlay in GPU mode
- Full baseline path remains available as `canvas2d-baseline` (default).
- In GPU mode, non-ported entities/effects still come through the 2D overlay pass until future phases port them.

## Seam binding
- **Render seam:** added concrete WebGL2 renderer adapter and transient GPU draw path.
- **App composition seam:** moved shake/flash composition ownership into renderer adapters (app now passes frame effects as data).
- **Quality/performance seam:** GPU particle rendering uses quality-scale-based stride degradation.

## Files created/changed
- Created: `src/runtime-vnext/renderers/webgl2PrototypeRendererAdapter.js`
- Changed: `src/runtime-vnext/createRuntimeVNext.js`
- Changed: `src/runtime-vnext/renderers/canvas2dRendererAdapter.js`
- Changed: `src/app/createFireworksApp.js`
- Changed: `src/core/config.js`
- Created this report: `fireworks-engine/runs/engine-evolution-phase1-gpu-prototype.md`

## Runtime mode selection
- Default: `canvas2d-baseline`
- GPU request: `?renderer=webgl2` (or `?renderer=webgl2-prototype`)
- Config option: `config.RENDERER.mode`
- If WebGL2 is unavailable or adapter init fails, runtime falls back to Canvas2D and records fallback reason on adapter/canvas dataset.

## Composition ownership changes
- Phase 0 leak: app loop directly translated Canvas2D context for shake and painted flash overlay.
- Phase 1 change: app computes frame effect values and passes them to `rendererAdapter.render(now, engine, frame)`.
- Renderer adapters now own applying shake/flash composition.

## Intentionally deferred
- Full scene GPU port (targets/fireworks/background/postprocessing parity)
- GPU bloom parity with Canvas baseline
- Event-driven render command stream / worker offload
- WebGPU lane
- Formal perf instrumentation and frame-time capture dashboard

## Validation performed
- `node --check` on changed files (syntax validation)
- Startup smoke via `npm run dev`
- Browser checks:
  - default mode resolves to canvas baseline
  - webgl request resolves with fallback reason in this environment (`webgl2-not-supported`)
  - reduced-motion startup still runs
- Screenshot captured from live app run (`?renderer=webgl2`, environment fell back to canvas baseline due no WebGL2 support)

## EVAL_GATES decision
- **Gate A (value):** Pass for prototype; visible render path now includes real GPU transient pipeline design and runtime selector.
- **Gate B (seam correctness):** Pass; app composition + render seams touched intentionally, bounded scope.
- **Gate C (performance safety):** Prototype-safe; quality stride hook added, fallback preserved. True perf gain not yet claimable.
- **Gate D (implementation quality):** Pass as prototype; lane is concrete and end-to-end selectable.
- **Gate E:** **prototype**

## Risks discovered
- Browser container used for validation does not expose WebGL2, so direct visual confirmation of GPU path was not possible there.
- Current GPU mode still composites a 2D overlay texture each frame; this is transitional and may offset perf wins until more of the scene is ported.
- Particle line rendering does not yet fully preserve all Canvas stylistic nuances (e.g., strobe/sparkle richness parity).

## Exact recommended next Codex task (Phase 2)
Implement **Phase 2 — GPU ownership expansion + composition cost reduction**:
1. Port fireworks trails and embers fully into WebGL2.
2. Port target base rendering (including hit flash ring) into WebGL2.
3. Replace per-frame 2D overlay texture upload with split static/dynamic GPU resources (static background texture + dynamic UI/canvas overlay only).
4. Add runtime HUD stat for renderer mode and transient draw counts to compare lane behavior during stress.

# Workstream C — seam integrity

## direct observation baseline
- The repository's physical architecture is strongly directory-seamed: `src/app`, `src/core`, `src/render`, `src/systems`, `src/shells`, `src/effects`, `src/patterns`, and `src/runtime-vnext` are real module boundaries.
- `src/main.js` is thin and `src/app/createFireworksApp.js` acts as the composition root.
- `src/ARCHITECTURE.md` names app, engine, shell, death behavior, pattern, and render seams.
- `fireworks-engine/SEAM_MAP.md` models input, core simulation, render, behavior, audio, quality/performance, and app composition seams.
- The live runtime includes `src/runtime-vnext/*`, which owns renderer selection, events, budgets, fallback, and adapter composition.

## strongest seam

### direct observation
- The behavior seam is physically cohesive: `src/shells/registry.js`, `src/effects/deathBehaviors.js`, and `src/patterns/launchPatterns.js` hold shell families, death choreography, and launch orchestration.
- This seam is explicitly called out in both `src/ARCHITECTURE.md` and `fireworks-engine/SEAM_MAP.md`.
- The shell/effect/pattern modules are extension-friendly and visibly isolated from DOM boot code.

### inference
- **Strongest seam: behavior seam.** It is both documented and structurally real, and it appears usable without broad framework churn.

## weakest documented seam

### direct observation
- `src/runtime-vnext/*` is live in the composition root but absent from `fireworks-engine/SEAM_MAP.md` and `src/ARCHITECTURE.md`.
- `src/app/createFireworksApp.js` depends on runtime-vnext for mode selection, budgets, events, metrics hooks, and renderer adapter wiring.
- The docs still describe app composition and render as if that boundary is simpler than the current code reality.

### inference
- **Weakest documented seam: runtime composition / runtime-vnext seam as documented.** The code seam exists, but the governance model under-documents it, which weakens seam truthfulness.

## most overloaded seam

### direct observation
- `src/core/engine.js` owns a very large share of runtime behavior: pools, launch queueing, shot registration, objective state, scoring, pressure, target spawning, shatter accounting, runtime events, budget requests, fever state, and update orchestration.
- The core simulation seam in `fireworks-engine/SEAM_MAP.md` already warns it is heavily coupled to shell/effect APIs.

### inference
- **Most overloaded seam: core simulation seam, especially `src/core/engine.js`.** It is still the gravity well of gameplay state, scoring, pressure logic, and many coordination responsibilities.

## seam with highest gameplay leverage

### direct observation
- `src/core/config.js` enables the objective loop and exposes dense gameplay economy knobs for pressure, hit quality, combo, shatter, phase timing, target health, and failure.
- `src/core/engine.js` implements objective pressure, scoring, target lifecycle, shot registration, and fail/restart logic.
- `src/render/overlayRenderer.js` makes those objective states visible to the player.

### inference
- **Highest gameplay leverage seam: core simulation seam.** Small changes there materially alter one-session gameplay, reward structure, and retention.

## seam with highest performance sensitivity

### direct observation
- `fireworks-engine/SEAM_MAP.md` identifies render and quality/performance as frame-budget-sensitive seams.
- `src/render/renderer.js` runs dynamic bloom with cadence throttling and load-aware fading.
- `src/systems/qualitySystem.js` adaptively changes quality scale based on frame timing.
- `src/runtime-vnext/contracts/runtimeBudgetManager.js` and runtime-vnext event/budget wiring are live participants in cap enforcement.
- `src/runtime-vnext/renderers/webgl2PrototypeRendererAdapter.js` still uploads the overlay canvas as a texture each frame while mixing Canvas2D overlay rendering with GPU transients.

### inference
- **Highest performance sensitivity seam: render + runtime-vnext boundary.** The performance story now crosses old render code and new adapter/budget code, which the official seam docs do not fully admit.

## seam with most hidden complexity

### direct observation
- `src/runtime-vnext/createRuntimeVNext.js` looks small, but it activates event buses, budget management, renderer selection, fallback logic, and adapter differences.
- `src/app/createFireworksApp.js` stores renderer mode/fallback/debug state on canvas dataset fields and hooks run metrics collection to runtime-vnext events.
- `src/runtime-vnext/renderers/webgl2PrototypeRendererAdapter.js` is explicitly hybrid: background and overlay work still happen on a 2D canvas that is uploaded into WebGL every frame, while transients render on GPU.

### inference
- **Most hidden complexity: runtime-vnext seam.** It is understated in docs but materially shapes architecture, performance behavior, and verification needs.

## seam integrity verdict

### direct observation
- The repo's major seams are real in physical code layout.
- The documented seam map largely matches legacy Canvas2D-era architecture.
- The docs do not fully model the newer runtime-vnext layer that now mediates rendering and performance decisions.

### inference
- Seam integrity is **good but not fully current**.
- The strongest seams are behavior and render submodules.
- The riskiest under-modeled seam is runtime-vnext, because it is already production-relevant in composition but still treated like an implementation detail rather than a first-class architectural seam.

## exact evidence list with file paths
- `fireworks-engine/SEAM_MAP.md`
- `src/ARCHITECTURE.md`
- `src/main.js`
- `src/app/createFireworksApp.js`
- `src/app/appState.js`
- `src/app/runMetricsCollector.js`
- `src/core/config.js`
- `src/core/engine.js`
- `src/core/entities.js`
- `src/render/renderer.js`
- `src/render/overlayRenderer.js`
- `src/systems/qualitySystem.js`
- `src/systems/inputSystem.js`
- `src/systems/audioSystem.js`
- `src/shells/registry.js`
- `src/effects/deathBehaviors.js`
- `src/patterns/launchPatterns.js`
- `src/runtime-vnext/createRuntimeVNext.js`
- `src/runtime-vnext/contracts/rendererAdapter.js`
- `src/runtime-vnext/contracts/runtimeBudgetManager.js`
- `src/runtime-vnext/contracts/runtimeEvents.js`
- `src/runtime-vnext/renderers/canvas2dRendererAdapter.js`
- `src/runtime-vnext/renderers/webgl2PrototypeRendererAdapter.js`

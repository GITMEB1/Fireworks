# Workstream C — Seam integrity audit

## strongest seam
**Behavior seam**

### Direct observation
- `src/shells/registry.js`, `src/effects/deathBehaviors.js`, and `src/patterns/launchPatterns.js` are physically separated modules with distinct responsibilities.
- `src/ARCHITECTURE.md` names those modules as extensibility seams.
- Multiple run artifacts bind work to this seam without needing broad app rewiring (`fireworks-engine/runs/leap-forward-upgrade-plan.md`, `fireworks-engine/runs/bssds-phase1-2-prototype.md`).

## weakest seam
**Audio seam**

### Direct observation
- `src/systems/audioSystem.js` exists, but audio integration is thin relative to other seams.
- Audio is composed centrally in `src/app/createFireworksApp.js` and called from `src/core/engine.js` and `src/effects/deathBehaviors.js`, so ownership is split across app/core/effects.
- The seam map lists audio, but there are few run artifacts centered on it compared with core/render/behavior.

### Inference
- Audio is a real module boundary, but not yet a strong planning seam for iterative work.

## most overloaded seam
**Core simulation seam**

### Direct observation
- `src/core/engine.js` owns state, pools, objective scoring, runtime events, budgets, launch scheduling, target interactions, shot registration, and multiple spawn pathways.
- `src/core/entities.js` contains physics, trail rendering state, target fragments, and config-driven motion behavior.
- Multiple documented opportunities and passes converge on `src/core/engine.js`, indicating it is a frequent convergence point rather than a narrow domain seam.

## seam with highest gameplay leverage
**Core simulation seam**

### Direct observation
- Objective loop, hit-quality scoring, shot outcomes, target pressure, and launch scheduling all live in `src/core/engine.js`.
- Input eventually resolves into engine calls (`src/systems/inputSystem.js` -> `engine.registerShot(...)`, `engine.spawnShellTo(...)`).
- Many high-impact passes target core simulation (`fireworks-engine/runs/objective-loop-mvp-pass.md`, `fireworks-engine/runs/opp-002-dirty-burst-pass.md`, `fireworks-engine/runs/destructible-targets-tuning-pass.md`).

## seam with highest performance sensitivity
**Render seam, closely followed by quality/performance seam**

### Direct observation
- `src/render/renderer.js` contains the dynamic bloom pass, render ordering, and per-frame compositing.
- `src/systems/qualitySystem.js` adjusts adaptive quality every frame based on frame samples.
- `fireworks-engine/runs/flicker-perf-audit.md` and `fireworks-engine/runs/flicker-perf-fix-pass.md` target render plus quality together.

### Inference
- Render is the highest per-frame cost center; quality/perf is the control seam that throttles pressure on the rest of the system.

## seam with most hidden complexity
**App composition seam**

### Direct observation
- `src/app/createFireworksApp.js` wires config, state, audio, runtime-vnext, engine, resize, quality, input, reduced motion, metrics, renderer stats, DOM dataset diagnostics, and loop lifecycle.
- `fireworks-engine/SEAM_MAP.md` describes app composition as broad blast radius, but does not mention runtime-vnext even though the app composition root now depends on it.
- Runtime-vnext contracts, adapters, and budgets are injected from app composition, making the app seam a gateway to multiple systems.

### Inference
- App composition looks small in file count but hides significant cross-seam coupling and upgrade risk.

## evidence list with exact file paths
- `src/ARCHITECTURE.md`
- `src/app/createFireworksApp.js`
- `src/main.js`
- `src/systems/inputSystem.js`
- `src/systems/audioSystem.js`
- `src/systems/qualitySystem.js`
- `src/core/engine.js`
- `src/core/entities.js`
- `src/render/renderer.js`
- `src/render/backgroundRenderer.js`
- `src/render/overlayRenderer.js`
- `src/shells/registry.js`
- `src/effects/deathBehaviors.js`
- `src/patterns/launchPatterns.js`
- `src/runtime-vnext/createRuntimeVNext.js`
- `fireworks-engine/SEAM_MAP.md`
- `fireworks-engine/runs/leap-forward-upgrade-plan.md`
- `fireworks-engine/runs/objective-loop-mvp-pass.md`
- `fireworks-engine/runs/flicker-perf-fix-pass.md`
- `fireworks-engine/runs/post-leap-stability-audit.md`

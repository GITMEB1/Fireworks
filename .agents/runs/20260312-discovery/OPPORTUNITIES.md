# Fireworks Enhancement Opportunities — 2026-03-12

## Quick Wins (High Impact, Low Effort)

### 1. Combo / Fever State System *(Leverage: 2.5)*
- **What:** Track consecutive 'Perfect Charge Supernovas'. Hitting 3 in a row triggers a temporary 'Fever State' (prestige palettes forced, massive spark multipliers).
- **Why now:** Directly addresses the primary retention drop-off by adding a skill mastery / high-score loop.
- **File anchors:** `src/core/engine.js` (state tracking), `src/render/overlayRenderer.js` (UI combo counter).
- **Estimated effort:** Low (~100 lines of logic).

### 2. Orchestrated Multi-Launch Salvos *(Leverage: 2.0)*
- **What:** A gesture or UI button that fires a structured pattern (e.g., a V-shape of 5 shells) instead of a single random launch.
- **Why now:** Reduces "spam clicking" chaos and creates much more satisfying, synchronized visual finales.
- **File anchors:** `src/patterns/launchPatterns.js` (add `fireSalvo` logic).
- **Estimated effort:** Medium (~120 lines).

### 3. New Shell Shapes *(Leverage: 3.0)*
- **What:** Parametrically generated shapes (Heart, Star, Smiley) that explicitly orient themselves upon explosion.
- **Why now:** High visual delight for near-zero architectural risk.
- **File anchors:** `src/shells/registry.js` (add `shellHeart`, `shellStar`).
- **Estimated effort:** Small (< 50 lines).

### 4. Screen Blending Fixes *(Leverage: 3.0)*
- **What:** Change global composite operations so smoke uses `source-over` while flashes use `screen` or `lighter`.
- **Why now:** Prevents the canvas from washing out completely white during rapid fire.
- **File anchors:** `src/render/sceneRenderer.js`.
- **Estimated effort:** Small (< 10 lines).


## Big Bets (High Impact, High Effort)

### 1. Procedural Audio Synthesizer (Web Audio API)
- **What:** Use `OscillatorNode` to procedurally generate rising charge tones, massive bass drops for supernovas, and fizzles.
- **Why now:** Audio is the single most glaring omission in the simulator. Without it, the heavy visual mechanics (shake, dilation) feel hollow.
- **File anchors:** Create new `src/systems/audioSystem.js` tied to `engine.js` events.
- **Estimated effort:** Medium-High (Requires managing AudioContext lifecycle safely).

### 2. OffscreenCanvas Render Threading
- **What:** Move particle rendering loop to a Web Worker via `OffscreenCanvas`.
- **Why now:** Prevents stuttering on lower-end devices during massive Supernova blooms.
- **File anchors:** Heavy async refactoring in `src/app/createFireworksApp.js` and `src/render/renderer.js`.
- **Estimated effort:** High (Complex timing and object transfer logic).


## Deferred / Out of Scope (Fill-ins)

- **Mobile Tilt Controls:** `src/systems/inputSystem.js`. Nice for mobile, but doesn't change core play. Deferred.
- **Persistent Haze Overlay:** `src/render/backgroundRenderer.js`. Good for game feel but risks muddying the screen if not rendered perfectly. Deferred.

# Fireworks Physics & Gameplay Opportunities — 2026-03-12

## Quick Wins (High Impact, Low Effort)

### Overcharge Buffer (The "Dirty Burst")
- **What:** Replace the current hard 100% "fizzle" (which resets the firework) with an unstable, smoky explosion.
- **Why now:** Play-testing identified the 100% fizzle as the #1 source of player frustration and a major engagement drop-off point.
- **File anchors:** `src/systems/inputSystem.js` (handleRelease), `src/shells/registry.js` (add shellSmokyBurst).
- **Estimated effort:** M (~60 lines)

### Supernova Micro-pauses (Hit Stop)
- **What:** Add a 40-60ms pause (frame skip) at the exact moment a Supernova triggers.
- **Why now:** Proven "game feel" technique used by Vlambeer/Nijman to communicate massive power and impact.
- **File anchors:** `src/core/engine.js` (triggerSupernova / update).
- **Estimated effort:** S (<10 lines)

### Dynamic Bloom Filter
- **What:** Use the modern Canvas `filter` API to apply brightness and blur to the particle layer during large bursts.
- **Why now:** Provides a premium "glow" effect that currently requires manual radial gradient management.
- **File anchors:** `src/render/renderer.js` (drawParticles).
- **Estimated effort:** S (~15 lines)

## Big Bets

### Procedural Audio Tension
- **What:** Implement a Web Audio system that uses oscillators to create rising "charge" sounds and impactful "booms".
- **Why now:** Sound is the strongest emotional amplifier in games; the application is currently silent.
- **File anchors:** [NEW] `src/systems/audioSystem.js`, `src/core/engine.js`.
- **Estimated effort:** M (~150 lines)

### Trajectory Prediction Arc
- **What:** Display a dotted parabolic arc during the slingshot charge showing the gravity-affected flight path.
- **Why now:** Shifts gameplay from "guesswork" to "skill-based targeting", depth found in games like Angry Birds.
- **File anchors:** `src/render/overlayRenderer.js`.
- **Estimated effort:** M (~80 lines)

## Deferred / Out of Scope
- **Offscreen Physics Worker:** Too much refactoring for current particle limits; not yet bottlenecked.
- **Tilt-to-Aim:** Novel but restricted by browser sensor permissions and UI complexity.

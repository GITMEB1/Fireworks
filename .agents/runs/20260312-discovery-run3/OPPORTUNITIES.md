# Fireworks Enhancement Opportunities — 2026-03-12

## Quick Wins (High Impact, Low Effort)

### 1. Supernova Micro-Pause (Game Feel 'Sleep')
- **What:** Halt the entire engine update tick for 50-80ms exactly when the Supernova triggers, right before the screen shake, to let the brain anticipate the hit.
- **Why now:** This 'sleep' pattern is a proven game feel trick that massively exaggerates the perceived weight of an impact for virtually zero technical friction.
- **File anchors:** `src/core/engine.js` (inside `triggerSupernova` and the main `update` loop)
- **Estimated effort:** S (< 20 lines)

### 2. Environmental Wind Physics Variation
- **What:** Introduce a slowly interpolating global 'wind' vector that causes particles to drift slightly laterally as they fall.
- **Why now:** Adds organic realism; stops explosions from looking like perfect, sterile math equations by breaking the strict vertical gravity axis.
- **File anchors:** `src/core/engine.js` (apply wind to particle velocities) & `src/core/config.js`
- **Estimated effort:** S (< 40 lines)

### 3. Mobile Multi-Touch Simultaneous Firing
- **What:** Support an array of active pointers, allowing players to tap with multiple fingers at once for an instant massive barrage.
- **Why now:** Highly delightful on mobile/tablets; encourages physical, tactile play which the current single-pointer system unintentionally punishes.
- **File anchors:** `src/systems/inputSystem.js` (`handlePointerDown` and tracking array)
- **Estimated effort:** S (< 50 lines)

---

## Big Bets

### 4. Procedural Audio Synthesizer Engine
- **What:** Integration of Web Audio API (`OscillatorNode`) to generate procedural bass drops for Supernovas, white noise for crackles, and upward sweeping tones for charging.
- **Why now:** The game operates in complete silence; sound is a critical emotional amplifier, and procedural audio adds immense juice without asset bloat.
- **File anchors:** `src/systems/audioSystem.js` (New File) heavily hooked into `src/core/engine.js`
- **Estimated effort:** M (~150-200 lines)

### 5. Trajectory Arc Aiming Mechanic
- **What:** Dragging the mouse while holding down draws a dotted parabola showing the launch arc; releasing fires along that physical trajectory.
- **Why now:** Transforms the interaction from generic clicking to an active 'slingshot' skill game, targeting the retention drop-off moment identified in playtests.
- **File anchors:** `src/systems/inputSystem.js` & `src/render/overlayRenderer.js`
- **Estimated effort:** M/L (~200 lines)

### 6. Global Post-Processing Bloom
- **What:** Draw the completed foreground to an offscreen canvas, apply a strong blur filter via Canvas context filter property, and composite it back over the main scene at 20% opacity.
- **Why now:** Radically increases visual polish, making the fireworks look like true HDR light sources rather than just bright pixels.
- **File anchors:** `src/render/renderer.js`
- **Estimated effort:** M (~80 lines, but needs optimization/quality fallbacks)

---

## Deferred / Out of Scope

- **Stylus Pressure-to-Charge Mapping:** Very cool but far too niche hardware-wise for the amount of effort required to tune it properly.
- **Permanent 'Soot' / Background Decals:** Low effort but also low overall visual impact; risks muddying the background too heavily during rapid fire.

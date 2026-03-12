---
description: Implement the Combo / Fever State System (Opportunity #1)
---

# Feature Implementation: Combo / Fever State System

This workflow guides the implementation of the top opportunity identified for the Fireworks simulator: a Combo & Fever state system that tracks consecutive "Perfect Charges" and rewards the player with a massive, temporary "Fever" mode.

## STAGE 1 — Engine State Updates (`src/core/engine.js`)

**Objective:** Add state tracking for combos and the fever timer.

**Actions:**
1. Use the `replace_file_content` tool on `src/core/engine.js`.
2. Locate the initial `state` object (around line 18) and add:
   - `combo: 0`
   - `feverTimer: 0`
   - `feverDuration: 10000` (10 seconds)
3. Add a new exported function `registerShot(type)` to `engine.js` that:
   - If `type === 'supernova'`, increment `state.combo`.
   - If `type === 'fizzle'` or `type === 'normal'`, reset `state.combo = 0`.
   - If `state.combo >= 3`, trigger Fever State: set `state.feverTimer = state.feverDuration`, reset `state.combo = 0`.
4. Inside the `update(dt)` function in `engine.js`, decrement `state.feverTimer` by `dt` if it's > 0.
5. While `state.feverTimer > 0`, temporarily augment gameplay (e.g., in `spawnParticle`, maybe force sparkling, or in `registry.js` force `prestige = true`). Wait, `prestige` is passed to `createExplosion`. Let's expose an `isFever()` function from the engine. Add `export function isFever() { return state.feverTimer > 0; }`.

## STAGE 2 — Input Integration (`src/systems/inputSystem.js`)

**Objective:** Hook player interactions into the new combo system.

**Actions:**
1. Open `src/systems/inputSystem.js`.
2. Locate the `endInteraction` function where the charge is evaluated.
3. When creating an explosion via `registry.createExplosion`, determine the `type`:
   - If shot was a fizzle (charge >= 1.0): call `engine.registerShot('fizzle')`.
   - If shot was a perfect charge (charge >= 0.95 && charge < 1.0): call `engine.registerShot('supernova')`.
   - If shot was normal (charge < 0.95): call `engine.registerShot('normal')`.

## STAGE 3 — Fever Mechanics (`src/shells/registry.js`)

**Objective:** Make Fever Mode physically distinct.

**Actions:**
1. Open `src/shells/registry.js`.
2. In `createExplosion()`, check if `engine.isFever()` is true.
3. If true, forcibly set `prestige = true` regardless of charge, and choose palettes from the high-end spectrum (e.g., palettes 0, 4, 6).
4. Increase `countMult` and `velMult` by 1.5x during Fever to make all explosions massive.

## STAGE 4 — UI Overlay (`src/render/overlayRenderer.js`)

**Objective:** Give the player aggressive visual feedback on their combo.

**Actions:**
1. Open `src/render/overlayRenderer.js`.
2. Inside `renderOverlay`, read `engine.state.combo` and `engine.state.feverTimer`.
3. If `combo > 0`, draw the text `${combo}x PERFECT` near the top center of the screen. Make it grow slightly with pulse/alpha.
4. If `feverTimer > 0`, draw a massive `FEVER MODE` banner across the screen with additive blending (`globalCompositeOperation = 'lighter'`), pulsating colours, and a countdown bar or fading opacity based on `feverTimer`.

## STAGE 5 — Verification

**Objective:** Prove the feature works and fixes the loop.

**Actions:**
1. Use the `browser_subagent` to playtest:
   - Do 2 normal shots. Verify no combo.
   - Do 1 perfect charge. Verify `1x PERFECT`.
   - Do 1 normal shot. Verify combo resets.
   - Do 3 consecutive perfect charges. Verify `FEVER MODE` activates and limits expand.
2. Ensure no JS errors in the console.

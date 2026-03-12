# Walkthrough: Perfect Charge Supernova Update

This update enhances the Fireworks simulator with a skill-based "Perfect Charge" mechanic and high-impact visual feedback (juiced effects).

## New Features

### 1. The "Sweet Spot" Mechanic
Holding a click now transitions through three distinct charge states:
- **Normal (0-94%):** Standard fireworks.
- **Perfect Charge (95-99%):** The charge indicator turns **White-Hot**. Releasing here triggers a **Supernova**.
- **Overcharge (100%+):** Holding too long kills the charge. The indicator turns dull grey and shrinks. Releasing here results in a **Fizzle**.

### 2. Supernova Visuals
When a Supernova is triggered, several "juice" effects activate simultaneously:
- **Time Dilation:** Global time slows to 0.1x for a brief moment, creating a "hit pause" feel at the apex.
- **Screen Shake:** The entire canvas vibrates violently, giving the explosion physical weight.
- **Color Flash:** A full-screen additive flash of the firework's primary color burns the effect into the background.

### 4. Dynamic Bloom Filter
The visual fidelity has been upgraded with a reactive bloom pass:
- **Reactive Intensity:** The glow intensity scales dynamically based on particle counts and shockwave impacts.
- **Hit Punch:** Supernovas and flash events drive a temporary "over-bloom" that decays naturally, making explosions feel more physical.
- **Adaptive Quality:** The effect automatically adjusts its resolution and blur radius based on the engine's quality scaling to preserve performance.

### 5. The Fizzle Penalty
Overcharged shots launch a projectile that fails to explode properly, emitting only grey smoke and weak sparks, creating a clear risk/reward loop.

## Implementation Details

### Core Engine (`src/core/engine.js`)
- Added `triggerSupernova(color)` to the engine API.
- This function sets global timers in `state` for dilation, shake, and flash.

### Input System (`src/systems/inputSystem.js`)
- Revised `endInteraction` to calculate charge states.
- Replaced the simple charge clamp with logic to branch between `fizzle`, `perfect`, and `normal` shell spawns.

### UI Rendering (`src/render/overlayRenderer.js`)
- Updated `renderChargeVisuals` to provide visual feedback for the new states.
- The "White-Hot" effect increases orbit counts and spark frequency to signal power.

### Renderer (`src/render/renderer.js`)
- Implemented the dynamic bloom pass logic.
- Linked `bloomIntensity` and `blurRadius` to `engine.activeCounts` and `state.flashTimer`.

### Main Loop (`src/app/createFireworksApp.js`)
- Injected time dilation and screen shake logic into the `loop` function.
- Time dilation affects the `engine.update` timestep, while screen shake applies a randomized translation to the `ctx` before rendering.

## Verification
- **Manual Test:** Hold click until the indicator turns white; release for Supernova.
- **Manual Test:** Hold click until the indicator turns grey; release for Fizzle.
- **Manual Test:** Observe the intensified "glow" during large explosions or Supernovas compared to single rocket launches.
- **Manual Test:** Verify that normal clicking still produces standard fireworks.

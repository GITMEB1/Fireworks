# Opportunity Brief: Fireworks Project (Run 2)

**Date:** 2026-03-12
**Focus:** Enhancing the Fever State and Charge Mechanics
**Audience:** Internal Development Team

## 1. Executive Summary
The recent addition of the Perfect Charge mechanics, Combo counter, and Fever State has successfully introduced a visceral, high-intensity visual loop to the Fireworks simulator. However, our play-testing and architectural audit revealed a critical sensory disconnect: the massive visual weight of a "Supernova" or a screaming "Fever Mode" is completely silent. This dramatically blunts the game feel. By addressing this and adding minor tactical embellishments, we can elevate this tech demo into a genuinely satisfying arcade experience.

## 2. Top Recommendation: The Complete Audio-Visual Climax
We strongly recommend greenlighting the **Dynamic Generative Audio System** combined with **The "Fever" Orchestral Crescendo**.

*   **The "Why":** According to benchmarks (Jan Willem Nijman's "Screenshake", Peggle), "Juice" requires multi-sensory feedback. A massive visual explosion without a corresponding deep, bass-heavy audio boom feels hollow.
*   **The "How":** Implementing the Web Audio API to procedurally generate sound (Oscillators, Noise, BiquadFilters) based on payload size and charge time. When Fever Mode hits, the audio system should drastically shift its mixing parameters, kicking off a synthesized, building crescendo that matches the visual chaos.
*   **The ROI:** This is a High Impact/Medium Effort bet that requires zero external assets (we synthesize the sounds) but multiplies the player's perceived reward by a factor of ten.

## 3. Recommended Follow-Up / Quick Win
While the audio system is being built, a dedicated single developer should implement the **"Sparkler" Continuous Drag Stream**.
*   Currently, clicking and holding only charges a single payload. Dragging does nothing. Emitting a low-particle continuous stream of embers while dragging gives the player back immediate tactical agency and provides highly responsive visual feedback during the otherwise 'idle' charge time.

## 4. Architectural Readiness
The codebase (`src/core/engine.js` and `src/core/entities.js`) is highly modular and cleanly handles object pooling and global time scaling. Hooking an `audioSystem.js` into the `registerShot` and particle death events will be straightforward and non-destructive to the current visual rendering pipeline.

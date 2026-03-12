# Comparative Design Benchmarking

## Category A: Particle Simulators
- **tsParticles:** Uses emitters and secondary particle bursts. Key takeaway: "Full compatibility" with legacy configs; performance via pooling (already doing).
- **p5.js Fireworks:** Emphasizes object-oriented structure where each particle manages its own physics (already doing). Takeaway: Sampling background colors for particle variety.

## Category B: Game Feel (Jan Willem Nijman)
- **Screenshake:** Essential for impact.
- **Sleep Effects (Micro-pauses):** 10-60ms pause on hit to emphasize impact.
- **Permanence:** Smoke and debris that stays on screen longer to create "visual history".
- **Audio Depth:** Low-frequency bass for explosions.

## Category C: Charge Mechanics
- **Angry Birds:** Pull-and-release tension. Visual feedback is key to predicting trajectory.
- **Archery:** "Squeeze and release" creates literal tension in the player. Auditory cues (tightening string) help timing.
- **Peggle:** Precision over power. Suggests that aiming is just as important as charging.

## Mechanic Patterns for Fireworks
| Pattern | Complexity | Implementation Fit |
|---|---|---|
| **Micro-pause on Supernova** | Drop-in | Add `state.sleepTimer` check in engine loop. |
| **Charge Tension Sound** | Extend | Oscillators that ramp frequency during charge. |
| **Trajectory Prediction** | Extend | Draw a faint arc during charge/aim. |
| **Atmospheric Resistance** | Architecture | Update drag based on particle velocity/area. |

# Comparative Design Benchmarks

## Category A: Browser Particle Simulators
- **Reference:** tsParticles (modern replacement for particles.js)
- **Pattern 1: WebGL Rendering Pipeline.** Offloading particle math and rendering to the GPU via WebGL to allow tens of thousands of particles without CPU bottlenecking.
  - **Complexity:** Architecture (>200 lines)
- **Pattern 2: Repel/Attract Cursor Interactions.** Particles dynamically reacting to the mouse cursor's proximity (dodging it or swarming it), adding a layer of ambient interaction.
  - **Complexity:** Extend (100-200 lines)

## Category B: "Game Feel" / Juice
- **Reference:** Jan Willem Nijman's "The Art of Screenshake" (Vlambeer talk, INDIGO Classes 2013)
- **Pattern 1: Sleep (Micro-pauses).** Inserting a 50-100ms freeze-frame exactly at the moment of a high-impact event (like the Supernova release) before the screen shake, emphasizing the power of the hit.
  - **Complexity:** Drop-in (<50 lines)
- **Pattern 2: Permanent Debris (Permanence).** Leaving blast marks, lingering smoke layers, or dead particle casings permanently on a background canvas layer to show the chaotic history of the session.
  - **Complexity:** Extend (100-200 lines)

## Category C: Arcade Skill Games w/ Charge Mechanics
- **Reference:** Angry Birds / Peggle game design heuristics
- **Pattern 1: Trajectory Arc Aiming.** Holding the mouse doesn't just charge power, it reveals a physics trajectory arc that the player can aim by dragging, turning mindless clicking into a skill shot.
  - **Complexity:** Architecture (>200 lines)
- **Pattern 2: Escalating Audio Feedback.** A clearly rising Shepard tone or escalating pitch during the charge phase, terminating in a massive bass drop for success or a sad trombone/fizzle for overcharge.
  - **Complexity:** Extend (100-200 lines)

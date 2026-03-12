# Codebase Architecture Audit

| Seam | Current capability | Obvious gap | Effort estimate (S/M/L) |
|---|---|---|---|
| **Core Engine** (`src/core/`) | Manages simulation state, config parameters (exposed vs hidden limits), and entity object pools. | Performance bottleneck at very high limits (iteration over standard objects); lack of worker threading or TypedArrays. | L |
| **Shell Types** (`src/shells/`) | 14 patterns (peony, willow, smiley, ghost, etc.) procedural geometry. | No compound shells (e.g., shell exploding into smaller shells) or user-drawable custom shapes. | M |
| **Effects** (`src/effects/`) | Terminal behaviors (crossette splitting, crackle strobe, ghost fading). | Lack of global post-processing effects (e.g., bloom, chromatic aberration) or sound effect integration on death. | L |
| **Systems** (`src/systems/`) | Input handling, performance quality degradation, resize observing. | No multi-touch for simultaneous multi-fire, no tilt/gyro aiming, no audio system. | M |
| **Rendering** (`src/render/`) | Standard Canvas 2D rendering separated by background, scene, and overlay. | Lacks `OffscreenCanvas` threading; could benefit from CSS Houdini Paint Worklets or Canvas filter optimizations. | L |
| **Orchestration** (`src/patterns/`) | Automated launch timing and patterns. | No music-timeline sequencer or choréography editor. | L |

## Config Analysis (`src/core/config.js`)
- **Exposed (Player-facing):** None are directly exposed to UI currently, but parameters like `gravity`, `CHARGE.maxMultiplier`, `shellWeights` dictate the feel.
- **Hidden (Dev-only):** `LIMITS` (maxParticles, etc.), `QUALITY` auto-degradation thresholds.

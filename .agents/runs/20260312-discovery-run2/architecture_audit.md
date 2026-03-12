# Architecture Audit (Run 2: Post-Fever & Shapes)

| Seam | Current capability | Obvious gap | Effort estimate (S/M/L) |
|---|---|---|---|
| `src/core/` (Engine, Entities, Config) | Robust timestep, object pooling. Tracks charge state, time dilation, combo/fever state. | Missing global audio triggering hooks; no persistent high scores across sessions. | M |
| `src/shells/` (Registry) | Standard styles (peony, willow) plus new parametric shapes (heart, star, smiley). Handles fever forced-prestige. | Composite shells (shapes within rings) or multi-stage sequential explosions (e.g. peony -> crackle delay). | M |
| `src/effects/` (Death Behaviors) | Terminal explosion logic (crossette, ghost, crackle, double break). | Continuous continuous-emit behaviors during flight (e.g. whistling rockets) or terrain collision. | S/M |
| `src/systems/` (Input, Resize) | Pointer tracking, hold-to-charge detection (fizzle, normal, perfect charge). | Multi-touch swipe gestures to trigger specific launch patterns (salvos) or tilt aiming. | M |
| `src/render/` (Scene, Overlay) | Canvas 2D rendering, complex charge indicator UI, pulsing Combo/Fever overlay. | Missing background post-processing (bloom overlay, persistent haze) or Web Worker decoupling (OffscreenCanvas). | L (Bloom: M) |
| `src/patterns/` (Launch Patterns) | Pre-programmed layouts (mirror, fan, finale) queued via delays. | Not directly tied to user input (e.g. clicking 3 fingers doesn't trigger a fan). | S |

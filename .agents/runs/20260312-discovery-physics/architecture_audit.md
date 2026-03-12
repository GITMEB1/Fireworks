# Architecture Audit — Physics & Gameplay Seams

| Seam | Current Capability | Obvious Gap | Effort Estimate (S/M/L) |
|---|---|---|---|
| Engine Config | Static gravity/friction in `CONFIG`. | No wind/atmospheric effects or dynamic gravity shifts. | S |
| Shell Registry | Hand-tuned `drag`, `gravMult`, `velocity` per shell type. | Lack of "heavy" shells or drag that changes with altitude (air density). | M |
| Death Behaviors | Recursive particle spawning (Crossette) or sub-bursts. | Limited reaction-based physics (e.g. force fields, attractors). | L |
| Input System | Click, charge, and trajectory aiming (slingshot). | Lack of multi-touch gestures for physics manipulation. | M |
| Engine Loop | Linear `update` with `timeScale`. | No spatial indexing for complex particle-particle collisions or forces. | L |
| Fever State | 1.5x count/vel multipliers. | No specific physics "personality" unique to Fever (e.g. zero-g). | S |

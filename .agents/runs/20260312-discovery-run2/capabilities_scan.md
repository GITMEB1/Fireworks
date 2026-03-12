# Platform Capability Scan

| Capability | Supported APIs | Potential Use Case in Project | Feasibility (H/M/L) |
|---|---|---|---|
| **Procedural Audio Synthesis** | Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`, `BiquadFilterNode`) | Generative, pitch-scaled explosion and launch sounds based on payload size and charge duration. Enables a synchronized 'hit pause' sound during Fever Mode. | H (High impact, easy to integrate via a simple `AudioSystem` wrapper) |
| **Advanced Post-Processing** | Canvas 2D `ctx.filter` / CSS `filter` on canvas | Applying a global `blur()` and `brightness()` scale during Perfect Charges / Fever Mode to create intense, glowing 'Bloom' effects without drawing extra particles. | M (High visual reward, but requires careful tuning to avoid 60fps frame drops on low-end devices) |
| **Off-Main-Thread Rendering** | `OffscreenCanvas` & Web Workers | Offloading the heavy array updates for thousands of `Particle` entities to a worker, preventing UI thread lockup during massive chain reactions. | M (Requires refactoring `engine.js` state syncing, but guarantees buttery smooth framerates) |
| **Procedural Backgrounds** | CSS Houdini (Paint Worklet) | Drawing dynamic, star-filled night skies or subtle aurora borealis backgrounds behind the primary canvas without taxing the main `requestAnimationFrame` loop. | L/M (Good progressive enhancement, but Safari support can be lagging) |
| **Hardware-Accelerated Shapes** | Canvas 2D `roundRect` and float-array colors | Replacing manual arc or line joins with standard modern primitives to speed up UI overlay drawing (like the Fever Mode banner). | H (Trivial drop-in replacement) |

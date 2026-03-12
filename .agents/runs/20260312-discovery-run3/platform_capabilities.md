# Platform Capability Scan

## 1. Canvas 2D Mesh2D & WebGPU Access
- **Capability:** Upcoming Mesh2D API and Canvas2D<->WebGPU context switching.
- **Status:** In development / Experimental (2025). WebGPU is active.
- **Relevance:** The engine currently iterates over simple JS objects and draws paths/rects via Canvas 2D. Transitioning the core renderer to use WebGPU or the new Mesh2D API would offer orders of magnitude more performance for particle counts. However, it requires a massive rewrite.
- **Browser Support:** [caniuse.com/webgpu](https://caniuse.com/webgpu) (Chrome/Edge/Safari, Firefox experimental).
- **Opportunity:** Track for future architecture rewrite, out of scope for quick wins.

## 2. Web Audio API (Procedural Sound)
- **Capability:** Procedural, real-time audio generation using `AudioContext` and `OscillatorNode` (no external asset downloads).
- **Status:** Mature, widely supported.
- **Relevance:** The game has ZERO audio currently. Implementing a procedural audio synthesizer engine to generate explosions, crackle pops (noise), and heavy bass drops on supernova would radically increase the "game feel" index.
- **Browser Support:** [caniuse.com/audio-api](https://caniuse.com/audio-api) (100% modern support).
- **Opportunity:** High-value `Extend` opportunity (create `src/systems/audioSystem.js`).

## 3. CSS Houdini Paint Worklet
- **Capability:** Off-thread procedural background rendering using a Canvas-like API within CSS properties.
- **Status:** Supported in Chrome/Edge, partial in Safari/Firefox.
- **Relevance:** `src/render/backgroundRenderer.js` currently draws gradients on the main canvas thread. Offloading this to a CSS Houdini Paint Worklet could slightly free up main-thread frame budget for more particles.
- **Browser Support:** [caniuse.com/css-paint-api](https://caniuse.com/css-paint-api)
- **Opportunity:** Low-effort technical optimization.

## 4. PointerEvents API (Pressure & Tilt)
- **Capability:** Accessing hardware stylus/touch pressure and tilt.
- **Status:** Excellent support across all modern browsers and stylus hardware.
- **Relevance:** Instead of relying purely on *time* to charge the supernova, we could use *pressure* on supported devices. Pressing harder instantly charges the explosion.
- **Browser Support:** [caniuse.com/pointer](https://caniuse.com/pointer)
- **Opportunity:** Niche but "wow" factor mechanic for mobile/tablet.

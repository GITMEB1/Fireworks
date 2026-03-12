# Platform Capability Scan

## Capability 1: OffscreenCanvas & Web Workers
- **Relevance:** The current Fireworks implementation renders everything on the main thread via `requestAnimationFrame` in `src/renderer.js` and `src/app/createFireworksApp.js`. During the "Rapid Fire" playtest (Test E), the scene becomes chaotic, and `QUALITY` step-downs heavily reduce detail to maintain FPS.
- **Opportunity:** Offloading the `sceneRenderer.js` drawing operations to a Web Worker using `OffscreenCanvas`. This frees the main thread to handle input and complex engine state updates without blocking the render.
- **Browser Support:** Universally supported across modern browsers (Chrome, Edge, Firefox, Safari) in 2024/2025.
- **Conclusion:** High-value target for rendering optimisation.

## Capability 2: Web Audio API (OscillatorNode & AudioWorklet)
- **Relevance:** The playtest (Stage 2) identified a critical lack of audio feedback, making the "Perfect Charge Supernova" feel hollow despite massive visual effects (time dilation, screen shake).
- **Opportunity:** Implementing a procedural audio synthesizer using `OscillatorNode` (for bass drops and launch whistles) or an `AudioWorklet` for complex crackle/fizzle sounds without needing to load heavy .mp3 assets.
- **Browser Support:** `OscillatorNode` is deeply established. `AudioWorklet` is the modern standard for glitch-free low-latency audio processing off the main UI thread.
- **Conclusion:** Core missing feature. High priority for immediate inclusion.

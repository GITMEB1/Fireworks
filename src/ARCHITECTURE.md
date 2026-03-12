# Fireworks Architecture Notes

## Runtime boundary
- `createFireworksApp(...)` is the app entrypoint.
- DOM-specific setup (canvas/context/elements/events) is isolated in app and systems modules.

## Engine boundary
- `src/core/engine.js` owns simulation state transitions, pool lifecycle, and launch scheduling.
- Effects and shells interact through explicit engine APIs (`spawnParticle`, `spawnGlow`, etc.).

## Extensibility seams
- Shell behaviors are organized in `src/shells/registry.js` and selected by type.
- Death behaviors are isolated in `src/effects/deathBehaviors.js`.
- Launch orchestration is isolated in `src/patterns/launchPatterns.js`.
- Rendering is split into background, scene, and overlay renderers in `src/render/*`.

## Package extraction readiness
- Core engine logic has no direct dependency on DOM nodes.
- Rendering and input are separate layers that can be swapped or extracted.

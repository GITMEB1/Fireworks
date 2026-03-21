# Fireworks Architecture Notes

## Runtime boundary
- `createFireworksApp(...)` is the app entrypoint.
- DOM-specific setup (canvas/context/elements/events) is isolated in app and systems modules.
- Runtime profile selection now happens in app composition so high-end mobile can diverge intentionally from desktop defaults (quality floor, DPR cap, premium render tuning) without forking the core engine.

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

## Validation boundary
- Deterministic calibration now runs repo-locally through `src/app/calibration/*` with real `src/core/engine.js` objective logic and `src/app/runMetricsCollector.js` telemetry.
- Browser debug hooks remain available, but they are secondary to the seeded repo-local runner for balance and telemetry validation.
- runtime-vnext events/budgets are shared by both browser runtime and headless calibration so balance reports use the same outcome/budget surfaces.
- The calibration lane now includes a dedicated `high-end-mobile-premium` profile scenario, but it remains truthful about scope: it validates gameplay/telemetry under those assumptions, not subjective render feel on physical devices.

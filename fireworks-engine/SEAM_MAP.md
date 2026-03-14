# Fireworks Seam Map

This map binds enhancement work to actual repository seams.

## Input seam
- **Primary files:** `src/systems/inputSystem.js`, `src/app/createFireworksApp.js`.
- **Change types:** gesture/charge behavior, launch controls, affordances, mobile interactions.
- **Risks/dependencies:** can alter core loop pacing; depends on app state fields and engine launch APIs.

## Core simulation seam
- **Primary files:** `src/core/engine.js`, `src/core/entities.js`, `src/core/config.js`, `src/core/utils.js`.
- **Change types:** physics, pooling, lifecycle rules, tunables, gameplay state machine.
- **Risks/dependencies:** performance and determinism sensitive; heavily coupled to shell/effect APIs.

## Render seam
- **Primary files:** `src/render/renderer.js`, `src/render/backgroundRenderer.js`, `src/render/overlayRenderer.js`, `src/core/context2d.js`.
- **Change types:** scene composition, glow/flash treatment, HUD/feedback readability.
- **Risks/dependencies:** frame budget pressure; needs compatibility with reduced motion and quality scaling.

## Behavior seam
- **Primary files:** `src/shells/registry.js`, `src/effects/deathBehaviors.js`, `src/patterns/launchPatterns.js`.
- **Change types:** shell archetypes, death choreography, launch patterns, burst signatures.
- **Risks/dependencies:** can explode particle counts quickly; may require config and quality guardrail updates.

## Audio seam
- **Primary files:** `src/systems/audioSystem.js`, integration in `src/app/createFireworksApp.js`, engine calls in `src/core/engine.js`.
- **Change types:** charge/explosion sound design, mixing policies, mute and mobile-safe initiation.
- **Risks/dependencies:** browser autoplay restrictions, CPU overhead, accessibility/motion preferences.

## Quality/performance seam
- **Primary files:** `src/systems/qualitySystem.js`, `src/systems/motionPreferenceSystem.js`, `src/core/config.js`, hot loops in `src/core/entities.js`.
- **Change types:** adaptive quality, caps, reduced-motion compatibility, perf fallbacks.
- **Risks/dependencies:** tradeoff between spectacle and smoothness; impacts every other seam.

## App composition seam
- **Primary files:** `src/main.js`, `src/app/createFireworksApp.js`, `src/app/appState.js`, `index.html`.
- **Change types:** bootstrapping, state wiring, lifecycle, DOM contracts.
- **Risks/dependencies:** broad blast radius; errors here can block entire app startup.

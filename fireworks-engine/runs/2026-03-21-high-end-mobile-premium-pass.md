# High-End Mobile Premium Pass — 2026-03-21

## Problem
Capable phones/tablets still behaved mostly like constrained desktop defaults: no first-class runtime profile, generic DPR handling, limited premium-target readability differentiation, and no deterministic high-end-mobile validation scenario. Pressure engagement was also too soft to make scenario comparisons trustworthy.

## Seam binding
- App composition: `src/app/createFireworksApp.js`, `src/app/appState.js`, `src/app/runtimeProfiles.js`, `src/app/runMetricsCollector.js`
- Quality/perf: `src/systems/resizeSystem.js`, `src/runtime-vnext/contracts/runtimeBudgetManager.js`, `src/core/config.js`
- Render/readability: `src/render/backgroundRenderer.js`, `src/render/renderer.js`, `src/render/overlayRenderer.js`, `src/core/entities.js`
- Core simulation: `src/core/engine.js`
- Calibration/truthfulness: `src/app/calibration/*`, `scripts/run-deterministic-calibration.mjs`, `.github/workflows/validation.yml`
- Docs/artifacts: `src/ARCHITECTURE.md`, `fireworks-engine/README.md`, `fireworks-engine/EVAL_GATES.md`, `fireworks-engine/runs/*`

## Files touched
- `src/app/runtimeProfiles.js`
- `src/app/createFireworksApp.js`
- `src/app/appState.js`
- `src/app/runMetricsCollector.js`
- `src/core/config.js`
- `src/core/engine.js`
- `src/core/entities.js`
- `src/render/backgroundRenderer.js`
- `src/render/renderer.js`
- `src/render/overlayRenderer.js`
- `src/systems/resizeSystem.js`
- `src/runtime-vnext/contracts/runtimeBudgetManager.js`
- `src/app/calibration/scenarioMatrix.js`
- `src/app/calibration/createHeadlessCalibrationHarness.js`
- `src/app/calibration/analyzeCalibrationResults.js`
- `scripts/run-deterministic-calibration.mjs`
- `.github/workflows/validation.yml`
- `src/ARCHITECTURE.md`
- `fireworks-engine/README.md`
- `fireworks-engine/EVAL_GATES.md`
- `fireworks-engine/runs/2026-03-21-high-end-mobile-next-leap-decision.md`
- `fireworks-engine/runs/2026-03-21-deterministic-calibration-data.json`
- `fireworks-engine/runs/2026-03-21-deterministic-calibration-pass.md`
- `fireworks-engine/runs/2026-03-21-deterministic-calibration-manifest.json`
- `fireworks-engine/runs/latest-deterministic-calibration-data.json`
- `fireworks-engine/runs/latest-deterministic-calibration-pass.md`
- `fireworks-engine/runs/latest-deterministic-calibration-manifest.json`

## What changed
1. Added explicit runtime profile selection with a dedicated `high-end-mobile-premium` path plus a `mobile-balanced` fallback.
2. Raised capable-mobile presentation quality via DPR cap headroom, richer sky/backdrop treatment, stronger bloom/charge tuning, target halo/glyph readability, and compact HUD handling on narrow screens.
3. Routed more premium-effect channels through runtime budgets (`glows`, `smokes`, `embers`) so telemetry is more honest about premium render stress.
4. Expanded deterministic calibration to include `high-end-mobile-premium`, emit runtime-profile metadata, and generate a manifest that states truthful validation scope.
5. Tightened CI artifact naming/upload behavior and updated docs to reflect that deterministic validation covers gameplay/telemetry under profile assumptions, not subjective device feel.
6. Retuned objective pressure upward so scenario comparisons are no longer blocked by uniformly under-engaged runs.

## Verification performed
- `npm run validate`
- `node --input-type=module -e "import('./src/app/createFireworksApp.js'); import('./src/app/calibration/createHeadlessCalibrationHarness.js'); import('./src/render/backgroundRenderer.js'); console.log('module-import-ok')"`
- `git diff --check`

## Gate-based decision
`ship`

## Next step
Run a physical-device observation pass on at least one capable phone/tablet to judge subjective premium feel, live touch ergonomics, and any browser-specific GPU upload pressure that the deterministic lane intentionally does not claim to validate.

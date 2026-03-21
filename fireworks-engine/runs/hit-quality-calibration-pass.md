# Hit-Quality Calibration Pass

## Problem
Review the captured scenario-based calibration pass and per-run logging so hit-quality/reward balance can be discussed with explicit attribution, while staying honest about the current automation limits.

## Seam binding
- `src/runtime-vnext/contracts/runtimeEventTypes.js`
- `src/core/engine.js`
- `src/app/createFireworksApp.js`
- `src/app/runMetricsCollector.js`
- `src/main.js`
- `fireworks-engine/runs/*` artifacts

## Files touched
- `src/runtime-vnext/contracts/runtimeEventTypes.js`
- `src/core/engine.js`
- `src/app/createFireworksApp.js`
- `src/app/runMetricsCollector.js`
- `src/main.js`
- `fireworks-engine/runs/hit-quality-calibration-data.json`
- `fireworks-engine/runs/hit-quality-calibration-pass.md`

## Schema used
Per-run record fields:
- `scenarioId`, `runId`, `timestamp`
- `totalScore`
- `baseHitScore`, `directBonusScore`, `clearScore`, `shatterBonusScore`, `perfectBonusScore`
- `directHits`, `normalHits`, `glancingHits`
- `shatterCount`, `avgShatterPower`
- `dirtyShotCount`
- `targetExpiryCount`, `priorityExpiryCount`
- `pressurePeak`, `outcome`
- `avgQualityScale`, `budgetDeniedByChannel`

## What changed
1. Added objective-run lifecycle and metrics emission in `engine` without changing gameplay resolution logic.
2. Added runtime events for shot registration, target expiry, run reset, and run end.
3. Added app-level run metrics collector that subscribes to runtime events and exports stable JSON.
4. Exposed intentional app/calibration debug hooks on `window` for browser-driven inspection and calibration control.

## Scenario matrix and protocol
Target matrix:
1. desktop high quality
2. reduced motion
3. low-end emulation

Observed protocol in the captured pass:
- 10 runs per attempted scenario
- browser-driven stop/reset sequencing aimed at consistent collection
- one run record emitted per explicit run end in the captured desktop dataset

Limits on reproducibility:
- no deterministic in-repo calibration runner is present in this checkout
- the captured pass depends on external browser automation and exposed debug hooks rather than a reviewable repo-local harness

## Aggregate results
### Desktop high quality (n=10)
- mean/median total score: `0 / 0`
- mean/median hit-quality counts (direct/normal/glancing): `0/0/0` and `0/0/0`
- mean/median score buckets:
  - base hit: `0 / 0`
  - direct bonus: `0 / 0`
  - clear: `0 / 0`
  - shatter bonus: `0 / 0`
  - perfect bonus: `0 / 0`
- recorded outcomes in captured data: `10 survive labels`, but these came from pre-fix forced-finalization/reset sequencing in the collector/control flow and should not be read as true successful survives
- mean/median pressure peak: `18 / 18`
- mean/median avg quality scale: `0.7953 / 0.76`

### Reduced motion
Blocked by browser-container instability (`SIGSEGV`) while launching follow-up Playwright sessions after initial capture pass.

### Low-end emulation
Blocked by same browser-container instability in follow-up full extraction pass.

## Pass/fail balance bands (predefined)
These were set before retune decision:
- Hit-quality signal present: mean total hits per run >= 3.
- Score attribution present: at least 2 non-zero score buckets in scenario aggregate.
- Pressure engagement: mean pressure peak >= 30 or fail rate between 5% and 45%.

## Decision and retune
- Band outcome: **fail** (desktop sample had no hit/score signal).
- Retune applied: **none** (blocked signal quality; tuning now would be blind).
- Gate decision: **prototype**.

## Verification performed
- Static review of the captured artifact, related source paths, and collector/event plumbing.
- Record completeness check: one record per run end in captured desktop dataset.
- No deterministic in-repo harness was available to re-run the matrix in this cleanup pass.

## Uncertainty and risks
- Scenario matrix is incomplete (only desktop fully captured in artifact file).
- Captured desktop runs show no objective interaction signal under current automation protocol.
- Balance conclusions are therefore low-confidence and not ship-grade.

## Next step (one action)
Create a deterministic in-repo calibration runner that drives objective interactions through engine seam (no external browser dependency), then rerun full 3-scenario x10 matrix and regenerate this report.

## Gate verdict
`prototype`

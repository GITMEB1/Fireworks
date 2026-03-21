# Deterministic Calibration Pass

## Problem
Replace fragile browser-driven calibration with a deterministic repo-local runner that exercises the real objective, hit-quality, pressure, and budget telemetry seams.

## Seam binding
- `src/app/calibration/*`
- `src/app/runMetricsCollector.js`
- `src/app/appState.js`
- `src/core/engine.js`
- `src/core/deterministicRandom.js`
- `src/runtime-vnext/contracts/*`
- `scripts/run-deterministic-calibration.mjs`
- `package.json`
- `.github/workflows/*`

## What changed
1. Added a seeded deterministic calibration harness that runs against the real engine/objective logic without browser automation.
2. Promoted calibration output to durable repo artifacts (`json` + markdown report).
3. Added package/CI wiring so the repo has an executable validation lane instead of documentation-only process.
4. Tightened objective-run finalization semantics so deterministic runs can end as `survive`, `fail`, or `aborted` without collector hacks.

## Scenario matrix
- Runs per scenario: 10
- **desktop-high-quality** — Desktop baseline with full quality and reduced motion disabled.
- **reduced-motion** — Reduced-motion path with quality clamped to the runtime reduced-motion scale.
- **low-end-emulation** — Fixed low-end emulation with constrained quality scale and slightly noisier execution.

## Aggregate results
### desktop-high-quality (status: fail)
- run count: 10
- mean total score: 13026.80
- mean pressure peak: 20.35
- mean hits per run: 61.50
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=11849, direct=3408, clear=83958, shatter=21168, perfect=9885
- hit totals: direct=355, normal=189, glancing=71
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=false

### reduced-motion (status: fail)
- run count: 10
- mean total score: 12961.40
- mean pressure peak: 21.73
- mean hits per run: 62.90
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=11446, direct=2946, clear=84300, shatter=20905, perfect=10017
- hit totals: direct=313, normal=224, glancing=92
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=false

### low-end-emulation (status: fail)
- run count: 10
- mean total score: 12082.00
- mean pressure peak: 22.60
- mean hits per run: 66.70
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=10711, direct=2958, clear=80610, shatter=19749, perfect=6792
- hit totals: direct=320, normal=226, glancing=121
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=false

## Verification performed
- Ran the deterministic scenario matrix in-repo through the engine seam.
- Wrote structured data for later diff/review.
- Evaluated explicit balance bands per scenario.

## Artifacts
- Dated data: fireworks-engine/runs/2026-03-21-deterministic-calibration-data.json
- Records captured: 30

## Gate decision
`defer`

## Next step
Retune objective/hit-quality values against the deterministic distributions before expanding gameplay scope.

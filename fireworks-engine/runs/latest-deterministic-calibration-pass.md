# Deterministic Calibration Pass

## Problem
Replace fragile browser-driven calibration with a deterministic repo-local runner that exercises the real objective, hit-quality, pressure, and budget telemetry seams while explicitly covering the premium high-end mobile profile.

## Truthful scope
- Validates: Objective pressure, score attribution, hit-quality distributions, and runtime budget denials under deterministic profile assumptions.
- Validates: Profile-specific quality-scale behavior and telemetry output.
- Does not validate: Subjective premium render feel, browser GPU upload cost, or live touch ergonomics.
- Does not validate: Exact frame-time performance on physical devices.

## Seam binding
- `src/app/calibration/*`
- `src/app/runMetricsCollector.js`
- `src/app/runtimeProfiles.js`
- `src/app/appState.js`
- `src/core/engine.js`
- `src/core/config.js`
- `src/runtime-vnext/contracts/*`
- `scripts/run-deterministic-calibration.mjs`
- `package.json`
- `.github/workflows/*`

## Artifact metadata
- generated at: 2026-03-21T19:41:19.398Z
- source revision: 6ea0ac3095c8739f30d6737ced3f16b3c67acc11
- manifest: fireworks-engine/runs/2026-03-21-deterministic-calibration-manifest.json

## Scenario matrix
- Runs per scenario: 10
- **desktop-high-quality** (desktop-default) — Desktop baseline with full quality and reduced motion disabled.
- **high-end-mobile-premium** (high-end-mobile-premium) — Capable phone/tablet profile with DPR 3 headroom, premium render tuning, and tighter touch-first tension.
- **reduced-motion** (mobile-balanced) — Reduced-motion path with quality clamped to the runtime reduced-motion scale.
- **low-end-emulation** (mobile-balanced) — Fixed low-end emulation with constrained quality scale and slightly noisier execution.

## Aggregate results
### desktop-high-quality (desktop-default, status: pass)
- run count: 10
- mean total score: 15599.00
- mean pressure peak: 30.01
- mean quality scale: 1.000
- mean hits per run: 71.00
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=13783, direct=3876, clear=100356, shatter=25066, perfect=12909
- hit totals: direct=402, normal=236, glancing=72
- budget denials: none
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=true

### high-end-mobile-premium (high-end-mobile-premium, status: pass)
- run count: 10
- mean total score: 16787.20
- mean pressure peak: 32.56
- mean quality scale: 0.960
- mean hits per run: 79.60
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=15172, direct=3928, clear=108048, shatter=26978, perfect=13746
- hit totals: direct=417, normal=258, glancing=121
- budget denials: none
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=true

### reduced-motion (mobile-balanced, status: pass)
- run count: 10
- mean total score: 15109.90
- mean pressure peak: 36.12
- mean quality scale: 0.720
- mean hits per run: 73.80
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=13491, direct=3578, clear=98460, shatter=24482, perfect=11088
- hit totals: direct=380, normal=247, glancing=111
- budget denials: none
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=true

### low-end-emulation (mobile-balanced, status: pass)
- run count: 10
- mean total score: 14583.20
- mean pressure peak: 33.83
- mean quality scale: 0.620
- mean hits per run: 76.60
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=12430, direct=3458, clear=99066, shatter=24323, perfect=6555
- hit totals: direct=371, normal=269, glancing=126
- budget denials: none
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=true

## Verification performed
- Ran the deterministic scenario matrix in-repo through the engine seam.
- Wrote structured data, markdown, and manifest artifacts for review.
- Evaluated explicit balance bands per scenario, including a premium high-end mobile profile.

## Artifacts
- Dated data: fireworks-engine/runs/2026-03-21-deterministic-calibration-data.json
- Records captured: 40

## Gate decision
`ship`

## Next step
Use this runner as the default gameplay-validation lane, then follow with physical-device visual/perf observation for the premium mobile profile.

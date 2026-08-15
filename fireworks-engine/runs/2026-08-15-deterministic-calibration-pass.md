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
- generated at: 2026-08-15T15:33:00.593Z
- source revision: d27c17ec564384c74bf36e4ff31320ed806c4157
- manifest: fireworks-engine/runs/2026-08-15-deterministic-calibration-manifest.json

## Scenario matrix
- Runs per scenario: 10
- **desktop-high-quality** (desktop-default) — Desktop baseline with full quality and reduced motion disabled.
- **high-end-mobile-premium** (high-end-mobile-premium) — Capable phone/tablet profile with DPR 3 headroom, premium render tuning, and tighter touch-first tension.
- **reduced-motion** (mobile-balanced) — Reduced-motion path with quality clamped to the runtime reduced-motion scale.
- **low-end-emulation** (mobile-balanced) — Fixed low-end emulation with constrained quality scale and slightly noisier execution.

## Aggregate results
### desktop-high-quality (desktop-default, status: fail)
- run count: 10
- mean total score: 14282.40
- mean pressure peak: 29.01
- mean quality scale: 1.000
- mean hits per run: 65.90
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=12656, direct=3384, clear=91128, shatter=22843, perfect=12813
- hit totals: direct=354, normal=227, glancing=78
- budget denials: none
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=false

### high-end-mobile-premium (high-end-mobile-premium, status: fail)
- run count: 10
- mean total score: 15101.40
- mean pressure peak: 29.32
- mean quality scale: 0.960
- mean hits per run: 73.10
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=13645, direct=3532, clear=98652, shatter=24556, perfect=10629
- hit totals: direct=376, normal=241, glancing=114
- budget denials: none
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=false

### reduced-motion (mobile-balanced, status: pass)
- run count: 10
- mean total score: 13629.20
- mean pressure peak: 30.58
- mean quality scale: 0.720
- mean hits per run: 69.10
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=12322, direct=3314, clear=89676, shatter=22307, perfect=8673
- hit totals: direct=353, normal=230, glancing=108
- budget denials: none
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=true

### low-end-emulation (mobile-balanced, status: fail)
- run count: 10
- mean total score: 13700.00
- mean pressure peak: 29.57
- mean quality scale: 0.620
- mean hits per run: 70.90
- fail rate: 0.0%
- non-zero score buckets: 5
- score buckets totals: base=11585, direct=3174, clear=92496, shatter=22674, perfect=7071
- hit totals: direct=341, normal=250, glancing=118
- budget denials: none
- band checks: hitSignal=true, scoreAttribution=true, pressureEngagement=false

## Verification performed
- Ran the deterministic scenario matrix in-repo through the engine seam.
- Wrote structured data, markdown, and manifest artifacts for review.
- Evaluated explicit balance bands per scenario, including a premium high-end mobile profile.

## Artifacts
- Dated data: fireworks-engine/runs/2026-08-15-deterministic-calibration-data.json
- Records captured: 40

## Gate decision
`prototype`

## Next step
Continue retuning objective pressure/profile assumptions or observe the premium mobile path on hardware before widening the visual scope further.

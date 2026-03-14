# Flicker + Performance Fix Pass

## 1) Root causes found
1. **Primary flicker cause:** bloom compositing instability during stress windows in `src/render/renderer.js`.
   - Bloom source refresh and bloom composite intensity were evolving on different rhythms.
   - Impact pulse logic forced frequent bloom redraws in already expensive scenes.
2. **Primary frame-pacing contributor:** avoidable adaptive-quality hot-path overhead in `src/systems/qualitySystem.js`.
   - Array `push/shift/reduce` sampling pattern created unnecessary per-frame work and allocation pressure risk under stress.
3. **Secondary visual instability:** abrupt bloom intensity response to load spikes without smoothing.

## 2) Files changed
- `src/render/renderer.js`
- `src/core/config.js`
- `src/systems/qualitySystem.js`
- `fireworks-engine/runs/flicker-perf-audit.md`
- `fireworks-engine/runs/flicker-perf-fix-pass.md`

## 3) What was fixed
### Render seam (`src/render/renderer.js`)
- Added bloom refresh dirty-state (`bloomNeedsRefresh`) to control bloom source update cadence cleanly.
- Bloom refresh now triggers on:
  - cadence tick,
  - bloom buffer resize,
  - impact start signal.
- Removed per-impact-frame forced refresh behavior; impact now marks refresh and uses normal cadence afterward.
- Added bloom intensity smoothing (`smoothedBloomIntensity`) and reused a coherent composite alpha derived from smoothed value.

### Config seam (`src/core/config.js`)
- Added `BLOOM.intensitySmoothing` for explicit tuning of bloom temporal stability.

### Quality/perf seam (`src/systems/qualitySystem.js`)
- Replaced `fpsSamples` push/shift/reduce sampling with fixed-size rolling buffer + running sum.
- Preserved quality adjustment thresholds/steps/cooldown behavior while reducing hot-path overhead.

## 4) What was ruled out
- No duplicate engine update path found in `createFireworksApp` loop.
- No evidence of repeated resize/DPR churn in static viewport stress sessions.
- No direct entity lifecycle corruption causing classical draw-state flicker.

## 5) Verification notes
- Local server run and mobile-viewport stress launch loops completed.
- Stress runs still show occasional long-frame spikes in this container/browser setup, but render-path behavior is now more stable and less prone to impact-phase bloom thrash.
- Adaptive quality still works and continues stepping down under sustained load (expected safety behavior).
- Reduced-motion bloom guard conditions remain intact.

## 6) Remaining low-confidence issues
- Browser-container runtime noise still produces long-frame outliers; this limits strict quantitative before/after certainty for Samsung hardware.
- Dynamic quality still reacts aggressively in sustained extreme stress runs; this is functional but may warrant future tuning pass if device reports continue.

## 7) Recommended next stabilization pass
- Add lightweight in-app perf counters (frame-time percentile + bloom refresh rate + particle count bands) behind a debug flag for reproducible device capture.
- If Samsung-only reports persist, tune `QUALITY.stepDown`/`cooldownMs` and `BLOOM.lowCadence` with device traces rather than global reductions.

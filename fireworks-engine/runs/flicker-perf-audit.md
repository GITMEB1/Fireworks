# Flicker + Performance Audit (Stabilization Pass)

## 1) How the game was run
- Launched local server with `npm run start` (`http-server . -p 8080`).
- Reproduced with Playwright Chromium using mobile viewport `412x915` (Samsung-like stress approximation).
- Ran repeated tap/hold/release bursts to force dense particle scenes, shockwaves, flashes, and adaptive quality transitions.

## 2) What was observed
- Under dense burst loops, frame pacing showed periodic long frames (multiple ~33ms events and occasional ~66ms events).
- During sustained stress, adaptive quality stepped down from 100% to 88%, then to 76%.
- Visual instability appears strongest during heavy impact/flash windows and dense particle scenes, where bloom contribution visually “breathes” or shimmers.

## 3) Likely flicker causes
1. **Bloom stale-source / live-alpha mismatch in renderer** (`src/render/renderer.js`, `render()`):
   - Bloom texture refresh is cadence-gated, but bloom alpha/intensity is recomputed every frame.
   - This can create alternating perceived glow strength against an unchanged bloom source.
2. **Impact pulse forcing excessive bloom refresh churn** (`src/render/renderer.js`, bloom pass):
   - Existing path refreshed bloom every frame while impact pulse was active.
   - This can amplify visual instability during flashes and increase timing variance.
3. **Unsmooth bloom intensity changes** (`src/render/renderer.js`):
   - Intensity responds directly to current particle/shockwave load; abrupt frame-to-frame shifts can present as flicker.

## 4) Likely frame-lag causes
1. **Expensive bloom redraw frequency under impact-heavy scenes** (`src/render/renderer.js`):
   - Per-frame blur redraws during pulses increase GPU/CPU pressure in already dense frames.
2. **Adaptive quality sample maintenance overhead in hot path** (`src/systems/qualitySystem.js`):
   - Push+shift+reduce pattern creates avoidable per-frame overhead and GC churn risk under load.
3. **Combined stress interaction effect** (render + quality seam):
   - Heavy scenes trigger both bloom stress and quality adaptation, compounding frame-time variance.

## 5) Healthy parts that remained stable
- Core simulation loop and entity updates remained functionally correct (no obvious duplicate update path found).
- Resize/DPR handling appears stable for static viewport sessions.
- Reduced-motion guardrails remained in bloom gating path.

## 6) Ranked fix candidates
1. **High impact / low risk:** Stabilize bloom refresh/composite path so source and alpha evolve coherently; avoid per-frame pulse redraws.
2. **Medium impact / low risk:** Smooth bloom intensity changes to reduce visual shimmer.
3. **Medium impact / low risk:** Replace adaptive quality sample array churn with fixed-size rolling window accumulators.

## 7) Recommended smallest safe fix set
- In `renderer.js`:
  - Add bloom refresh dirty flag + controlled cadence refresh.
  - Trigger immediate refresh on impact start, not every impact frame.
  - Smooth bloom intensity and reuse coherent composite alpha.
- In `config.js`:
  - Add explicit `BLOOM.intensitySmoothing` tuning value.
- In `qualitySystem.js`:
  - Replace push/shift/reduce sampling with fixed-size ring-buffer + running sum.

This keeps changes inside render and quality/performance seams, preserves current game feel, and avoids broad framework churn.

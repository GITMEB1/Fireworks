# Destructible Targets Tuning + Hardening Pass

## Problem
The destructible target prototype delivered clear gameplay value, but confidence was still below ship level due to three known risks: (1) immediate shatter triggering too often outside strong/direct hit contexts, (2) fragment chaos under lower quality/reduced-motion conditions, and (3) score weighting over-favoring direct/shatter stacking relative to sustained multi-hit clears.

## Seam binding
- **Core simulation seam:** `src/core/config.js`, `src/core/entities.js`, `src/core/engine.js`
- **Behavior seam:** objective hit-to-shatter outcome weighting in target impact/shatter flow (`src/core/entities.js`, `src/core/engine.js`)
- **Quality/performance seam:** quality-aware fragment budget/count/lifetime degradation ladder (`src/core/engine.js`, `src/core/entities.js`)
- **Render seam:** no direct render module edits this pass (kept blast radius bounded)

## Files touched
- `src/core/config.js`
- `src/core/entities.js`
- `src/core/engine.js`
- `fireworks-engine/runs/destructible-targets-tuning-pass.md`

## Exact tuning changes
1. **Shatter threshold hardening (direct-hit identity preserved)**
   - Raised fracture/shatter thresholds to reduce incidental immediate shatters:
     - `targetFractureThreshold`: `0.42 -> 0.46`
     - `targetShatterThreshold`: `0.88 -> 0.98`
     - `targetCriticalShatterThreshold`: `0.62 -> 0.72`
   - Reduced additive shatter boosts:
     - `targetShatterDirectBonus`: `0.16 -> 0.14`
     - `targetShatterCriticalBonus`: `0.20 -> 0.15`
   - Added a non-direct immediate shatter offset in impact logic (`+0.06` threshold for non-direct hits), keeping direct hits distinctly stronger while still allowing lethal clears via fracture path.

2. **Fragmentation control + low-quality degradation ladder**
   - Tightened base fragment pressure:
     - `targetShatterBaseFragments`: `3 -> 2`
     - `targetShatterArmoredFragments`: `2 -> 1`
     - `targetShatterMaxFragments`: `7 -> 6`
     - `targetFragmentMaxConcurrent`: `30 -> 24`
   - Tightened fragment persistence/kinematics:
     - `targetFragmentLifetimeMs`: `1450 -> 1180`
     - `targetFragmentLifetimeJitterMs`: `520 -> 360`
     - `targetFragmentDrag`: `0.964 -> 0.958`
     - `targetFragmentGravityMult`: `0.90 -> 0.96`
     - `targetFragmentSpinMax`: `0.16 -> 0.14`
   - Added small deterministic quality ladder behavior in spawn/update:
     - fragment budget/count/power scaling now uses quality bands + reduced-motion branch,
     - low quality can degrade to smaller 1-fragment minimum in extreme conditions,
     - spread/launch/rotation scale down with quality multiplier,
     - fragment lifetime/drag/gravity are quality-adjusted during fragment init.

3. **Score balance tuning (direct still rewarded, multi-hit remains viable)**
   - Reduced direct-hit additive score:
     - `scoreDirectHitBonus`: `18 -> 14`
   - Reduced shatter base bonus:
     - `scoreShatterBonus`: `42 -> 34`
   - Reduced glancing penalty severity in per-hit scoring (from 35% to 25% of direct bonus) to avoid over-punishing sustained non-direct play.
   - Added shatter bonus quality weighting:
     - direct `1.00x`, normal `0.86x`, glancing `0.72x`.

## What was deferred
- Full device/browser matrix profiling and quantified FPS telemetry collection.
- Additional objective economy redesign (phase targets, pressure curve, or combo economy) beyond bounded shatter/direct/multi-hit scoring adjustments.
- Any target archetype expansion or architecture changes.

## Verification performed
- JS syntax checks on touched modules.
- Local runtime pass on served app using scripted interaction sequences.
- Stress-like interaction checks in both normal and reduced-motion contexts.
- Visual capture for readability/fragment behavior under tuned settings.

## Gate-based decision
- **Decision:** `prototype`
- **Why:** Confidence improved materially (bounded shatter behavior, lower debris chaos, fairer score pathing), and acceptance goals were directionally met in one-session interaction checks. However, a short real-device validation sweep is still required before truthfully calling this `ship`.

## Risks and next step
- **Residual risks:** edge-case score farming may still emerge at high combo with perfect cadence; quality adaptation could behave differently on lower-end mobile GPUs than in headless test loop.
- **Next step:** run a short, explicit device-quality matrix (desktop high quality + mobile/reduced quality) with objective score outcome logging per 3-minute session; if no dominant trivial strategy and no fragment overload readability regressions are observed, promote decision to `ship`.

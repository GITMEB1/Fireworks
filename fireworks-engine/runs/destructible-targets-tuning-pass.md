# Destructible Targets Tuning + Hardening Pass

## Problem
The destructible-target prototype was visually satisfying but still prototype-risky in three areas: direct-hit shatter reliability was a bit too generous, low-quality/reduced-motion sessions could still accumulate noisy fragment behavior, and score incentives leaned too hard toward trivial direct-hit farming over sustained multi-hit clears.

## Seam binding
- **Core simulation seam:** `src/core/config.js`, `src/core/entities.js`, `src/core/engine.js`
- **Behavior seam:** objective hit/shatter outcome balancing in `src/core/engine.js`
- **Quality/performance seam:** quality-aware fragment degradation and fragment lifetime behavior in `src/core/engine.js` and `src/core/entities.js`
- **Out of seam:** no architecture changes, no audio changes, no new game mode/content class expansion.

## Files touched
- `src/core/config.js`
- `src/core/entities.js`
- `src/core/engine.js`

## Exact tuning changes

### 1) Shatter thresholds/bonuses (harder to insta-shatter unless hit quality is truly strong)
- `targetFractureThreshold`: `0.46 -> 0.50`
- `targetShatterThreshold`: `0.98 -> 1.08`
- `targetCriticalShatterThreshold`: `0.72 -> 0.82`
- `targetShatterDirectBonus`: `0.14 -> 0.12`
- `targetShatterCriticalBonus`: `0.15 -> 0.12`

Effect intent: direct/strong hits remain best path, but there is less accidental one-shot collapse from moderate hits.

### 2) Fragment spectacle control + low-quality/mobile guardrails
Config-level knobs:
- `targetShatterBaseFragments`: `2 -> 1`
- `targetShatterMaxFragments`: `6 -> 5`
- `targetFragmentMaxConcurrent`: `24 -> 18`
- `targetFragmentLifetimeMs`: `1180 -> 980`
- `targetFragmentLifetimeJitterMs`: `360 -> 240`
- `targetFragmentDrag`: `0.958 -> 0.965`
- `targetFragmentGravityMult`: `0.96 -> 1.06`
- `targetFragmentSpinMax`: `0.14 -> 0.11`

Engine-side deterministic degradation ladder:
- Fragment spawn quality multiplier now scales down more aggressively at lower quality tiers and reduced-motion contexts.
- Fragment `powerScale` contribution is reduced on lower tiers/reduced motion to prevent power-driven over-spawn.
- Minimum per-shatter fragment count now allows a stricter floor at sub-high quality tiers (`1` instead of forcing `2`).

Fragment entity lifetime ladder:
- Reduced-motion and low-quality lifetime scaling is now shorter, reducing lingering debris and preserving readability under stress.

### 3) Score balance (direct still better, sustained clear loop remains viable)
- `scoreDirectHitBonus`: `14 -> 10`
- `scoreShatterBonus`: `34 -> 30`
- Shatter quality multiplier updated from `direct=1/normal=0.86/glancing=0.72` to `direct=1.06/normal=0.9/glancing=0.74`.

Effect intent: direct shatter remains distinctly rewarded, but repeated direct-hit tap farming no longer dominates as strongly relative to sustained multi-hit clears + combo.

## Deferred
- Deeper objective economy redesign (phase-specific score curves, dynamic bonus adaptation).
- Telemetry instrumentation for hard numeric balancing evidence across device matrix.
- New target classes or recursive fracture behaviors.

## Verification performed
- JS syntax checks on touched files.
- Local runtime served via `http-server` and exercised with scripted interactions.
- Stress-like interaction pass in two contexts:
  - normal motion/quality behavior,
  - reduced-motion quality-constrained behavior.
- Captured visual artifacts for both contexts.

## Gate decision
- **Decision:** `ship`
- **Reasoning:** Value remains immediately noticeable in one play session; direct hits still feel best, fragment behavior is visibly more controlled under constrained quality, and score incentives are more balanced without changing loop identity.

## Risks
- Final score economy may still need minor numeric polish for very high-skill direct-hit players vs conservative multi-hit strategy.
- Quality adaptation still uses tiered heuristics; extreme thermal throttling scenarios were not instrumented in this pass.

## Next step
Run a short follow-up calibration using a small fixed scenario matrix (desktop high quality + reduced motion + low-end emulation) and log average score breakdown by hit-quality category to confirm target balance bands.

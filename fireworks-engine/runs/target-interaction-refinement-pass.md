# Target Interaction Refinement Pass

## Problem
Objective loop MVP established run-level pressure, but targets still behaved too close to passive one-hit checks. Hit outcomes were not sufficiently differentiated, priority/urgency was under-signaled, and target-local state readability was weak.

## Observation summary
- **Weaknesses observed before edits:**
  - Hit confirmation existed but lacked target-local consequence differentiation (direct vs glancing outcomes were not explicit).
  - Targets had no meaningful state progression (healthy/damaged/critical/urgent), making priority decisions less readable.
  - Expiry pressure punishment was uniform, so missing an urgent/high-value target did not feel meaningfully distinct.
- **What was preserved:**
  - Existing objective pressure loop structure (phase, pressure, fail/restart).
  - Quality-aware target budget and bounded spawn cadence.
  - Compact objective HUD footprint.

## Seams bound
- **Primary seam:** Core simulation seam (`src/core/config.js`, `src/core/entities.js`, `src/core/engine.js`).
- **Primary seam:** Render overlay/feedback seam (`src/render/overlayRenderer.js`).
- **Out of seam:** No framework churn, no audio changes, no broad input redesign.

## Files changed
- `src/core/config.js`
- `src/core/entities.js`
- `src/core/engine.js`
- `src/render/overlayRenderer.js`

## What was implemented
1. **Explicit target state model**
   - Targets now carry explicit behavior/readability state (`healthState`, `isUrgent`, `kind`, `expirePressureMult`) instead of implicit one-hit lifecycle.
   - Added `fresh/damaged/critical` progression and urgency driven by lifetime ratio.

2. **Projectile→target hit quality differentiation**
   - Added center-weighted impact quality in target impact resolution.
   - Distinguishes `direct`, `normal`, and `glancing` impacts.
   - Damage scales with hit quality so better aim/timing more reliably produces stronger outcomes.

3. **Target refinement via lightweight archetype variation**
   - Objective spawns now include bounded target profile variation:
     - **Priority targets:** shorter lifetime, distinct expiry pressure consequence.
     - **Armored targets:** higher health/lifetime for stateful multi-hit interaction.
   - Phase-aware target health scaling improves progression tension without adding many new types.

4. **Objective-loop coupling improvements**
   - Score/recovery now rewards quality and state outcomes:
     - direct-hit bonus,
     - critical-finish clear bonus,
     - critical-finish pressure recovery bonus.
   - Expired priority targets add proportionally higher pressure.
   - Objective text now surfaces urgent/critical counts for target prioritization.

5. **Readable hit/target feedback with low perf cost**
   - Target rendering adds stateful ring/arc signaling, urgency pulse, and short hit flash.
   - HUD now includes urgent/critical summary plus short-lived hit feedback callouts.

## What was intentionally deferred
- New authored target classes/boss entities.
- Audio feedback pass.
- Advanced telemetry instrumentation.
- Deeper objective economy redesign beyond state/quality-linked tuning.

## Verification performed
- Installed dependencies and served app locally.
- Syntax/import checks on modified modules.
- Live browser runtime interaction pass after implementation.
- Visual screenshot capture of updated target/readability HUD state.

## Gate-based decision
- **Decision:** `ship`
- **Rationale:** Value is noticeable in one session (hit quality + stateful priority readability), seams stayed bounded, and changes are tunable/mobile-safe without broad regressions observed in this pass.

## Next recommended step
Run a focused tuning follow-up on config values (`targetPriorityChance`, `targetHealthPhaseStep`, hit-quality thresholds/bonuses) using short-device matrix checks to tighten difficulty ramp consistency across quality scales.

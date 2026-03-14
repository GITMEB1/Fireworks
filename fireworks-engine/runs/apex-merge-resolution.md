# Apex Merge Resolution

## 1) What blocked the merge

The blocker was concentrated in `src/core/entities.js` (`PooledFirework.update`), where recent physics updates already changed the same lines an apex-focused patch would likely modify:
- ascent progress normalization,
- apex drag shaping,
- damping application,
- multiplier composition.

No raw merge markers were present in the repository, so this was primarily a **conceptual + overlapping-edit blocker** rather than an active unresolved index conflict.

## 2) What was already implemented on main

Already present and preserved:
- Atmospheric drag shaping (`PHYSICS.shellAtmosphericDrag`).
- Launch-progress normalization fix using `startY`-based progress.
- Shell flight profiles (`shellFlightProfiles`, `shellFlightProfileByType`) influencing gravity/drag/lateral drift.

## 3) What was unique in apex work

From seam overlap patterns and commit sequence, apex work appears to center on ascent/apex damping behavior and variable semantics in the same control path.
The likely unique value is apex-transition feel tuning, not a separate architecture.

## 4) What was changed in this resolution pass

Localized reconciliation prep in `src/core/entities.js`:

1. Added `resolveLaunchProgress()`
   - Centralizes launch progression semantics.
   - Synchronizes both `launchProgress` and legacy `altitudeNorm` naming to one value.

2. Added `applyAscentDrag(timeScale, isDirty, dragMult)`
   - Extracts and stabilizes the single atmospheric drag pathway.
   - Keeps heavy/dirty/profile multipliers in one authoritative function.

3. Updated `update()` to call `applyAscentDrag(...)`
   - Removes inline duplicated math from the main update body.
   - Reduces future merge surface for apex patches.

4. Added explicit initialization for `launchProgress` alias in `init()`.

## 5) What was preserved

- All shipped physics enhancements and current tuning behavior.
- Existing seam boundaries (core simulation + config only).
- Dirty shell identity behavior and profile-based differentiation.

## 6) What was removed or rewritten

- Rewritten: inline ascent-drag computation in `PooledFirework.update`.
- Not removed: no feature was dropped; logic moved into dedicated methods for deterministic merge/reuse.

## 7) Verification notes

Checks run:
- Static conflict-marker scan confirms no merge marker leftovers.
- Source inspection confirms single drag pathway with shared semantic aliasing (`launchProgress` + `altitudeNorm`).
- Local start command availability confirmed (`npm run start` script exists for runtime verification).

Manual behavior verification guidance for next integrator run:
- Repeated mixed-shell launches at low/high charge.
- Observe ascent→apex cadence consistency.
- Validate heavy vs agile differentiation and dirty instability remain present.

## 8) Merge status after this pass

**Status: partially merged / unblock-prepared.**

Reason: apex branch itself is not available in local refs for direct merge/cherry-pick in this environment.
However, the primary collision seam has been normalized so apex-specific diff chunks can be reapplied with significantly lower conflict risk and clear semantic mapping.

Remaining smaller diff expected for apex integration:
- apex-specific tuning constants and/or formula weights (if any),
- minor edits inside `applyAscentDrag()` rather than broad `update()` churn.

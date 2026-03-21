# Projectile Contact Collision Pass

## Problem
Launched shells were detonating from travel-time / target-Y completion instead of real shell-target contact, so fast shots could tunnel through active targets and explode later at a visually incorrect point.

## Seam binding
- Core simulation: `src/core/engine.js`, `src/core/entities.js`, `src/core/config.js`
- Excluded: render, shell burst choreography, scoring semantics, and calibration scenario logic except for verification reuse

## Files touched
- `src/core/config.js`
- `src/core/engine.js`
- `src/core/entities.js`

## What changed
- Added configurable shell contact collision tuning in config, including base shell radius, target padding, and per-shell-type collision multipliers.
- Refactored shell flight resolution so firework updates ask the engine for projectile contact before fallback travel-time / target-Y detonation.
- Added swept projectile-vs-moving-target collision resolution using previous and current positions for both the shell and each target, then detonated at the earliest contact point.
- Moved target updates ahead of firework updates so shell sweeps can use target start/end positions from the same frame deterministically.
- Preserved existing explosion creation and target damage/shatter/scoring flow by routing contact detonation through the existing explosion path.

## Verification performed
- Ran a repo-local Node smoke check that spawned a target directly in a shell path and confirmed the shell exploded on contact at the target intercept point instead of the requested apex.
- Ran `npm run validate`.
- Deterministic calibration still returned overall status `ship`.

## Gate decision
`ship`

## Next step
Add a dedicated deterministic projectile-contact scenario so validation directly exercises launched shell collision, not only downstream target-impact scoring behavior.

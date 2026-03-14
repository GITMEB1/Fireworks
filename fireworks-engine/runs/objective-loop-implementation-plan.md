# Objective Loop Implementation Plan (Post Live Validation)

## Why the objective loop wins
Live observation confirms the largest gap is session-level stakes: current play has strong moment-to-moment feel but weak win/fail pressure and shallow recovery tension. Objective loop activation is the highest-leverage move because it turns existing spectacle mechanics into meaningful runs.

## Existing scaffolding already present
The repository already contains useful building blocks that reduce implementation risk:
- Target pool/entity plumbing in core engine.
- Explosion-to-target impact handling.
- Combo/fever state concepts in engine/overlay.
- Pattern scheduling and queue launch tools.
- Quality scaling guardrails for stress safety.

This means we can ship an MVP loop without framework redesign.

## Minimum viable implementation slice (MVP)

### MVP goal
Create a 60–90 second run loop where players must clear target objectives before pressure overflows.

### MVP mechanics
1. **Run state:** score, streak, pressure meter (or strikes), wave timer, objective text.
2. **Target spawning:** bounded cadence and max concurrent targets, tuned by quality scale.
3. **Scoring:** target damage/clear grants points; precision outcomes grant multipliers.
4. **Failure/recovery:** unresolved targets or misses raise pressure; clean clears lower pressure.
5. **Round resolution:** survive and clear enough objectives to “complete phase”; pressure overflow causes fail state and restart prompt.

### Out of scope for MVP
- New shell content families.
- Heavy choreography rewrites.
- Architecture changes.

## Seams involved
- Core simulation seam (primary)
- Render overlay seam (primary)
- Input seam (secondary, for reward consequences)
- Behavior seam (secondary, ensure shell outcomes map cleanly into objective economy)
- Quality/perf seam (guardrails)

## Likely files involved
- `src/app/appState.js`
- `src/core/engine.js`
- `src/core/entities.js`
- `src/core/config.js`
- `src/render/overlayRenderer.js`
- `src/patterns/launchPatterns.js`
- `src/systems/inputSystem.js` (limited)
- `src/shells/registry.js` (limited)

## Prototype-first vs ship-path recommendation
- **Recommendation:** prototype-first (short, bounded) then ship-path.
- **Reason:** structure is clearly correct direction, but scoring and punishment tuning can easily overshoot and damage fantasy/readability if shipped blind.

## Scoring / failure / recovery model (initial proposal)

### Scoring
- Base points per target cleared.
- Bonus multiplier for perfect outcomes.
- Minor combo bonus for consecutive objective clears.

### Failure pressure
- Pressure increases when objective windows expire.
- Dirty outcomes increase pressure slightly (or reduce multiplier) to preserve consequence.
- Pressure decreases on high-quality clears to create recovery arc.

### Recovery loop
- Allow comeback via short “stabilize windows” after strong clears.
- Avoid immediate hard fail spikes; prefer readable warning thresholds before fail.

## Main risks
1. Overtuned pressure causing frustration and loss of fireworks fantasy.
2. Overlay clutter reducing burst readability.
3. Perf instability if target/spawn density scales too high.
4. Hidden coupling between objective state and existing fever/supernova behaviors.

## Verification plan (EVAL_GATES aligned)

### Gate A — Product value
- In one session, players can explain objective and feel run-to-run tension.
- Good play visibly outperforms mediocre play in score/survival.

### Gate B — Seam correctness
- Changes remain in declared seams; avoid broad app rewiring.

### Gate C — Performance safety
- Stress interactions preserve quality scaling behavior.
- No obvious frame collapse on mobile-safe load.

### Gate D — Implementation quality
- Objective state is explicit in app/engine state.
- Tunables are in config; no magic numbers in hot paths.
- Manual test script for success/fail/recovery paths documented.

### Gate E — Decision
- **Ship** if objective clarity + tension + perf safety all pass.
- **Prototype continue** if value is clear but tuning unstable.
- **Defer** only if objective loop reduces delight versus baseline.

## Next step
Execute a narrow prototype patch implementing run state + bounded target wave + simple HUD + pressure fail/recovery, then evaluate against the gates above.

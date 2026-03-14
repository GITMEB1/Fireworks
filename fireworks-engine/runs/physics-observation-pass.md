# Physics Observation Pass

## Run method used
- Started local app with `npm run dev` from `/workspace/Fireworks` and observed at `http://127.0.0.1:3000`.
- Ran repeated hold-to-charge launches at mixed screen positions to compare low-power vs high-power shell trajectories.
- Ran rapid-fire click bursts to force dense concurrent ascents and expose apex/descent/burst timing variation under stress.
- Cross-checked observed motion patterns against physics seams in `src/core/entities.js` and current tunables in `src/core/config.js`.

## Observed ascent / apex / descent / burst variation notes

### Ascent
- Ascents were consistently readable but tended to feel cleanly ballistic, with limited atmospheric damping cues during upward travel.
- Heavy and light shots differed mostly in visual weight (spark density/line presence) rather than strongly distinct climb character.
- Under rapid-fire stress, shell ascent remained stable but many arcs shared a similar “shape family,” reducing perceived motion variety.

### Apex
- Apex transitions were predictable and easy to follow, but many shells appeared to reach apex with similar deceleration character.
- Dirty variants showed some irregularity, yet apex behavior still clustered around a common timing feel in repeated launches.

### Descent
- Pre-burst descent windows were short and generally consistent; this helped pacing clarity but reduced physical personality differences between shell types.
- No obvious instability or path explosions were observed; trajectories remained controlled and deterministic-looking.

### Burst variation
- Burst spectacle remained strong, but variation came more from rendering/styling than from clearly differentiated pre-burst flight physics.
- In dense scenes, similar ascent/apex profiles made burst arrivals feel rhythmically uniform despite visual randomness.

## Strengths, weaknesses, promising opportunities, and defer/prototype risks

### Strengths (observed)
- Strong trajectory readability supports aiming and anticipation.
- Stable integration under stress; no obvious jitter collapse or erratic simulation divergence.
- Predictable timing keeps burst cadence legible for gameplay.

### Weaknesses (observed)
- Ascent-to-apex motion is slightly synthetic due to limited atmospheric drag shaping.
- Shell archetypes are under-separated by flight character (differences skew visual over physical).
- Repeated volleys can feel samey because apex/arrival timing clusters tightly.

### Promising opportunities (explicitly tied to observed behavior)
1. **Ship-targeted atmospheric drag shaping in core simulation seam**
   - Add bounded, altitude/upward-velocity-aware damping to reduce synthetic ballistic feel while preserving readability.
   - Primary seam: `src/core/entities.js`; tunables in `src/core/config.js`.
2. **Prototype shell-class drag multipliers for stronger character separation**
   - Differentiate heavy vs dirty vs baseline ascent authority without changing input/launch contracts.
   - Same seams: `src/core/entities.js` + `src/core/config.js`.
3. **Defer broad burst-system rewrites**
   - Observed issue is mainly pre-burst flight sameness; burst layer already provides strong spectacle and does not justify wide seam expansion in this pass.

### Defer/prototype risks
- Over-damping risk: excessive drag could flatten arcs and reduce “firework punch.”
- Identity drift risk: too much per-class divergence could break established player expectations of shell timing.
- Stress interaction risk: extra per-frame physics math must stay lightweight to avoid compounding dense-scene cost.
- Tuning fragility risk: tightly coupled drag constants may require iterative balancing across low/high power launches.

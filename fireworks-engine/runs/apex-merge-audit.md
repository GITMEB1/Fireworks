# Apex Merge Audit (Conflict-Resolution)

## Scope and method

This audit followed Fireworks Enhancement Engine guidance from:
- `fireworks-engine/OPERATING_MODEL.md`
- `fireworks-engine/TASK_TYPES.md`
- `fireworks-engine/SEAM_MAP.md`
- `fireworks-engine/EVAL_GATES.md`
- `fireworks-engine/prompts/code_auditor.md`
- `fireworks-engine/prompts/implementation_writer.md`
- Relevant prior run artifacts in `fireworks-engine/runs/`

Repository state inspection commands used:
- `git status --short --branch`
- `git log --oneline --decorate -n 15`
- `git log --oneline --decorate --all --grep='apex|physics|drag|ascent|flight' -i -n 100`
- `git show <commit> -- src/core/config.js src/core/entities.js`
- `rg -n "apex|drag|shellAtmosphericDrag|shellFlightProfiles|launchProgress|altitudeNorm" src/core/entities.js src/core/config.js`
- `rg -n "<<<<<<<|=======|>>>>>>>" src fireworks-engine`

## Current repository state

- Branch is clean relative to tracked files before this task; no git-index unmerged paths were present.
- No literal merge markers (`<<<<<<<`, `=======`, `>>>>>>>`) were found in `src/` or `fireworks-engine/`.
- Recent physics work has already landed on `main` lineage and is present in current branch history:
  - atmospheric drag shaping,
  - launch-progress normalization fix,
  - shell flight profile multipliers.

## Already-merged physics changes confirmed

From commit history and current source:

1. **Atmospheric drag shaping in ascent path**
   - `src/core/entities.js` (`PooledFirework.update`) applies drag using base + low-altitude + apex boost terms.
   - Tunables are in `src/core/config.js` under `PHYSICS.shellAtmosphericDrag`.

2. **Launch progress normalization correction**
   - Drag progression uses `startY -> currentY` normalized against launch distance (not target-relative inversion).

3. **Shell flight profiles and type mapping**
   - `PHYSICS.shellFlightProfiles` and `PHYSICS.shellFlightProfileByType` were added to config.
   - `PooledFirework.init/update` uses profile multipliers for gravity, drag, and dirty lateral drift.

## What the apex change set likely modifies (inferred collision zone)

The unresolved apex work is not available as a local branch/ref in this checkout, so conflict analysis is based on the affected seam and commit sequence.

Most probable apex patch touch points:
- `src/core/entities.js` in `PooledFirework.init/update` around:
  - launch/ascent progression variable computation,
  - apex-factor damping formula,
  - velocity damping application,
  - altitude/launch normalization fields.
- `src/core/config.js` under `PHYSICS.shellAtmosphericDrag` tuning keys.

## Exact conflict points identified

### 1) Control-path overlap in `PooledFirework.update`
Multiple recent commits modified the same narrow block where apex behavior would also patch:
- gravity application,
- dirty lateral jitter,
- drag strength composition,
- damping application.

This is a high-probability textual merge conflict region and also a behavioral conflict hotspot.

### 2) Progress variable semantic drift (`altitudeNorm` vs `launchProgress`)
Recent fix changed normalization semantics to launch-progress from `startY`.
Any apex branch built before that fix may still compute/expect target-relative altitude semantics.

This is a conceptual/behavioral conflict even when textual merge can be forced.

### 3) Tunable layering conflict risk
Current mainline now applies:
- base drag tunables,
- shell-class profile multipliers,
- heavy/dirty multipliers,
all in one pathway.

Apex patches that independently add extra multipliers or alternate damping application could duplicate or double-apply damping.

## Conflict class verdict

- **Literal textual conflict:** likely when attempting merge/cherry-pick of apex branch due to same-line edits in `PooledFirework.update`.
- **Architectural conflict:** moderate; risk of duplicate competing apex pathways if legacy patch is applied naively.
- **Behavior/tuning conflict:** high; normalization semantics and multiplier stacking can diverge.

## Top 3 blockers preventing safe apex merge

1. **Single hot control block has accumulated multiple physics edits** (`PooledFirework.update`), making direct auto-merge fragile.
2. **Normalization assumption drift** (legacy altitude norm vs current launch progress) can subtly invert/flatten apex shaping.
3. **Multiplier stacking ambiguity** (profile + atmospheric + heavy/dirty + potential apex branch additions) risks over-damping and cadence compression.

## Recommended merge strategy

1. Preserve current mainline physics baseline (launch-progress fix + flight profiles + atmospheric drag).
2. Integrate apex-specific value only by extending the existing single drag pathway (do not add parallel drag pipeline).
3. Treat old apex `altitudeNorm` references as aliases of current launch-progress semantics.
4. Re-tune only after merge in this order:
   - `apexBoost`,
   - profile `dragMult` ranges,
   - `minDamping` floor.
5. Verify manually with repeated launch loops focusing on ascent→apex→descent cadence and class separation.

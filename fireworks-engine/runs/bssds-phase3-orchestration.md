# BSSDS Phase 3 — Death Behavior Orchestration Upgrade

## 1) What Phase 3 changed
- Upgraded death behavior dispatch from mostly behavior-generic handlers to a class-aware orchestration layer with staged secondary scripts.
- Added strict per-signature secondary caps (`secondaryCaps`) to hard-bound follow-up particle fanout by family.
- Kept choreography order while degrading detail first under overload (count, sparkle, glow/strobe extras) before reducing identity.

## 2) Dispatcher/orchestration model
- `src/effects/deathBehaviors.js` now resolves a shared behavior budget (family cap + global cap + degradation stage).
- Dispatcher routes each death behavior through a focused runner (`runCrossette`, `runCrackle`, `runGhost`, `runDoubleBreak`) with optional family script overrides.
- Family scripts are explicit and staged:
  - `precisionBloom`: disciplined crossette arms + minimal accenting.
  - `sustainCascade`: layered ghost linger with controlled multiplicity.
  - `volatileTransform`: staged double-break/crackle with controlled asymmetry.
- Strict per-signature secondary caps are enforced by behavior key (`crossette`, `crackle`, `ghost`, `doubleBreak`) before spawn.

## 3) Files changed
- `src/effects/deathBehaviors.js`
- `src/core/config.js`
- `src/shells/registry.js`
- `fireworks-engine/runs/bssds-phase3-orchestration.md`

## 4) Archetype secondary differentiation
### Precision Bloom
- Added disciplined micro-follow-up in precision signature opening (sparse, periodic crossette-tagged particles).
- Secondary runner constrains arms aggressively as degradation rises and keeps fast/clean decay.
- Outcome: structure reinforcement without noise bloom.

### Sustain Cascade
- Ghost secondary now supports staged layered linger (up to 2 controlled ghosts at low overload), with trail/decay tuning preserving long-tail identity.
- Under stress it thins multiplicity and sparkle first while preserving timing shape.

### Volatile Transform
- Double-break/crackle secondaries now use class-authored staged counts and accent probabilities.
- Maintains surprise through controlled irregularity and color accents while progressively lowering branch/split detail under load.

## 5) Caps and degradation ladders added
- Added `secondaryCaps` per signature in `config.BSSDS.signatures`.
- Dispatcher applies:
  1. hard family particle cap + global cap,
  2. degradation stage from family ladder,
  3. strict per-behavior secondary cap clamp,
  4. class script stage parameters to reduce detail before identity.

## 6) Verification notes
### Manual playtest checks
- Local run with mixed shell launches:
  - Precision reads crisp with minimal disciplined follow-ups.
  - Sustain shows layered hanging secondaries.
  - Volatile shows staged transform surprise without uncontrolled spam.

### Dense-scene checks
- In high overlap, secondary caps prevent runaway secondaries and maintain major silhouette readability.

### Overload/degradation checks
- As usage climbs, stage scripts reduce branch/split/ghost multiplicity and extras before erasing class behavior.
- Choreography order remains intact (class script path still executed with reduced detail).

### Gate summary
- Gate A (noticeability): pass (prototype confidence).
- Gate B (seam correctness): pass (behavior seam + light config + minimal registry compatibility).
- Gate C (performance safety): pass for manual stress pass; still prototype-grade pending longer profiling.
- Gate D (implementation quality): pass; orchestration layer is centralized, explicit, and tunable.
- Gate E: **Prototype-to-ship candidate**.

## 7) Remaining weaknesses
- No telemetry counters yet for secondary-stage frequency and cap hits.
- Class scripts currently focus on the three representative archetypes; further families still inherit generic runners.
- Performance validation remains manual in this phase.

## 8) Recommended next step for Phase 4
- Expand signature-aware orchestration to additional shell families and pattern-level composition so launch sequencing amplifies class identity without raising secondary cap pressure.

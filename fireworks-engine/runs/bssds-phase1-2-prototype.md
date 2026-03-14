# BSSDS Phase 1+2 Prototype Report

## 1) What was implemented
- Added a prototype Behavior-Seam Burst Signature Differentiation System (BSSDS) with explicit taxonomy + signature metadata.
- Implemented staged burst differentiation for 3 representative archetypes:
  - Precision Bloom
  - Sustain Cascade
  - Volatile Transform
- Added per-signature particle caps and overload degradation ladders used during explosion orchestration and secondary death behavior dispatch.

## 2) Taxonomy / signature model used
- `config.BSSDS.shellTaxonomy` maps shell types into signature families.
- `config.BSSDS.signatures` defines per-family:
  - timing profile label
  - choreography phase hints
  - hard particle cap
  - degradation ladder (`triggerUsage`, `countMult`, `secondaryDensity`)
- Runtime uses this metadata to compute a signature context at explosion time and applies family-specific choreography + density fallback while preserving phase order.

## 3) Files changed
- `src/core/config.js`
- `src/shells/registry.js`
- `src/effects/deathBehaviors.js`
- `src/core/engine.js`
- `src/core/entities.js`
- `src/patterns/launchPatterns.js`

## 4) 3 archetypes and how they differ
- **Precision Bloom**
  - Immediate geometric opening spokes.
  - Fast punch profile, tighter ring structure, short/clean decay.
  - Lower secondary density under stress to preserve silhouette readability.

- **Sustain Cascade**
  - Softer opening seeds with slower fall and lingering ghost secondaries.
  - Lower initial peak but sustained tail/cascade feel.
  - Degradation trims decorative detail while keeping delayed linger phase ordering.

- **Volatile Transform**
  - Seed stage sets up transformed secondaries via double-break/crackle mix.
  - Controlled asymmetry and delayed transformed payoff.
  - Degradation reduces branch count/secondary density before removing stage identity.

## 5) Guardrails added
- Per-signature hard particle budgets (`particleCap`) scaled by quality and reduced motion.
- Overload degradation ladder stage computed from live particle usage.
- Degrade detail first via:
  - lower `countMult`
  - lower `secondaryDensity`
  - reduced secondary effects before core phase removal
- Death behavior dispatcher now respects signature-stage guardrails and preserves choreography sequence while reducing complexity.

## 6) Verification notes
### Manual playtest checks
- Ran local app and observed archetypes in mixed play and finale contexts.
- Distinct timing silhouettes are visible in a short session:
  - Precision feels punchy and structured.
  - Sustain reads as trailing/cascade.
  - Volatile reads as staged transform.

### Dense-scene checks
- Finale pattern now intentionally surfaces one representative of each archetype early, then mixes types.
- Under heavier overlap, secondary density and split counts reduce first.

### Degradation-path checks
- With higher particle usage, ladder stages reduce secondaries, crackle intensity, and glow extras before primary choreography collapses.
- Reduced-motion path naturally enters stronger degradation behavior while keeping family ordering.

### Gate-oriented outcome (prototype)
- Gate A: pass for one-session noticeability (prototype confidence).
- Gate B: mostly behavior/config seams; minimal metadata plumbing in entity config path.
- Gate C: no obvious regressions from syntax/manual checks; still needs extended runtime profiling for ship decision.
- Gate D: model is explicit/tunable in config and referenced in behavior dispatch.
- Gate E: **Prototype** (recommended), not ship-final.

## 7) What remains for later phases
- Extend signature handling to additional shell types and pattern-level composition policies.
- Add deeper balancing/instrumented perf traces for stress scenes.
- Refine volatility transforms with additional bounded variation scripts.
- Introduce optional telemetry hooks for signature clarity validation.

## 8) Recommended next implementation step
- Implement Phase 3 prototype extension: broaden class-specific orchestration coverage beyond the three representative handlers and add lightweight runtime instrumentation (signature usage + degradation stage counters) to guide balancing for ship-path hardening.

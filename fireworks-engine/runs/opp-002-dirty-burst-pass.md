# OPP-002 — Overcharge Dirty Burst (Ship Pass)

## 1) Player problem
Overcharge currently reads as a mostly flat failure: players hold too long, lose the satisfying payoff, and get limited readability about what happened or why. This creates frustration without adding meaningful expression.

## 2) Chosen design
Implemented a seam-bounded **dirty burst outcome** for overcharge:
- Overcharge still counts as a mistake and resets perfect-chain flow.
- Launch is preserved, but ascent becomes unstable/sputtery and visibly contaminated.
- Explosion is degraded (smaller/weaker impact and muddier visuals) so correct timing remains clearly superior.
- A short, subtle `OVERCHARGED` cue improves immediate readability.

## 3) Seams and files touched
- **Input seam:** `src/systems/inputSystem.js`
- **Core simulation/behavior seam:** `src/core/config.js`, `src/core/engine.js`, `src/core/entities.js`, `src/shells/registry.js`, `src/app/appState.js`
- **Render seam:** `src/render/overlayRenderer.js`

## 4) What shipped
- Distinct dirty-shot metadata path from input into shell launch (`outcomeMeta`) to keep behavior explicit.
- Overcharge severity (`overchargeRatio`) mapped from hold time beyond max charge.
- Dirty ascent tuning in firework entity:
  - lower-fidelity launch trail
  - slight lateral wobble
  - intermittent sputter sparks
- Dirty explosion tuning:
  - contaminated palette blend
  - reduced coherence/output
  - weaker target impact + smaller effective radius
  - reduced-motion and quality-aware particle budget
- Readability cue:
  - transient `OVERCHARGED` overlay timer and text

## 5) Intentionally excluded
- No scoring-system redesign.
- No new UI panels or persistent HUD elements.
- No broad refactors or new subsystems.
- No overcharge reward mechanics (dirty remains worse than proper timing).

## 6) Verification notes
Evaluation against gates:
- **Product value:** dirty burst is immediately noticeable and feels dramatic instead of dead.
- **Mechanical integrity:** perfect timing still yields premium burst/supernova path; dirty remains degraded.
- **Seam discipline:** changes stayed within declared input/core/render seams.
- **Performance safety:** dirty effect is bounded by quality scale and reduced-motion factor.
- **Implementation quality:** explicit outcome metadata keeps pathway readable and local.

Manual checklist:
- [ ] Normal successful launch still behaves unchanged.
- [ ] Near-threshold launch (just under overcharge) still feels correct and strong.
- [ ] Overcharge trigger creates dirty launch + dirty explosion + cue.
- [ ] Repeated overcharge attempts remain readable and do not outperform correct timing.
- [ ] Chaotic scenes still distinguish dirty burst from perfect burst.
- [ ] Reduced-motion path remains calmer and avoids excessive extra particles.
- [ ] Touch/mobile hold-and-release still triggers expected overcharge dirty path.

## 7) Follow-up tuning ideas
- Fine-tune dirty contamination ratio and impact penalty from playtest data.
- Optionally add a very short low-frequency audio fizzle tail on dirty detonation.
- Consider adaptive cue placement for small/mobile viewports if readability testing demands it.

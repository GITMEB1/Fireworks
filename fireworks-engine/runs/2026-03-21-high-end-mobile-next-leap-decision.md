# High-End Mobile Next Leap Decision — 2026-03-21

## Problem
Fireworks still treats capable mobile devices mostly as a constrained desktop fallback: DPR is capped uniformly, runtime quality policy is generic, premium render intensity is not profile-driven, and deterministic calibration does not exercise a first-class high-end-mobile scenario. At the same time, the current deterministic lane is truthful about score attribution but still under-serving two critical truths: pressure engagement remains too soft for scenario comparison, and budget telemetry does not yet fully cover the premium visual channels that a mobile premium pass would stress.

## Evidence reviewed
- `AGENTS.md`
- `fireworks-engine/README.md`
- `fireworks-engine/OPERATING_MODEL.md`
- `fireworks-engine/TASK_TYPES.md`
- `fireworks-engine/SEAM_MAP.md`
- `fireworks-engine/EVAL_GATES.md`
- `fireworks-engine/MIGRATION.md`
- `fireworks-engine/AUDIT_SUMMARY.md`
- `fireworks-engine/IMPLEMENTATION_REPORT.md`
- `fireworks-engine/runs/repository-deep-audit-and-guidance.md`
- `fireworks-engine/runs/high-effort-observation-review.md`
- `fireworks-engine/runs/hit-quality-calibration-pass.md`
- `fireworks-engine/runs/latest-deterministic-calibration-pass.md`
- `fireworks-engine/runs/2026-03-21-deterministic-calibration-pass.md`
- `fireworks-engine/runs/2026-03-21-next-leap-decision.md`
- `src/ARCHITECTURE.md`
- `src/main.js`
- `src/app/createFireworksApp.js`
- `src/app/appState.js`
- `src/app/runMetricsCollector.js`
- `src/core/config.js`
- `src/core/engine.js`
- `src/runtime-vnext/*`
- representative `src/render/*`, `src/systems/*`, `src/shells/*`, `src/effects/*`, `src/patterns/*`, `src/app/calibration/*`
- `scripts/run-deterministic-calibration.mjs`
- `package.json`
- `.github/workflows/validation.yml`

## Candidate approaches considered
1. **Render-only premium pass** — stronger bloom/background/charge/target visuals with no runtime-profile or validation upgrade.
2. **Calibration-only mobile scenario pass** — add a high-end mobile scenario and artifact tightening, but leave runtime/render mostly generic.
3. **First-class high-end mobile profile system + premium visual tuning + validation truthfulness upgrade**.
4. **Pressure-only gameplay retune** — fix engagement bands first, defer mobile premium work.

## Chosen approach
**Approach 3, with a targeted pressure retune included inside it.**

Build a first-class high-end mobile profile that can materially raise sharpness/readability/spectacle on capable devices, route premium render choices through config/profile seams instead of ad hoc desktop defaults, extend deterministic calibration with an explicit high-end-mobile scenario, and tighten artifact/report truthfulness so the lane clearly states what it validates and what it does not. Include a bounded objective-pressure retune because scenario comparisons remain low-value while pressure engagement fails every deterministic profile.

## Why it beat the alternatives
- A render-only pass would make the game prettier but leave the repo unable to justify the change truthfully.
- A calibration-only pass would document mobile better without materially improving the actual experience on capable phones/tablets.
- Pressure-only tuning would improve balance confidence but miss the primary product opportunity: high-end mobile should look and feel premium, not merely passable.
- This combined move best matches the repo’s current bottlenecks: first-class mobile experience, truthful validation, and better future tuning leverage.

## Seams affected
- App composition: profile selection, app state, runtime metadata.
- Quality/performance: DPR/quality floors, budget channels, mobile-safe scaling.
- Render: background richness, bloom tuning, charge/impact/target readability treatments.
- Core simulation: objective pressure tuning and premium-effect budget routing.
- Calibration/runtime-vnext: scenario matrix, metrics truthfulness, artifact generation, CI naming/upload clarity.
- Docs/runs: architecture + validation artifacts.

## Expected upside
- Capable mobile devices get visibly richer, sharper, more readable presentation.
- The repo gains an actual high-end-mobile runtime path rather than implicit desktop reuse.
- Deterministic validation can compare high-end mobile against other scenarios with honest scope wording.
- Budget telemetry becomes more useful for premium-render tuning.
- Pressure comparisons become more credible if the retune restores engagement bands.

## Risks accepted
- Broader multi-seam diff than a typical tuning patch.
- Automatic device classification may need follow-up refinement on edge-case tablets/browsers.
- Deterministic validation still cannot prove subjective “premium feel”; it can only validate gameplay/telemetry and budget behavior under the selected profile assumptions.
- Pressure retune may require one or two post-pass adjustments after running the lane.

## Verification plan
1. Implement profile-driven runtime/render tuning with an explicit `high-end-mobile-premium` path.
2. Expand deterministic calibration to include that profile and surface profile metadata in artifacts.
3. Retune objective pressure until deterministic engagement bands are meaningfully improved or clearly reported.
4. Regenerate calibration artifacts and update workflow/report wording for truthfulness.
5. Run the repo validation lane and at least one additional safe check.

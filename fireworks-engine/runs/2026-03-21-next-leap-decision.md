# Next Leap Decision — 2026-03-21

## Problem
Fireworks now behaves like a session/objective action game, but the repository still lacks a trustworthy, repo-local way to calibrate hit-quality, perfect-shot reward, pressure, and scenario variance. The current browser-driven flow is low-trust and blocked prior decision-making.

## Repo evidence reviewed
- `fireworks-engine/AUDIT_SUMMARY.md`
- `fireworks-engine/IMPLEMENTATION_REPORT.md`
- `fireworks-engine/runs/repository-deep-audit-and-guidance.md`
- `fireworks-engine/runs/high-effort-observation-review.md`
- `fireworks-engine/runs/hit-quality-calibration-pass.md`
- `src/ARCHITECTURE.md`
- `src/app/createFireworksApp.js`
- `src/app/runMetricsCollector.js`
- `src/core/config.js`
- `src/core/engine.js`
- `src/runtime-vnext/*`
- `package.json`
- `.github/workflows/*`

## Candidate leaps considered
- **A. Deterministic in-repo calibration runner + trustworthy telemetry**
- **B. Promote runtime-vnext to first-class architecture/governance seam**
- **C. Strengthen the session/objective loop into a fuller game structure**
- **D. Add executable validation/CI enforcement**
- **E. Consolidate governance/docs around current repo reality**

## Chosen leap
**A, with D as follow-through:** build a deterministic repo-local calibration runner that exercises the real objective/hit-quality logic, produces durable artifacts, and is wired into package scripts + CI.

## Why it beat the alternatives
- Prior audits repeatedly identify calibration truthfulness as the immediate bottleneck blocking good balance and next-stage decisions.
- It improves future iteration speed and honesty more than a docs-only or architecture-only pass.
- It creates a reusable executable lane that can later validate gameplay and runtime-vnext changes.
- Gameplay expansion before trustworthy calibration would deepen balance debt.
- runtime-vnext governance promotion matters, but it is not the current highest-risk blocker.

## Seams affected
- App composition: headless calibration harness + metrics export
- Core simulation: objective-run finalization and deterministic exercise surface
- runtime-vnext: event/budget telemetry reuse in non-browser execution
- Repo automation/docs: package scripts, workflows, run artifacts, architecture/process docs

## Expected upside
- Calibration becomes rerunnable in-repo without browser automation.
- Outcome semantics become more stable and reviewable.
- CI can enforce at least one truth-bearing validation lane.
- Balance and scenario discussions can rely on committed artifacts instead of anecdotal play or fragile capture logs.

## Breakage I am willing to tolerate
- Adopting repo-level ESM/tooling assumptions if needed for Node-based runners.
- Minor refactors to app/state/metrics plumbing to support headless execution.
- Historical browser-debug hooks becoming secondary rather than primary.

## Main verification plan
1. Implement seeded deterministic calibration harness against real engine/objective logic.
2. Run the full 3-scenario x10 matrix locally and write JSON + markdown artifacts.
3. Add package/CI wiring and run the new validation command locally.
4. Sanity-check the app still serves via existing static workflow assumptions.

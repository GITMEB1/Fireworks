# Mechanics Truth Contract

## Problem

The May perfect-feel pass described a bounded 68%–97% perfect window, pressure forgiveness, a warning grace period and a phase breather, but production input, overlay and timing paths still disagreed. The deterministic calibration also simulated an obsolete `supernova` shot type instead of the live `perfect-ready` contract.

## Priority

Ship one mechanics truth contract before adding more effects or balance features. This is the smallest end-to-end change that makes the player cue, launch outcome, objective state and validation evidence agree.

## Seam binding

- **Mechanics contract:** `src/core/mechanicsContract.js`, `src/core/config.js`
- **Input and overlay:** `src/systems/inputSystem.js`, `src/render/overlayRenderer.js`
- **Objective loop and app timing:** `src/core/engine.js`, `src/app/createFireworksApp.js`
- **Calibration and CI:** `src/app/calibration/*`, `tests/mechanics-contract.test.mjs`, `package.json`
- **Continuity:** `walkthrough.md`, `fireworks-engine/opportunities/scored_backlog.yaml`

## What changed

- Defined one inclusive 0.68–0.97 perfect-ready classifier used by input, overlay, charge sparks and calibration.
- Kept late releases non-destructive: they are normal shots at full launch power with an amber `LATE — FULL POWER` cue.
- Bounded progressive spark probability to `0..1` and runtime quality.
- Routed positive pressure impulses through 15% forgiveness and implemented a 1,200 ms warning-crossing grace period that cannot refresh until pressure recovers below warning.
- Made the 1,200 ms phase breather advance in real time while pausing objective clocks, target lifetime and spawning; phase advances once and the completed-phase text persists.
- Composed breather and Supernova dilation so the stronger 0.1× cinematic slowdown wins.
- Added focused mechanics tests to the repository validation command and aligned deterministic scenarios with `perfect-ready` terminology.
- Superseded the stale Dirty Burst backlog recommendation instead of silently restoring the removed penalty.

## Verification performed

- `node --test tests/mechanics-contract.test.mjs`: 8 tests passed, 0 failed.
- `node --check` on every changed JavaScript module: passed.
- HTTP/module smoke: `index.html`, `src/main.js` and `src/core/mechanicsContract.js` each returned HTTP 200.
- Deterministic calibration comparison using 40 runs per revision:
  - current `main` (`05b024f92a06190fd5a5d91e00d35b3e74d9441b`): `defer`; all four profiles failed pressure engagement; perfect score attribution was zero;
  - candidate: `prototype`; reduced-motion passed, the other three profiles missed the pressure peak band by less than one point, and all profiles restored non-zero perfect attribution.
- Headless desktop/mobile visual capture was attempted but not completed because this environment has Playwright without a browser executable. The source-level overlay test confirms the exact labels, but subjective render feel and physical-device performance remain unproven.

## Gate decision

- **Product value:** pass — the visible timing cue and actual launch outcome now agree.
- **Seam correctness:** pass — changes stay in the declared mechanics, input, render, objective and validation seams.
- **Performance safety:** pass at mechanism level — new per-frame work is constant-time and particle probability remains bounded and quality-scaled; no device benchmark is claimed.
- **Implementation quality:** pass — boundary, integration, pressure, breather and dilation behaviour is deterministic and reviewable.
- **Decision:** **ship** the mechanics contract. Keep the wider objective-balance calibration at **prototype** until pressure assumptions are retuned or observed on hardware.

## Next step

Review the pushed branch, manually hold through the perfect and late windows on desktop and touch hardware, then open a pull request if the cue and pacing feel right. Do not add another charge outcome before that observation.

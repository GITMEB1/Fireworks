# Objective Loop MVP Pass

## Problem
The current experience has strong moment-to-moment fireworks feel, but weak run-level pressure and win/fail clarity. This pass implements a narrow Objective Pressure Loop MVP so one short session feels like survival/objective play instead of pure sandbox spectacle.

## Seams bound
- **Primary:** Core simulation seam (`src/core/*`), render overlay seam (`src/render/*`).
- **Secondary (minimal):** Input seam (`src/systems/inputSystem.js`) for restart path.
- **Out of seam:** No architecture rewrite, no audio work, no shell-family expansion.

## Files changed
- `src/app/appState.js`
- `src/app/createFireworksApp.js`
- `src/core/config.js`
- `src/core/engine.js`
- `src/core/entities.js`
- `src/render/overlayRenderer.js`
- `src/systems/inputSystem.js`

## What was implemented
1. **Explicit run state:** Added `objectiveRun` model with score, pressure, combo window, phase timer/progress, objective text, and fail status.
2. **Bounded target pressure loop:** Added quality-aware concurrent target budget + spawn cadence/jitter and per-phase target pressure.
3. **Scoring:** Added hit score, clear score, perfect bonus, and light combo multiplier within a short combo window.
4. **Failure/recovery:**
   - Expired targets increase pressure.
   - Dirty shots add pressure.
   - Clears reduce pressure (perfect clears recover more).
   - Passive decay enables recovery.
   - Pressure overflow triggers fail state.
5. **Phase progression:** Clear quota per phase, timer/overtime pressure behavior, and escalating clear requirement by phase.
6. **Restart path:** Fail state can be reset with `R` or first tap/click.
7. **HUD support:** Minimal overlay panel for score, phase, objective text, timer, pressure bar, and fail prompt.
8. **Auto-launch behavior:** Disabled auto-launch when objective mode is enabled to avoid non-player run progression.

## Intentionally deferred
- Deep objective variety (multiple objective types, boss targets, authored set-pieces).
- Additional shell/reward economy redesign beyond simple perfect bonus.
- Any long-run meta progression.
- Advanced telemetry/perf instrumentation (manual runtime sanity pass only this round).

## Verification performed
- Installed dependencies and served app locally.
- Live browser runtime pass with input interactions and objective HUD observation.
- Confirmed scoreboard/pressure/phase HUD appears and updates.
- Confirmed fail prompt appears and restart path is available.
- Captured screenshot artifact for visual verification.

## Gate-based decision
- **Decision:** `prototype`
- **Reason:** Core objective pressure loop is now playable and readable, but tuning (pressure cadence vs clear rates across skill levels/devices) still needs balancing before ship.

## Next step
Run a short tuning pass focused on:
1. pressure gain/recovery balance across average vs strong play,
2. target cadence at low quality scales/mobile profile,
3. HUD copy compactness and warning readability under heavy FX.

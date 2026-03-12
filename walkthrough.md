# Fireworks Simulator — Combined Walkthrough

## Run 1: Deep Debugging (11 issues found, 8 fixed)

Deep debugging run on a 1287-line single-file HTML fireworks simulator. Found **11 issues** (1 critical, 3 high, 3 medium, 4 low). Applied **8 targeted fixes** across 25 edit sites.

Most impactful: 6 of 10 shell types never randomized particle launch angles (I-11, CRITICAL).

| ID | Title | Severity | Status |
|---|---|---|---|
| I-01 | Right-click launches firework | HIGH | ✅ Fixed |
| I-02 | Context-menu on entire document | MEDIUM | ✅ Fixed |
| I-03 | Quality double-multiplied on counts | HIGH | ✅ Fixed |
| I-04 | Reduced-motion allows full autoplay | MEDIUM | ✅ Fixed |
| I-05 | Trail buffer out-of-bounds | HIGH | ✅ Fixed |
| I-06 | `pCfg` reuse in `shellSpiral` | LOW | Noted |
| I-07 | Autoplay stops after interaction | LOW | By design |
| I-08 | `pointercancel` launches firework | MEDIUM | ✅ Fixed |
| I-09 | Canvas missing a11y attributes | LOW | ✅ Fixed |
| I-10 | Visibility change doesn't clear queue | LOW | Noted |
| I-11 | 6 shell types missing angles | **CRITICAL** | ✅ Fixed |

---

## Run 2: Launch Velocity & Hold-to-Charge (this run)

### Baseline Reconciliation
All 8 debugging fixes confirmed present. Found 1 remaining bug: `touchcancel` still launched instead of abandoning.

### Baseline Fix
- **touchcancel → abandon**: New `handleTouchCancel()` deletes pointer without launching

### Variable Rocket Velocity
- `timeToTarget` now derives from `charge`, `heavyPenalty`, and `prestigeSpeedFactor`
- Up to 42% faster ascent at max charge, +10% for prestige
- Heavy shells ~6% slower (realistic weight feel)

### Hold-to-Charge Improvements
1. **Power curve**: `Math.pow(raw, 0.65)` — early hold useful, mid noticeable, max premium
2. **Ascent trail**: thicker lines (+2.4×charge), more sparks, longer trails, sparkle at mid-charge
3. **Explosion payoff**: larger flash, secondary warm glow, lower shockwave threshold (0.25), prestige double shockwave + core burst
4. **Prestige crown**: more particles, faster, longer trails, inner bright glow
5. **Charge visualization**: pulsing core, faster spinning rings, more orbiting dots, prestige power ring

### Browser Validation (10/10 tests PASS)
- Quick tap: ✅ Normal speed, standard explosion
- Short hold: ✅ Slightly faster, charge ring visible
- Medium hold: ✅ Noticeably faster, thicker trail
- Long hold: ✅ Fastest ascent, richest explosion, crown halo
- Speed comparison: ✅ Clearly visible difference
- Right-click: ✅ Blocked
- Autoplay: ✅ Working
- Console: ✅ Clean

### Residual Risks
1. `pCfg` shared mutable state (low risk, currently safe)
2. `touchcancel` untestable on desktop
3. Particle budget peaks at max charge + prestige + doubleBreak (mitigated by pool limits)

### Next Best Improvements
1. Keyboard support (spacebar/escape)
2. Idle resume autoplay
3. Ring buffer class for trail/history
4. Reduced-motion for manual interactions

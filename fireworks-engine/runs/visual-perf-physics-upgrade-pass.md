# Visual / Performance / Physics Upgrade Pass

## 1) Observation summary
Primary evidence came from local play sessions on `http://127.0.0.1:3000` with repeated hold-to-charge launches and stress clicking bursts.

Key findings:
- First-impression spectacle is already strong (night sky, stars, subtle haze).
- Heavy scenes become too bloom-washed; burst readability degrades when many particles are active.
- Adaptive quality scaling does trigger, but bloom still contributes wash in exactly those dense moments.
- Shell ascent is functional but slightly synthetic: mostly clean parabola + gravity with limited atmospheric feel.
- Reduced-motion and quality systems already exist and should be preserved.

Related artifact: `fireworks-engine/runs/observation-pass-visual-perf-physics.md`.

## 2) Chosen opportunities
### Ship candidate A — Adaptive Bloom Pulse Guardrails
- **Category:** visual + performance
- **Player-facing problem:** dense scenes look muddy; bloom cost and wash are not tightly stress-shaped.
- **Source anchor:** OPP-007 Dynamic Bloom Pulse (validated/reframed from observation).

### Ship candidate B — Atmospheric Drag Physics Shaping
- **Category:** physics
- **Player-facing problem:** shell arcs feel too purely ballistic and under-differentiated by shell character.
- **Source anchor:** OPP-001 Atmospheric Drag Physics (validated and made seam-bounded).

### Prototype-first considered — Aggressive bloom skipping mode
- **Decision:** deferred as separate candidate for now.
- **Reason:** new cadence and overload fade already reduced risk while keeping spectacle; further skipping may over-flatten visuals without stronger stress evidence.

## 3) Seam bindings
### A) Adaptive Bloom Pulse Guardrails
- **Seams:** Render seam + Quality/performance seam.
- **Touched files:**
  - `src/render/renderer.js`
  - `src/core/config.js`

### B) Atmospheric Drag Physics Shaping
- **Seam:** Core simulation seam.
- **Touched files:**
  - `src/core/entities.js`
  - `src/core/config.js`

No app-composition or input-system churn.

## 4) Files changed
- `src/core/config.js`
- `src/render/renderer.js`
- `src/core/entities.js`
- `fireworks-engine/runs/observation-pass-visual-perf-physics.md`
- `fireworks-engine/runs/visual-perf-physics-upgrade-pass.md`

## 5) What shipped
### Shipped: Adaptive Bloom Pulse Guardrails
Implemented bounded bloom controls:
- New `CONFIG.BLOOM` section for explicit bloom tunables.
- Stress-aware bloom intensity using particle load + shockwave/flash impact pulse.
- Overload fade to reduce alpha when scene density is very high.
- Cadence throttling (update bloom canvas every N frames in lower-quality/high-overload states).
- Quality-based bloom buffer scale clamped by config instead of fixed multiplier.

Player-facing expectation:
- Premium impact flashes still pop.
- Heavy scenes retain more readable burst structure and less full-screen haze.
- Reduced-motion behavior remains intact (bloom disabled in reduced-motion path as before).

### Shipped: Atmospheric Drag Physics Shaping
Implemented bounded shell-flight drag:
- New `CONFIG.PHYSICS.shellAtmosphericDrag` settings.
- Per-shell drag factor in `PooledFirework.update()` based on:
  - altitude relative to target,
  - upward velocity (apex shaping),
  - shell character multipliers (heavy shells less drag, dirty shells more drag).
- Hard minimum damping floor to avoid over-damping.

Player-facing expectation:
- Ascents feel less synthetic and slightly more material/expressive.
- Heavy shells preserve authority; dirty shells retain erratic personality.

## 6) What stayed prototype-first
- **None newly implemented as code prototype in this pass.**
- “Aggressive bloom skipping mode” is explicitly held as a **future prototype candidate** pending stronger stress evidence.

## 7) Deferred items and why
- **OPP-006 Offscreen Physics Worker Investigation**: deferred (broad architecture impact, weak immediate product-visible value for this pass).
- **Aggressive bloom skip mode**: deferred from implementation to avoid overshooting and harming spectacle without stronger necessity.

## 8) Verification notes (EVAL_GATES)
### Gate A — Product value
- Visual change is noticeable in one session: heavy scenes show more local structure and less wash.
- Physics change is subtle but perceivable during repeated launches (less purely linear ballistic feel).

### Gate B — Seam correctness
- Work remained within declared seams:
  - Render + quality/perf: `renderer.js`, `config.js`
  - Core simulation: `entities.js`, `config.js`
- No unrelated framework-level rewrites.

### Gate C — Performance safety
- Mechanism-based safety changes:
  - Bloom cadence throttling under low quality/high overload.
  - Bloom alpha fade under overload.
  - Bloom buffer scale bounded by quality factor.
- Reduced motion compatibility remains valid (`!reducedMotion` guard preserved).
- No fabricated benchmark claims; only mechanism + observed behavior.

### Gate D — Implementation quality
- Diff is localized and configurable via new config sections.
- Behavior is understandable and reversible by tuning/disable flags.

### Gate E — Decision
- **Adaptive Bloom Pulse Guardrails:** **Ship**.
- **Atmospheric Drag Physics Shaping:** **Ship**.
- **Aggressive bloom skipping mode:** **Defer / prototype later if needed**.

## 9) Manual playtest / stress checklist
- [x] Base launch readability still present (charge arc and target visible).
- [x] Heavy-click stress run still shows active quality system and no hard failures.
- [x] Premium impact moments still visibly punctuated.
- [x] Reduced-motion logic path preserved in code-level guards.
- [x] Mobile/touch compatibility: no input contract changes; behavior should remain intact.

## 10) Rollback notes
- To rollback bloom changes: revert `CONFIG.BLOOM` usage block in `renderer.js` and remove bloom config section.
- To rollback physics shaping: disable via `CONFIG.PHYSICS.shellAtmosphericDrag.enabled = false` or revert firework damping block.

## 11) Next recommended upgrade pass
- Add lightweight instrumentation around active particle counts + bloom cadence state to better quantify stress thresholds.
- Explore burst signature differentiation (behavior seam) with strict particle caps to improve variety without clarity loss.
- Revisit prototype-level aggressive stress bloom skipping only if real-world mobile stress shows persistent readability/perf issues.

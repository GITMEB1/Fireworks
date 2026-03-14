# Leap-Forward Upgrade Plan — Behavior-Seam Burst Signature Differentiation System

## 0) Candidate decision before planning (required)

### Top 3 leap-forward candidates
1. **Behavior-Seam Burst Signature Differentiation System** (behavior + light quality/perf guardrails)
2. **Input Mastery Layer (trajectory prediction + advanced charge affordances + intentional risk windows)** (input + render)
3. **Architecture-level physics offload / deep perf refactor** (core + architecture)

### Why two lose
- **Input Mastery Layer loses now:** it improves control clarity, but does not create a major spectacle/gameplay step-change because current launches already read well and the bigger remaining sameness is post-launch payoff identity.
- **Architecture perf refactor loses now:** high cost and risk, weak immediate player-visible gain versus current stabilized frame pacing; this is a scaling hedge, not the best next delight multiplier.

### Why one wins
- **Burst Signature Differentiation wins** because it attacks the biggest remaining ceiling: many shells still feel like variations of one payoff grammar (similar burst cadence and visual/motion read under stress). Distinct shell identities can create immediate “this shell means something” moments in one short play session, without framework redesign.

---

## 1) Repo-state review summary (Phase 1)

### What has recently improved (grounded in engine run artifacts)
- **Bloom/readability under stress improved** through adaptive bloom pulse guardrails and smoothing (`runs/visual-perf-physics-upgrade-pass.md`, `runs/flicker-perf-fix-pass.md`).
- **Frame pacing/flicker stability improved** via bloom refresh cadence controls and quality-system hot-path cleanup (`runs/flicker-perf-fix-pass.md`, `runs/flicker-perf-audit.md`).
- **Shell flight shaping improved** with atmospheric drag and flight profiles in physics seam (`runs/physics-enhancement-pass.md`, `runs/physics-observation-pass.md`).

### What remains flat / underleveraged
- **Behavior identity is still under-separated**: shell roster is broad (`src/shells/registry.js`) but many outcomes still resolve to dense radial/near-radial burst grammars with limited class-specific choreography sequencing.
- **Death behaviors are shallowly compositional**: dispatcher (`src/effects/deathBehaviors.js`) offers a few variants, but not a strong signature system with predictable archetype identity + differentiated payoff curves.
- **Launch patterns do not exploit shell identity deeply**: patterns (`src/patterns/launchPatterns.js`) mostly place shells spatially/timing-wise, not via intentional identity pairings or contrast arcs.

### Biggest remaining ceiling
- **Primary ceiling: gameplay/mechanics (readability-driven identity and mastery), not raw perf or architecture right now.**
- Rendering/perf received meaningful stabilization; physics got material shaping. The next step-change is **what each shell *means* to the player** (anticipation, payoff, pattern readability, repeat-session variety).

---

## 2) Chosen leap-forward upgrade (Phase 2)

## Title
**Behavior-Seam Burst Signature Differentiation System (BSSDS)**

## Category
Gameplay/mechanics + behavior design (with bounded quality/perf guardrails)

## Player-facing value
- Every shell class becomes immediately legible by **signature choreography**, not just color/count differences.
- Players gain stronger anticipation/memory: “I know what this shell does and when its payoff lands.”
- Variety increases while stress readability is preserved through per-signature budgets and guardrails.

## Why this is a leap forward (not refinement)
- It changes the game’s core expressive loop from “launch fireworks” to “choose/recognize distinct payoff identities.”
- It introduces a **system layer** (signature taxonomy + behavior rules + validation gates), not one-off tuning.
- It has high one-session noticeability (Gate A) and can compound future content additions cleanly.

## Why it beats next 2 strongest alternatives
- Beats **Input Mastery Layer**: larger spectacle + identity impact with less UX-learning overhead.
- Beats **Architecture perf work**: much higher immediate delight/retention upside given perf is currently stabilized enough for ship-level iteration.

## Concrete definition (not vague)

### Shell classes (example taxonomy)
- **Peony / Ring / Star (Precision Bloom class):** crisp, geometric/opening-first signatures.
- **Willow / Brocade / Palm (Sustain Cascade class):** slower-fall, lingering trails, delayed richness.
- **Crackle / Crossette / DoubleBreak / Ghost / Dirty (Volatile Transform class):** staged transforms, asymmetry, or delayed second events.

### Burst choreography changes
- Add **signature scripts** per class: phase sequence (pre-flash → primary break → secondary events → decay profile).
- Distinguish by **timing envelope** (fast punch vs staggered cascade), **directionality** (radial/axial/branching), and **secondary event cadence**.

### Visual/motion identity changes
- Encode class-specific motion fingerprints using existing knobs (drag/decay/trail/sparkle/death behavior chains) rather than new framework.
- Ensure signatures remain legible under quality scale by deterministic simplification rules.

### Payoff differentiation
- Define per-signature payoff category:
  - **Instant impact** (high early peak, short tail)
  - **Layered reveal** (mid-latency second break)
  - **Lingering curtain** (lower peak, longer tail)

### Mastery/readability differences
- Players can intentionally choose shell types to achieve tactical visual outcomes (fast clears, sustained screen painting, combo punctuation).
- Readability supports mastery: recognizable silhouette + timing windows even in dense scenes.

### Quality guardrails
- Per-signature particle budget ceilings tied to `qualityScale`.
- Secondary-event cap and fallback simplification per signature.
- Signature-specific “degradation ladders” to maintain identity under stress (reduce particle count first, preserve choreography order).

## Likely seams involved
- **Primary:** Behavior seam (`src/shells/registry.js`, `src/effects/deathBehaviors.js`, `src/patterns/launchPatterns.js`)
- **Secondary (guardrails only):** Quality/performance seam (`src/core/config.js`, optional light checks where caps are enforced)

## Likely files involved
- `src/shells/registry.js`
- `src/effects/deathBehaviors.js`
- `src/patterns/launchPatterns.js`
- `src/core/config.js`
- Possibly `src/core/entities.js` for minimal metadata plumbing if needed

## Main risks
- Signature over-complexity causing noise/chaos in stress scenes.
- Particle inflation from multi-stage behaviors.
- Archetype drift if taxonomy and launch-pattern usage are not aligned.

## Ship vs prototype recommendation
- **Prototype-first, then ship-path.**
- Rationale: high upside with balancing uncertainty; needs bounded validation against stress/readability gates before full rollout.

---

## 3) Why this is the right next move now (Phase 3)
- Recent upgrades solved foundational stability pain (flicker/frame pacing/readability wash and basic flight shaping).
- The current bottleneck is experiential differentiation, not baseline technical viability.
- BSSDS converts stabilized rendering/physics headroom into visible gameplay identity gains.

---

## 4) Seam binding and architecture impact assessment

## Seam binding
- **In-scope:** behavior seam + config guardrails.
- **Out-of-scope:** app composition, deep engine loop redesign, audio seam.

## Architecture impact
- **Low-to-moderate** if implemented as data-driven signature rules within existing shell/death/pattern modules.
- No framework rewrite required; leverage existing spawning/death dispatch and quality caps.

---

## 5) Implementation phases (Phase 4)

### Phase 1 — Shell taxonomy and signature schema
- **Objective:** define explicit archetype taxonomy and per-type signature metadata.
- **Seams:** behavior, config
- **Likely files:** `src/shells/registry.js`, `src/core/config.js`
- **Risk:** Medium (taxonomy mistakes cascade)
- **Player-visible result:** shell types start feeling intentionally categorized.
- **Mode:** **Plan only → prototype**

### Phase 2 — Burst signature rule implementation
- **Objective:** implement signature scripts (timing envelopes, choreography phases, payoff profiles).
- **Seams:** behavior
- **Likely files:** `src/shells/registry.js`, `src/effects/deathBehaviors.js`
- **Risk:** High (can cause chaos/overdraw)
- **Player-visible result:** clearly distinct shell payoff rhythms.
- **Mode:** **Prototype**

### Phase 3 — Death behavior orchestration upgrade
- **Objective:** extend dispatcher to support class-specific staged secondaries with strict caps.
- **Seams:** behavior + quality/perf guardrails
- **Likely files:** `src/effects/deathBehaviors.js`, `src/core/config.js`
- **Risk:** High
- **Player-visible result:** richer but controlled secondary signatures.
- **Mode:** **Prototype → ship candidate**

### Phase 4 — Launch pattern identity integration
- **Objective:** make patterns intentionally compose contrasting signatures (instead of random assortment).
- **Seams:** behavior
- **Likely files:** `src/patterns/launchPatterns.js`
- **Risk:** Medium
- **Player-visible result:** patterns read as designed spectacles, not just spatial spreads.
- **Mode:** **Ship candidate**

### Phase 5 — Guardrails and stress validation hardening
- **Objective:** enforce per-signature budgets, degradation ladders, readability safeguards.
- **Seams:** quality/perf + behavior
- **Likely files:** `src/core/config.js`, `src/shells/registry.js`, `src/effects/deathBehaviors.js`
- **Risk:** Medium
- **Player-visible result:** variety preserved without chaos/perf collapse.
- **Mode:** **Ship candidate**

### Phase 6 — Final balancing and ship decision
- **Objective:** tune signature distinctness thresholds and finalize rollout set.
- **Seams:** behavior/config
- **Likely files:** same as above
- **Risk:** Medium
- **Player-visible result:** consistent “recognizable shell identity” in short sessions.
- **Mode:** **Ship candidate**

---

## 6) Risk controls
- Cap multi-stage spawn counts per signature class and quality tier.
- Add deterministic fallback for each signature under overload.
- Maintain choreography-order invariants when degrading detail.
- Keep edits seam-bounded and reversible via config toggles.

---

## 7) Verification plan (Phase 5)

Mapped to EVAL_GATES:

1. **One-session noticeability (Gate A):**
   - In a short session, player can correctly identify shell class signature without reading labels.
2. **Stronger shell identity (Gate A):**
   - Each class has unique timing silhouette and motion/readability profile.
3. **More variety without chaos (Gate A + C):**
   - Increased perceived variety while preserving scene legibility in dense launches.
4. **Preserved readability (Gate A + C):**
   - Target marker/major burst silhouettes remain trackable under stress.
5. **Acceptable stress perf behavior (Gate C):**
   - No obvious frame-time instability regressions in heavy launch patterns versus current baseline behavior.
6. **Maintainable seam-bounded implementation (Gate B + D):**
   - Changes confined to declared files/seams, with clear signature config and rollback.

---

## 8) Success criteria
- Players report and demonstrate that shell types feel meaningfully different in both anticipation and payoff.
- Differentiation is visible within one short play session.
- Stress scenes keep readability and avoid reverting to bloom/chaos failure modes.
- Code remains bounded to behavior + guardrail seams and is tunable through config.

---

## 9) Intentionally out of scope
- Audio/sound redesign or mixing.
- Framework or architecture rewrites.
- Deep off-main-thread simulation migration.
- Broad UI redesign.

---

## 10) Decision output (Phase 6)
- **Chosen upgrade:** Behavior-Seam Burst Signature Differentiation System.
- **Why it wins:** highest immediate player-visible step-change after recent stability/physics groundwork; directly addresses remaining sameness ceiling.
- **Start mode:** **Prototype-first** (timeboxed), then ship-path on passing gates.
- **Recommended next Codex implementation task:**
  - “Implement Phase 1+2 prototype: add shell signature taxonomy and staged burst rule scripts for 3 representative archetypes (Precision Bloom, Sustain Cascade, Volatile Transform) with strict per-signature particle caps and overload degradation ladders.”

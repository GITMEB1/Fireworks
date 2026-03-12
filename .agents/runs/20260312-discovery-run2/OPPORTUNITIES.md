# Codebase Opportunity Inventory

### 1. Dynamic Generative Audio System
- **Source Insight:** Play-test Test C (missing audio severely undercuts the visual juice); Platform Scan (Web Audio API).
- **Codebase Hook:** Introduce `src/systems/audioSystem.js`; Hook into `engine.js` (`registerShot`, `spawnParticle`) and `entities.js` (explosion events).
- **Player Value:** Provides massive visceral weight to explosions and satisfying auditory feedback for charging, making every interaction drastically more engaging.

### 2. The "Fever" Orchestral Crescendo
- **Source Insight:** Comparative Design Benchmarking (Peggle's Fever Mode climax); Play-test Test C (Fever visual juice lacks a complementary audio peak).
- **Codebase Hook:** `src/core/engine.js` (inside `if (this.combo >= 3)` trigger), `src/systems/audioSystem.js`.
- **Player Value:** Transforms the Fever state from a neat visual trick into a legendary, memorable gameplay climax that players will actively chase.

### 3. "Sparkler" Continuous Drag Stream
- **Source Insight:** Comparative Design Benchmarking (`andrewdcampbell/jsfireworks`); Architecture Audit (Input System currently only handles single press/release).
- **Codebase Hook:** `src/systems/inputSystem.js` (`handlePointerMove` to emit while button is down); `src/core/engine.js` (`spawnConstantSparks`).
- **Player Value:** Gives players immediate, tactile joy while drawing patterns across the sky, turning "wasted" dragging into a creative tool.

### 4. Post-Processing Bloom & Heavy Visual Impact
- **Source Insight:** Platform Scan (Canvas 2D filters / CSS filters); Benchmarking (Vlambeer's "The Art of Screenshake" emphasis on over-the-top visual weight).
- **Codebase Hook:** `src/render/sceneRenderer.js` (applying `ctx.filter` or CSS `filter: blur() brightness()` during Fever Mode or Supernova explosions).
- **Player Value:** Amplifies the blinding flash of high-tier explosions, making the player feel incredibly powerful when hitting perfect charges.

### 5. Moving "Bonus Bucket" Skill Target
- **Source Insight:** Comparative Design Benchmarking (Peggle's moving bucket); Play-test Test E (identified a drop-off moment where random clicking lacks a long-term goal).
- **Codebase Hook:** `src/core/entities.js` (New `Target` entity); `src/core/engine.js` (update loop collision detection between falling `Ember`/`Glow` and the target).
- **Player Value:** Introduces a persistent, skill-based objective. Catching falling sparks extends combos or triggers mini-rewards, deeply extending replayability.

### 6. Environmental Permanence (Scorch Marks & Ash)
- **Source Insight:** Benchmarking (Vlambeer's concept of Permanence); Architecture Audit (Missing background persistency).
- **Codebase Hook:** `src/render/sceneRenderer.js` (Adding a secondary, persistent off-screen canvas to act as the floor).
- **Player Value:** Makes the environment feel grounded. The accumulation of ash and scorch marks visibly records the history of the player's chaotic session.

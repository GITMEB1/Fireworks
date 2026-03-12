# Impact/Effort Ranking

### High Leverage (High Impact / Low-Medium Effort)
**1. Dynamic Generative Audio System**
- **Impact:** High (Massively improves game feel and the reward loop without needing assets)
- **Effort:** Medium (Requires creating a new `audioSystem.js` and hooking into existing event triggers)

**2. The "Fever" Orchestral Crescendo**
- **Impact:** High (Turns the Fever mechanic into a true climax, maximizing player delight)
- **Effort:** Medium (Built on top of the Audio System, requires timing/pitch sync with `engine.js` timestep)

### Strategic Bets (High Impact / High Effort)
**3. Moving "Bonus Bucket" Target**
- **Impact:** High (Provides long-term replayability and a skill ceiling that prevents player drop-off)
- **Effort:** High (Requires new entity types, spatial collision detection, and UI integration for bonuses)

### Quick Wins (Medium Impact / Low Effort)
**4. "Sparkler" Continuous Drag Stream**
- **Impact:** Medium (Improves tactical feel during downtime)
- **Effort:** Low (Modifying the existing `pointermove` handler in `inputSystem.js`)

**5. Post-Processing Bloom & Visual Impact**
- **Impact:** Medium (Makes explosions "pop" significantly more)
- **Effort:** Low (Adding a canvas `filter` context switch during render, though requires performance testing)

### Backlog (Low Impact or High Effort/Low Return)
**6. Environmental Permanence (Scorch Marks & Ash)**
- **Impact:** Low (A nice-to-have visual detail but doesn't change gameplay)
- **Effort:** Medium (Requires managing a secondary offscreen buffer canvas to avoid memory leaks)

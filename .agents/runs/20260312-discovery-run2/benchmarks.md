# Comparative Design Benchmarking

## Category A: Browser-based Particle Simulators
**Reference:** `andrewdcampbell/jsfireworks` (p5.js interactive fireworks)
**Source Class:** `live_retrieval` (GitHub)
**Mechanic Patterns:**
1. **Continuous Drag Streams:** Instead of only exploding on release, dragging the mouse continuously emits a stream of sparks (like a sparkler).
   - *Complexity:* Extend (100-200 lines to update input handling and emit logic)

## Category B: "Game Feel" / Juice references
**Reference:** Jan Willem Nijman (Vlambeer) "The Art of Screenshake"
**Source Class:** `practitioner`
**Mechanic Patterns:**
1. **Visual and Audio Weight:** Layering low-frequency bass sounds with muzzle flashes to give actions 'weight'.
   - *Complexity:* Extend (150 lines for AudioContext synthesis hooking into the existing flash logic)
2. **Permanence:** Leaving physical evidence of past actions (e.g. bullet casings). In fireworks, this could be scorch marks or ash that accumulates at the bottom of the canvas.
   - *Complexity:* Extend (100 lines for a persistent background canvas buffer)

## Category C: Arcade Skill Games
**Reference:** *Peggle* and *Angry Birds*
**Source Class:** `live_retrieval` / `practitioner` (Game analysis)
**Mechanic Patterns:**
1. **The "Fever" Climax:** Peggle's "Fever Mode" dramatically slows down time globally while queuing an orchestral crescendo. While we have a Fever state, tying it directly to an escalating audio track would vastly improve the payoff.
   - *Complexity:* Architecture (requires an audio system and syncing timestep with audio playback rate)
2. **Moving Bonus Targets:** Peggle uses a moving bucket to catch the ball for bonuses. Fireworks could feature a slowly moving target at the bottom; if a falling spark randomly hits it, it extends the Fever timer or boosts the combo.
   - *Complexity:* Architecture (requires adding collision detection physics to the `update` loop)

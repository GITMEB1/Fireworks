# Comparative Design Benchmarks

## Reference 1: Jan Willem Nijman's "Art of Screenshake" (Vlambeer Game Feel)
- **Category:** Game Feel (Practitioner)
- **Pattern 1:** **Audio-Visual Sync for Hitstop.** Time dilation (which Fireworks has for Supernova) feels incomplete without a synced, heavy bass-drop audio cue that fades back in as time normalizes.
    - **Complexity:** Extend (requires `AudioContext` and linking to current `engine.state.dilation` timer).
- **Pattern 2:** **More Dust/Persistent Debris.** Explosions should leave a lingering "scar" or smoke cloud that persists longer than the bright flash, giving permanence to the action.
    - **Complexity:** Extend (extend `smokeEnabled` to allow longer-living, darker haze elements).

## Reference 2: Rhythm/Skill Arcade Games (e.g., Peggle, Osu!)
- **Category:** Arcade Skill Game
- **Pattern 1:** **Combo Chaining (The "Fever" State).** Successfully hitting the "Perfect Charge" window 3 times in a row should trigger a temporary global multiplier or palette shift (e.g., everything turns gold).
    - **Complexity:** Architecture (requires a new scoring/session state tracking system, currently non-existent).
- **Pattern 2:** **Dynamic Audio Pitching.** The sounds should pitch up slightly with every successive rapid launch, building musical tension before resolving.
    - **Complexity:** Extend (requires `AudioSystem` with frequency modulation based on `timeSinceLastLaunch`).

## Reference 3: High-Performance WebGL/Canvas Particle Demos
- **Category:** Web Particle Simulators
- **Pattern 1:** **Composite Operations.** Using `globalCompositeOperation = 'screen'` or `'lighter'` only on the core flash, while using `'source-over'` for smoke, to prevent the "washed out" look during rapid fire.
    - **Complexity:** Extend (modifying `overlayRenderer.js` and `sceneRenderer.js` blend modes).
- **Pattern 2:** **Vector Force Fields / Wind.** Instead of static gravity, having a moving "wind" vector that all particles respond to, making them drift naturally.
    - **Complexity:** Extend (adding a global wind vector to `config.js` and applying it in `engine.js` update loop).

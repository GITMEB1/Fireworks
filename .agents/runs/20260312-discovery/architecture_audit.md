# Fireworks Architecture Audit

| Seam | Current capability | Obvious gap | Effort estimate (S/M/L) |
|---|---|---|---|
| Configure simulation (`config.js`) | Physics limits, auto-launcher intervals, UI quality steps, specific colour palettes | No runtime-exposed settings menu; no parameterised gravity per-shell; no progressive difficulty | L (for UI) / S (for scaling) |
| Shell Types (`registry.js`) | 10 types (peony, willow, ring, crossette, crackle, palm, spiral, brocade, ghost, doubleBreak) + 1 fizzle | Lacks distinct shapes (hearts, stars) or complex sub-munitions | S |
| Input handling | Detects charge duration, fizzles at >100%, supernova at 95-99% | No touch/tilt support on mobile, no multi-touch simultaneous firing | S |
| Death Behaviors | Crossette split, Crackle strobe, Ghost delay, Double Break split | Trails fading into other colours, whistling sound logic | S |
| Patterns | Basic launch orchestration | Salvos, structured grid bursts, synchronized musical launches | M |
| Graphics layer | Base canvas render loops | Threading (OffscreenCanvas) for high particle counts | L |
| Audio | None | Complete lack of Web Audio integration | M |

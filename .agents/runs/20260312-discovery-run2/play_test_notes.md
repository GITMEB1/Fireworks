## Play-test: Test A — Basic click
- Feeling: satisfying initially, but repetitive quickly
- What worked: Random selection of standard shells + the newly added parametric shapes adds good variety.
- What felt missing: Without holding, the explosions are small and lack 'oomph'. There is no combo incentive to single-click.
- Friction points: Repeated clicks simply reset the combo counter, making them feel like 'wasted' actions if trying to chase the fever loop.
- Delight spikes: Seeing a smiley face or heart trigger randomly.

## Play-test: Test B — Short hold (20-40%)
- Feeling: tactical, building tension
- What worked: The UI charge indicator expands clearly with additional orbit rings to show accumulation of power.
- What felt missing: There's no major difference between a 30% hold and a 60% hold other than slightly more particles.
- Friction points: It breaks the combo just like a basic click, so players are punished unless they go for perfect.
- Delight spikes: The thicker, spark-throwing ascent trail for heavier payloads.

## Play-test: Test C — Perfect charge (95-99%) & Fever Trigger
- Feeling: delightful, powerful
- What worked: Time dilation creates an amazing 'hit pause' feel, and the screen shake adds weight. 
- What felt missing: **Sound.** The massive visual feedback is completely disconnected from the silent acoustic experience. 
- Friction points: Over-shaking the screen on rapid Fever mode can cause motion sickness or make the UI tracker hard to read.
- Delight spikes: Hitting the 3rd perfect charge to trigger the massive "FEVER MODE" banner, followed by wildly over-scaled, prestige-colored shape explosions.

## Play-test: Test D — Overcharge (Fizzle)
- Feeling: disappointing (intentionally)
- What worked: The sudden transition to a dull grey indicator communicates failure instantly without text.
- What felt missing: A distinct 'sad trombone' or fizzle sound effect to cement the failure.
- Friction points: The fizzle particle burst counts against the general particle limit, which could theoretically cull better explosions if fired rapidly before fading.
- Delight spikes: The risk/reward tension making perfect charges feel earned.

## Play-test: Test E — Sustained rapid fire
- Feeling: chaotic, overwhelming
- What worked: The engine handles thousands of particles gracefully by gracefully degrading quality scaling.
- What felt missing: A sense of composition. It just becomes a white-washed screen of overlapping glows.
- Friction points: Screen blending issues (`source-over` vs `lighter`) make the canvas pure white eventually.
- Delight spikes: The momentary absolute chaos feeling like a grand finale.

**Drop-off moment:** 
Once the player triggers the new "FEVER MODE" 2 or 3 times, the novelty wears off. There is no cumulative objective, persistent high score, or progression system to keep them engaged over a longer term. The lack of audio also makes the long-term play loop feel 'flat' compared to the visual juice.

# Observation Pass — Visual / Performance / Physics

## 0) Before editing: run/observe approach + hypotheses

### How I will run and observe
- Serve the game locally with `npm run dev` (http-server on port 3000).
- Use Playwright-driven interaction loops to simulate repeated aim/launch cycles and stress scenes (rapid click bursts).
- Capture snapshots at initial, mid-stress, and heavy-stress points for artifact trail.
- Cross-check observations against render/core/quality seams in source files before selecting upgrades.

### Top 3 opportunity hypotheses to validate/reject
1. **Dynamic bloom is over-washing dense scenes and costs too much in hot moments**.
   - **Ship evidence:** stress scene shows muddy readability + code confirms per-frame blur/downsample pass regardless of frame pressure; can bound with cadence/alpha controls.
   - **Prototype evidence:** visual gain possible but perf risk uncertain after guardrails.
   - **Defer evidence:** bloom already cheap and clarity loss not reproducible.
2. **Shell ascent motion feels synthetic (too ballistic/linear) and could benefit from atmospheric drag shaping**.
   - **Ship evidence:** launch arcs feel samey and code has almost no ascent drag for shells; can add bounded drag preserving archetype differences.
   - **Prototype evidence:** feel improves but shell identity drifts or balancing uncertainty remains.
   - **Defer evidence:** drag hurts readability/timing or reduces burst satisfaction.
3. **Stress fallback is mostly global quality scaling; render path could degrade more gracefully locally**.
   - **Ship evidence:** quality percentage drops under stress but expensive visual pass still runs frequently; add local fallback without architecture changes.
   - **Prototype evidence:** fallback is useful but needs wider instrumentation first.
   - **Defer evidence:** fallback already effective and local controls add complexity without value.

---

## 1) How I ran the game
- Command: `npm run dev` from `/workspace/Fireworks`.
- URL observed: `http://127.0.0.1:3000`.
- Play style:
  - Manual-style interaction scripted with hold-to-charge launches over multiple screen regions.
  - Additional rapid-click stress burst sequence to force dense particle conditions.
- Captured screenshots:
  - `obs-initial.png`
  - `obs-mid-stress.png`
  - `obs-heavy.png`

## 2) What I observed
- First impression is strong: dark gradient sky + stars + soft haze feels premium quickly.
- Aim/charge readability is generally good (arc + crosshair are visible) in light scenes.
- In dense moments, scene becomes low-contrast and samey: many pale streaks blend into a grey/yellow cloud.
- Quality indicator visibly dropped during stress (e.g., observed 88% to 64%), so adaptive system is active.
- Despite quality dropping, heavy scene still looked bloom-washed rather than clearer, suggesting local bloom behavior is not stress-aware enough.
- Shell ascent motion feels mostly uniform parabola with little air resistance character; believable enough, but not expressive.

## 3) Visual weaknesses
- **Bloom clarity issue:** high particle density smears burst detail; ring/shape readability drops.
- **Event differentiation issue:** premium moments (flash/shockwave) can get lost in generally bright haze.
- **Layer separation issue under load:** foreground streaks and background haze collapse into similar luminance.

## 4) Performance suspicion points
- Renderer executes blur/downsample bloom pass every frame when qualityScale >= 0.7 and reduced motion is off.
- Bloom pass sources from full scene canvas, then blurs, then composites—expensive in exactly the moments with highest activity.
- Quality scaling is present, but no obvious bloom cadence throttle tied to stress intensity or low quality state.

## 5) Physics / motion weaknesses
- Shell ascent has gravity + optional dirty jitter but no atmospheric damping, making ascent feel mathematically clean rather than materially physical.
- Heavy vs light shells mostly differ via line width/spark rate/history, less via flight character.
- Opportunity: add light altitude/time-based drag shaping so heavy shells retain momentum while lighter shells soften near apex.

## 6) What already works well (do not harm)
- Charge feedback loop (ring/orbits/spark accents) communicates power state effectively.
- Auto quality scaling visibly reacts in stress scenes.
- Background composition and twinkle field support ambience without overpowering gameplay in calm scenes.
- Reduced-motion path is already wired through quality and smoke controls; upgrades should keep those guardrails intact.

## 7) Top candidate upgrade opportunities from actual observation
1. **Stress-aware dynamic bloom pulse + cadence control** (visual + performance)
   - Keep impact punch on premium events while reducing haze during dense normal scenes.
2. **Atmospheric drag shaping for shell ascent** (physics)
   - Introduce subtle drag curve to improve arc believability and shell character.
3. **Local render fallback in stress (prototype only if needed)**
   - Additional bloom suppression in overload moments beyond global quality percentage.

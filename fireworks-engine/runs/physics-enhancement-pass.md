# Physics Enhancement Pass

## Chosen opportunities and ship / prototype / defer decisions

### SHIP — Atmospheric drag shaping for shell ascent
- **Decision:** Ship.
- **Why (from observation):** Repeated launches showed ascent/apex motion that was readable but too uniformly ballistic.
- **Outcome target:** Preserve clarity while introducing subtle material feel and better pre-burst differentiation.

### PROTOTYPE — Shell-class drag multiplier tuning
- **Decision:** Prototype (bounded).
- **Why (from observation):** Heavy/dirty differences were present but mostly visual; class-linked ascent authority can improve character separation.
- **Outcome target:** Validate stronger archetype identity without breaking timing expectations.

### DEFER — Burst-layer behavioral rewrites
- **Decision:** Defer.
- **Why (from observation):** Core issue was pre-burst motion sameness, not missing burst spectacle.
- **Outcome target:** Keep scope on physics seam and avoid unnecessary cross-seam churn.

## Seam binding to concrete files
- **Primary simulation seam:** `src/core/entities.js`
  - Location for per-shell update integration (velocity damping shaping during ascent/apex approach).
- **Physics tuning seam:** `src/core/config.js`
  - Location for configurable drag constants, class multipliers, and safety clamps.
- **Intentionally untouched seams (for scope control):** render/input/app composition files.

## Implemented changes summary
- Added/used configurable atmospheric drag controls in physics config to keep behavior explicit and reversible.
- Applied ascent-focused damping logic in shell update path, keyed to upward velocity and flight phase, with bounded floor values to prevent over-damping.
- Added/used shell-class modulation (heavy vs dirty/baseline) so physical character tracks observed archetype intent.
- Kept implementation localized to the declared seams (`src/core/entities.js`, `src/core/config.js`) to minimize integration risk.

## Verification against Gate A–E

### Gate A — Product value
- Verified that ascent motion is less synthetic in repeated launch loops, with clearer feel differences between shell classes.
- Verified no loss of core readability: launch anticipation and burst timing remain trackable.

### Gate B — Seam correctness
- Verified work is seam-bounded to physics/config files only.
- Verified no incidental edits to input, app-shell, or render architecture.

### Gate C — Perf/stability safety
- Verified damping math remains lightweight (simple scalar operations in existing update loop).
- Verified dense-scene runs did not show obvious instability or trajectory blow-ups.

### Gate D — Implementation quality
- Verified behavior is tunable via config instead of hard-coded magic values.
- Verified rollback path is straightforward (disable/tune drag section).

### Gate E — Decision integrity
- **Ship:** core atmospheric drag shaping.
- **Prototype:** deeper class-multiplier tuning.
- **Defer:** burst-behavior rewrites outside physics seam.
- Each decision remains tied to observed pre-burst flight behavior and declared seams.

## Stress/perf safety notes and rollback guidance

### Stress/perf safety notes
- Keep drag calculations branch-light and scalar to avoid update-loop bloat under high shell counts.
- Maintain minimum damping floors so high-charge launches do not stall unnaturally near apex.
- Re-check dense rapid-fire scenes after tuning changes to avoid unintentional cadence compression.

### Rollback guidance
1. Set atmospheric drag feature/tunables in `src/core/config.js` to disabled/minimal values for soft rollback.
2. If needed, revert ascent damping block in `src/core/entities.js` for full behavior rollback.
3. Re-run baseline launch/stress loop (`npm run dev` + repeated launches) to confirm restoration of previous trajectory feel.

## Conclusion (explicit tie-back)
Observed behavior showed stable but overly uniform ballistic ascent/apex motion; enhancement decisions were therefore constrained to physics/config seams that directly govern pre-burst trajectory. Ship/prototype/defer choices intentionally avoided unrelated seams and were selected to improve physical character without sacrificing readability or stress safety.

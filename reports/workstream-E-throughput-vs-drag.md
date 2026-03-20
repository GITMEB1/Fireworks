# Workstream E — Delivery throughput versus governance drag

## where process accelerates work
### Direct observation
- `fireworks-engine/SEAM_MAP.md` and `src/ARCHITECTURE.md` give clear file anchors for common work.
- `fireworks-engine/opportunities/scored_backlog.yaml` translates fuzzy ideas into ranked, bounded opportunities with game-specific tradeoffs.
- Many run artifacts are small, seam-bound passes rather than giant rewrites (`physics-enhancement-pass`, `opp-002-dirty-burst-pass`, `flicker-perf-fix-pass`).

## where process slows work
### Direct observation
- The repository carries multiple process layers: `AGENTS.md`, `fireworks-engine/*`, `.agents/*`, and historical PromptFactory references.
- `.agents/workflows/opportunity-discovery.md` is long and ceremony-heavy relative to the actual size of the game codebase.
- `fireworks-engine/prompts/*`, `fireworks-engine/schemas/*`, backlog files, and run artifacts create a substantial documentation surface for a relatively small codebase.

## where rigor is useful
### Direct observation
- Mobile/perf/readability concerns recur across docs and source, and bounded seam planning clearly helps avoid broad churn.
- Runtime-vnext work especially benefits from explicit seam binding and prototype gating (`fireworks-engine/runs/engine-evolution-phase0-execution.md`, `post-leap-stability-audit.md`).
- Opportunity scoring reflects actual product priorities better than generic engineering metrics.

## where rigor becomes theater
### Direct observation
- Evaluation language is more detailed than the actual automated enforcement stack.
- Several run artifacts claim mechanism-level or manual confidence, but the repo still lacks standard scripts for repeatable test/lint/build validation.
- PromptFactory-style claim-control and sourcing language remains in `.agents/workflows/opportunity-discovery.md` even though the current tasking model is repo-local and seam-bound.

### Inference
- The planning layer is stronger than the implementation enforcement layer, so some rigor currently functions as narrative discipline rather than operational control.

## throughput verdict
**accelerates planning but slows implementation**

### Why
### Direct observation
- The seam-bound Fireworks docs are good at turning ideas into scoped candidate work.
- The repo still carries overlapping governance surfaces and substantial artifact ceremony.
- Enforcement/tooling does not yet offset that overhead with equally strong automation.

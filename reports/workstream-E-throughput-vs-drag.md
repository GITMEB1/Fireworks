# Workstream E — throughput vs drag

## where process accelerates work

### direct observation
- `AGENTS.md` gives a short repo-specific operator path and explicitly prioritizes seam-local changes over framework churn.
- `fireworks-engine/SEAM_MAP.md` and `TASK_TYPES.md` reduce search cost by routing work to concrete source seams.
- `fireworks-engine/opportunities/scored_backlog.yaml` makes prioritization game-native rather than abstract.
- `fireworks-engine/runs/*` preserve implementation context across multiple passes, including objective loop, runtime-vNext, perf audits, and reinforcement passes.
- The source tree itself is modular enough that seam-bound planning is not fiction.

### inference
- For non-trivial work, the Fireworks-native layer likely **improves continuity and reduces thrash**. It helps a new contributor orient quickly.

## where process slows work

### direct observation
- The repo still carries multiple process layers: `AGENTS.md`, `fireworks-engine/*`, `.agents/*`, historical migration notes, and a vestigial `PromptFactory` gitlink.
- `fireworks-engine` includes prompts, schemas, scored backlog, migration notes, audit summary, implementation report, and many run artifacts.
- `.agents/workflows/opportunity-discovery.md` is a long, multi-stage workflow with live retrieval, benchmarking, capability scan, claim-control, and evaluation-gate steps.
- There is little automation backing this documentation density.

### inference
- Governance overhead is most likely to slow work when contributors feel compelled to satisfy overlapping documentation systems rather than the smallest useful seam-bound pass.

## where rigor is useful

### direct observation
- The codebase now contains gameplay economy logic, target-state systems, adaptive quality, runtime budgets, fallback rendering, and a hybrid runtime-vnext layer.
- `src/core/engine.js`, `src/render/renderer.js`, and `src/runtime-vnext/*` are rich enough that undisciplined edits could create regressions or misleading perf claims.
- Run artifacts around runtime-vNext and calibration show why durable reasoning matters for architecture and tuning work.

### inference
- Rigor is useful for cross-seam changes, architecture moves, performance claims, and game-balance changes where anecdotal feel can mislead.

## where rigor becomes theater

### direct observation
- The repo claims to avoid mandatory long-form docs before coding, yet it still retains long workflow scripts and many process artifacts.
- CI does not strongly enforce the verification discipline described in docs.
- The Pages workflow deploys static content without validation.
- The Azure workflow suggests build/test formality but currently tolerates missing build/test scripts.

### inference
- Rigor becomes theater when the repo produces ever more planning/reporting artifacts without converting them into enforced checks or simplified authority.
- The biggest theater risk is **planning inflation**: rich governance language with weak operational enforcement.

## throughput verdict

### direct observation
- The seam-bound Fireworks layer is genuinely helpful for framing significant work.
- The combined governance stack remains heavier than the actual tooling maturity.

### inference
- **Verdict: accelerates planning but slows implementation.**
- The operating model helps determine what to do and where to do it.
- It slows implementation when overlap between `fireworks-engine/*` and `.agents/*` is not collapsed, and when reporting obligations exceed automation.

## exact evidence list with file paths
- `AGENTS.md`
- `fireworks-engine/README.md`
- `fireworks-engine/OPERATING_MODEL.md`
- `fireworks-engine/TASK_TYPES.md`
- `fireworks-engine/SEAM_MAP.md`
- `fireworks-engine/EVAL_GATES.md`
- `fireworks-engine/MIGRATION.md`
- `fireworks-engine/AUDIT_SUMMARY.md`
- `fireworks-engine/IMPLEMENTATION_REPORT.md`
- `fireworks-engine/opportunities/scored_backlog.yaml`
- `fireworks-engine/runs/repository-deep-audit-and-guidance.md`
- `fireworks-engine/runs/high-effort-observation-review.md`
- `.agents/workflows/opportunity-discovery.md`
- `.agents/workflows/implement-fever-state.md`
- `package.json`
- `.github/workflows/static-pages.yml`
- `.github/workflows/azure-webapps-node.yml`
- `src/app/createFireworksApp.js`
- `src/core/engine.js`
- `src/render/renderer.js`
- `src/runtime-vnext/createRuntimeVNext.js`
- `src/runtime-vnext/renderers/webgl2PrototypeRendererAdapter.js`

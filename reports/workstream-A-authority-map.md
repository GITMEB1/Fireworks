# Workstream A — authority map

## declared authority

### direct observation
- `AGENTS.md` declares the repo operating layer starts in `fireworks-engine/` and orders work through `fireworks-engine/OPERATING_MODEL.md`, `TASK_TYPES.md`, `SEAM_MAP.md`, and `EVAL_GATES.md` before implementation.
- `fireworks-engine/README.md` declares `fireworks-engine/` is the Fireworks-native operating layer and says it "replaces generic PromptFactory-style process docs" with a seam-bound system.
- `fireworks-engine/MIGRATION.md` declares `fireworks-engine/` is now the default enhancement layer and says legacy PromptFactory-style workflow docs are historical reference.
- `fireworks-engine/OPERATING_MODEL.md` claims a 7-stage flow from opportunity framing through evaluation, with every run ending in an artifact.
- `.agents/workflows/opportunity-discovery.md` still declares a PromptFactory-style structured analysis workflow with canonical staged discovery, live retrieval, practitioner sourcing, play-test gates, claim-control, and evaluation gate language.

### inference
- On paper, authority is supposed to be: root `AGENTS.md` -> `fireworks-engine/*` -> seam-bound execution in `src/*`, with `.agents/*` and `PromptFactory` demoted to historical reference.

## practical authority

### direct observation
- The real runtime entrypoint is `src/main.js`, which calls `createFireworksApp(...)` and starts the app.
- `src/app/createFireworksApp.js` is the actual composition root: it wires config, state, audio, runtime-vnext, engine, resize, quality, input, reduced-motion binding, and run metrics collection.
- `fireworks-engine/SEAM_MAP.md` maps work to real source seams in `src/*`, which broadly matches how the codebase is physically organized.
- `fireworks-engine/opportunities/scored_backlog.yaml` is game-specific rather than generic: it scores delight, spectacle, clarity, retention, perf cost, mobile risk, seam count, and prototype/ship recommendations.
- `fireworks-engine/runs/` contains substantial project-history artifacts tied to actual repo evolution, including runtime-vNext, objective loop, destructible targets, perf audits, and reinforcement passes.
- The `PromptFactory` path is not usable as an in-repo operator surface in this checkout: `git ls-files --stage PromptFactory` reports mode `160000`, meaning a gitlink/submodule entry, while `.gitmodules` is missing and no usable contents were available.

### inference
- The real operator path for current work is: `AGENTS.md` -> `fireworks-engine/*` -> actual runtime/source seams in `src/*`.
- Practical authority comes from whichever layer is both specific to Fireworks and physically executable against the current tree. That excludes `PromptFactory` proper in this checkout.

## stale authority

### direct observation
- `.agents/workflows/opportunity-discovery.md` still instructs a browser-first, benchmark-heavy, PromptFactory-style discovery process that is much broader and heavier than the seam-bound Fireworks operating layer.
- `.agents/workflows/implement-fever-state.md` is a prescriptive implementation workflow bound to an older opportunity framing and older assumptions about the loop.
- `.agents/runs/20260312-discovery*` directories still contain large PromptFactory-style artifacts such as `response_plan.yaml`, `architecture_audit.md`, `OPPORTUNITIES.md`, play-test notes, capability scans, and evaluation gates.
- `fireworks-engine/AUDIT_SUMMARY.md` itself says generic PromptFactory-style workflow docs should be archived/deprecated as the primary path.
- `fireworks-engine/IMPLEMENTATION_REPORT.md` says the embedded `PromptFactory/` directory is present but empty in this snapshot and describes `fireworks-engine/` as the replacement operating subsystem.

### inference
- `.agents/*` is not dead, but much of it is stale authority: retained, versioned, and still readable, yet inconsistent with the repo's stated present-tense operating model.

## ambiguous authority

### direct observation
- `fireworks-engine/README.md` says there is no generic multi-domain prompt framework, but `fireworks-engine/prompts/*.md` still implement prompt modules by task type.
- `fireworks-engine/MIGRATION.md` says PromptFactory-like content under `.agents/workflows/` and `.agents/runs/` should be treated as historical reference, but those directories remain committed and legible enough to still be used.
- `src/ARCHITECTURE.md` describes app/engine/extensibility seams, but does not mention `src/runtime-vnext/*`, even though runtime-vnext is now in the live composition root.
- `fireworks-engine/SEAM_MAP.md` names render, quality/performance, and app composition seams, but does not model `src/runtime-vnext/*` as a first-class seam despite that layer owning renderer selection, fallback, budgets, and events.

### inference
- The repo's declared authority is clear at the highest level, but not yet fully consolidated: some old governance surfaces remain committed, and some new architectural authority has outgrown the docs.

## contradictions

### direct observation
- `fireworks-engine/README.md` says the Fireworks layer replaces generic PromptFactory-style process docs, yet `.agents/workflows/opportunity-discovery.md` is still committed and still self-describes in PromptFactory terms.
- `fireworks-engine/MIGRATION.md` says legacy PromptFactory-style docs are historical reference, yet `.agents/*` remains a live, versioned workflow and artifact surface.
- `fireworks-engine/README.md` says the operating layer is built around real seams in `src/core`, `src/systems`, `src/render`, `src/shells`, `src/effects`, and `src/app`, but the live composition root also depends on `src/runtime-vnext/*`, which the official seam map omits.
- `fireworks-engine/SEAM_MAP.md` treats render and quality as seams but does not acknowledge that runtime-vnext owns budget routing and renderer fallback decisions now active in `src/app/createFireworksApp.js`.
- `fireworks-engine/MIGRATION.md` says the embedded `PromptFactory` entry is a git submodule pointer, but the checkout has no `.gitmodules`, so even the legacy pointer is partially broken and cannot operate as a healthy submodule workflow.

## verdict

### direct observation
- Fireworks has a real native authority layer, but it is not the only governance surface left in the tree.

### inference
- Authority today is **tiered rather than singular**:
  1. **Real operator entrypoint:** `AGENTS.md` plus `fireworks-engine/*`.
  2. **Real execution authority:** `src/main.js` and `src/app/createFireworksApp.js`, then the seam-local `src/*` modules.
  3. **Residual alternative authority:** `.agents/*`.
  4. **Vestigial authority:** `PromptFactory` gitlink.

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
- `.agents/workflows/opportunity-discovery.md`
- `.agents/workflows/implement-fever-state.md`
- `.agents/runs/20260312-discovery/response_plan.yaml`
- `.agents/runs/20260312-discovery/architecture_audit.md`
- `.agents/runs/20260312-discovery/OPPORTUNITIES.md`
- `src/ARCHITECTURE.md`
- `src/main.js`
- `src/app/createFireworksApp.js`
- `src/runtime-vnext/createRuntimeVNext.js`
- `PromptFactory` (gitlink observed via git index)
- `.gitmodules` (missing)

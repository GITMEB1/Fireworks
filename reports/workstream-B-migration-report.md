# Workstream B — Migration truth report

## retained concepts
### Direct observation
- `fireworks-engine/MIGRATION.md` explicitly retains staged execution, opportunity triage, evaluation gates, and handoff artifacts.
- `fireworks-engine/OPERATING_MODEL.md` keeps a seven-stage flow from framing through evaluation.
- `fireworks-engine/TASK_TYPES.md` preserves a task taxonomy.
- `fireworks-engine/schemas/*.md` preserve structured artifact templates.
- `fireworks-engine/prompts/*.md` preserve prompt-module style execution.

## removed concepts
### Direct observation
- `fireworks-engine/MIGRATION.md` says framework-heavy language and generic mandatory rituals were removed.
- `fireworks-engine/README.md` explicitly rejects enterprise workflow abstraction, generic multi-domain prompt framework, and mandatory long-form docs before coding.
- `fireworks-engine/AUDIT_SUMMARY.md` rejects generic discovery language that is not seam-bound.

### Inference
- What was removed is mostly framing and ceremony, not the deeper artifact-driven operating style.

## renamed/repackaged concepts
### Direct observation
- Generic PromptFactory workflow language has been repackaged into Fireworks-specific docs: `OPERATING_MODEL.md`, `TASK_TYPES.md`, `SEAM_MAP.md`, `EVAL_GATES.md`, and opportunity backlog files.
- `.agents/runs/.../opportunities_inventory.yaml` became `fireworks-engine/opportunities/inventory.yaml`.
- Generic process outputs are now framed as Fireworks seam-bound artifacts via `fireworks-engine/schemas/*` and `fireworks-engine/runs/*`.

## evidence of simplification
### Direct observation
- Fireworks-native docs are shorter and more repo-specific than `.agents/workflows/opportunity-discovery.md`.
- `fireworks-engine/SEAM_MAP.md` points directly at concrete code files under `src/`.
- `fireworks-engine/opportunities/scored_backlog.yaml` scores opportunities with game-specific fields such as delight, spectacle, clarity, retention, perf cost, and mobile risk.
- Many run artifacts in `fireworks-engine/runs/` bind work to exact seams and files rather than broad generic workflow stages.

### Inference
- The simplification is real at the documentation layer for mainline planning and prioritization.

## unresolved overlap
### Direct observation
- `.agents/workflows/opportunity-discovery.md` still prescribes PromptFactory canonical stages including live retrieval, practitioner sources, browser playtests, and claim-safety rules.
- The `PromptFactory` gitlink still exists in the repository index.
- `fireworks-engine/prompts/*.md` and `fireworks-engine/schemas/*.md` show the repo still operates with prompt-driven artifacts, just under new Fireworks naming.
- Run artifacts such as `fireworks-engine/runs/repository-deep-audit-and-guidance.md` still discuss PromptFactory remnants as historical/optional rather than deleted.

### Inference
- The repo has replaced the default vocabulary and entrypoint, but not fully eliminated PromptFactory-derived structure or all old surfaces.

## migration verdict
**partial migration with overlap**

### Why
### Direct observation
- Default docs and root guidance clearly point to `fireworks-engine/`.
- PromptFactory proper is not populated and is non-operational in this checkout.
- Older PromptFactory-style workflows remain committed in `.agents/` and are specific enough that they could still be used.
- The new system still retains major PromptFactory primitives: staged flows, prompts, schemas, run artifacts, and evaluation gating.

### Inference
- This is not a purely cosmetic rename, because the new layer is materially more seam-bound and game-specific.
- It is also not a clean full replacement, because the old workflow surfaces remain present, legible, and partially live.

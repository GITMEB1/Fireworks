# Workstream B — migration report

## retained concepts

### direct observation
- The repo retained staged execution. `fireworks-engine/OPERATING_MODEL.md` still uses a seven-stage pipeline from opportunity framing to evaluation.
- The repo retained task typing. `fireworks-engine/TASK_TYPES.md` classifies work into opportunity, juice, feature, performance, refactor, audit, experiment, and content tasks.
- The repo retained artifact-driven handoff. `fireworks-engine/schemas/*.md` still define briefs, seam bindings, implementation plans, test plans, experiment records, and eval records.
- The repo retained scored opportunity triage. `fireworks-engine/opportunities/scored_backlog.yaml` formalizes ranking before implementation.
- The repo retained durable run artifacts. `fireworks-engine/runs/*` is an active long-lived evidence trail.
- The repo retained explicit gating. `fireworks-engine/EVAL_GATES.md` is a direct descendant of formal evaluation gating.

### inference
- Fireworks did not reject PromptFactory's core discipline primitives. It kept the parts that support decision continuity and auditability.

## removed concepts

### direct observation
- `fireworks-engine/README.md` explicitly says the new layer intentionally excludes enterprise workflow abstraction, generic multi-domain prompt framework language, and mandatory long-form docs before coding.
- `fireworks-engine/MIGRATION.md` says framework-heavy language and generic mandatory rituals were intentionally removed.
- The new backlog scoring is Fireworks-specific rather than generic claim-control scoring. It centers delight, spectacle, clarity, retention, perf cost, regression risk, mobile risk, seam count, and prototype/ship recommendations.

### inference
- What appears genuinely removed is the old attempt at cross-domain portability. The new docs are for this game, not for an abstract reusable governance product.

## renamed or repackaged concepts

### direct observation
- PromptFactory-style staged workflow has been repackaged as the Fireworks 7-stage operating model.
- PromptFactory-style opportunity inventory/ranking has been repackaged as `fireworks-engine/opportunities/inventory.yaml` and `fireworks-engine/opportunities/scored_backlog.yaml`.
- Prompt modules still exist, but they are now task-specific to Fireworks under `fireworks-engine/prompts/*.md`.
- Run artifacts remain, but the repository treats them as Fireworks execution passes rather than generic PromptFactory run folders.
- Evaluation gates remain, but they are now keyed to product value, seam correctness, performance safety, implementation quality, and ship/prototype/defer decisions.

### inference
- The migration is not a deletion of PromptFactory ideas; it is a narrowing and re-anchoring of them around Fireworks-specific seams and game outcomes.

## evidence of genuine simplification

### direct observation
- `fireworks-engine/README.md` gives a short, repo-specific operating entrypoint instead of a broad research/program-management script.
- `fireworks-engine/SEAM_MAP.md` binds work directly to concrete `src/*` files rather than to generic abstract domains.
- `fireworks-engine/prompts/opportunity_hunter.md` is much shorter and more execution-oriented than `.agents/workflows/opportunity-discovery.md`.
- `fireworks-engine/opportunities/scored_backlog.yaml` uses game-native scoring fields instead of generalized sourcing/claim-compliance machinery.
- Representative `fireworks-engine/runs/*` entries, especially runtime-vNext and gameplay-evolution passes, are tightly coupled to repo architecture and recent implementation history.

### inference
- The simplification is real where the repo now uses seam binding plus game-specific scoring instead of generic discovery theater.

## unresolved overlap

### direct observation
- `.agents/workflows/opportunity-discovery.md` still prescribes PromptFactory canonical stages including live retrieval, practitioner sources, browser playtests, claim-safety rules, and evaluation gate checks.
- `.agents/workflows/implement-fever-state.md` remains a live implementation recipe tied to an earlier operating model.
- `.agents/runs/*` still stores PromptFactory-style run packs with `response_plan.yaml`, `task_intel.yaml`, benchmark notes, capability scans, and evaluation gates.
- The `PromptFactory` gitlink still exists in the index as mode `160000`, even though the checkout lacks a working `.gitmodules` mapping and usable checked-out contents.
- `fireworks-engine/AUDIT_SUMMARY.md` and `MIGRATION.md` talk about archiving/deprecating old surfaces, but those surfaces have not been removed or clearly fenced off.

### inference
- The overlap is not hypothetical. The repo currently preserves two recognizable governance idioms: a Fireworks-native seam-bound layer and an older PromptFactory-style workflow layer.

## migration verdict

### direct observation
- The default vocabulary, task surface, opportunity scoring, and seam map are now Fireworks-specific.
- PromptFactory proper is non-operative in this checkout because it is only a gitlink with no working submodule mapping.
- Older PromptFactory-style workflow artifacts remain committed and still actionable.

### inference
- **Verdict: partial migration with overlap.**
- This is not a cosmetic rewrite because the repo now has a materially different operator surface centered on real seams and product-specific scoring.
- It is also not a successful full replacement because old workflow surfaces remain present, versioned, and semantically strong enough to compete with the new layer.

## exact evidence list with file paths
- `fireworks-engine/README.md`
- `fireworks-engine/OPERATING_MODEL.md`
- `fireworks-engine/TASK_TYPES.md`
- `fireworks-engine/SEAM_MAP.md`
- `fireworks-engine/EVAL_GATES.md`
- `fireworks-engine/MIGRATION.md`
- `fireworks-engine/AUDIT_SUMMARY.md`
- `fireworks-engine/IMPLEMENTATION_REPORT.md`
- `fireworks-engine/opportunities/inventory.yaml`
- `fireworks-engine/opportunities/scored_backlog.yaml`
- `fireworks-engine/prompts/code_auditor.md`
- `fireworks-engine/prompts/evaluator.md`
- `fireworks-engine/prompts/experiment_designer.md`
- `fireworks-engine/prompts/feature_designer.md`
- `fireworks-engine/prompts/implementation_writer.md`
- `fireworks-engine/prompts/juice_designer.md`
- `fireworks-engine/prompts/opportunity_hunter.md`
- `fireworks-engine/prompts/performance_investigator.md`
- `fireworks-engine/prompts/refactor_planner.md`
- `fireworks-engine/schemas/enhancement_brief.yaml.md`
- `fireworks-engine/schemas/seam_binding.yaml.md`
- `fireworks-engine/schemas/implementation_plan.yaml.md`
- `fireworks-engine/schemas/test_plan.yaml.md`
- `fireworks-engine/schemas/experiment_record.yaml.md`
- `fireworks-engine/schemas/eval_record.yaml.md`
- `fireworks-engine/runs/repository-deep-audit-and-guidance.md`
- `.agents/workflows/opportunity-discovery.md`
- `.agents/workflows/implement-fever-state.md`
- `.agents/runs/20260312-discovery/response_plan.yaml`
- `.agents/runs/20260312-discovery/architecture_audit.md`
- `.agents/runs/20260312-discovery/OPPORTUNITIES.md`
- `PromptFactory` (gitlink observed via git index)
- `.gitmodules` (missing)

# Optional comparator — PromptFactory minimum viable rigor for Fireworks

## canonical PromptFactory-style elements still visible here

### direct observation
- Staged workflow remains in `fireworks-engine/OPERATING_MODEL.md`.
- Task-class routing remains in `fireworks-engine/TASK_TYPES.md`.
- Prompt modules remain in `fireworks-engine/prompts/*.md` and even more explicitly in `.agents/workflows/*`.
- Artifact schemas remain in `fireworks-engine/schemas/*.md`.
- Run logs remain in `fireworks-engine/runs/*` and `.agents/runs/*`.
- Evaluation gating remains in `fireworks-engine/EVAL_GATES.md` and `.agents/.../evaluation_gate.md`.
- Claim-control style discovery language remains most visibly in `.agents/workflows/opportunity-discovery.md`.

## minimum viable subset worth preserving for Fireworks

### inference
Retain only the parts that materially improve game work at this repo's scale:
- a **single authority entrypoint**: `AGENTS.md` -> `fireworks-engine/*`.
- a **real seam map** aligned to current architecture, including `src/runtime-vnext/*`.
- a **small scored backlog** using Fireworks-native fields.
- a **short run report** for meaningful passes.
- an **explicit verdict** (`ship` / `prototype` / `defer`).
- a **minimal evidence rule**: claims about perf, player value, or architecture changes must cite source files and checks actually performed.

## PromptFactory rigor that is too heavy for this repo

### direct observation
- `.agents/workflows/opportunity-discovery.md` mandates extended discovery stages, benchmark gathering, live retrieval, capability scans, claim-safety bookkeeping, and multiple output artifacts.
- The repo lacks the enforcement tooling to justify that much ritual.

### inference
The following looks too heavy for Fireworks at current scale:
- mandatory multi-stage discovery for ordinary seam-local changes,
- broad external benchmarking before repo-local verification,
- formal claim-control taxonomies when the repo lacks matching automated validation,
- maintaining both `.agents/*` and `fireworks-engine/*` as parallel governance systems.

## recommendation

### inference
Retain the **discipline primitives**, not the full PromptFactory ceremony. Fireworks should keep seam binding, scored prioritization, explicit verdicts, and short evidence-backed run artifacts. It should retire or archive the long canonical workflow theater unless a task is unusually strategic, externally consequential, or cross-repo in nature.

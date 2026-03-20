# Workstream A — Source-of-truth and governance authority map

## declared authority
### Direct observation
- `AGENTS.md` declares `fireworks-engine/` the operating layer and says non-trivial work should start with `fireworks-engine/OPERATING_MODEL.md`, `TASK_TYPES.md`, `SEAM_MAP.md`, and `EVAL_GATES.md` (`AGENTS.md`).
- `fireworks-engine/README.md` says `fireworks-engine/` is the "Fireworks-native operating layer" and that it "replaces generic PromptFactory-style process docs" (`fireworks-engine/README.md`).
- `fireworks-engine/MIGRATION.md` says `fireworks-engine/` is now the default enhancement layer and legacy PromptFactory-style docs are historical reference (`fireworks-engine/MIGRATION.md`).
- `.agents/workflows/opportunity-discovery.md` still declares a "PromptFactory-style structured analysis" workflow, names PromptFactory as the canonical process, and requires browser/live retrieval stages that are external to Fireworks seam binding (`.agents/workflows/opportunity-discovery.md`).

## practical authority
### Direct observation
- The actual runtime entrypoint is code, not process docs: `src/main.js` starts `createFireworksApp(...)`, and `src/app/createFireworksApp.js` composes app state, engine, systems, runtime-vnext, metrics, and renderer selection.
- The repo-level agent guidance currently exposed to tools is `AGENTS.md`, and it explicitly points to `fireworks-engine/` first.
- Current repo artifacts are denser and newer inside `fireworks-engine/runs/` than inside `.agents/workflows/`; the former contains implementation/audit records tied to concrete repo seams, while the latter contains a small set of workflow scripts plus March 12 discovery traces.
- `PromptFactory` is tracked as a gitlink (`git ls-files --stage` shows mode `160000 PromptFactory`) rather than a populated working tree, so it cannot practically serve as the in-repo operating center in this checkout.

### Inference
- The practical operator path for present work is: `AGENTS.md` -> `fireworks-engine/*` docs -> seam-bound source modules in `src/`. PromptFactory itself is not executable authority here because its contents are absent.
- `.agents/` still has practical influence as a historical or fallback workflow library, but not as the primary entrypoint.

## stale authority
### Direct observation
- `.agents/workflows/opportunity-discovery.md` instructs a browser-first, multi-stage PromptFactory process with external live retrieval and benchmark steps; that is materially different from the Fireworks-native seam-first workflow now declared at repo root.
- `.agents/workflows/implement-fever-state.md` is a prescriptive feature script for a specific mechanic rather than a general operating layer, and it references tooling/process assumptions that do not match current repo guidance.
- `fireworks-engine/AUDIT_SUMMARY.md` says generic PromptFactory-style workflow docs should be archived/deprecated as the primary path.

### Inference
- `.agents/workflows/*` is stale as default governance, even if some ideas remain reusable.

## ambiguous authority
### Direct observation
- `fireworks-engine/MIGRATION.md` says PromptFactory-like content in `.agents/workflows/` and `.agents/runs/` is historical reference, but those directories remain versioned and prominent.
- `fireworks-engine/README.md` says there is no generic multi-domain prompt framework, yet `fireworks-engine/prompts/*.md` still preserve a prompt-module model, and `.agents/workflows/opportunity-discovery.md` preserves PromptFactory vocabulary.
- `AGENTS.md` tells meaningful run artifacts to go under `fireworks-engine/runs/`, but `.agents/runs/` remains populated with prior workflow outputs.

### Inference
- The migration did not fully retire older authority markers; it redirected default entry, but left multiple adjacent process surfaces active in the tree.

## contradictions
- `fireworks-engine/README.md` says the new layer replaces generic PromptFactory-style process docs, but `.agents/workflows/opportunity-discovery.md` is still committed and still describes itself as using PromptFactory's canonical process.
- `fireworks-engine/MIGRATION.md` says legacy PromptFactory-style docs are historical reference, but the repo still tracks an actual `PromptFactory` gitlink and a live `.agents/` workflow directory.
- `fireworks-engine/README.md` claims a lean system centered on real seams, but `fireworks-engine/SEAM_MAP.md` does not name the active `src/runtime-vnext/*` seam that current code and multiple run reports treat as real.

## evidence list with exact file paths
- `AGENTS.md`
- `fireworks-engine/README.md`
- `fireworks-engine/MIGRATION.md`
- `fireworks-engine/AUDIT_SUMMARY.md`
- `fireworks-engine/OPERATING_MODEL.md`
- `.agents/workflows/opportunity-discovery.md`
- `.agents/workflows/implement-fever-state.md`
- `.agents/runs/20260312-discovery/task_intel.yaml`
- `src/main.js`
- `src/app/createFireworksApp.js`
- `PromptFactory` (git submodule entry; observed via git index)

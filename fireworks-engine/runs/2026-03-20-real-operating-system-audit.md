# 2026-03-20 real operating system audit

## problem
Determine whether Fireworks has genuinely transitioned from generic PromptFactory-style governance to a Fireworks-native seam-bound operating layer, and whether the documented operating model matches actual repository practice.

## seam binding
- Documentation/governance seam: `AGENTS.md`, `fireworks-engine/*`, `.agents/*`, `PromptFactory`, root backlog/opportunity docs.
- Architecture/runtime seam: `src/main.js`, `src/app/*`, `src/core/*`, `src/render/*`, `src/runtime-vnext/*`, `src/systems/*`, `src/shells/*`, `src/effects/*`, `src/patterns/*`.
- Tooling/deployment seam: `package.json`, `.github/workflows/*`.

## files touched
- `reports/workstream-A-authority-map.md`
- `reports/workstream-B-migration-report.md`
- `reports/workstream-C-seam-integrity.md`
- `reports/workstream-D-verification-reality.md`
- `reports/workstream-E-throughput-vs-drag.md`
- `reports/FIREWORKS_REAL_OPERATING_SYSTEM_AUDIT.md`
- `reports/OPTIONAL-PROMPTFACTORY-MINIMUM-VIABLE-RIGOR.md`
- `fireworks-engine/runs/2026-03-20-real-operating-system-audit.md`

## what changed
- Replaced placeholder/partial audit outputs with a consolidated evidence-led governance and architecture truth audit.
- Recorded authority order, PromptFactory migration status, seam integrity findings, verification reality, throughput/governance-drag analysis, and a synthesis verdict.
- Added optional comparator on the minimum viable PromptFactory rigor worth preserving.

## verification performed
- Static inspection only; no gameplay/runtime execution was performed in this audit pass.
- Inspected root guidance, Fireworks operating docs, representative `.agents` workflows/runs, root opportunity/backlog files, runtime composition roots, representative source seams, runtime-vnext files, package/scripts, GitHub workflows, and git index state for `PromptFactory`.
- Repository inspection commands used included:
  - `find . -name AGENTS.md -print`
  - `sed -n` on mandated docs and representative source files
  - `rg --files` for repo inventory
  - `rg -n` for PromptFactory/runtime-vnext/tooling evidence
  - `git ls-files --stage PromptFactory`
  - `git ls-tree HEAD PromptFactory`
  - `git status --short --branch`

## gate-based decision
- `ship` (documentation decision support only)
- Reason: the audit artifact is complete enough to guide cleanup and governance consolidation without claiming unperformed runtime validation.

## next step
Use the synthesis report to decide whether to formally archive `.agents/*` and the `PromptFactory` gitlink, then update `fireworks-engine/SEAM_MAP.md` and `src/ARCHITECTURE.md` so the documented operating model reflects `src/runtime-vnext/*` as a first-class seam.

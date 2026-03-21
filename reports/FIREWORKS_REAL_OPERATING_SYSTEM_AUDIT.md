# Fireworks real operating system audit

## 1. Executive verdict

### direct observation
- Fireworks has a real repo-native operating layer in `fireworks-engine/` and a real modular game runtime in `src/`.
- The repo is no longer governed primarily by a populated `PromptFactory` checkout.
- The migration is incomplete because `.agents/*` remains an alternate governance surface and the `PromptFactory` gitlink still exists.
- The documented seam model lags behind the live architecture because `src/runtime-vnext/*` is operational but not first-class in the official seam map.
- Verification maturity is mixed: runtime safeguards exist, but CI/package enforcement is thin.

### inference
Fireworks has **genuinely moved beyond generic PromptFactory governance**, but it has **not fully consolidated** into a single current operating system. The repo's real OS today is a **Fireworks-native seam-bound planning layer anchored in `AGENTS.md` and `fireworks-engine/*`, executed against a real modular runtime in `src/*`, with leftover PromptFactory-era residue still present and insufficiently archived**.

## 2. What the repo says it is
- `AGENTS.md` says `fireworks-engine/` is the operating layer and that work should be planning-first, seam-bound, and reported via concise run artifacts.
- `fireworks-engine/README.md` says the repo replaced generic PromptFactory-style docs with a lean, Fireworks-native system centered on real source seams.
- `fireworks-engine/OPERATING_MODEL.md` says execution follows seven stages from opportunity framing to evaluation.
- `fireworks-engine/MIGRATION.md` says legacy PromptFactory-style content is historical reference, not the default path.

## 3. What the repo actually appears to be
- A real browser game codebase with modular seams in `src/*`.
- A serious repo-local planning/reporting layer in `fireworks-engine/*`.
- A partially retired but still visible PromptFactory-era workflow layer in `.agents/*`.
- A vestigial `PromptFactory` gitlink that is not operational in this checkout.
- A codebase whose current architecture includes runtime-vnext composition and hybrid render paths beyond what the official seam docs fully describe.

## 4. The real source of truth today

### direct observation
- Runtime truth starts at `src/main.js` and `src/app/createFireworksApp.js`.
- Repo operating truth starts at `AGENTS.md` and then `fireworks-engine/*`.
- Old `.agents/*` content is still present, but current top-level instructions point elsewhere.
- `PromptFactory` proper is not practically usable here.

### inference
The real source of truth order today is:
1. **Root operating instruction:** `AGENTS.md`.
2. **Current governance layer:** `fireworks-engine/OPERATING_MODEL.md`, `TASK_TYPES.md`, `SEAM_MAP.md`, `EVAL_GATES.md`, scored backlog, and recent `fireworks-engine/runs/*`.
3. **Actual executable architecture:** `src/main.js`, `src/app/createFireworksApp.js`, then seam-local source modules.
4. **Historical secondary evidence:** `.agents/*`.
5. **Vestigial artifact:** `PromptFactory` gitlink.

## 5. Migration verdict

### inference
**Migration verdict: partial migration with overlap.**
- It is not merely cosmetic because Fireworks now uses game-native scoring, seam binding, repo-local prompts, and architecture-coupled run artifacts.
- It is not complete because old PromptFactory-style workflows are still committed and the `PromptFactory` gitlink still exists.

## 6. Seam integrity verdict

### inference
**Seam integrity verdict: mostly real, but the docs are behind the architecture.**
- Behavior, render, and app/core separation are materially real.
- `src/runtime-vnext/*` is an architectural fact but not yet a first-class documented seam.
- `src/core/engine.js` remains overloaded and should be treated as a high-risk seam regardless of how clean the surrounding directory structure looks.

## 7. Verification maturity verdict

### inference
**Verification maturity verdict: partially operational.**
- Runtime has real safeguards: adaptive quality, runtime budgets, fallback rendering, reduced-motion handling, calibration export.
- Repository automation is underpowered: no real test/lint/build pipeline, no strongly enforced CI validation before deploy.

## 8. Throughput verdict

### inference
**Throughput verdict: accelerates planning but slows implementation.**
- The Fireworks-native layer makes non-trivial work easier to frame and hand off.
- Governance overlap and weak automation create drag once work moves from planning to execution.

## 9. Top 5 strongest findings
1. The repo now has a real Fireworks-native operating layer, not just renamed generic docs.
2. The source tree really is seam-local and game-specific enough to support that operating layer.
3. `PromptFactory` itself is non-operative in this checkout; it survives only as a gitlink artifact.
4. `fireworks-engine/opportunities/scored_backlog.yaml` is clear evidence of genuine domain-specific prioritization rather than generic process carryover.
5. Runtime safeguards are real inside the app even though repository-level enforcement is weak.

## 10. Top 5 highest-risk weaknesses
1. Governance overlap remains unresolved: `AGENTS.md`, `fireworks-engine/*`, `.agents/*`, and `PromptFactory` all still exist.
2. Official seam documentation understates the importance of `src/runtime-vnext/*`.
3. `src/core/engine.js` is an overloaded coordination seam and a likely future regression hotspot.
4. Verification language is stronger than verification automation.
5. CI/deployment configuration is weakly aligned with the repo's stated rigor; Pages deploys with no checks and Azure relies on mostly absent scripts.

## 11. Recommendations

### retain
- Keep `AGENTS.md` as the top-level operator contract.
- Keep `fireworks-engine/*` as the repo-native planning/reporting layer.
- Keep scored backlog plus concise run artifacts.
- Keep runtime guardrails in quality, budget, and fallback systems.

### collapse
- Collapse authority so `.agents/*` is clearly historical or clearly deleted from the active path.
- Collapse seam documentation so `src/runtime-vnext/*` is explicitly modeled in `fireworks-engine/SEAM_MAP.md` and reflected in `src/ARCHITECTURE.md`.
- Collapse redundant workflow language so contributors do not have to reconcile two governance dialects.

### automate
- Add at least one real validation script to `package.json` and run it in CI.
- Gate deployment on that script.
- Add a lightweight import/syntax/smoke check to convert current documentary rigor into enforced rigor.

### delete/archive
- Archive or explicitly de-emphasize `.agents/workflows/*` and older `.agents/runs/*` if they are no longer part of the live operator path.
- Archive or remove the broken/non-operative `PromptFactory` gitlink if it is no longer needed.
- Archive stale reports that continue to describe old governance surfaces as active when they are meant to be historical.

## 12. Final conclusion: What the real operating system of Fireworks is today

Fireworks' real operating system today is **a seam-bound, game-specific planning and reporting layer in `fireworks-engine/`, anchored by `AGENTS.md`, executed against a real modular runtime rooted in `src/main.js` and `src/app/createFireworksApp.js`, and supplemented by runtime guardrails inside the app itself**. It is **not PromptFactory anymore**. But it is also **not yet a fully consolidated Fireworks-native OS**, because old PromptFactory-derived workflow surfaces still coexist and the official seam model has not caught up to the actual runtime-vnext architecture.

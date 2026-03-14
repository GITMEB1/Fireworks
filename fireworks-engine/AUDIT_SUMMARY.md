# Fireworks + PromptFactory Audit Summary

## Repo reality check
- Fireworks has clear app and engine boundaries with real extension seams in `src/`.
- Runtime entrypoint is `src/main.js`, composed through `src/app/createFireworksApp.js`.
- Core seam modules are already explicit (`core`, `systems`, `render`, `shells`, `effects`, `patterns`).

## What from PromptFactory-style workflow is useful
- Staged thinking (discover -> plan -> implement -> evaluate).
- Durable run artifacts (briefs, plans, evaluation records).
- Explicit opportunity ranking before coding.

## What is overbuilt or misaligned
- Generic multi-stage discovery language that is not seam-bound by default.
- Heavy documentation cadence before implementation.
- Framework vocabulary that obscures concrete Fireworks file ownership.

## PromptFactory clone status in this repo
- `PromptFactory/` exists but is empty in this checkout.
- PromptFactory-like content appears to have been adapted into `.agents/workflows/` and `.agents/runs/`.

## Archive / rewrite / delete guidance
- **Archive/deprecate:** generic PromptFactory-style workflow docs as the primary operating path.
- **Rewrite:** process entrypoint around opportunity triage + seam binding + scoring.
- **Delete:** nothing destructive now; prefer documented migration due to historical run artifacts.

## What should become Fireworks-native
- Task classes tied to Fireworks enhancement jobs.
- Seam map tied to actual `src/` modules.
- Backlog scoring fields that reflect delight/spectacle/clarity/retention vs perf/risk.
- Short execution prompts focused on implementable change.

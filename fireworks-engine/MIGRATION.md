# PromptFactory Migration Notes

## Current state
- The embedded `PromptFactory` entry is a git submodule pointer in this repository.
- In this checkout, the submodule content is effectively unavailable for direct in-repo edits.
- PromptFactory-like process content that *is* available lives under `.agents/workflows/` and `.agents/runs/`.

## Migration strategy
- `fireworks-engine/` is now the default enhancement operating layer.
- Legacy PromptFactory-style workflow docs are treated as historical reference, not the primary path.
- Reuse legacy run artifacts only when they provide concrete implementation evidence.

## Conceptual retention
- staged execution,
- opportunity triage,
- explicit evaluation gates,
- handoff artifacts.

## Intentional simplification
- removed framework-heavy language,
- removed generic mandatory rituals,
- centered all planning on Fireworks seam bindings.

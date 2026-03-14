# Fireworks Enhancement Engine

`fireworks-engine/` is the Fireworks-native operating layer for planning and executing product improvements.

It replaces generic PromptFactory-style process docs with a lean system built around real seams in this repository (`src/core`, `src/systems`, `src/render`, `src/shells`, `src/effects`, `src/app`).

## What this is for
- Turn enhancement ideas into shippable tasks.
- Route work to the right code seams early.
- Keep evidence and evaluation close to implementation.
- Produce durable artifacts for the next agent/developer.

## Start here
1. Read `OPERATING_MODEL.md`.
2. Pick a task class in `TASK_TYPES.md`.
3. Bind seams via `SEAM_MAP.md`.
4. Score opportunities in `opportunities/scored_backlog.yaml`.
5. Run implementation with one prompt module in `prompts/`.
6. Record outcomes using `schemas/` templates.

## Not included on purpose
- No enterprise workflow abstraction.
- No generic multi-domain prompt framework.
- No mandatory long-form docs before coding.

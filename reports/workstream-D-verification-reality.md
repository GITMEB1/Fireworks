# Workstream D — Verification and enforcement realism

## actual tooling inventory
### Direct observation
- `package.json` defines only `start` and `dev`, both using `http-server`.
- No test runner config, linter config, formatter config, or typechecker config was found in repo root.
- `.github/workflows/azure-webapps-node.yml` invokes `npm run build --if-present` and `npm run test --if-present`, but those scripts do not exist in `package.json`.
- `fireworks-engine/runs/` contains many markdown run artifacts and one JSON metrics artifact (`hit-quality-calibration-data.json`).
- There is lightweight in-app metrics plumbing via `src/app/runMetricsCollector.js` and runtime events under `src/runtime-vnext/contracts/*`.

## documentary safeguards
### Direct observation
- `fireworks-engine/EVAL_GATES.md` defines product, seam, performance, implementation, and decision gates.
- `fireworks-engine/OPERATING_MODEL.md` requires a verification pass and evaluation artifact.
- `fireworks-engine/schemas/test_plan.yaml.md` and `fireworks-engine/schemas/eval_record.yaml.md` define structured validation templates.
- Many run reports include "Verification performed" sections.

## enforced safeguards
### Direct observation
- There is no evidence of automated tests, lint checks, or CI quality gates that would fail a change locally in this checkout.
- Runtime-vnext does emit budget and objective events, and `src/app/runMetricsCollector.js` can serialize metrics, so there is some executable instrumentation.
- Fallback behavior and renderer mode metadata are operational in code via `src/runtime-vnext/createRuntimeVNext.js` and `src/app/createFireworksApp.js`.

### Inference
- The repo enforces a small amount of runtime behavior observability, but almost none of the broader governance language is machine-enforced.

## biggest enforcement gap
- The repo talks in detail about evaluation, quality gates, and verification, but ships without automated `test`, `lint`, `build`, or type-check scripts in `package.json`.

## minimum tooling upgrade with highest leverage
- Add one deterministic, headless verification lane around runtime events and objective metrics.

### Direct observation
- `src/app/runMetricsCollector.js` and `src/runtime-vnext/contracts/runtimeEventTypes.js` already provide an event surface.
- `fireworks-engine/runs/hit-quality-calibration-pass.md` explicitly calls for an in-repo calibration runner without external browser dependency.

### Inference
- A Node-based deterministic scenario runner over engine/runtime events would give the highest leverage because it reuses existing instrumentation and directly supports the repo's calibration-heavy governance language.

## maturity verdict
**partially operational**

### Why
### Direct observation
- The repo has real runtime instrumentation and a large habit of recording run reports.
- The repo lacks standard automated enforcement for most of its stated evaluation doctrine.

### Inference
- Verification is more than pure documentation, but still under-tooled relative to its governance vocabulary.

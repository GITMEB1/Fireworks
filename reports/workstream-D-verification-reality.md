# Workstream D — verification reality

## actual tooling inventory

### direct observation
- `package.json` defines only `start` and `dev`, both serving the repo with `http-server`.
- No `test`, `lint`, `build`, `typecheck`, or validation scripts are defined in `package.json`.
- `.github/workflows/static-pages.yml` deploys static content directly to GitHub Pages; it does not run validation.
- `.github/workflows/azure-webapps-node.yml` runs `npm install`, `npm run build --if-present`, and `npm run test --if-present`, which means build/test are optional and currently no-op because the scripts are absent.
- `src/systems/qualitySystem.js` is an in-app adaptive runtime safeguard.
- `src/app/runMetricsCollector.js` is an in-app metrics collector that records quality scale and budget-denial data per run and can export calibration JSON through the console.
- `src/runtime-vnext/contracts/runtimeBudgetManager.js` and runtime event contracts provide runtime guardrail plumbing.

### inference
- The repo has **runtime guardrails** but only **minimal repository-level tooling**.

## documentary safeguards

### direct observation
- `AGENTS.md` requires truthful reporting, seam binding, and run artifacts for substantial work.
- `fireworks-engine/EVAL_GATES.md` defines product/seam/perf/quality decision gates.
- `fireworks-engine/schemas/test_plan.yaml.md` and `eval_record.yaml.md` define expected verification artifacts.
- `fireworks-engine/runs/*` repeatedly record checks, confidence levels, and ship/prototype/defer decisions.
- `.agents/workflows/opportunity-discovery.md` contains extensive evaluation-gate language and claim-control rules.

### inference
- The repo is rich in documentary verification language. It tells contributors how to think and how to report.

## enforced safeguards

### direct observation
- Adaptive quality scaling is enforced in runtime through `src/systems/qualitySystem.js`.
- Renderer-mode fallback is enforced in `src/runtime-vnext/createRuntimeVNext.js` and the WebGL2 prototype adapter via Canvas2D fallback.
- Budget requests and budget-denial events are enforced in runtime-vnext budget plumbing and consumed by `src/core/engine.js` and `src/app/runMetricsCollector.js`.
- Reduced-motion behavior is bound in `src/systems/motionPreferenceSystem.js` and consulted by quality/render logic.

### inference
- The strongest enforcement is **inside the running app**, not in CI or package scripts.

## biggest enforcement gap

### direct observation
- There is no repeatable automated check that the repo can even build, lint, or statically validate JavaScript.
- There is no test runner configured.
- There is no lint/type discipline configured.
- The main deployment workflow for Pages uploads the repository as-is with no preflight validation.
- The Azure workflow appears partially templated and weakly maintained: it contains duplicate `env:` keys and relies on missing build/test scripts.

### inference
- **Biggest enforcement gap: the governance layer claims disciplined verification, but repository automation barely enforces anything before deployment.**

## smallest high-leverage tooling upgrade

### direct observation
- The repo is plain JavaScript and static hosting. A lightweight check could be added without architecture churn.

### inference
- **Smallest high-leverage upgrade:** add a real validation script surface in `package.json` and wire it into CI. Even one of these would materially improve truthfulness:
  - syntax/static parse check for `src/**/*.js`,
  - a minimal smoke test that loads the app or validates imports,
  - a real `npm run test` or `npm run lint` target that CI actually executes.
- This is smaller and more leverage-rich than adding more documentation because it converts current documentary gates into enforced preflight checks.

## maturity verdict

### direct observation
- Verification exists as runtime safeguards, detailed docs, run reports, and some calibration instrumentation.
- Verification is not strongly enforced by package scripts or CI.

### inference
- **Verdict: partially operational.**
- Calling it "documentary only" would ignore genuine runtime budget/fallback/quality enforcement.
- Calling it "meaningfully enforced" would overstate the absent repo-level automation.

## exact evidence list with file paths
- `AGENTS.md`
- `fireworks-engine/EVAL_GATES.md`
- `fireworks-engine/schemas/test_plan.yaml.md`
- `fireworks-engine/schemas/eval_record.yaml.md`
- `fireworks-engine/runs/high-effort-observation-review.md`
- `fireworks-engine/runs/repository-deep-audit-and-guidance.md`
- `.agents/workflows/opportunity-discovery.md`
- `package.json`
- `.github/workflows/static-pages.yml`
- `.github/workflows/azure-webapps-node.yml`
- `src/app/createFireworksApp.js`
- `src/app/runMetricsCollector.js`
- `src/systems/qualitySystem.js`
- `src/systems/motionPreferenceSystem.js`
- `src/core/engine.js`
- `src/runtime-vnext/createRuntimeVNext.js`
- `src/runtime-vnext/contracts/runtimeBudgetManager.js`
- `src/runtime-vnext/contracts/runtimeEventTypes.js`

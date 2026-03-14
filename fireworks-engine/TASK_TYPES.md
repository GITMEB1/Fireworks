# Fireworks Task Classes

## OPPORTUNITY_HUNT
- **When to use:** Need fresh, ranked product opportunities.
- **Required inputs:** architecture map, playtest/perf notes, current backlog.
- **Expected outputs:** scored opportunity list + top-3 recommendations.
- **Common seams:** app composition, input, render, quality/perf.
- **Evaluation criteria:** novelty, measurable player value, realistic implementation scope.

## JUICE_TUNING
- **When to use:** Improve game feel (impact, feedback, delight) without major feature additions.
- **Required inputs:** target interaction loop, current feel pain points, frame budget constraints.
- **Expected outputs:** parameter/code changes + before/after criteria.
- **Common seams:** shells, effects, render overlay, audio.
- **Evaluation criteria:** felt intensity, readability, no perf cliff, reduced motion compatibility.

## FEATURE_DESIGN
- **When to use:** New mechanic or mode requiring scoped design before code.
- **Required inputs:** problem statement, seam candidates, constraints.
- **Expected outputs:** implementation-ready spec and phaseable rollout plan.
- **Common seams:** input, core simulation, patterns, overlay/app state.
- **Evaluation criteria:** user value clarity, seam fit, migration/rollback simplicity.

## PERFORMANCE_DIAGNOSIS
- **When to use:** Jank, dropped frames, thermal issues, mobile regressions.
- **Required inputs:** repro path, rough perf profile, device/browser notes.
- **Expected outputs:** bottleneck list + ranked fixes.
- **Common seams:** core entities update loop, renderer, quality system.
- **Evaluation criteria:** frame-time improvement, stability under stress, low regression risk.

## ARCHITECTURE_REFACTOR
- **When to use:** Structural coupling slows delivery or causes bug churn.
- **Required inputs:** pain points, ownership boundaries, target seam contract.
- **Expected outputs:** staged refactor plan with compatibility steps.
- **Common seams:** app composition, engine boundary, registry/dispatcher modules.
- **Evaluation criteria:** reduced coupling, easier feature insertion, no behavior drift.

## CODE_AUDIT
- **When to use:** Need fast quality/risk review of existing implementation.
- **Required inputs:** scope files, recent changes, known incidents.
- **Expected outputs:** findings grouped by severity + fix recommendations.
- **Common seams:** any touched modules; often input/core/render.
- **Evaluation criteria:** correctness, maintainability, consistency with architecture seams.

## EXPERIMENT_DESIGN
- **When to use:** Uncertain value; need prototype or A/B style validation.
- **Required inputs:** hypothesis, target metric, success threshold.
- **Expected outputs:** experiment plan + instrumentation + decision rule.
- **Common seams:** app state, input loop, quality/perf instrumentation.
- **Evaluation criteria:** signal quality, reversibility, implementation cost.

## CONTENT_GENERATION
- **When to use:** Need reusable artifacts (briefs, plans, release notes, migration docs).
- **Required inputs:** source evidence, decision context, target consumer.
- **Expected outputs:** concise artifact ready for team execution.
- **Common seams:** docs and opportunity files; optionally overlay copy/status UI.
- **Evaluation criteria:** actionability, factual grounding in repo, minimal bloat.

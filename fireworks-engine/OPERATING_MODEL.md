# Fireworks Operating Model (7 Stages)

This flow optimizes for shipping real Fireworks product improvements, not process theater.

## 1) Opportunity framing
**Goal:** Define the player/product problem worth solving now.
- **Inputs:** playtest notes, backlog, bugs, perf signals, user reports.
- **Outputs:** `enhancement_brief` draft with problem, audience, expected gain.

## 2) Seam binding
**Goal:** Attach the opportunity to concrete code seams before ideation drifts.
- **Inputs:** enhancement brief, `SEAM_MAP.md`, current source state.
- **Outputs:** `seam_binding` with target files/modules + excluded areas.

## 3) Feasibility and impact scoring
**Goal:** Rank work by value/risk/cost using Fireworks metrics.
- **Inputs:** seam binding, inventory candidates.
- **Outputs:** scored entry in `opportunities/scored_backlog.yaml`, ship recommendation.

## 4) Design pass
**Goal:** Produce the smallest design that can deliver measurable user-facing improvement.
- **Inputs:** scored opportunity, constraints (perf/mobile/accessibility).
- **Outputs:** `implementation_plan` + acceptance criteria + rollback notes.

## 5) Implementation pass
**Goal:** Execute in-repo changes at bounded seams.
- **Inputs:** implementation plan, seam binding, prompt module (usually `implementation_writer.md`).
- **Outputs:** code diff + short change log.

## 6) Verification pass
**Goal:** Prove behavior and quality before claiming success.
- **Inputs:** changed code, `test_plan`.
- **Outputs:** checks run, pass/fail notes, unresolved risks.

## 7) Evaluation and next-step recommendation
**Goal:** Close the loop with evidence and a concrete next move.
- **Inputs:** verification outcomes, qualitative playtest/perf observations.
- **Outputs:** `eval_record` with verdict (`ship`, `prototype`, `defer`) + next task candidate.

## Practical rules
- Prefer one seam-focused change over cross-cutting rewrites.
- If confidence is low, pick `prototype_first: true`.
- Every run must end in an artifact someone else can execute immediately.

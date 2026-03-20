# Optional comparator — PromptFactory minimum viable rigor for Fireworks

## canonical PromptFactory-style elements still visible here
- Stage-based execution and explicit stop/evaluation gates (`.agents/workflows/opportunity-discovery.md`, `fireworks-engine/OPERATING_MODEL.md`).
- Artifact-driven handoff (`.agents/runs/*`, `fireworks-engine/runs/*`, `fireworks-engine/schemas/*`).
- Claim discipline around evidence and confidence (`.agents/workflows/opportunity-discovery.md`).

## minimum viable subset worth preserving for a game repo
1. **Seam binding before ideation drift**
   - Preserve `SEAM_MAP.md`-style file anchoring.
2. **One lightweight opportunity scoring pass**
   - Preserve game-specific backlog scoring, not generic multi-stage discovery ceremony.
3. **Prototype vs ship decision gate**
   - Preserve explicit `ship` / `prototype` / `defer` outcomes.
4. **Short verification record tied to changed seams**
   - Preserve concise run artifacts with what changed, what was verified, and what remains risky.
5. **Evidence labeling when claims outrun enforcement**
   - Preserve the habit of distinguishing direct observation from inference, especially for perf and feel claims.

## PromptFactory rigor that looks too heavy for this repo
- Mandatory external benchmark/live retrieval stages for ordinary seam-local changes.
- Multi-document discovery cascades before implementation for small gameplay/perf fixes.
- Generic framework vocabulary that obscures file ownership.

## recommendation
Retain the **discipline primitives** from PromptFactory, but keep them inside the smaller Fireworks-native shell: seam map, scored backlog, short run report, explicit verdict, and minimal evidence labeling. Drop the old canonical workflow theater unless the task is unusually strategic or externally consequential.

# Evaluation Gates

Use these gates to decide if a change should ship.

## Gate A — Product value
- Does this clearly improve player delight, readability, or retention?
- Is the value noticeable in one play session?

## Gate B — Seam correctness
- Are touched files aligned with declared seam binding?
- Did we avoid unnecessary cross-seam coupling?

## Gate C — Performance safety
- No obvious frame-time regressions in stress interaction.
- Quality scaling still works; reduced motion path still valid.

## Gate D — Implementation quality
- Diff is understandable and maintainable.
- Behavior is testable (manual or automated) with clear acceptance criteria.
- Deterministic or otherwise reviewable validation path exists when balance/telemetry claims are central to the change.
- Validation artifacts must say what they do **not** prove when visual feel or device-specific performance is part of the pitch.

## Gate E — Decision
- **Ship:** high value, controlled risk, verified.
- **Prototype:** promising but uncertain; instrument and timebox.
- **Defer:** weak value/risk ratio or wrong timing.

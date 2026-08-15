# Walkthrough: Charge, Supernova, Pressure and Phase Flow

Fireworks uses one shared mechanics contract so the input outcome, charge cue and gameplay reward stay aligned.

## Charge timing

Holding a pointer builds a clamped charge ratio after the minimum hold duration:

- **Normal (below 68%):** launches with the accumulated power.
- **Perfect-ready (68%–97%, inclusive):** the indicator turns white-hot and the release launches at full power.
- **Late (above 97%):** the indicator turns amber and says `LATE — FULL POWER`; the release remains a full-power normal shot. The removed fizzle/overburn penalty does not return.

The same classifier in `src/core/mechanicsContract.js` drives input, the overlay and progressive charge sparks. A perfect-ready launch becomes a Supernova only when it makes direct target contact.

## Supernova feedback

A confirmed Supernova triggers:

- 0.1× cinematic time dilation for 300 ms;
- screen shake and a brief colour flash;
- a short hit-stop and bass drop;
- combo/Fever progression.

Phase-breather slowdown is composed with this cinematic channel. The stronger Supernova slowdown takes priority instead of being overwritten.

## Objective pressure

Positive pressure impulses—target expiry, dirty shots and overtime—flow through one helper:

- `pressureSpikeForgiveness: 0.85` reduces each positive impulse by 15%;
- crossing the warning threshold starts a 1,200 ms failure grace period;
- the grace period does not refresh while pressure stays above warning;
- it re-arms only after pressure falls below the warning threshold;
- passive decay and clear recovery remain separate negative pressure changes.

## Phase breather

Clearing a phase starts a 1,200 ms real-time breather:

- the completed-phase message remains visible for the full interval;
- target spawning, target lifetime and the phase clock pause;
- non-target spectacle continues at the configured breather scale;
- the next phase resumes once, with no duplicate phase increment.

## Rendering and performance

- Charge-ramp particle probability is clamped to `0..1` and scaled by runtime quality.
- Reactive bloom, target readability, adaptive quality and reduced-motion behaviour remain unchanged.
- Late timing uses an amber cue without adding a destructive outcome or a new shell family.

## Verification

Run:

```bash
npm ci
npm run validate
```

`npm run validate` executes the focused mechanics-contract tests before the deterministic calibration lane. Browser observation is still required for subjective feel, mobile rendering and physical-device performance claims.

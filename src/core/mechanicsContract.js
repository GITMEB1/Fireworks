const DEFAULT_FRAME_MS = 16.666;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function getChargeRatio(durationMs, chargeConfig) {
  const minDuration = Math.max(0, chargeConfig?.minDuration || 0);
  const maxDuration = Math.max(minDuration + 1, chargeConfig?.maxDuration || minDuration + 1);
  if (!Number.isFinite(durationMs) || durationMs <= minDuration) return 0;
  const ratio = clamp((durationMs - minDuration) / (maxDuration - minDuration), 0, 1);
  return Math.round(ratio * 1_000_000) / 1_000_000;
}

export function getChargeState(durationMs, chargeConfig) {
  const ratio = getChargeRatio(durationMs, chargeConfig);
  const perfectMin = clamp(chargeConfig?.perfectMinRatio ?? 0.68, 0, 1);
  const perfectMax = clamp(chargeConfig?.perfectMaxRatio ?? 0.97, perfectMin, 1);
  const isPerfectReady = ratio >= perfectMin && ratio <= perfectMax;
  const isLate = ratio > perfectMax;
  const perfectProgress = isPerfectReady
    ? clamp((ratio - perfectMin) / Math.max(0.001, perfectMax - perfectMin), 0, 1)
    : 0;

  return {
    ratio,
    outcome: isPerfectReady ? 'perfect-ready' : 'normal',
    isPerfectReady,
    isLate,
    launchCharge: isPerfectReady || isLate ? 1 : ratio,
    perfectProgress
  };
}

export function getRampSparkChance(chargeState, chargeConfig, qualityScale = 1) {
  if (!chargeState?.isPerfectReady) return 0;
  const maxChance = clamp(chargeConfig?.rampSparkChanceMax ?? 0.28, 0, 1);
  const quality = clamp(Number.isFinite(qualityScale) ? qualityScale : 1, 0, 1);
  return clamp(maxChance * chargeState.perfectProgress * quality, 0, 1);
}

function syncPressureGrace(run, objectiveConfig) {
  if (run.pressure < objectiveConfig.warningPressure) {
    run.pressureGraceRemainingMs = 0;
    run.pressureGraceArmed = true;
  }
}

export function applyObjectivePressure(run, rawDelta, objectiveConfig) {
  if (!run || !Number.isFinite(rawDelta) || rawDelta === 0) {
    return { rawDelta: 0, appliedDelta: 0, graceStarted: false };
  }

  const previousPressure = run.pressure;
  const forgiveness = clamp(objectiveConfig.pressureSpikeForgiveness ?? 1, 0, 1);
  const appliedDelta = rawDelta > 0 ? rawDelta * forgiveness : rawDelta;
  run.pressure = clamp(
    previousPressure + appliedDelta,
    0,
    objectiveConfig.maxPressure
  );

  const crossedWarning = previousPressure < objectiveConfig.warningPressure
    && run.pressure >= objectiveConfig.warningPressure;
  const graceStarted = crossedWarning
    && run.pressureGraceArmed !== false
    && objectiveConfig.pressureGraceWindowMs > 0;

  if (graceStarted) {
    run.pressureGraceRemainingMs = objectiveConfig.pressureGraceWindowMs;
    run.pressureGraceArmed = false;
  }

  syncPressureGrace(run, objectiveConfig);
  return { rawDelta, appliedDelta, previousPressure, pressure: run.pressure, graceStarted };
}

export function advancePressureGrace(run, realDtMs, objectiveConfig) {
  if (!run) return;
  const elapsed = Math.max(0, Number.isFinite(realDtMs) ? realDtMs : DEFAULT_FRAME_MS);
  run.pressureGraceRemainingMs = Math.max(0, (run.pressureGraceRemainingMs || 0) - elapsed);
  syncPressureGrace(run, objectiveConfig);
}

export function applyPassivePressureDecay(run, simulationDtMs, objectiveConfig) {
  const elapsed = Math.max(0, Number.isFinite(simulationDtMs) ? simulationDtMs : DEFAULT_FRAME_MS);
  const decay = Math.max(0, objectiveConfig.pressureDecayPerSecond || 0) * (elapsed / 1000);
  return applyObjectivePressure(run, -decay, objectiveConfig);
}

export function isPressureFailureBlocked(run) {
  return (run?.pressureGraceRemainingMs || 0) > 0;
}

export function beginPhaseBreather(run, objectiveConfig, completedPhase) {
  if (!run) return;
  run.breatherTimerMs = Math.max(0, objectiveConfig.breatherMsOnPhaseClear || 0);
  run.breatherCompletedPhase = completedPhase;
  run.objectiveText = `Phase ${completedPhase} complete — breathing room!`;
}

export function advancePhaseBreather(run, realDtMs) {
  if (!run || !(run.breatherTimerMs > 0)) return false;
  const elapsed = Math.max(0, Number.isFinite(realDtMs) ? realDtMs : DEFAULT_FRAME_MS);
  const completedPhase = run.breatherCompletedPhase ?? Math.max(1, run.phase - 1);
  run.breatherTimerMs = Math.max(0, run.breatherTimerMs - elapsed);

  if (run.breatherTimerMs > 0) {
    run.objectiveText = `Phase ${completedPhase} complete — breathing room!`;
  } else {
    run.breatherCompletedPhase = null;
    run.objectiveText = `Phase ${run.phase} started`;
  }

  // Pause the entire tick that consumed the final breather milliseconds.
  return true;
}

export function getObjectiveBreatherScale(run, objectiveConfig) {
  if (!(run?.breatherTimerMs > 0)) return 1;
  return clamp(objectiveConfig?.breatherTimeScale ?? 0.35, 0.05, 1);
}

export function composeTimeDilation(...scales) {
  const validScales = scales.filter((scale) => Number.isFinite(scale) && scale > 0);
  return validScales.length > 0 ? clamp(Math.min(...validScales), 0.01, 1) : 1;
}

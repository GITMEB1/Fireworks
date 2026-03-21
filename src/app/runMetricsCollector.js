import { RUNTIME_EVENT_TYPES } from '../runtime-vnext/contracts/runtimeEventTypes.js';

export function createRunMetricsCollector({ events, state, attachToWindow = true }) {
  const records = [];
  const budgetDeniedByRun = new Map();
  const qualitySamplesByRun = new Map();
  let scenarioId = 'desktop-high-quality';

  function pushQualitySample() {
    const runId = state.objectiveRun?.metrics?.runId;
    if (!runId) return;
    if (!qualitySamplesByRun.has(runId)) qualitySamplesByRun.set(runId, []);
    qualitySamplesByRun.get(runId).push(state.qualityScale);
  }

  function onBudgetDenied(payload) {
    const runId = state.objectiveRun?.metrics?.runId || payload.runId;
    if (!runId) return;
    if (!budgetDeniedByRun.has(runId)) budgetDeniedByRun.set(runId, {});
    const byChannel = budgetDeniedByRun.get(runId);
    byChannel[payload.channel] = (byChannel[payload.channel] || 0) + 1;
  }

  function onRunEnded(payload) {
    const qualitySamples = qualitySamplesByRun.get(payload.runId) || [];
    const qualitySum = qualitySamples.reduce((sum, value) => sum + value, 0);
    const avgQualityScale = qualitySamples.length > 0 ? qualitySum / qualitySamples.length : state.qualityScale;
    const budgetDeniedByChannel = budgetDeniedByRun.get(payload.runId) || {};
    const avgShatterPower = payload.shatterCount > 0 ? payload.shatterPowerTotal / payload.shatterCount : 0;

    records.push({
      scenarioId,
      runtimeProfileId: state.runtimeProfileId || 'desktop-default',
      runtimeProfileLabel: state.runtimeProfileLabel || 'Desktop Default',
      displayDprCap: state.displayDprCap || 2,
      runId: payload.runId,
      timestamp: new Date().toISOString(),
      totalScore: payload.score,
      baseHitScore: payload.scoreBuckets.baseHitScore,
      directBonusScore: payload.scoreBuckets.directBonusScore,
      clearScore: payload.scoreBuckets.clearScore,
      shatterBonusScore: payload.scoreBuckets.shatterBonusScore,
      perfectBonusScore: payload.scoreBuckets.perfectBonusScore,
      directHits: payload.hitQualityCounts.directHits,
      normalHits: payload.hitQualityCounts.normalHits,
      glancingHits: payload.hitQualityCounts.glancingHits,
      shatterCount: payload.shatterCount,
      avgShatterPower,
      dirtyShotCount: payload.dirtyShotCount,
      targetExpiryCount: payload.targetExpiryCount,
      priorityExpiryCount: payload.priorityExpiryCount,
      pressurePeak: payload.pressurePeak,
      outcome: payload.outcome,
      avgQualityScale,
      budgetDeniedByChannel
    });

    qualitySamplesByRun.delete(payload.runId);
    budgetDeniedByRun.delete(payload.runId);
  }

  const offBudgetDenied = events.on(RUNTIME_EVENT_TYPES.budgetDenied, onBudgetDenied);
  const offRunEnded = events.on(RUNTIME_EVENT_TYPES.objectiveRunEnded, onRunEnded);

  const api = {
    setScenario(nextScenarioId) {
      scenarioId = nextScenarioId || scenarioId;
    },
    sampleFrame() {
      pushQualitySample();
    },
    getRecords() {
      return [...records];
    },
    exportRecords() {
      const data = JSON.stringify(records, null, 2);
      const marker = 'FIREWORKS_CALIBRATION_JSON';
      console.log(`${marker}_START`);
      console.log(data);
      console.log(`${marker}_END`);
      return data;
    },
    forceFinalize(reason = 'explicit-stop') {
      if (state.objectiveRun?.status === 'running') {
        state.objectiveRun.status = 'aborted';
        if (state.objectiveRun.metrics) state.objectiveRun.metrics.ended = true;
        events.emit(RUNTIME_EVENT_TYPES.objectiveRunEnded, {
          runId: state.objectiveRun.metrics.runId,
          outcome: 'aborted',
          reason,
          score: state.objectiveRun.score,
          pressure: state.objectiveRun.pressure,
          pressurePeak: state.objectiveRun.metrics.pressurePeak,
          scoreBuckets: { ...state.objectiveRun.metrics.scoreBuckets },
          hitQualityCounts: { ...state.objectiveRun.metrics.hitQualityCounts },
          shatterCount: state.objectiveRun.metrics.shatterCount,
          shatterPowerTotal: state.objectiveRun.metrics.shatterPowerTotal,
          dirtyShotCount: state.objectiveRun.metrics.dirtyShotCount,
          targetExpiryCount: state.objectiveRun.metrics.targetExpiryCount,
          priorityExpiryCount: state.objectiveRun.metrics.priorityExpiryCount
        });
      }
    },
    dispose() {
      offBudgetDenied();
      offRunEnded();
    }
  };

  // Intentional calibration/debug hook for browser-driven run capture and review.
  if (attachToWindow && typeof window !== 'undefined') window.__fireworksCalibration = api;

  return api;
}

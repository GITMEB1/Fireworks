import { DEFAULT_CALIBRATION_BANDS } from './scenarioMatrix.js';

export function analyzeCalibrationResults({ records, scenarios, calibrationBands = DEFAULT_CALIBRATION_BANDS }) {
  const scenarioSummaries = scenarios.map((scenario) => summarizeScenario({
    scenario,
    records: records.filter((record) => record.scenarioId === scenario.id),
    calibrationBands
  }));

  const overallStatus = scenarioSummaries.every((summary) => summary.bandStatus === 'pass')
    ? 'ship'
    : (scenarioSummaries.some((summary) => summary.bandStatus === 'pass') ? 'prototype' : 'defer');

  return {
    calibrationBands,
    scenarioSummaries,
    overallStatus
  };
}

function summarizeScenario({ scenario, records, calibrationBands }) {
  const count = records.length;
  const totals = sumRecords(records);
  const mean = (value) => count > 0 ? value / count : 0;
  const hitMean = mean(totals.directHits + totals.normalHits + totals.glancingHits);
  const failRate = count > 0 ? records.filter((record) => record.outcome === 'fail').length / count : 0;
  const nonZeroScoreBuckets = [
    'baseHitScore',
    'directBonusScore',
    'clearScore',
    'shatterBonusScore',
    'perfectBonusScore'
  ].filter((bucket) => totals[bucket] > 0).length;
  const meanPressurePeak = mean(totals.pressurePeak);
  const meanTotalScore = mean(totals.totalScore);

  const bandChecks = {
    hitSignal: hitMean >= calibrationBands.minimumMeanHitsPerRun,
    scoreAttribution: nonZeroScoreBuckets >= calibrationBands.minimumNonZeroScoreBuckets,
    pressureEngagement: meanPressurePeak >= calibrationBands.minimumMeanPressurePeak || (
      failRate >= calibrationBands.minimumFailRate && failRate <= calibrationBands.maximumFailRate
    )
  };

  const bandStatus = Object.values(bandChecks).every(Boolean) ? 'pass' : 'fail';

  return {
    scenarioId: scenario.id,
    description: scenario.description,
    runCount: count,
    meanTotalScore,
    meanPressurePeak,
    failRate,
    meanHitsPerRun: hitMean,
    nonZeroScoreBuckets,
    totals,
    bandChecks,
    bandStatus
  };
}

function sumRecords(records) {
  const initial = {
    totalScore: 0,
    baseHitScore: 0,
    directBonusScore: 0,
    clearScore: 0,
    shatterBonusScore: 0,
    perfectBonusScore: 0,
    directHits: 0,
    normalHits: 0,
    glancingHits: 0,
    shatterCount: 0,
    avgShatterPower: 0,
    dirtyShotCount: 0,
    targetExpiryCount: 0,
    priorityExpiryCount: 0,
    pressurePeak: 0
  };

  return records.reduce((acc, record) => {
    for (const key of Object.keys(initial)) {
      acc[key] += record[key] || 0;
    }
    return acc;
  }, initial);
}

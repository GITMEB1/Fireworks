import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CALIBRATION_SCENARIOS } from '../src/app/calibration/scenarioMatrix.js';
import { runDeterministicCalibrationScenario } from '../src/app/calibration/createHeadlessCalibrationHarness.js';
import { analyzeCalibrationResults } from '../src/app/calibration/analyzeCalibrationResults.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const runsDir = path.join(repoRoot, 'fireworks-engine', 'runs');
const dateStamp = '2026-03-21';
const datedDataPath = path.join(runsDir, `${dateStamp}-deterministic-calibration-data.json`);
const datedReportPath = path.join(runsDir, `${dateStamp}-deterministic-calibration-pass.md`);
const latestDataPath = path.join(runsDir, 'latest-deterministic-calibration-data.json');
const latestReportPath = path.join(runsDir, 'latest-deterministic-calibration-pass.md');
const RUNS_PER_SCENARIO = 10;

const records = [];
for (const scenario of CALIBRATION_SCENARIOS) {
  for (let runIndex = 0; runIndex < RUNS_PER_SCENARIO; runIndex++) {
    const record = runDeterministicCalibrationScenario({ scenario, runIndex });
    records.push(record);
  }
}

const analysis = analyzeCalibrationResults({ records, scenarios: CALIBRATION_SCENARIOS });
const payload = {
  generatedAt: new Date().toISOString(),
  runsPerScenario: RUNS_PER_SCENARIO,
  scenarios: CALIBRATION_SCENARIOS,
  records,
  analysis
};
const report = renderMarkdownReport({ payload, datedDataPath });

await fs.writeFile(datedDataPath, JSON.stringify(payload, null, 2));
await fs.writeFile(datedReportPath, report);
await fs.writeFile(latestDataPath, JSON.stringify(payload, null, 2));
await fs.writeFile(latestReportPath, report);

console.log('Deterministic calibration complete.');
console.log(`Data: ${path.relative(repoRoot, datedDataPath)}`);
console.log(`Report: ${path.relative(repoRoot, datedReportPath)}`);
console.log(`Latest data: ${path.relative(repoRoot, latestDataPath)}`);
console.log(`Latest report: ${path.relative(repoRoot, latestReportPath)}`);
console.log(`Overall status: ${analysis.overallStatus}`);

function renderMarkdownReport({ payload, datedDataPath }) {
  const { analysis, records, runsPerScenario, scenarios } = payload;
  const lines = [
    '# Deterministic Calibration Pass',
    '',
    '## Problem',
    'Replace fragile browser-driven calibration with a deterministic repo-local runner that exercises the real objective, hit-quality, pressure, and budget telemetry seams.',
    '',
    '## Seam binding',
    '- `src/app/calibration/*`',
    '- `src/app/runMetricsCollector.js`',
    '- `src/app/appState.js`',
    '- `src/core/engine.js`',
    '- `src/core/deterministicRandom.js`',
    '- `src/runtime-vnext/contracts/*`',
    '- `scripts/run-deterministic-calibration.mjs`',
    '- `package.json`',
    '- `.github/workflows/*`',
    '',
    '## What changed',
    '1. Added a seeded deterministic calibration harness that runs against the real engine/objective logic without browser automation.',
    '2. Promoted calibration output to durable repo artifacts (`json` + markdown report).',
    '3. Added package/CI wiring so the repo has an executable validation lane instead of documentation-only process.',
    '4. Tightened objective-run finalization semantics so deterministic runs can end as `survive`, `fail`, or `aborted` without collector hacks.',
    '',
    '## Scenario matrix',
    `- Runs per scenario: ${runsPerScenario}`,
    ...scenarios.map((scenario) => `- **${scenario.id}** — ${scenario.description}`),
    '',
    '## Aggregate results'
  ];

  for (const summary of analysis.scenarioSummaries) {
    lines.push(`### ${summary.scenarioId} (status: ${summary.bandStatus})`);
    lines.push(`- run count: ${summary.runCount}`);
    lines.push(`- mean total score: ${summary.meanTotalScore.toFixed(2)}`);
    lines.push(`- mean pressure peak: ${summary.meanPressurePeak.toFixed(2)}`);
    lines.push(`- mean hits per run: ${summary.meanHitsPerRun.toFixed(2)}`);
    lines.push(`- fail rate: ${(summary.failRate * 100).toFixed(1)}%`);
    lines.push(`- non-zero score buckets: ${summary.nonZeroScoreBuckets}`);
    lines.push(`- score buckets totals: base=${summary.totals.baseHitScore}, direct=${summary.totals.directBonusScore}, clear=${summary.totals.clearScore}, shatter=${summary.totals.shatterBonusScore}, perfect=${summary.totals.perfectBonusScore}`);
    lines.push(`- hit totals: direct=${summary.totals.directHits}, normal=${summary.totals.normalHits}, glancing=${summary.totals.glancingHits}`);
    lines.push(`- band checks: hitSignal=${summary.bandChecks.hitSignal}, scoreAttribution=${summary.bandChecks.scoreAttribution}, pressureEngagement=${summary.bandChecks.pressureEngagement}`);
    lines.push('');
  }

  lines.push('## Verification performed');
  lines.push('- Ran the deterministic scenario matrix in-repo through the engine seam.');
  lines.push('- Wrote structured data for later diff/review.');
  lines.push('- Evaluated explicit balance bands per scenario.');
  lines.push('');
  lines.push('## Artifacts');
  lines.push(`- Dated data: ${path.relative(repoRoot, datedDataPath)}`);
  lines.push(`- Records captured: ${records.length}`);
  lines.push('');
  lines.push('## Gate decision');
  lines.push(`\`${analysis.overallStatus}\``);
  lines.push('');
  lines.push('## Next step');
  lines.push(analysis.overallStatus === 'ship'
    ? 'Use this runner as the default balance-validation lane and add threshold alerts for future tuning changes.'
    : 'Retune objective/hit-quality values against the deterministic distributions before expanding gameplay scope.');

  return `${lines.join('\n')}\n`;
}

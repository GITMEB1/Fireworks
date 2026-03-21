import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CALIBRATION_SCENARIOS } from '../src/app/calibration/scenarioMatrix.js';
import { runDeterministicCalibrationScenario } from '../src/app/calibration/createHeadlessCalibrationHarness.js';
import { analyzeCalibrationResults } from '../src/app/calibration/analyzeCalibrationResults.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const runsDir = path.join(repoRoot, 'fireworks-engine', 'runs');
const generatedAt = new Date();
const dateStamp = generatedAt.toISOString().slice(0, 10);
const datedDataPath = path.join(runsDir, `${dateStamp}-deterministic-calibration-data.json`);
const datedReportPath = path.join(runsDir, `${dateStamp}-deterministic-calibration-pass.md`);
const datedManifestPath = path.join(runsDir, `${dateStamp}-deterministic-calibration-manifest.json`);
const latestDataPath = path.join(runsDir, 'latest-deterministic-calibration-data.json');
const latestReportPath = path.join(runsDir, 'latest-deterministic-calibration-pass.md');
const latestManifestPath = path.join(runsDir, 'latest-deterministic-calibration-manifest.json');
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
  generatedAt: generatedAt.toISOString(),
  sourceRevision: resolveSourceRevision(),
  runsPerScenario: RUNS_PER_SCENARIO,
  truthfulScope: {
    validates: [
      'Objective pressure, score attribution, hit-quality distributions, and runtime budget denials under deterministic profile assumptions.',
      'Profile-specific quality-scale behavior and telemetry output.'
    ],
    doesNotValidate: [
      'Subjective premium render feel, browser GPU upload cost, or live touch ergonomics.',
      'Exact frame-time performance on physical devices.'
    ]
  },
  scenarios: CALIBRATION_SCENARIOS,
  records,
  analysis
};
const report = renderMarkdownReport({ payload, datedDataPath, datedManifestPath });
const manifest = {
  generatedAt: payload.generatedAt,
  sourceRevision: payload.sourceRevision,
  runsPerScenario: RUNS_PER_SCENARIO,
  scenarioIds: CALIBRATION_SCENARIOS.map((scenario) => scenario.id),
  runtimeProfileIds: [...new Set(CALIBRATION_SCENARIOS.map((scenario) => scenario.runtimeProfileId || 'desktop-default'))],
  overallStatus: analysis.overallStatus,
  datedDataFile: path.basename(datedDataPath),
  datedReportFile: path.basename(datedReportPath),
  latestDataFile: path.basename(latestDataPath),
  latestReportFile: path.basename(latestReportPath),
  truthfulScope: payload.truthfulScope
};

await fs.writeFile(datedDataPath, JSON.stringify(payload, null, 2));
await fs.writeFile(datedReportPath, report);
await fs.writeFile(datedManifestPath, JSON.stringify(manifest, null, 2));
await fs.writeFile(latestDataPath, JSON.stringify(payload, null, 2));
await fs.writeFile(latestReportPath, report);
await fs.writeFile(latestManifestPath, JSON.stringify(manifest, null, 2));

console.log('Deterministic calibration complete.');
console.log(`Data: ${path.relative(repoRoot, datedDataPath)}`);
console.log(`Report: ${path.relative(repoRoot, datedReportPath)}`);
console.log(`Manifest: ${path.relative(repoRoot, datedManifestPath)}`);
console.log(`Latest data: ${path.relative(repoRoot, latestDataPath)}`);
console.log(`Latest report: ${path.relative(repoRoot, latestReportPath)}`);
console.log(`Latest manifest: ${path.relative(repoRoot, latestManifestPath)}`);
console.log(`Overall status: ${analysis.overallStatus}`);

function resolveSourceRevision() {
  try {
    return execSync('git rev-parse HEAD', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return process.env.GITHUB_SHA || 'unknown';
  }
}

function renderMarkdownReport({ payload, datedDataPath, datedManifestPath }) {
  const { analysis, records, runsPerScenario, scenarios, truthfulScope, generatedAt: generatedAtIso, sourceRevision } = payload;
  const lines = [
    '# Deterministic Calibration Pass',
    '',
    '## Problem',
    'Replace fragile browser-driven calibration with a deterministic repo-local runner that exercises the real objective, hit-quality, pressure, and budget telemetry seams while explicitly covering the premium high-end mobile profile.',
    '',
    '## Truthful scope',
    ...truthfulScope.validates.map((item) => `- Validates: ${item}`),
    ...truthfulScope.doesNotValidate.map((item) => `- Does not validate: ${item}`),
    '',
    '## Seam binding',
    '- `src/app/calibration/*`',
    '- `src/app/runMetricsCollector.js`',
    '- `src/app/runtimeProfiles.js`',
    '- `src/app/appState.js`',
    '- `src/core/engine.js`',
    '- `src/core/config.js`',
    '- `src/runtime-vnext/contracts/*`',
    '- `scripts/run-deterministic-calibration.mjs`',
    '- `package.json`',
    '- `.github/workflows/*`',
    '',
    '## Artifact metadata',
    `- generated at: ${generatedAtIso}`,
    `- source revision: ${sourceRevision}`,
    `- manifest: ${path.relative(repoRoot, datedManifestPath)}`,
    '',
    '## Scenario matrix',
    `- Runs per scenario: ${runsPerScenario}`,
    ...scenarios.map((scenario) => `- **${scenario.id}** (${scenario.runtimeProfileId || 'desktop-default'}) — ${scenario.description}`),
    '',
    '## Aggregate results'
  ];

  for (const summary of analysis.scenarioSummaries) {
    lines.push(`### ${summary.scenarioId} (${summary.runtimeProfileId}, status: ${summary.bandStatus})`);
    lines.push(`- run count: ${summary.runCount}`);
    lines.push(`- mean total score: ${summary.meanTotalScore.toFixed(2)}`);
    lines.push(`- mean pressure peak: ${summary.meanPressurePeak.toFixed(2)}`);
    lines.push(`- mean quality scale: ${summary.meanQualityScale.toFixed(3)}`);
    lines.push(`- mean hits per run: ${summary.meanHitsPerRun.toFixed(2)}`);
    lines.push(`- fail rate: ${(summary.failRate * 100).toFixed(1)}%`);
    lines.push(`- non-zero score buckets: ${summary.nonZeroScoreBuckets}`);
    lines.push(`- score buckets totals: base=${summary.totals.baseHitScore}, direct=${summary.totals.directBonusScore}, clear=${summary.totals.clearScore}, shatter=${summary.totals.shatterBonusScore}, perfect=${summary.totals.perfectBonusScore}`);
    lines.push(`- hit totals: direct=${summary.totals.directHits}, normal=${summary.totals.normalHits}, glancing=${summary.totals.glancingHits}`);
    lines.push(`- budget denials: ${formatBudgetDenials(summary.totals.budgetDeniedByChannel)}`);
    lines.push(`- band checks: hitSignal=${summary.bandChecks.hitSignal}, scoreAttribution=${summary.bandChecks.scoreAttribution}, pressureEngagement=${summary.bandChecks.pressureEngagement}`);
    lines.push('');
  }

  lines.push('## Verification performed');
  lines.push('- Ran the deterministic scenario matrix in-repo through the engine seam.');
  lines.push('- Wrote structured data, markdown, and manifest artifacts for review.');
  lines.push('- Evaluated explicit balance bands per scenario, including a premium high-end mobile profile.');
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
    ? 'Use this runner as the default gameplay-validation lane, then follow with physical-device visual/perf observation for the premium mobile profile.'
    : 'Continue retuning objective pressure/profile assumptions or observe the premium mobile path on hardware before widening the visual scope further.');

  return `${lines.join('\n')}\n`;
}

function formatBudgetDenials(byChannel = {}) {
  const entries = Object.entries(byChannel);
  if (entries.length === 0) return 'none';
  return entries.map(([channel, count]) => `${channel}=${count}`).join(', ');
}

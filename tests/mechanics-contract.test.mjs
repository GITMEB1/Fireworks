import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createConfig, PALETTES } from '../src/core/config.js';
import { createEngine } from '../src/core/engine.js';
import { createAppState } from '../src/app/appState.js';
import { renderChargeVisuals } from '../src/render/overlayRenderer.js';
import { createInputSystem } from '../src/systems/inputSystem.js';
import {
  advancePressureGrace,
  applyObjectivePressure,
  composeTimeDilation,
  getChargeState,
  getRampSparkChance,
  isPressureFailureBlocked
} from '../src/core/mechanicsContract.js';

const CHARGE_CONFIG = {
  minDuration: 180,
  maxDuration: 1450,
  perfectMinRatio: 0.68,
  perfectMaxRatio: 0.97,
  rampSparkChanceMax: 0.28
};

const durationForRatio = (ratio) => CHARGE_CONFIG.minDuration
  + ratio * (CHARGE_CONFIG.maxDuration - CHARGE_CONFIG.minDuration);

test('perfect charge boundaries are inclusive and late release remains normal', () => {
  assert.equal(getChargeState(durationForRatio(0.679), CHARGE_CONFIG).outcome, 'normal');
  assert.equal(getChargeState(durationForRatio(0.68), CHARGE_CONFIG).outcome, 'perfect-ready');
  assert.equal(getChargeState(durationForRatio(0.97), CHARGE_CONFIG).outcome, 'perfect-ready');

  const late = getChargeState(durationForRatio(0.971), CHARGE_CONFIG);
  assert.equal(late.outcome, 'normal');
  assert.equal(late.isLate, true);
  assert.equal(late.launchCharge, 1);
  assert.equal(late.ratio > CHARGE_CONFIG.perfectMaxRatio, true);
});

test('progressive ramp sparks remain probability-bounded and quality-scaled', () => {
  const ready = getChargeState(durationForRatio(0.97), CHARGE_CONFIG);
  assert.equal(getRampSparkChance(ready, { ...CHARGE_CONFIG, rampSparkChanceMax: 4 }, 2), 1);
  assert.equal(getRampSparkChance(ready, CHARGE_CONFIG, 0.5), 0.14);
  assert.equal(getRampSparkChance(getChargeState(durationForRatio(0.5), CHARGE_CONFIG), CHARGE_CONFIG), 0);
});

test('input and overlay consume the same charge contract with no legacy threshold', async () => {
  const [inputSource, overlaySource, configSource, calibrationSource, scenarioSource] = await Promise.all([
    readFile(new URL('../src/systems/inputSystem.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/render/overlayRenderer.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/core/config.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/calibration/createHeadlessCalibrationHarness.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/calibration/scenarioMatrix.js', import.meta.url), 'utf8')
  ]);

  assert.match(inputSource, /getChargeState/);
  assert.match(overlaySource, /getChargeState/);
  assert.doesNotMatch(inputSource, /perfectReadyThreshold/);
  assert.doesNotMatch(overlaySource, /perfectReadyThreshold/);
  assert.doesNotMatch(configSource, /perfectReadyThreshold/);
  assert.match(calibrationSource, /getChargeState/);
  assert.match(scenarioSource, /perfectReadyChance/);
  assert.doesNotMatch(calibrationSource, /'supernova'/);
  assert.doesNotMatch(scenarioSource, /supernovaChance/);
});

test('input releases perfect and late holds with contract-defined outcomes and power', () => {
  const originalWindow = globalThis.window;
  const windowListeners = new Map();
  const canvasListeners = new Map();
  globalThis.window = {
    PointerEvent: function PointerEvent() {},
    addEventListener(type, listener) { windowListeners.set(type, listener); }
  };

  try {
    const calls = [];
    const canvas = {
      addEventListener(type, listener) { canvasListeners.set(type, listener); },
      hasPointerCapture() { return false; }
    };
    const state = createAppState({ width: 390, height: 844, userInteracted: true });
    const engine = {
      registerShot(type) { calls.push({ kind: 'shot', type }); },
      spawnShellTo(...args) { calls.push({ kind: 'shell', args }); }
    };
    createInputSystem({
      canvas,
      hintEl: { style: {} },
      statusEl: { style: {} },
      palettes: PALETTES,
      state,
      config: createConfig(),
      engine
    });

    const releaseAfterRatio = (pointerId, ratio) => {
      state.activePointers.set(pointerId, {
        startTime: performance.now() - durationForRatio(ratio),
        targetX: 120,
        targetY: 180,
        launchX: 110,
        palette: PALETTES[0]
      });
      canvasListeners.get('pointerup')({ pointerId });
    };

    releaseAfterRatio(1, 0.8);
    releaseAfterRatio(2, 0.99);

    assert.deepEqual(calls[0], { kind: 'shot', type: 'perfect-ready' });
    assert.equal(calls[1].args[5], 1);
    assert.equal(calls[1].args[7].outcome, 'perfect-ready');
    assert.deepEqual(calls[2], { kind: 'shot', type: 'normal' });
    assert.equal(calls[3].args[5], 1);
    assert.deepEqual(calls[3].args[7], { outcome: 'normal', chargeTiming: 'late' });
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});

test('overlay labels the same perfect and late timing states', () => {
  const labels = [];
  const noop = () => {};
  const ctx = {
    beginPath: noop,
    arc: noop,
    fill: noop,
    stroke: noop,
    moveTo: noop,
    lineTo: noop,
    fillText(text) { labels.push(text); },
    createRadialGradient() { return { addColorStop: noop }; }
  };
  const config = createConfig();
  const pointerAtRatio = (ratio) => ({
    x: 120,
    y: 180,
    startTime: 2000 - durationForRatio(ratio),
    palette: PALETTES[0]
  });

  renderChargeVisuals({
    ctx,
    now: 2000,
    activePointers: new Map([[1, pointerAtRatio(0.8)]]),
    config,
    engine: null
  });
  renderChargeVisuals({
    ctx,
    now: 2000,
    activePointers: new Map([[2, pointerAtRatio(0.99)]]),
    config,
    engine: null
  });

  assert.deepEqual(labels, ['PERFECT', 'LATE — FULL POWER']);
});

test('positive pressure is forgiven by 15% and grace cannot refresh indefinitely', () => {
  const objectiveConfig = {
    warningPressure: 72,
    maxPressure: 100,
    pressureSpikeForgiveness: 0.85,
    pressureGraceWindowMs: 1200
  };
  const run = {
    pressure: 70,
    pressureGraceRemainingMs: 0,
    pressureGraceArmed: true
  };

  const first = applyObjectivePressure(run, 10, objectiveConfig);
  assert.equal(first.appliedDelta, 8.5);
  assert.equal(run.pressure, 78.5);
  assert.equal(run.pressureGraceRemainingMs, 1200);
  assert.equal(isPressureFailureBlocked(run), true);

  advancePressureGrace(run, 600, objectiveConfig);
  applyObjectivePressure(run, 10, objectiveConfig);
  assert.equal(run.pressureGraceRemainingMs, 600);

  advancePressureGrace(run, 600, objectiveConfig);
  assert.equal(isPressureFailureBlocked(run), false);

  applyObjectivePressure(run, -20, objectiveConfig);
  assert.equal(run.pressureGraceArmed, true);
  assert.equal(run.pressureGraceRemainingMs, 0);
});

test('breather pauses objective clocks for 1,200 ms of real time and advances phase once', () => {
  const config = createConfig({
    OBJECTIVE: {
      phaseClearTargetBase: 1,
      phaseClearTargetStep: 1,
      phaseDurationMs: 5000,
      spawnCooldownMs: 5000,
      breatherMsOnPhaseClear: 1200,
      breatherTimeScale: 0.35
    }
  });
  const state = createAppState({ width: 390, height: 844, qualityScale: 1, userInteracted: true });
  const engine = createEngine({
    config,
    palettes: PALETTES,
    state,
    audio: { updateCharge() {}, playBassDrop() {} }
  });
  engine.preAllocatePools();
  state.objectiveRun.phaseClears = state.objectiveRun.phaseClearTarget;

  const transition = engine.update(1, 16.666, 16.666);
  assert.equal(transition.breathing, true);
  assert.equal(state.objectiveRun.phase, 2);
  assert.equal(state.objectiveRun.breatherTimerMs, 1200);
  assert.match(state.objectiveRun.objectiveText, /Phase 1 complete/);

  const phaseTimer = state.objectiveRun.phaseTimerMs;
  const spawnCooldown = state.objectiveRun.spawnCooldownMs;
  engine.update(0.35, 616.666, 600);
  assert.equal(state.objectiveRun.breatherTimerMs, 600);
  assert.equal(state.objectiveRun.phaseTimerMs, phaseTimer);
  assert.equal(state.objectiveRun.spawnCooldownMs, spawnCooldown);
  assert.match(state.objectiveRun.objectiveText, /Phase 1 complete/);

  engine.update(0.35, 1216.666, 600);
  assert.equal(state.objectiveRun.breatherTimerMs, 0);
  assert.equal(state.objectiveRun.phase, 2);
  assert.equal(state.objectiveRun.phaseTimerMs, phaseTimer);
  assert.equal(state.objectiveRun.objectiveText, 'Phase 2 started');

  engine.update(1, 1233.332, 16.666);
  assert.equal(state.objectiveRun.phase, 2);
  assert.equal(state.objectiveRun.phaseTimerMs < phaseTimer, true);
});

test('cinematic Supernova dilation takes priority over the phase breather', () => {
  assert.equal(composeTimeDilation(1, 0.35), 0.35);
  assert.equal(composeTimeDilation(0.1, 0.35), 0.1);
  assert.equal(composeTimeDilation(1, 1), 1);
});

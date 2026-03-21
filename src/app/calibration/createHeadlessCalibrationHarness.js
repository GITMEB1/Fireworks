import { createConfig, PALETTES } from '../../core/config.js';
import { createAppState } from '../appState.js';
import { createEngine } from '../../core/engine.js';
import { createRuntimeEvents } from '../../runtime-vnext/contracts/runtimeEvents.js';
import { createRuntimeBudgetManager } from '../../runtime-vnext/contracts/runtimeBudgetManager.js';
import { createRunMetricsCollector } from '../runMetricsCollector.js';
import { withDeterministicRandom } from '../../core/deterministicRandom.js';

const FRAME_MS = 16.666;
const MAX_RUN_MS = 70000;
const ACTION_INTERVAL_MS = 320;

export function runDeterministicCalibrationScenario({ scenario, runIndex }) {
  const seed = `${scenario.id}:${runIndex}`;

  return withDeterministicRandom(seed, () => {
    const config = createConfig({
      QUALITY: {
        enabled: scenario.qualityEnabled,
        minScale: Math.min(scenario.qualityScale, 0.62),
        maxScale: scenario.qualityScale,
        reduceMotionScale: scenario.qualityScale
      }
    });

    const state = createAppState({
      reducedMotion: scenario.reducedMotion,
      width: scenario.width,
      height: scenario.height,
      qualityScale: scenario.qualityScale,
      userInteracted: true
    });
    state.width = scenario.width;
    state.height = scenario.height;
    state.qualityScale = scenario.qualityScale;

    const events = createRuntimeEvents();
    const budgets = createRuntimeBudgetManager({ config, state, events });
    const runtimeVNext = { events, budgets };
    const engine = createEngine({
      config,
      palettes: PALETTES,
      state,
      audio: createSilentAudioSystem(),
      runtimeVNext
    });
    budgets.bindEngine(engine);
    engine.preAllocatePools();

    const collector = createRunMetricsCollector({ events, state, attachToWindow: false });
    collector.setScenario(scenario.id);

    let now = 0;
    let nextActionAt = ACTION_INTERVAL_MS;

    while (now < MAX_RUN_MS && state.objectiveRun?.status === 'running') {
      now += FRAME_MS;
      engine.update(1, now);
      collector.sampleFrame();

      if (now >= nextActionAt) {
        executePlayerAction({ engine, state, scenario, now });
        nextActionAt += ACTION_INTERVAL_MS;
      }
    }

    if (state.objectiveRun?.status === 'running') {
      engine.finalizeObjectiveRun('survive', 'time-limit');
    }

    return collector.getRecords().at(-1);
  });
}

function executePlayerAction({ engine, state, scenario, now }) {
  const run = state.objectiveRun;
  if (!run || run.status !== 'running') return;

  const target = pickTarget(engine, scenario.strategy.targetBias);
  if (!target) {
    if (Math.random() < scenario.strategy.dirtyShotChance * 0.5) {
      engine.registerShot('dirty');
    }
    return;
  }

  const shotRoll = Math.random();
  if (shotRoll < scenario.strategy.dirtyShotChance) {
    engine.registerShot('dirty');
    maybeApplyDirtySplash(target, now);
    return;
  }

  const shotType = shotRoll < scenario.strategy.dirtyShotChance + scenario.strategy.supernovaChance
    ? 'supernova'
    : 'normal';
  engine.registerShot(shotType);

  if (Math.random() < scenario.strategy.missChance) return;

  const hitQuality = resolveHitQuality(scenario.strategy);
  const impact = resolveImpactPoint(target, hitQuality);
  const intensity = resolveImpactIntensity({ target, shotType, hitQuality, scenario });
  target.onImpact(intensity, impact.x, impact.y, Math.floor(now));

  if (target.health > 0 && shouldFollowThrough({ target, shotType, scenario })) {
    const followUpQuality = hitQuality === 'glancing' ? 'normal' : 'direct';
    const followUpImpact = resolveImpactPoint(target, followUpQuality);
    const followUpIntensity = Math.max(0.42, intensity * (scenario.strategy.finishBoost + 0.66));
    target.onImpact(followUpIntensity, followUpImpact.x, followUpImpact.y, Math.floor(now) + 1);
  }
}

function maybeApplyDirtySplash(target, now) {
  if (Math.random() < 0.55) return;
  const impact = resolveImpactPoint(target, 'glancing');
  target.onImpact(0.16 + Math.random() * 0.08, impact.x, impact.y, Math.floor(now) + 2);
}

function pickTarget(engine, targetBias) {
  const targets = engine.pools.targets.slice(0, engine.activeCounts.targets);
  if (targets.length === 0) return null;

  if (targetBias === 'urgent-first') {
    return targets.find((target) => target.isUrgent) || targets.find((target) => target.kind === 'priority') || targets[0];
  }

  if (targetBias === 'critical-first') {
    return targets.find((target) => target.healthState === 'critical') || targets.find((target) => target.isUrgent) || targets[0];
  }

  if (targetBias === 'priority-first') {
    return targets.find((target) => target.kind === 'priority') || targets.find((target) => target.isUrgent) || targets[0];
  }

  return targets[0];
}

function resolveHitQuality(strategy) {
  const roll = Math.random();
  if (roll < strategy.directHitChance) return 'direct';
  if (roll < strategy.directHitChance + strategy.glancingHitChance) return 'glancing';
  return 'normal';
}

function resolveImpactPoint(target, hitQuality) {
  const qualityRadius = Math.max(4, target.radius * (target.engine.config.OBJECTIVE.hitQualityCenterRadiusMult || 1.7));
  const angle = Math.random() * Math.PI * 2;
  const distance = hitQuality === 'direct'
    ? qualityRadius * 0.1
    : (hitQuality === 'glancing' ? qualityRadius * 0.92 : qualityRadius * 0.46);

  return {
    x: target.x + Math.cos(angle) * distance,
    y: target.y + Math.sin(angle) * distance
  };
}

function resolveImpactIntensity({ target, shotType, hitQuality, scenario }) {
  const isCritical = target.healthState === 'critical';
  const base = shotType === 'supernova'
    ? 0.82 + Math.random() * 0.28
    : 0.52 + Math.random() * 0.24;
  const qualityAdjust = hitQuality === 'direct' ? 0.18 : (hitQuality === 'glancing' ? -0.16 : 0);
  const urgencyAdjust = target.isUrgent ? 0.08 : 0;
  const criticalAdjust = isCritical ? 0.1 : 0;
  const scenarioAdjust = scenario.id === 'low-end-emulation' ? -0.04 : 0;
  return Math.max(0.08, base + qualityAdjust + urgencyAdjust + criticalAdjust + scenarioAdjust);
}

function shouldFollowThrough({ target, shotType, scenario }) {
  if (shotType === 'dirty') return false;
  const remainingHealthRatio = target.maxHealth > 0 ? target.health / target.maxHealth : 0;
  if (remainingHealthRatio <= 0) return false;
  const baseChance = shotType === 'supernova' ? 0.72 : 0.42;
  const priorityBoost = target.kind === 'priority' ? 0.08 : 0;
  const lowHealthBoost = remainingHealthRatio < 0.48 ? 0.18 : 0;
  const scenarioPenalty = scenario.id === 'low-end-emulation' ? 0.06 : 0;
  return Math.random() < baseChance + priorityBoost + lowHealthBoost - scenarioPenalty;
}

function createSilentAudioSystem() {
  return {
    updateCharge() {},
    playBassDrop() {},
    playLaunch() {},
    playExplosion() {},
    init() {}
  };
}

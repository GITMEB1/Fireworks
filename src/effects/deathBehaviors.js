import { rand, DEATH_CROSSETTE, DEATH_CRACKLE, DEATH_GHOST, DEATH_DOUBLE_BREAK } from '../core/utils.js';

const SECONDARY_SCRIPT_DEFAULTS = {
  precisionBloom: {
    [DEATH_CROSSETTE]: {
      armsByStage: [4, 3, 2, 2],
      velocityRange: [2.3, 3.3],
      trailByStage: [3, 3, 2, 2],
      decayByStage: [[0.02, 0.029], [0.021, 0.03], [0.022, 0.032], [0.024, 0.034]],
      sparkleByStage: [0.04, 0.02, 0.01, 0],
      allowGlowStageMax: 1,
      glowSize: 26,
      colorMode: 'source'
    }
  },
  sustainCascade: {
    [DEATH_GHOST]: {
      ghostCountByStage: [2, 2, 1, 1],
      velocityRangeByStage: [[1.9, 4.3], [1.8, 3.8], [1.6, 3.2], [1.4, 2.8]],
      dragByStage: [0.943, 0.946, 0.95, 0.953],
      decayByStage: [[0.013, 0.018], [0.014, 0.019], [0.016, 0.021], [0.017, 0.023]],
      trailByStage: [7, 6, 5, 4],
      sparkleByStage: [0.08, 0.06, 0.035, 0.02],
      alphaByStage: [0.95, 0.94, 0.92, 0.9],
      colorMode: 'ghostWhite'
    }
  },
  volatileTransform: {
    [DEATH_DOUBLE_BREAK]: {
      burstsByStage: [6, 5, 4, 3],
      velocityRangeByStage: [[1.9, 4.2], [1.8, 3.9], [1.7, 3.5], [1.6, 3.2]],
      trailByStage: [4, 4, 3, 3],
      sparkleByStage: [0.06, 0.04, 0.02, 0.01],
      accentChanceByStage: [0.34, 0.28, 0.22, 0.16],
      allowGlowStageMax: 1,
      glowSize: 34,
      colorMode: 'secondaryAccent'
    },
    [DEATH_CRACKLE]: {
      splitsByStage: [3, 2, 2, 1],
      strobeChanceByStage: [0.35, 0.24, 0.12, 0.05],
      velocityRangeByStage: [[0.9, 2.5], [0.8, 2.2], [0.7, 1.9], [0.6, 1.7]],
      colorMode: 'warmCrackle'
    }
  }
};

function clampStage(stage) {
  return Math.max(0, Math.min(3, stage || 0));
}

const BEHAVIOR_KEYS = {
  [DEATH_CROSSETTE]: 'crossette',
  [DEATH_CRACKLE]: 'crackle',
  [DEATH_GHOST]: 'ghost',
  [DEATH_DOUBLE_BREAK]: 'doubleBreak'
};

function valueByStage(series, stage, fallback = null) {
  if (!Array.isArray(series)) return fallback;
  return series[Math.min(stage, series.length - 1)] ?? fallback;
}

export function createDeathBehaviorDispatcher(engine) {
  const bssds = engine.config.BSSDS;
  const orchestration = {
    ...SECONDARY_SCRIPT_DEFAULTS,
    ...(bssds?.secondaryOrchestration || {})
  };

  function resolveBehaviorBudget(p, behavior) {
    const signature = p.signatureFamily && bssds?.signatures?.[p.signatureFamily];
    const hardCap = signature
      ? Math.floor(signature.particleCap * engine.state.qualityScale * (engine.state.reducedMotion ? 0.72 : 1))
      : Math.floor(engine.config.LIMITS.maxParticles * engine.state.qualityScale);
    const globalLimit = Math.floor(engine.config.LIMITS.maxParticles * engine.state.qualityScale);
    const limit = Math.max(1, Math.min(hardCap, globalLimit));
    const usage = engine.activeCounts.particles / limit;
    let ladderStage = p.signatureStage || 0;

    if (signature?.degradeLadder) {
      ladderStage = 0;
      for (const step of signature.degradeLadder) {
        if (usage >= step.triggerUsage || engine.state.reducedMotion) ladderStage += 1;
      }
    }

    const stage = clampStage(ladderStage);
    const behaviorKey = BEHAVIOR_KEYS[behavior];
    const strictBehaviorCap = behaviorKey ? signature?.secondaryCaps?.[behaviorKey] : null;

    return {
      limit,
      stage,
      secondaryDensity: signature?.degradeLadder?.[Math.max(0, stage - 1)]?.secondaryDensity ?? 1,
      signatureFamily: p.signatureFamily || null,
      strictBehaviorCap
    };
  }

  function canSpawn(budget, count = 1) {
    const cappedCount = budget.strictBehaviorCap != null ? Math.min(count, budget.strictBehaviorCap) : count;
    return {
      ok: engine.activeCounts.particles + cappedCount <= budget.limit && cappedCount > 0,
      count: cappedCount
    };
  }

  function stageScript(family, behavior, fallback = null) {
    if (!family) return fallback;
    return orchestration?.[family]?.[behavior] || fallback;
  }

  function resolveColor(mode, p, script, stage) {
    if (mode === 'ghostWhite') return '255,255,255';
    if (mode === 'secondaryAccent') {
      const accentChance = valueByStage(script?.accentChanceByStage, stage, 0.28);
      return Math.random() < accentChance ? '255,255,255' : (p.secondaryColor || p.color);
    }
    if (mode === 'warmCrackle') return '255,235,180';
    return p.color;
  }

  function runCrossette(p, budget, base) {
    const script = stageScript(budget.signatureFamily, DEATH_CROSSETTE);
    const stage = budget.stage;
    const arms = script
      ? Math.max(2, valueByStage(script.armsByStage, stage, 3))
      : (stage >= 2 ? 2 : (stage === 1 ? 3 : 4));
    const armCheck = canSpawn(budget, arms);
    if (!armCheck.ok) return;

    const velocityRange = script?.velocityRange || [2.2, 3.4];
    const decayRange = script
      ? valueByStage(script.decayByStage, stage, [0.02, 0.03])
      : [0.02, 0.03];
    const trailLength = script
      ? valueByStage(script.trailByStage, stage, 3)
      : 3;
    const sparkle = script
      ? valueByStage(script.sparkleByStage, stage, 0)
      : 0;

    for (let j = 0; j < armCheck.count; j++) {
      engine.resetPCfg();
      const cfg = engine.pCfg;
      cfg.angle = base + j * ((Math.PI * 2) / Math.max(1, armCheck.count));
      cfg.velocity = rand(velocityRange[0], velocityRange[1]) * p.velMult;
      cfg.drag = 0.925;
      cfg.decay = rand(decayRange[0], decayRange[1]);
      cfg.trailLength = trailLength;
      cfg.size = 1.5 * (1 + p.charge * 0.2);
      cfg.sparkleChance = sparkle;
      engine.spawnParticle(p.x, p.y, resolveColor(script?.colorMode, p, script, stage), cfg);
    }

    const allowGlowStageMax = script?.allowGlowStageMax ?? 1;
    if (stage <= allowGlowStageMax) {
      engine.spawnGlow(p.x, p.y, p.color, (script?.glowSize || 28) * p.velMult, 0.06, 0.03);
    }
  }

  function runCrackle(p, budget) {
    const script = stageScript(budget.signatureFamily, DEATH_CRACKLE);
    const stage = budget.stage;
    const splits = script
      ? Math.max(1, valueByStage(script.splitsByStage, stage, 2))
      : (stage >= 2 ? 1 : (Math.random() < 0.85 ? 2 : 3));
    const splitCheck = canSpawn(budget, splits);
    if (!splitCheck.ok) return;

    const strobeChance = script
      ? valueByStage(script.strobeChanceByStage, stage, 0.2)
      : (stage === 0 ? 0.35 : 0);
    const velocityRange = script
      ? valueByStage(script.velocityRangeByStage, stage, [0.8, 2.4])
      : [0.8, 2.4];

    for (let k = 0; k < splitCheck.count; k++) {
      engine.resetPCfg();
      const cfg = engine.pCfg;
      cfg.angle = rand(0, Math.PI * 2);
      cfg.velocity = rand(velocityRange[0], velocityRange[1]) * p.velMult;
      cfg.drag = 0.9;
      cfg.gravMult = 0.8;
      cfg.decay = rand(0.03, 0.05);
      cfg.trailLength = 1;
      cfg.size = 1.2;
      cfg.isStrobe = Math.random() < strobeChance;
      engine.spawnParticle(p.x, p.y, resolveColor(script?.colorMode, p, script, stage), cfg);
    }

    if (!script && stage <= 1) engine.audio.playCrackle();
  }

  function runGhost(p, budget) {
    const script = stageScript(budget.signatureFamily, DEATH_GHOST);
    const stage = budget.stage;
    const ghostCount = script
      ? Math.max(1, Math.floor(valueByStage(script.ghostCountByStage, stage, 1) * budget.secondaryDensity))
      : 1;

    const ghostCheck = canSpawn(budget, ghostCount);
    if (!ghostCheck.ok) return;

    for (let i = 0; i < ghostCheck.count; i++) {
      engine.resetPCfg();
      const velocityRange = script
        ? valueByStage(script.velocityRangeByStage, stage, [1.8, 4.2])
        : [1.8, 4.2];
      const decayRange = script
        ? valueByStage(script.decayByStage, stage, [0.013, 0.018])
        : (stage >= 2 ? [0.018, 0.024] : [0.013, 0.018]);

      engine.pCfg.velocity = rand(velocityRange[0], velocityRange[1]) * p.velMult;
      engine.pCfg.drag = script ? valueByStage(script.dragByStage, stage, 0.94) : 0.94;
      engine.pCfg.decay = rand(decayRange[0], decayRange[1]);
      engine.pCfg.trailLength = script ? valueByStage(script.trailByStage, stage, 6) : (stage >= 2 ? 4 : 6);
      engine.pCfg.size = 1.7 * (1 + p.charge * 0.3);
      engine.pCfg.alpha = script ? valueByStage(script.alphaByStage, stage, 0.95) : 0.95;
      engine.pCfg.sparkleChance = script
        ? valueByStage(script.sparkleByStage, stage, 0.04)
        : (stage >= 1 ? 0.03 : 0.08);
      engine.spawnParticle(p.x, p.y, resolveColor(script?.colorMode, p, script, stage), engine.pCfg);
    }
  }

  function runDoubleBreak(p, budget) {
    const script = stageScript(budget.signatureFamily, DEATH_DOUBLE_BREAK);
    const stage = budget.stage;
    const baseBursts = script
      ? valueByStage(script.burstsByStage, stage, 5)
      : 5;
    const bursts = Math.max(2, Math.floor(baseBursts * budget.secondaryDensity));
    const burstCheck = canSpawn(budget, bursts);
    if (!burstCheck.ok) return;

    const velocityRange = script
      ? valueByStage(script.velocityRangeByStage, stage, [1.8, 4.1])
      : [1.8, 4.1];

    const sColor = resolveColor(script?.colorMode, p, script, stage);
    for (let k = 0; k < burstCheck.count; k++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2);
      engine.pCfg.velocity = rand(velocityRange[0], velocityRange[1]) * p.velMult;
      engine.pCfg.drag = 0.932;
      engine.pCfg.gravMult = 0.95;
      engine.pCfg.decay = rand(0.016, 0.024);
      engine.pCfg.trailLength = script ? valueByStage(script.trailByStage, stage, 4) : (stage >= 2 ? 3 : 4);
      engine.pCfg.size = 1.4 * (1 + p.charge * 0.2);
      engine.pCfg.sparkleChance = script
        ? valueByStage(script.sparkleByStage, stage, 0.03)
        : (stage === 0 ? 0.06 : 0.02);
      engine.spawnParticle(p.x, p.y, sColor, engine.pCfg);
    }

    const allowGlowStageMax = script?.allowGlowStageMax ?? 1;
    if (stage <= allowGlowStageMax) engine.spawnGlow(p.x, p.y, sColor, (script?.glowSize || 34) * p.velMult, 0.07, 0.028);
  }

  return function dispatchDeathBehavior(p) {
    const budget = resolveBehaviorBudget(p, p.deathBehavior);
    const base = Math.atan2(p.vy, p.vx);

    switch (p.deathBehavior) {
      case DEATH_CROSSETTE:
        runCrossette(p, budget, base);
        break;
      case DEATH_CRACKLE:
        runCrackle(p, budget);
        break;
      case DEATH_GHOST:
        runGhost(p, budget);
        break;
      case DEATH_DOUBLE_BREAK:
        runDoubleBreak(p, budget);
        break;
    }
  };
}

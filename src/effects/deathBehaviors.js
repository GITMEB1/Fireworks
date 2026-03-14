import { rand, DEATH_CROSSETTE, DEATH_CRACKLE, DEATH_GHOST, DEATH_DOUBLE_BREAK } from '../core/utils.js';

export function createDeathBehaviorDispatcher(engine) {
  function resolveBehaviorBudget(p) {
    const bssds = engine.config.BSSDS;
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

    return { limit, ladderStage, secondaryDensity: signature?.degradeLadder?.[Math.max(0, ladderStage - 1)]?.secondaryDensity ?? 1 };
  }

  return function dispatchDeathBehavior(p) {
    const { limit, ladderStage, secondaryDensity } = resolveBehaviorBudget(p);
    const base = Math.atan2(p.vy, p.vx);

    switch (p.deathBehavior) {
      case DEATH_CROSSETTE: {
        const arms = ladderStage >= 2 ? 2 : (ladderStage === 1 ? 3 : 4);
        if (engine.activeCounts.particles + arms > limit) return;
        for (let j = 0; j < arms; j++) {
          engine.resetPCfg();
          const cfg = engine.pCfg;
          cfg.angle = base + j * ((Math.PI * 2) / arms);
          cfg.velocity = rand(2.2, 3.4) * p.velMult;
          cfg.drag = 0.925;
          cfg.decay = rand(0.02, 0.03);
          cfg.trailLength = 3;
          cfg.size = 1.5 * (1 + p.charge * 0.2);
          engine.spawnParticle(p.x, p.y, p.color, cfg);
        }
        if (ladderStage <= 1) engine.spawnGlow(p.x, p.y, p.color, 28 * p.velMult, 0.06, 0.03);
        break;
      }

      case DEATH_CRACKLE: {
        const splits = ladderStage >= 2 ? 1 : (Math.random() < 0.85 ? 2 : 3);
        if (engine.activeCounts.particles + splits > limit) return;
        for (let k = 0; k < splits; k++) {
          engine.resetPCfg();
          const cfg = engine.pCfg;
          cfg.angle = rand(0, Math.PI * 2);
          cfg.velocity = rand(0.8, 2.4) * p.velMult;
          cfg.drag = 0.9;
          cfg.gravMult = 0.8;
          cfg.decay = rand(0.03, 0.05);
          cfg.trailLength = 1;
          cfg.size = 1.2;
          cfg.isStrobe = ladderStage === 0 && Math.random() < 0.35;
          engine.spawnParticle(p.x, p.y, '255,235,180', cfg);
        }
        if (ladderStage <= 1) engine.audio.playCrackle();
        break;
      }

      case DEATH_GHOST: {
        if (engine.activeCounts.particles + 1 > limit) return;
        engine.resetPCfg();
        engine.pCfg.velocity = rand(1.8, 4.2) * p.velMult;
        engine.pCfg.drag = 0.94;
        engine.pCfg.decay = ladderStage >= 2 ? rand(0.018, 0.024) : rand(0.013, 0.018);
        engine.pCfg.trailLength = ladderStage >= 2 ? 4 : 6;
        engine.pCfg.size = 1.7 * (1 + p.charge * 0.3);
        engine.pCfg.alpha = 0.95;
        engine.pCfg.sparkleChance = ladderStage >= 1 ? 0.03 : 0.08;
        engine.spawnParticle(p.x, p.y, '255,255,255', engine.pCfg);
        break;
      }

      case DEATH_DOUBLE_BREAK: {
        const baseBursts = 5;
        const bursts = Math.max(2, Math.floor(baseBursts * secondaryDensity));
        if (engine.activeCounts.particles + bursts > limit) return;
        const sColor = Math.random() < 0.28 ? '255,255,255' : (p.secondaryColor || p.color);
        for (let k = 0; k < bursts; k++) {
          engine.resetPCfg();
          engine.pCfg.angle = rand(0, Math.PI * 2);
          engine.pCfg.velocity = rand(1.8, 4.1) * p.velMult;
          engine.pCfg.drag = 0.932;
          engine.pCfg.gravMult = 0.95;
          engine.pCfg.decay = rand(0.016, 0.024);
          engine.pCfg.trailLength = ladderStage >= 2 ? 3 : 4;
          engine.pCfg.size = 1.4 * (1 + p.charge * 0.2);
          engine.pCfg.sparkleChance = ladderStage === 0 ? 0.06 : 0.02;
          engine.spawnParticle(p.x, p.y, sColor, engine.pCfg);
        }
        if (ladderStage <= 1) engine.spawnGlow(p.x, p.y, sColor, 34 * p.velMult, 0.07, 0.028);
        break;
      }
    }
  };
}

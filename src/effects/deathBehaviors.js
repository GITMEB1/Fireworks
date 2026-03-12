import { rand, DEATH_CROSSETTE, DEATH_CRACKLE, DEATH_GHOST, DEATH_DOUBLE_BREAK } from '../core/utils.js';

export function createDeathBehaviorDispatcher(engine) {
  return function dispatchDeathBehavior(p) {
    const limit = Math.floor(engine.config.LIMITS.maxParticles * engine.state.qualityScale);
    const base = Math.atan2(p.vy, p.vx);

    switch (p.deathBehavior) {
      case DEATH_CROSSETTE:
        if (engine.activeCounts.particles + 4 > limit) return;
        for (let j = 0; j < 4; j++) {
          engine.resetPCfg();
          const cfg = engine.pCfg;
          cfg.angle = base + j * (Math.PI / 2);
          cfg.velocity = rand(2.2, 3.4) * p.velMult;
          cfg.drag = 0.925; cfg.decay = rand(0.02, 0.03);
          cfg.trailLength = 3; cfg.size = 1.5 * (1 + p.charge * 0.2);
          engine.spawnParticle(p.x, p.y, p.color, cfg);
        }
        engine.spawnGlow(p.x, p.y, p.color, 28 * p.velMult, 0.06, 0.03);
        break;

      case DEATH_CRACKLE: {
        const splits = Math.random() < 0.85 ? 2 : 3;
        if (engine.activeCounts.particles + splits > limit) return;
        for (let k = 0; k < splits; k++) {
          engine.resetPCfg();
          const cfg = engine.pCfg;
          cfg.angle = rand(0, Math.PI * 2); cfg.velocity = rand(0.8, 2.4) * p.velMult;
          cfg.drag = 0.9; cfg.gravMult = 0.8; cfg.decay = rand(0.03, 0.05);
          cfg.trailLength = 1; cfg.size = 1.2; cfg.isStrobe = Math.random() < 0.35;
          engine.spawnParticle(p.x, p.y, '255,235,180', cfg);
        }
        break;
      }

      case DEATH_GHOST:
        if (engine.activeCounts.particles + 1 > limit) return;
        engine.resetPCfg();
        engine.pCfg.velocity = rand(1.8, 4.2) * p.velMult; engine.pCfg.drag = 0.936;
        engine.pCfg.decay = rand(0.014, 0.02); engine.pCfg.trailLength = 5;
        engine.pCfg.size = 1.7 * (1 + p.charge * 0.3); engine.pCfg.alpha = 0.95; engine.pCfg.sparkleChance = 0.08;
        engine.spawnParticle(p.x, p.y, '255,255,255', engine.pCfg);
        break;

      case DEATH_DOUBLE_BREAK: {
        if (engine.activeCounts.particles + 5 > limit) return;
        const sColor = Math.random() < 0.28 ? '255,255,255' : (p.secondaryColor || p.color);
        for (let k = 0; k < 5; k++) {
          engine.resetPCfg();
          engine.pCfg.angle = rand(0, Math.PI * 2); engine.pCfg.velocity = rand(1.8, 4.1) * p.velMult;
          engine.pCfg.drag = 0.932; engine.pCfg.gravMult = 0.95; engine.pCfg.decay = rand(0.016, 0.024);
          engine.pCfg.trailLength = 4; engine.pCfg.size = 1.4 * (1 + p.charge * 0.2); engine.pCfg.sparkleChance = 0.06;
          engine.spawnParticle(p.x, p.y, sColor, engine.pCfg);
        }
        engine.spawnGlow(p.x, p.y, sColor, 34 * p.velMult, 0.07, 0.028);
        break;
      }
    }
  };
}

import { rand, pick, DEATH_CROSSETTE, DEATH_CRACKLE, DEATH_GHOST, DEATH_DOUBLE_BREAK } from '../core/utils.js';

export function createShellRegistry(engine) {
  function shellPeony({ x, y, palette, countMult, velMult, charge, prestige }) {
    const count = Math.floor(78 * countMult);
    for (let i = 0; i < count; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2);
      engine.pCfg.velocity = rand(2.5, 8.2) * velMult; engine.pCfg.drag = 0.935; engine.pCfg.decay = rand(0.012, 0.018);
      engine.pCfg.trailLength = 4 + Math.floor(charge * 2) + (prestige ? 1 : 0);
      engine.pCfg.size = (Math.random() < 0.2 ? 2.2 : 1.7) * (1 + charge * 0.3);
      engine.pCfg.sparkleChance = prestige ? 0.14 : 0.08;
      engine.spawnParticle(x, y, Math.random() < 0.24 ? '255,255,255' : pick(palette), engine.pCfg);
    }
  }

  function shellWillow({ x, y, countMult, velMult, charge, prestige }) {
    const goldA = engine.palettes[0][0], goldB = engine.palettes[0][1];
    const count = Math.floor(80 * countMult);
    for (let i = 0; i < count; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2);
      engine.pCfg.velocity = rand(1.5, 6.5) * velMult; engine.pCfg.drag = 0.968; engine.pCfg.gravMult = 0.82; engine.pCfg.decay = rand(0.0042, 0.0065);
      engine.pCfg.trailLength = 12 + Math.floor(charge * 6) + (prestige ? 2 : 0);
      engine.pCfg.size = rand(1.4, 2.1) * (1 + charge * 0.3); engine.pCfg.sparkleChance = prestige ? 0.09 : 0.05;
      engine.spawnParticle(x, y, Math.random() < 0.5 ? goldA : goldB, engine.pCfg);
    }
    engine.spawnGlow(x, y, goldA, 120 * velMult, 0.12 * (1 + charge), 0.01);
  }

  function shellRing({ x, y, palette, countMult, velMult, charge }) {
    const count = Math.floor(44 * countMult);
    const angleOffset = rand(0, Math.PI * 2);
    const ringColor = pick(palette);
    for (let i = 0; i < count; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = (i / count) * Math.PI * 2 + angleOffset;
      engine.pCfg.velocity = rand(5.8, 6.5) * velMult; engine.pCfg.drag = 0.942; engine.pCfg.decay = rand(0.010, 0.013);
      engine.pCfg.trailLength = 4; engine.pCfg.size = 1.8 * (1 + charge * 0.3);
      engine.spawnParticle(x, y, ringColor, engine.pCfg);
    }
  }

  function shellCrossette({ x, y, palette, countMult, velMult, charge }) {
    const count = Math.floor(24 * countMult);
    for (let i = 0; i < count; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2);
      engine.pCfg.velocity = rand(4.2, 7.2) * velMult; engine.pCfg.drag = 0.958; engine.pCfg.decay = rand(0.017, 0.022);
      engine.pCfg.trailLength = 5; engine.pCfg.size = 2.4 * (1 + charge * 0.2);
      engine.pCfg.deathBehavior = DEATH_CROSSETTE; engine.pCfg.velMult = velMult; engine.pCfg.charge = charge;
      engine.spawnParticle(x, y, pick(palette), engine.pCfg);
    }
  }

  function shellCrackle({ x, y, palette, countMult, velMult, charge }) {
    const color = pick(palette);
    const count = Math.floor(72 * countMult);
    for (let i = 0; i < count; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2);
      engine.pCfg.velocity = rand(1.4, 8.4) * velMult; engine.pCfg.drag = 0.93; engine.pCfg.decay = rand(0.013, 0.018);
      engine.pCfg.trailLength = 2; engine.pCfg.size = rand(1.6, 2.2) * (1 + charge * 0.2); engine.pCfg.isStrobe = true;
      engine.pCfg.deathBehavior = DEATH_CRACKLE; engine.pCfg.velMult = velMult;
      engine.spawnParticle(x, y, color, engine.pCfg);
    }
  }

  function shellPalm({ x, y, palette, countMult, velMult, charge }) {
    const arms = Math.floor(12 * countMult);
    const color = pick(palette);
    for (let i = 0; i < arms; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = (i / arms) * Math.PI * 2 + rand(-0.06, 0.06);
      engine.pCfg.velocity = rand(6.4, 9.2) * velMult; engine.pCfg.drag = 0.955; engine.pCfg.gravMult = 0.58;
      engine.pCfg.decay = rand(0.0085, 0.0115); engine.pCfg.trailLength = 15 + Math.floor(charge * 6);
      engine.pCfg.size = rand(2.3, 3.2) * (1 + charge * 0.3); engine.pCfg.sparkleChance = 0.05;
      engine.spawnParticle(x, y, color, engine.pCfg);
    }
  }

  function shellSpiral({ x, y, palette, countMult, velMult, charge }) {
    const turns = Math.floor(42 * countMult);
    const start = rand(0, Math.PI * 2);
    const colorA = pick(palette);
    const colorB = Math.random() < 0.5 ? '255,255,255' : pick(palette);
    for (let i = 0; i < turns; i++) {
      const t = i / turns;
      const velocity = (2 + t * 5.2) * velMult;
      engine.resetPCfg();
      engine.pCfg.angle = start + t * Math.PI * 5.4; engine.pCfg.velocity = velocity; engine.pCfg.drag = 0.946;
      engine.pCfg.decay = rand(0.010, 0.014); engine.pCfg.trailLength = 5; engine.pCfg.size = 1.7 * (1 + charge * 0.2);
      engine.spawnParticle(x, y, colorA, engine.pCfg);
      engine.pCfg.angle = start + t * Math.PI * 5.4 + Math.PI;
      engine.spawnParticle(x, y, colorB, engine.pCfg);
    }
  }

  function shellBrocade({ x, y, palette, countMult, velMult, charge }) {
    const gold = Math.random() < 0.5 ? '255,215,120' : '255,235,170';
    const count = Math.floor(66 * countMult);
    for (let i = 0; i < count; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2);
      engine.pCfg.velocity = rand(2.2, 7.1) * velMult; engine.pCfg.drag = 0.965; engine.pCfg.gravMult = 0.88;
      engine.pCfg.decay = rand(0.0052, 0.0074); engine.pCfg.trailLength = 11 + Math.floor(charge * 5);
      engine.pCfg.size = rand(1.8, 2.4) * (1 + charge * 0.3); engine.pCfg.sparkleChance = 0.12;
      engine.spawnParticle(x, y, gold, engine.pCfg);
    }
  }

  function shellGhost({ x, y, palette, countMult, velMult, charge }) {
    const outer = Math.floor(46 * countMult);
    const dimColor = pick(palette);
    for (let i = 0; i < outer; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2); engine.pCfg.velocity = rand(2.4, 6.8) * velMult;
      engine.pCfg.drag = 0.94; engine.pCfg.decay = rand(0.012, 0.017); engine.pCfg.trailLength = 5;
      engine.pCfg.deathBehavior = DEATH_GHOST; engine.pCfg.velMult = velMult; engine.pCfg.charge = charge;
      engine.spawnParticle(x, y, dimColor, engine.pCfg);
    }
  }

  function shellDoubleBreak({ x, y, palette, countMult, velMult, charge }) {
    const count = Math.floor(28 * countMult);
    const primary = pick(palette), secondary = Math.random() < 0.45 ? '255,255,255' : pick(palette);
    for (let i = 0; i < count; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2); engine.pCfg.velocity = rand(3.2, 7.6) * velMult;
      engine.pCfg.drag = 0.942; engine.pCfg.decay = rand(0.012, 0.016); engine.pCfg.trailLength = 5;
      engine.pCfg.deathBehavior = DEATH_DOUBLE_BREAK; engine.pCfg.velMult = velMult; engine.pCfg.charge = charge;
      engine.pCfg.secondaryColor = secondary;
      engine.spawnParticle(x, y, primary, engine.pCfg);
    }
  }

  const shells = { peony: shellPeony, willow: shellWillow, ring: shellRing, crossette: shellCrossette, crackle: shellCrackle, palm: shellPalm, spiral: shellSpiral, brocade: shellBrocade, ghost: shellGhost, doubleBreak: shellDoubleBreak };

  function createExplosion(x, y, type, palette, charge = 0, prestige = false) {
    const flashColor = palette[0];
    const countMult = 1 + charge * (engine.config.CHARGE.maxMultiplier - 1);
    const velMult = 1 + charge * (engine.config.CHARGE.maxVelMultiplier - 1) + (prestige ? 0.12 : 0);

    engine.spawnFlash(x, y, flashColor, rand(58, 92) * velMult * 1.2, 0.12 + charge * 0.1 + (prestige ? 0.05 : 0));
    engine.spawnGlow(x, y, flashColor, rand(65, 110) * velMult, rand(0.08, 0.18) * (1 + charge + (prestige ? 0.2 : 0)), rand(0.012, 0.02));
    engine.spawnSmokeBurst(x, y, flashColor, Math.floor((['brocade', 'willow', 'doubleBreak'].includes(type) ? 4 : 3) * countMult));
    engine.spawnEmbers(x, y, flashColor, Math.floor((type === 'crackle' ? 14 : 8) * countMult));
    if (charge > 0.4 || prestige) engine.spawnShockwave(x, y, flashColor, prestige ? Math.max(charge, 0.82) : charge);

    (shells[type] || shellPeony)({ x, y, palette, countMult, velMult, charge, prestige });
  }

  return { createExplosion };
}

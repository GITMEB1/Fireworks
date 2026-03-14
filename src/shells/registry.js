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

  function shellFizzle({ x, y, palette }) {
    engine.spawnSmokeBurst(x, y, '150,150,150', 2);
    engine.spawnFlash(x, y, palette[0], 20, 0.4);
    for (let i = 0; i < 8; i++) {
        engine.resetPCfg();
        engine.pCfg.angle = rand(0, Math.PI * 2);
        engine.pCfg.velocity = rand(0.5, 1.5);
        engine.pCfg.drag = 0.95; engine.pCfg.decay = rand(0.02, 0.04);
        engine.pCfg.size = 1.0; engine.pCfg.trailLength = 2;
        engine.spawnParticle(x, y, pick(palette), engine.pCfg);
    }
  }

  function shellHeart({ x, y, palette, countMult, velMult, charge }) {
    const count = Math.floor(60 * countMult);
    const color = pick(palette);
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      engine.resetPCfg();
      engine.pCfg.angle = Math.atan2(hy, hx);
      engine.pCfg.velocity = Math.sqrt(hx * hx + hy * hy) * 0.35 * velMult;
      engine.pCfg.drag = 0.95; engine.pCfg.decay = rand(0.015, 0.02);
      engine.pCfg.trailLength = 4; engine.pCfg.size = 2.0 * (1 + charge * 0.2);
      engine.spawnParticle(x, y, color, engine.pCfg);
    }
  }

  function shellStar({ x, y, palette, countMult, velMult, charge }) {
    const count = Math.floor(60 * countMult);
    const color = pick(palette);
    const points = 5;
    for (let i = 0; i < count; i++) {
        const segment = i % points;
        const t = Math.floor(i / points) / (count / points); 
        const a1 = segment * 4 * Math.PI / 5 - Math.PI / 2;
        const a2 = (segment + 1) * 4 * Math.PI / 5 - Math.PI / 2;
        const px = Math.cos(a1) + (Math.cos(a2) - Math.cos(a1)) * t;
        const py = Math.sin(a1) + (Math.sin(a2) - Math.sin(a1)) * t;
        
        engine.resetPCfg();
        engine.pCfg.angle = Math.atan2(py, px);
        engine.pCfg.velocity = Math.sqrt(px * px + py * py) * 6.5 * velMult;
        engine.pCfg.drag = 0.95; engine.pCfg.decay = rand(0.012, 0.016);
        engine.pCfg.trailLength = 4; engine.pCfg.size = 2.0 * (1 + charge * 0.2);
        engine.spawnParticle(x, y, color, engine.pCfg);
    }
  }

  function shellSmiley({ x, y, palette, countMult, velMult, charge }) {
    const count = Math.floor(70 * countMult);
    const color = pick(palette);
    for (let i = 0; i < count; i++) {
        let px, py;
        if (i < 40) { 
            const t = (i / 40) * Math.PI * 2;
            px = Math.cos(t); py = Math.sin(t);
        } else if (i < 45) { 
            px = -0.35; py = -0.35;
        } else if (i < 50) { 
            px = 0.35; py = -0.35;
        } else { 
            const t = ((i - 50) / 19); 
            const angle = t * 0.6 * Math.PI + 0.2 * Math.PI; 
            px = Math.cos(angle) * 0.6;
            py = Math.sin(angle) * 0.6;
        }
        
        engine.resetPCfg();
        engine.pCfg.angle = Math.atan2(py, px);
        engine.pCfg.velocity = Math.max(0.1, Math.sqrt(px * px + py * py)) * 6.0 * velMult;
        engine.pCfg.drag = 0.95; engine.pCfg.decay = rand(0.012, 0.016);
        engine.pCfg.trailLength = 4; engine.pCfg.size = 2.0 * (1 + charge * 0.2);
        engine.spawnParticle(x, y, color, engine.pCfg);
    }
  }

  function shellDirty({ x, y, palette, countMult, degrade = 0.5 }) {
    const qualityFactor = Math.max(0.6, engine.state.qualityScale);
    const reducedMotionFactor = engine.state.reducedMotion ? 0.55 : 1;
    const count = Math.max(12, Math.floor(42 * countMult * qualityFactor * reducedMotionFactor));
    const contamination = ['120,112,96', '136,128,110', '152,142,120', '170,160,132'];

    engine.spawnSmokeBurst(x, y, '120,120,130', Math.max(2, Math.floor((4 + degrade * 4) * reducedMotionFactor)));
    for (let i = 0; i < count; i++) {
      engine.resetPCfg();
      engine.pCfg.angle = rand(0, Math.PI * 2);
      const instability = 1 + degrade * 0.55;
      engine.pCfg.velocity = rand(1.5, 7.4) / instability;
      engine.pCfg.drag = rand(0.86, 0.93);
      engine.pCfg.decay = rand(0.018, 0.032) * instability;
      engine.pCfg.trailLength = rand(1, 3);
      engine.pCfg.size = rand(1.1, 2.2);
      engine.pCfg.sparkleChance = engine.state.reducedMotion ? 0.04 : 0.1;
      const baseColor = pick(palette);
      const dirtyColor = Math.random() < (0.45 + degrade * 0.35) ? pick(contamination) : baseColor;
      engine.spawnParticle(x, y, dirtyColor, engine.pCfg);
    }
  }


  function applyExplosionImpactToTargets(x, y, explosionRadius, charge = 0) {
    const impactEventId = ++engine.explosionEventId;
    const impactScale = 1 + charge * 1.5;
    for (let i = 0; i < engine.activeCounts.targets; i++) {
      const target = engine.pools.targets[i];
      const dx = target.x - x;
      const dy = target.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalized = Math.max(0, Math.min(1, 1 - (distance / explosionRadius)));
      const intensity = normalized * impactScale;
      if (intensity > 0) target.onImpact(intensity, x, y, impactEventId);
    }
  }

  const shells = { peony: shellPeony, willow: shellWillow, ring: shellRing, crossette: shellCrossette, crackle: shellCrackle, palm: shellPalm, spiral: shellSpiral, brocade: shellBrocade, ghost: shellGhost, doubleBreak: shellDoubleBreak, fizzle: shellFizzle, heart: shellHeart, star: shellStar, smiley: shellSmiley, dirty: shellDirty };

  function createExplosion(x, y, type, palette, charge = 0, prestige = false) {
    if (type === 'fizzle') {
        applyExplosionImpactToTargets(x, y, 72, charge);
        shells.fizzle({ x, y, palette });
        return;
    }

    if (type === 'dirty') {
        const dirtyCfg = engine.config.CHARGE.dirty;
        const degrade = dirtyCfg.minDegrade + (dirtyCfg.maxDegrade - dirtyCfg.minDegrade) * Math.min(1, Math.max(0, charge));
        const impactPenalty = -0.2 - degrade * 0.2;
        const radius = 72 + 28 * (1 - degrade);
        applyExplosionImpactToTargets(x, y, radius, impactPenalty);

        const flashAlpha = engine.state.reducedMotion ? 0.14 : 0.22;
        engine.spawnFlash(x, y, '185,170,145', 32 + 18 * (1 - degrade), flashAlpha);
        engine.spawnGlow(x, y, '145,132,108', 54 + 18 * (1 - degrade), 0.08, 0.022);
        shells.dirty({ x, y, palette, countMult: 0.9 + (1 - degrade) * 0.4, degrade });
        return;
    }

    let isFever = false;
    if (engine.isFever && engine.isFever()) {
        isFever = true;
        prestige = true;
        palette = pick(engine.palettes); // Fever palette randomization (or specific high-end palette if desired)
    }
    
    if (charge >= 1.0 && prestige && engine.triggerSupernova) {
        engine.triggerSupernova(palette[0]);
    }

    const flashColor = palette[0];
    let countMult = 1 + charge * (engine.config.CHARGE.maxMultiplier - 1);
    let velMult = 1 + charge * (engine.config.CHARGE.maxVelMultiplier - 1) + (prestige ? 0.12 : 0);

    if (isFever) {
        countMult *= 1.5;
        velMult *= 1.5;
    }

    const explosionRadius = 110 * velMult;
    applyExplosionImpactToTargets(x, y, explosionRadius, charge);

    engine.spawnFlash(x, y, flashColor, rand(58, 92) * velMult * 1.2, 0.12 + charge * 0.1 + (prestige ? 0.05 : 0));
    engine.spawnGlow(x, y, flashColor, rand(65, 110) * velMult, rand(0.08, 0.18) * (1 + charge + (prestige ? 0.2 : 0)), rand(0.012, 0.02));
    engine.spawnSmokeBurst(x, y, flashColor, Math.floor((['brocade', 'willow', 'doubleBreak'].includes(type) ? 4 : 3) * countMult));
    engine.spawnEmbers(x, y, flashColor, Math.floor((type === 'crackle' ? 14 : 8) * countMult));
    if (charge > 0.4 || prestige) engine.spawnShockwave(x, y, flashColor, prestige ? Math.max(charge, 0.82) : charge);

    (shells[type] || shellPeony)({ x, y, palette, countMult, velMult, charge, prestige });
  }

  return { createExplosion };
}

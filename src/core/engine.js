import { PooledGlow, PooledSmoke, PooledEmber, PooledShockwave, PooledParticle, PooledFirework, PooledTarget } from './entities.js';
import { clamp, pick, rand, DEATH_CROSSETTE, DEATH_CRACKLE, DEATH_DOUBLE_BREAK, DEATH_GHOST, DEATH_NONE } from './utils.js';
import { createShellRegistry } from '../shells/registry.js';
import { createLaunchPatternRunner } from '../patterns/launchPatterns.js';
import { createDeathBehaviorDispatcher } from '../effects/deathBehaviors.js';

export function createEngine({ config, palettes, state, audio }) {
  const pools = { fireworks: [], particles: [], smokes: [], glows: [], embers: [], shockwaves: [], targets: [] };
  const activeCounts = { fireworks: 0, particles: 0, smokes: 0, glows: 0, embers: 0, shockwaves: 0, targets: 0 };

  const engine = {
    config,
    palettes,
    state,
    pools,
    activeCounts,
    pCfg: {
      alpha: 1, decay: 0.015, size: 1.7, drag: config.baseFriction, gravMult: 1,
      trailLength: 4, isFlash: false, isStrobe: false, sparkleChance: 0,
      deathBehavior: DEATH_NONE, angle: 0, velocity: 0, inheritVX: 0, inheritVY: 0,
      velMult: 1, charge: 0, secondaryColor: null
    },
    resetPCfg,
    preAllocatePools,
    spawnParticle,
    spawnGlow,
    spawnSmokeBurst,
    spawnEmbers,
    spawnShockwave,
    spawnShellTo,
    spawnFlash,
    spawnAscentSpark,
    spawnContinuousSpark,
    spawnTarget,
    queueLaunch,
    flushLaunchQueue,
    triggerSupernova,
    registerShot,
    isFever,
    createExplosion: null,
    dispatchDeathBehavior: null,
    launchPattern: null,
    update,
    audio,
    explosionEventId: 0
  };

  const shellRegistry = createShellRegistry(engine);
  engine.createExplosion = shellRegistry.createExplosion;
  engine.dispatchDeathBehavior = createDeathBehaviorDispatcher(engine);
  engine.launchPattern = createLaunchPatternRunner(engine);

  // Initialize new state properties if not present
  state.combo = state.combo || 0;
  state.feverTimer = state.feverTimer || 0;
  state.feverDuration = state.feverDuration || 10000;

  function resetPCfg() {
    const pCfg = engine.pCfg;
    pCfg.alpha = 1; pCfg.decay = 0.015; pCfg.size = 1.7;
    pCfg.drag = config.baseFriction; pCfg.gravMult = 1; pCfg.trailLength = 4;
    pCfg.isFlash = false; pCfg.isStrobe = false; pCfg.sparkleChance = 0;
    pCfg.deathBehavior = DEATH_NONE; pCfg.angle = 0; pCfg.velocity = 0;
    pCfg.inheritVX = 0; pCfg.inheritVY = 0;
    pCfg.velMult = 1; pCfg.charge = 0; pCfg.secondaryColor = null;
  }

  function preAllocatePools() {
    const { LIMITS } = config;
    for (let i = pools.fireworks.length; i < LIMITS.maxFireworks; i++) pools.fireworks.push(new PooledFirework(engine));
    for (let i = pools.particles.length; i < LIMITS.maxParticles; i++) pools.particles.push(new PooledParticle(engine));
    for (let i = pools.smokes.length; i < LIMITS.maxSmoke; i++) pools.smokes.push(new PooledSmoke());
    for (let i = pools.glows.length; i < LIMITS.maxGlows; i++) pools.glows.push(new PooledGlow());
    for (let i = pools.embers.length; i < LIMITS.maxEmbers; i++) pools.embers.push(new PooledEmber());
    for (let i = pools.shockwaves.length; i < LIMITS.maxShockwaves; i++) pools.shockwaves.push(new PooledShockwave());
    for (let i = pools.targets.length; i < LIMITS.maxTargets; i++) pools.targets.push(new PooledTarget(engine));
  }

  function spawnParticle(x, y, color, cfg) {
    const limit = Math.floor(config.LIMITS.maxParticles * state.qualityScale);
    if (activeCounts.particles >= limit) return;
    pools.particles[activeCounts.particles++].init(x, y, color, cfg);
  }
  function spawnGlow(x, y, color, radius = 80, alpha = 0.16, decay = 0.018, rise = -0.02) {
    const limit = Math.floor(config.LIMITS.maxGlows * state.qualityScale);
    if (activeCounts.glows >= limit) return;
    pools.glows[activeCounts.glows++].init(x, y, color, radius * config.glowIntensity, alpha, decay, rise);
  }
  function spawnSmokeBurst(x, y, color, amount = 3) {
    if (!config.smokeEnabled || state.reducedMotion) return;
    const limit = Math.floor(config.LIMITS.maxSmoke * state.qualityScale);
    for (let i = 0; i < amount && activeCounts.smokes < limit; i++) {
      pools.smokes[activeCounts.smokes++].init(x, y, color);
    }
  }
  function spawnEmbers(x, y, color, amount = 8) {
    const limit = Math.floor(config.LIMITS.maxEmbers * state.qualityScale);
    for (let i = 0; i < amount && activeCounts.embers < limit; i++) {
      pools.embers[activeCounts.embers++].init(x, y, color);
    }
  }
  function spawnShockwave(x, y, color, charge = 0) {
    const limit = Math.floor(config.LIMITS.maxShockwaves * state.qualityScale);
    if (activeCounts.shockwaves >= limit) return;
    pools.shockwaves[activeCounts.shockwaves++].init(x, y, color, charge);
  }
  function spawnShellTo(tx, ty, type, palette, startX = null, charge = 0, prestige = false, outcomeMeta = null) {
    const limit = Math.floor(config.LIMITS.maxFireworks * clamp(state.qualityScale + 0.2, 0.6, 1.2));
    if (activeCounts.fireworks >= limit) return;
    const sx = startX == null ? rand(state.width * 0.2, state.width * 0.8) : startX;
    const sy = state.height + rand(14, 34);
    pools.fireworks[activeCounts.fireworks++].init(sx, sy, tx, ty, type, palette || pick(palettes), charge, prestige, outcomeMeta);
  }
  function spawnFlash(x, y, color, size = 76, alpha = 0.14) {
    resetPCfg();
    const pCfg = engine.pCfg;
    pCfg.isFlash = true; pCfg.size = size; pCfg.alpha = alpha; pCfg.decay = 0.08; pCfg.velocity = 0;
    spawnParticle(x, y, color, pCfg);
  }
  function spawnAscentSpark(x, y, color, vx, vy, type, charge = 0, prestige = false) {
    const heavy = ['willow', 'brocade', 'palm'].includes(type) || charge > 0.5 || prestige;
    resetPCfg();
    const pCfg = engine.pCfg;
    pCfg.velocity = (heavy ? rand(0.4, 1.4) : rand(0.3, 1)) * (1 + charge * 0.5 + (prestige ? 0.25 : 0));
    pCfg.angle = rand(Math.PI * 0.7, Math.PI * 1.3);
    pCfg.drag = 0.9; pCfg.gravMult = 0.45;
    pCfg.decay = heavy ? 0.045 : 0.055;
    pCfg.size = (heavy ? 1.2 : 0.9) * (1 + charge);
    pCfg.trailLength = heavy ? 3 : 2;
    pCfg.alpha = 0.9;
    pCfg.inheritVX = vx * 0.12; pCfg.inheritVY = vy * 0.12;
    pCfg.sparkleChance = prestige ? 0.16 : 0;
    spawnParticle(x, y, prestige ? '255,255,255' : color, pCfg);
  }

  function spawnContinuousSpark(x, y, color, vx = 0, vy = 0) {
    const limit = Math.floor(config.LIMITS.maxParticles * 0.6 * state.qualityScale);
    if (activeCounts.particles >= limit) return;
    resetPCfg();
    const pCfg = engine.pCfg;
    pCfg.velocity = rand(0.5, 3.0);
    pCfg.angle = rand(0, Math.PI * 2);
    pCfg.drag = 0.92;
    pCfg.gravMult = 0.8;
    pCfg.decay = rand(0.04, 0.08); // dies fast
    pCfg.size = rand(0.8, 1.8);
    pCfg.trailLength = 2; // short trail to look like sparks
    pCfg.alpha = 1;
    pCfg.inheritVX = vx;
    pCfg.inheritVY = vy;
    spawnParticle(x, y, color, pCfg);
  }


  function spawnTarget(x, y, radius = rand(14, 26), mass = rand(2.2, 5.6), color = pick(palettes)) {
    const limit = Math.floor(config.LIMITS.maxTargets * clamp(state.qualityScale + 0.25, 0.5, 1.2));
    if (activeCounts.targets >= limit) return;
    const targetColor = Array.isArray(color) ? pick(color) : color;
    pools.targets[activeCounts.targets++].init(x, y, radius, mass, targetColor);
  }

  function queueLaunch(delayMs, tx, ty, type = null, palette = null, startX = null, charge = 0, prestige = false, outcomeMeta = null) {
    state.scheduledLaunches.push({ at: performance.now() + delayMs, tx, ty, type, palette, startX, charge, prestige, outcomeMeta });
  }

  function triggerSupernova(color) {
    state.timeDilation = 0.1;
    state.timeDilationTimer = 300;
    state.screenShakeTimer = 400;
    state.flashTimer = 100;
    state.flashColor = color || '255,255,255';
    state.sleepTimer = 60;
    audio.playBassDrop();
  }

  function registerShot(type) {
    if (type === 'supernova') {
      state.combo++;
      if (state.combo >= 3) {
        state.feverTimer = state.feverDuration;
        state.combo = 0; // Reset combo when entering Fever
      }
    } else {
      // Normal or dirty shots reset the combo
      state.combo = 0;
      if (type === 'dirty') {
        state.overchargeCueTimer = config.CHARGE.dirty.cueDurationMs;
      }
    }
  }

  function isFever() {
    return state.feverTimer > 0;
  }

  function flushLaunchQueue(now) {
    if (state.scheduledLaunches.length === 0) return;
    const pending = [];
    for (const l of state.scheduledLaunches) {
      if (l.at <= now) spawnShellTo(l.tx, l.ty, l.type, l.palette, l.startX, l.charge, l.prestige, l.outcomeMeta);
      else pending.push(l);
    }
    state.scheduledLaunches = pending;
  }

  function compactAndUpdate(poolName, timeScale) {
    for (let i = activeCounts[poolName] - 1; i >= 0; i--) {
      if (pools[poolName][i].update(timeScale)) {
        const last = pools[poolName][activeCounts[poolName] - 1];
        pools[poolName][activeCounts[poolName] - 1] = pools[poolName][i];
        pools[poolName][i] = last;
        activeCounts[poolName]--;
      }
    }
  }

  function update(timeScale, now) {
    flushLaunchQueue(now);
    
    // Update Fever timer (dt is roughly equivalent to timeScale in ms contexts, though Fireworks engine handles dt in main loop, we decrement based on timeScale * 16.66)
    if (state.feverTimer > 0) {
      state.feverTimer -= timeScale * 16.66;
    }
    if (state.overchargeCueTimer > 0) {
      state.overchargeCueTimer -= timeScale * 16.66;
    }

    // Sputter sparks for active pointers
    let maxCharge = 0;
    if (state.activePointers && state.activePointers.size > 0) {
      for (const p of state.activePointers.values()) {
        if (Math.random() < Math.max(0.1, timeScale * 0.4)) {
          const color = p.palette ? pick(p.palette) : '255,255,255';
          engine.spawnContinuousSpark(p.x, p.y, color, rand(-1, 1), rand(-1, 1));
        }
        const duration = now - p.startTime;
        const charge = Math.min(1.0, Math.max(0, (duration - config.CHARGE.minDuration) / (config.CHARGE.maxDuration - config.CHARGE.minDuration)));
        if (charge > maxCharge) maxCharge = charge;
      }
    }
    audio.updateCharge(maxCharge);

    compactAndUpdate('fireworks', timeScale);
    compactAndUpdate('particles', timeScale);
    compactAndUpdate('smokes', timeScale);
    compactAndUpdate('glows', timeScale);
    compactAndUpdate('embers', timeScale);
    compactAndUpdate('shockwaves', timeScale);
    compactAndUpdate('targets', timeScale);
  }

  return engine;
}

export { DEATH_CROSSETTE, DEATH_CRACKLE, DEATH_DOUBLE_BREAK, DEATH_GHOST };

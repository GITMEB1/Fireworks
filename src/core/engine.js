import { PooledGlow, PooledSmoke, PooledEmber, PooledShockwave, PooledParticle, PooledFirework } from './entities.js';
import { clamp, pick, rand, DEATH_CROSSETTE, DEATH_CRACKLE, DEATH_DOUBLE_BREAK, DEATH_GHOST, DEATH_NONE } from './utils.js';
import { createShellRegistry } from '../shells/registry.js';
import { createLaunchPatternRunner } from '../patterns/launchPatterns.js';
import { createDeathBehaviorDispatcher } from '../effects/deathBehaviors.js';

export function createEngine({ config, palettes, state }) {
  const pools = { fireworks: [], particles: [], smokes: [], glows: [], embers: [], shockwaves: [] };
  const activeCounts = { fireworks: 0, particles: 0, smokes: 0, glows: 0, embers: 0, shockwaves: 0 };

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
    queueLaunch,
    flushLaunchQueue,
    triggerSupernova,
    createExplosion: null,
    dispatchDeathBehavior: null,
    launchPattern: null,
    update
  };

  const shellRegistry = createShellRegistry(engine);
  engine.createExplosion = shellRegistry.createExplosion;
  engine.dispatchDeathBehavior = createDeathBehaviorDispatcher(engine);
  engine.launchPattern = createLaunchPatternRunner(engine);

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
  function spawnShellTo(tx, ty, type, palette, startX = null, charge = 0, prestige = false) {
    const limit = Math.floor(config.LIMITS.maxFireworks * clamp(state.qualityScale + 0.2, 0.6, 1.2));
    if (activeCounts.fireworks >= limit) return;
    const sx = startX == null ? rand(state.width * 0.2, state.width * 0.8) : startX;
    const sy = state.height + rand(14, 34);
    pools.fireworks[activeCounts.fireworks++].init(sx, sy, tx, ty, type, palette || pick(palettes), charge, prestige);
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

  function queueLaunch(delayMs, tx, ty, type = null, palette = null, startX = null, charge = 0, prestige = false) {
    state.scheduledLaunches.push({ at: performance.now() + delayMs, tx, ty, type, palette, startX, charge, prestige });
  }

  function triggerSupernova(color) {
    state.timeDilation = 0.1;
    state.timeDilationTimer = 300;
    state.screenShakeTimer = 400;
    state.flashTimer = 100;
    state.flashColor = color || '255,255,255';
  }

  function flushLaunchQueue(now) {
    if (state.scheduledLaunches.length === 0) return;
    const pending = [];
    for (const l of state.scheduledLaunches) {
      if (l.at <= now) spawnShellTo(l.tx, l.ty, l.type, l.palette, l.startX, l.charge, l.prestige);
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
    compactAndUpdate('fireworks', timeScale);
    compactAndUpdate('particles', timeScale);
    compactAndUpdate('smokes', timeScale);
    compactAndUpdate('glows', timeScale);
    compactAndUpdate('embers', timeScale);
    compactAndUpdate('shockwaves', timeScale);
  }

  return engine;
}

export { DEATH_CROSSETTE, DEATH_CRACKLE, DEATH_DOUBLE_BREAK, DEATH_GHOST };

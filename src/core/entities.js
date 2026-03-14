import { rand, rgba, weightedShellType } from './utils.js';

export class PooledGlow {
  init(x, y, color, radius, alpha, decay, rise = -0.02) {
    this.x = x; this.y = y; this.color = color;
    this.radius = radius; this.alpha = alpha;
    this.decay = decay; this.rise = rise;
  }
  update(timeScale) {
    this.y += this.rise * timeScale;
    this.radius += 0.7 * timeScale;
    this.alpha -= this.decay * timeScale;
    return this.alpha <= 0;
  }
  draw(ctx) {
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    g.addColorStop(0, rgba(this.color, this.alpha));
    g.addColorStop(0.35, rgba(this.color, this.alpha * 0.35));
    g.addColorStop(1, rgba(this.color, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
  }
}

export class PooledSmoke {
  init(x, y, color) {
    this.x = x + rand(-16, 16); this.y = y + rand(-16, 16);
    this.vx = rand(-0.28, 0.28); this.vy = rand(-0.38, -0.05);
    this.size = rand(18, 42); this.alpha = rand(0.04, 0.085);
    this.decay = rand(0.0005, 0.0011); this.color = color || '110,110,120';
  }
  update(timeScale) {
    this.x += this.vx * timeScale; this.y += this.vy * timeScale;
    this.size += 0.22 * timeScale; this.alpha -= this.decay * timeScale;
    return this.alpha <= 0;
  }
  draw(ctx) {
    ctx.fillStyle = rgba(this.color, this.alpha);
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
  }
}

export class PooledEmber {
  init(x, y, color) {
    this.x = x + rand(-10, 10); this.y = y + rand(-4, 4);
    this.vx = rand(-0.45, 0.45); this.vy = rand(-0.25, 0.2);
    this.color = color; this.alpha = rand(0.18, 0.38);
    this.size = rand(0.9, 1.8); this.decay = rand(0.0035, 0.008);
  }
  update(timeScale) {
    this.x += this.vx * timeScale; this.y += this.vy * timeScale;
    this.vy += 0.008 * timeScale;
    this.vx *= Math.pow(0.992, timeScale);
    this.alpha -= this.decay * timeScale;
    return this.alpha <= 0;
  }
  draw(ctx) {
    ctx.fillStyle = rgba(this.color, this.alpha);
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
  }
}

export class PooledShockwave {
  init(x, y, color, charge = 0) {
    this.x = x; this.y = y; this.color = color;
    this.radius = 10 + charge * 18;
    this.alpha = 0.22 + charge * 0.12;
    this.lineWidth = 1.2 + charge * 2.2;
    this.growth = 3.2 + charge * 3.6;
    this.decay = 0.012 + (1 - charge) * 0.004;
  }
  update(timeScale) {
    this.radius += this.growth * timeScale;
    this.alpha -= this.decay * timeScale;
    return this.alpha <= 0;
  }
  draw(ctx) {
    ctx.strokeStyle = rgba(this.color, this.alpha);
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.stroke();
  }
}

export class PooledParticle {
  constructor(engine) { this.engine = engine; this.trail = new Float32Array(64); }
  init(x, y, color, cfg) {
    this.x = x; this.y = y; this.color = color;
    this.alpha = cfg.alpha; this.decay = cfg.decay;
    this.size = cfg.size; this.drag = cfg.drag;
    this.gravMult = cfg.gravMult; this.trailLength = cfg.trailLength;
    this.isFlash = cfg.isFlash; this.isStrobe = cfg.isStrobe;
    this.strobeSpeed = rand(0.07, 0.14); this.sparkleChance = cfg.sparkleChance;
    this.deathBehavior = cfg.deathBehavior; this.velMult = cfg.velMult;
    this.charge = cfg.charge; this.secondaryColor = cfg.secondaryColor;
    const a = cfg.angle;
    this.vx = Math.cos(a) * cfg.velocity + cfg.inheritVX;
    this.vy = Math.sin(a) * cfg.velocity + cfg.inheritVY;
    this.trailIndex = 0; this.trailCount = 0;
  }
  update(timeScale) {
    if (!this.isFlash) {
      this.trailIndex = (this.trailIndex - 2) & 62;
      this.trail[this.trailIndex] = this.x;
      this.trail[this.trailIndex + 1] = this.y;
      if (this.trailCount < this.trailLength) this.trailCount++;
      this.vx *= Math.pow(this.drag, timeScale);
      this.vy *= Math.pow(this.drag, timeScale);
      this.vy += this.engine.config.gravity * this.gravMult * timeScale;
      this.x += this.vx * timeScale;
      this.y += this.vy * timeScale;
    }
    this.alpha -= this.decay * timeScale;
    if (this.alpha <= 0) {
      if (this.deathBehavior !== 0) this.engine.dispatchDeathBehavior(this);
      return true;
    }
    return false;
  }
  draw(ctx, now) {
    if (this.isFlash) {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = rgba(this.color, Math.max(0, this.alpha)); ctx.fill();
      return;
    }
    if (this.trailCount < 2) return;

    let currentAlpha = this.alpha;
    if (this.isStrobe) currentAlpha = Math.sin(now * this.strobeSpeed) > 0 ? this.alpha : 0.03;

    if (this.sparkleChance > 0 && Math.random() < this.sparkleChance) {
      ctx.strokeStyle = `rgba(255,255,255,${currentAlpha})`;
      ctx.lineWidth = this.size * 1.4;
    } else {
      ctx.strokeStyle = rgba(this.color, currentAlpha);
      ctx.lineWidth = this.size;
    }

    ctx.lineCap = 'round';
    ctx.beginPath();
    let idx = this.trailIndex;
    ctx.moveTo(this.trail[idx], this.trail[idx + 1]);
    for (let i = 1; i < this.trailCount; i++) {
      idx = (idx + 2) & 62;
      ctx.lineTo(this.trail[idx], this.trail[idx + 1]);
    }
    ctx.stroke();
  }
}

export class PooledFirework {
  constructor(engine) { this.engine = engine; this.history = new Float32Array(64); }
  init(startX, startY, targetX, targetY, type, palette, charge = 0, prestige = false, outcomeMeta = null) {
    this.x = startX; this.y = startY;
    this.targetX = targetX; this.targetY = targetY;
    this.charge = charge; this.prestige = prestige;
    this.type = type || weightedShellType(this.engine.config, charge);
    this.outcome = outcomeMeta?.outcome || (this.type === 'dirty' ? 'dirty' : 'normal');
    this.overchargeRatio = Math.max(0, Math.min(1, outcomeMeta?.overchargeRatio || 0));
    this.palette = palette;

    this.timeToTarget = rand(38, 58) * (prestige ? 1.05 : 1);
    this.vx = (targetX - startX) / this.timeToTarget;
    this.vy = (targetY - startY) / this.timeToTarget - 0.5 * this.engine.config.gravity * this.timeToTarget;

    const isDirty = this.outcome === 'dirty';
    this.isHeavy = !isDirty && (['palm', 'willow', 'brocade', 'doubleBreak'].includes(this.type) || charge > 0.5 || prestige);
    const physicsCfg = this.engine.config.PHYSICS || {};
    const profileMap = physicsCfg.shellFlightProfiles || {};
    const profileByType = physicsCfg.shellFlightProfileByType || {};
    const profileKey = profileByType[this.type] || 'default';
    const defaultProfile = profileMap.default || { dragMult: 1, gravityMult: 1, lateralDriftMult: 1 };
    const profile = profileMap[profileKey] || defaultProfile;
    this.flightProfile = {
      dragMult: profile.dragMult ?? defaultProfile.dragMult ?? 1,
      gravityMult: profile.gravityMult ?? defaultProfile.gravityMult ?? 1,
      lateralDriftMult: profile.lateralDriftMult ?? defaultProfile.lateralDriftMult ?? 1
    };
    this.historyLength = Math.floor((this.isHeavy ? 7 : 4) + charge * 5 + (prestige ? 2 : 0));
    this.color = isDirty ? '160,150,120' : (prestige ? '255,245,220' : (this.isHeavy ? '255,220,150' : '255,180,110'));
    this.lineWidth = isDirty ? (1.4 + this.overchargeRatio * 0.4) : ((this.isHeavy ? 2.8 : 1.6) + charge * 1.5 + (prestige ? 0.7 : 0));
    this.sparkRate = isDirty ? (0.08 + this.overchargeRatio * 0.12) : ((this.isHeavy ? 0.25 : 0.12) + charge * 0.2 + (prestige ? 0.1 : 0));
    this.launchGlowColor = isDirty ? '120,112,96' : this.palette[0];
    this.histIndex = 0; this.histCount = 0;
    this.sputterCooldown = 0;
    this.launchDistanceY = Math.max(1, startY - targetY);
    this.altitudeNorm = 0;
  }
  update(timeScale) {
    this.histIndex = (this.histIndex - 2) & 62;
    this.history[this.histIndex] = this.x;
    this.history[this.histIndex + 1] = this.y;
    if (this.histCount < this.historyLength) this.histCount++;

    const isDirty = this.outcome === 'dirty';
    const profile = this.flightProfile || { dragMult: 1, gravityMult: 1, lateralDriftMult: 1 };
    const gravityMult = Math.max(0.92, Math.min(1.08, profile.gravityMult ?? 1));
    const dragMult = Math.max(0.9, Math.min(1.1, profile.dragMult ?? 1));
    const lateralDriftMult = Math.max(0.85, Math.min(1.15, profile.lateralDriftMult ?? 1));

    this.vy += this.engine.config.gravity * gravityMult * timeScale;
    if (isDirty) {
      this.vx += rand(-0.015, 0.015) * lateralDriftMult * (1 + this.overchargeRatio * 1.2) * timeScale;
    }

    const dragCfg = this.engine.config.PHYSICS?.shellAtmosphericDrag;
    if (dragCfg?.enabled) {
      const altitudeNorm = Math.min(1, Math.max(0, (this.targetY - this.y) / this.launchDistanceY));
      this.altitudeNorm = altitudeNorm;
      const apexFactor = Math.max(0, -this.vy) / 2.6;
      let dragStrength = dragCfg.base + (1 - altitudeNorm) * dragCfg.lowAltitudeBoost + apexFactor * dragCfg.apexBoost;
      if (this.isHeavy) dragStrength *= dragCfg.heavyMultiplier;
      dragStrength *= dragMult;
      if (isDirty) dragStrength *= dragCfg.dirtyMultiplier;
      const damping = Math.max(dragCfg.minDamping, 1 - dragStrength * timeScale);
      this.vx *= damping;
      this.vy *= damping;
    }

    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    this.timeToTarget -= 1 * timeScale;

    if (Math.random() < this.sparkRate) {
      this.engine.spawnAscentSpark(this.x, this.y, this.color, this.vx, this.vy, this.type, this.charge, this.prestige);
    }
    if (isDirty) {
      this.sputterCooldown -= timeScale;
      if (this.sputterCooldown <= 0) {
        this.sputterCooldown = rand(2.2, 4.6);
        this.engine.spawnContinuousSpark(this.x, this.y, '135,128,112', rand(-0.4, 0.4), rand(-0.3, 0.3));
      }
    }
    if (Math.random() < 0.07 && this.engine.config.smokeEnabled) {
      this.engine.spawnSmokeBurst(this.x, this.y, this.launchGlowColor, 1);
    }
    if (this.timeToTarget <= 0 || this.y <= this.targetY) {
      this.engine.createExplosion(this.x, this.y, this.type, this.palette, this.charge, this.prestige);
      return true;
    }
    return false;
  }
  draw(ctx) {
    if (this.histCount > 1) {
      ctx.strokeStyle = rgba(this.color, 0.7);
      ctx.lineWidth = this.lineWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      let idx = this.histIndex;
      ctx.moveTo(this.history[idx], this.history[idx + 1]);
      for (let i = 1; i < this.histCount; i++) {
        idx = (idx + 2) & 62;
        ctx.lineTo(this.history[idx], this.history[idx + 1]);
      }
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.isHeavy ? 2.2 : 1.6, 0, Math.PI * 2);
    ctx.fillStyle = rgba(this.color, 0.95);
    ctx.fill();
  }
}


export class PooledTarget {
  constructor(engine) {
    this.engine = engine;
    this.lastImpactEventId = -1;
  }
  init(x, y, radius, mass, color) {
    this.x = x; this.y = y;
    this.vx = rand(-1.2, 1.2); this.vy = rand(-0.6, 0.6);
    this.mass = Math.max(0.1, mass);
    this.health = 1;
    this.radius = radius;
    this.color = color;
    this.rotation = rand(0, Math.PI * 2);
    this.rotationSpeed = rand(-0.035, 0.035);
    this.lastImpactEventId = -1;
  }
  update(timeScale) {
    const { state, config } = this.engine;
    this.vy += config.gravity * timeScale;
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    this.rotation += this.rotationSpeed * timeScale;

    const left = this.radius;
    const right = state.width - this.radius;
    const top = this.radius;
    const bottom = state.height - this.radius;

    if (this.x < left) {
      this.x = left;
      this.vx = Math.abs(this.vx) * 0.82;
    } else if (this.x > right) {
      this.x = right;
      this.vx = -Math.abs(this.vx) * 0.82;
    }

    if (this.y < top) {
      this.y = top;
      this.vy = Math.abs(this.vy) * 0.8;
    } else if (this.y > bottom) {
      this.y = bottom;
      this.vy = -Math.abs(this.vy) * 0.74;
      this.vx *= 0.96;
      if (Math.abs(this.vy) < 0.1) this.vy = 0;
    }

    return this.health <= 0;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = `rgb(${this.color})`;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = Math.max(1.5, this.radius * 0.24);
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.92, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.3, -this.radius * 0.25, this.radius * 0.33, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  onImpact(intensity, impactX, impactY, impactEventId = null) {
    if (impactEventId != null && this.lastImpactEventId === impactEventId) return;
    if (impactEventId != null) this.lastImpactEventId = impactEventId;

    this.health -= intensity;
    const impulse = intensity / this.mass;
    this.vx += (this.x - impactX) * impulse;
    this.vy += (this.y - impactY) * impulse;
    this.vy -= impulse * 2;
    this.rotationSpeed += rand(-0.02, 0.02) * (1 + intensity);

    if (this.health <= 0) this.shatter();
  }
  shatter() {
    const count = Math.floor(rand(15, 26));
    const speedFactor = rand(0.3, 0.6);

    for (let i = 0; i < count; i++) {
      this.engine.resetPCfg();
      const pCfg = this.engine.pCfg;
      pCfg.angle = rand(0, Math.PI * 2);
      pCfg.velocity = rand(1.2, 4.2);
      pCfg.drag = 0.94;
      pCfg.gravMult = 0.95;
      pCfg.decay = rand(0.02, 0.04);
      pCfg.size = rand(1.0, 2.4);
      pCfg.trailLength = 2;
      pCfg.alpha = 1;
      pCfg.inheritVX = this.vx * speedFactor + rand(-1.6, 1.6);
      pCfg.inheritVY = this.vy * speedFactor + rand(-1.6, 1.2);
      this.engine.spawnParticle(this.x, this.y, this.color, pCfg);
    }

    this.engine.spawnSmokeBurst(this.x, this.y, this.color, 3);
    this.health = 0;
  }
}

import { clamp, rand, rgba, weightedShellType } from './utils.js';

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
    this.signatureFamily = cfg.signatureFamily; this.signatureStage = cfg.signatureStage;
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
    this.startY = startY;
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
    // Keep both names synced to ease merges with older apex-focused branches.
    this.launchProgress = 0;
    this.altitudeNorm = 0;
  }

  resolveLaunchProgress() {
    const progress = Math.min(1, Math.max(0, (this.startY - this.y) / this.launchDistanceY));
    // Legacy alias kept for older diffs that referenced altitudeNorm directly.
    this.launchProgress = progress;
    this.altitudeNorm = progress;
    return progress;
  }

  applyAscentDrag(timeScale, isDirty, dragMult) {
    const dragCfg = this.engine.config.PHYSICS?.shellAtmosphericDrag;
    if (!dragCfg?.enabled) return;

    const launchProgress = this.resolveLaunchProgress();
    const apexFactor = Math.max(0, -this.vy) / 2.6;
    let dragStrength = dragCfg.base + (1 - launchProgress) * dragCfg.lowAltitudeBoost + apexFactor * dragCfg.apexBoost;
    if (this.isHeavy) dragStrength *= dragCfg.heavyMultiplier;
    dragStrength *= dragMult;
    if (isDirty) dragStrength *= dragCfg.dirtyMultiplier;
    const damping = Math.max(dragCfg.minDamping, 1 - dragStrength * timeScale);
    this.vx *= damping;
    this.vy *= damping;
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

    this.applyAscentDrag(timeScale, isDirty, dragMult);

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


export class PooledTargetFragment {
  constructor(engine) {
    this.engine = engine;
  }
  init(x, y, radius, color, velocity, sourceTarget) {
    const objectiveCfg = this.engine.config.OBJECTIVE || {};
    this.x = x;
    this.y = y;
    this.radius = Math.max(3, radius);
    this.baseRadius = this.radius;
    this.color = color;
    this.vx = velocity.vx;
    this.vy = velocity.vy;
    this.rotation = rand(0, Math.PI * 2);
    this.rotationSpeed = velocity.rotationSpeed;
    this.alpha = 0.92;
    this.ageMs = 0;
    const qualityScale = clamp(this.engine.state.qualityScale, 0.55, 1);
    const lifeScale = this.engine.state.reducedMotion
      ? 0.56
      : (qualityScale < 0.62 ? 0.62 : (qualityScale < 0.74 ? 0.76 : (qualityScale < 0.86 ? 0.9 : 1)));
    this.lifetimeMs = Math.max(360, ((objectiveCfg.targetFragmentLifetimeMs || 1180) + rand(-1, 1) * (objectiveCfg.targetFragmentLifetimeJitterMs || 360)) * lifeScale);
    this.drag = clamp((objectiveCfg.targetFragmentDrag || 0.958) - (1 - lifeScale) * 0.018, 0.84, 0.995);
    this.gravityMult = (objectiveCfg.targetFragmentGravityMult || 0.96) + (1 - lifeScale) * 0.12;
    this.kind = sourceTarget?.kind || 'normal';
    this.removalReason = null;
  }
  update(timeScale) {
    const { state, config } = this.engine;
    const dtMs = timeScale * 16.666;
    this.ageMs += dtMs;

    this.vx *= Math.pow(this.drag, timeScale);
    this.vy *= Math.pow(this.drag, timeScale);
    this.vy += config.gravity * this.gravityMult * timeScale;
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    this.rotation += this.rotationSpeed * timeScale;

    const boundPad = this.radius * 0.55;
    if (this.x < boundPad) {
      this.x = boundPad;
      this.vx = Math.abs(this.vx) * 0.54;
    } else if (this.x > state.width - boundPad) {
      this.x = state.width - boundPad;
      this.vx = -Math.abs(this.vx) * 0.54;
    }

    if (this.y < boundPad) {
      this.y = boundPad;
      this.vy = Math.abs(this.vy) * 0.5;
    } else if (this.y > state.height - boundPad) {
      this.y = state.height - boundPad;
      this.vy = -Math.abs(this.vy) * 0.42;
      this.vx *= 0.9;
    }

    const lifeRatio = Math.max(0, 1 - this.ageMs / this.lifetimeMs);
    this.alpha = clamp(0.14 + lifeRatio * 0.84, 0, 1);
    this.radius = this.baseRadius * (0.82 + lifeRatio * 0.26);

    if (this.ageMs >= this.lifetimeMs) {
      this.removalReason = 'expired';
      return true;
    }

    return false;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.beginPath();
    ctx.moveTo(-this.radius * 0.9, -this.radius * 0.5);
    ctx.lineTo(this.radius, -this.radius * 0.2);
    ctx.lineTo(this.radius * 0.7, this.radius * 0.82);
    ctx.lineTo(-this.radius * 0.6, this.radius * 0.7);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.42, this.alpha * 0.45)})`;
    ctx.lineWidth = Math.max(0.8, this.radius * 0.12);
    ctx.beginPath();
    ctx.moveTo(-this.radius * 0.62, -this.radius * 0.25);
    ctx.lineTo(this.radius * 0.58, this.radius * 0.2);
    ctx.stroke();

    ctx.restore();
  }
}

export class PooledTarget {
  constructor(engine) {
    this.engine = engine;
    this.lastImpactEventId = -1;
  }
  init(x, y, radius, mass, color, objectiveProfile = null) {
    const objectiveCfg = this.engine.config.OBJECTIVE || {};
    this.x = x; this.y = y;
    this.vx = rand(-1.2, 1.2); this.vy = rand(-0.6, 0.6);
    this.mass = Math.max(0.1, mass);
    this.radius = radius;
    this.color = color;
    this.rotation = rand(0, Math.PI * 2);
    this.rotationSpeed = rand(-0.035, 0.035);

    this.kind = objectiveProfile?.kind || 'normal';
    this.expirePressureMult = objectiveProfile?.expirePressureMult || 1;
    this.lifetimeMs = objectiveProfile?.lifetimeMs || objectiveCfg.targetLifetimeMs || 7600;
    this.health = Math.max(0.2, objectiveProfile?.health || 1);
    this.maxHealth = this.health;

    this.ageMs = 0;
    this.hitFlashMs = 0;
    this.hitFlashDurationMs = Math.max(40, objectiveCfg.targetHitFlashMs || 180);
    this.hitQuality = 'normal';
    this.lastImpactIntensity = 0;
    this.healthState = 'fresh';
    this.isUrgent = false;
    this.removalReason = null;
    this.lastImpactEventId = -1;

    this.destructionState = 'intact';
    this.fractureProgress = 0;
    this.fractureTimerMs = 0;
    this.pendingShatterMeta = null;
    this.hasShattered = false;
  }
  updateStateFlags() {
    const objectiveCfg = this.engine.config.OBJECTIVE || {};
    const healthRatio = this.maxHealth > 0 ? this.health / this.maxHealth : 0;
    const lifeRatio = this.lifetimeMs > 0 ? (this.lifetimeMs - this.ageMs) / this.lifetimeMs : 0;
    this.isUrgent = lifeRatio <= (objectiveCfg.targetUrgentLifetimeRatio || 0.2);

    if (this.destructionState === 'fracturing' || this.destructionState === 'shattered') {
      this.healthState = 'critical';
      return;
    }
    this.healthState = healthRatio <= (objectiveCfg.targetCriticalHealthRatio || 0.35) ? 'critical' : (healthRatio < 0.8 ? 'damaged' : 'fresh');
  }
  beginFracture(hitMeta) {
    if (this.destructionState === 'fracturing' || this.destructionState === 'shattered') return;
    this.destructionState = 'fracturing';
    this.fractureProgress = Math.max(this.fractureProgress, 0.64);
    this.fractureTimerMs = 95;
    this.pendingShatterMeta = hitMeta;
    this.health = Math.max(0, this.health);
  }
  shatter(hitMeta) {
    if (this.hasShattered) return;
    this.hasShattered = true;
    this.destructionState = 'shattered';
    this.removalReason = 'shattered';
    this.engine.spawnTargetFragments?.(this, hitMeta || this.pendingShatterMeta || {});
    this.engine.onTargetShattered?.(this, hitMeta || this.pendingShatterMeta || {});
  }
  update(timeScale) {
    const { state, config } = this.engine;
    this.ageMs += timeScale * 16.666;
    this.hitFlashMs = Math.max(0, this.hitFlashMs - timeScale * 16.666);
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

    if (this.fractureTimerMs > 0) {
      this.fractureTimerMs = Math.max(0, this.fractureTimerMs - timeScale * 16.666);
      this.fractureProgress = clamp(this.fractureProgress + timeScale * 0.04, 0, 1);
      if (this.fractureTimerMs <= 0 && !this.hasShattered) {
        this.shatter(this.pendingShatterMeta || {});
      }
    }

    this.updateStateFlags();

    if (this.ageMs >= this.lifetimeMs && this.health > 0 && this.destructionState !== 'shattered') {
      this.removalReason = 'expired';
      this.health = 0;
      return true;
    }

    if (this.destructionState === 'shattered') {
      return true;
    }

    return false;
  }
  draw(ctx) {
    const lifeRatio = this.lifetimeMs > 0 ? (this.lifetimeMs - this.ageMs) / this.lifetimeMs : 0;
    const urgentPulse = this.isUrgent ? (0.5 + 0.5 * Math.sin(this.ageMs * 0.018)) : 0;
    const ringAlpha = this.healthState === 'critical' ? 0.72 + urgentPulse * 0.18 : 0.48 + urgentPulse * 0.16;
    const crackAlpha = Math.min(0.95, this.fractureProgress * 1.18);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = `rgb(${this.color})`;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    if (this.hitFlashMs > 0) {
      const flash = this.hitFlashMs / this.hitFlashDurationMs;
      ctx.fillStyle = `rgba(255,255,255,${0.18 + flash * 0.32})`;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * (1.06 + flash * 0.12), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.lineWidth = Math.max(1.5, this.radius * 0.24);
    ctx.strokeStyle = this.healthState === 'critical' ? `rgba(255,120,120,${ringAlpha})` : `rgba(255,255,255,${ringAlpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.92, 0, Math.PI * 2);
    ctx.stroke();

    if (this.fractureProgress > 0.08) {
      ctx.strokeStyle = `rgba(255,245,230,${0.32 + crackAlpha * 0.4})`;
      ctx.lineWidth = Math.max(0.9, this.radius * 0.1);
      ctx.beginPath();
      ctx.moveTo(-this.radius * 0.58, -this.radius * 0.18);
      ctx.lineTo(-this.radius * 0.16, this.radius * 0.1);
      ctx.lineTo(this.radius * 0.18, this.radius * 0.02);
      ctx.lineTo(this.radius * 0.58, this.radius * 0.34);
      ctx.moveTo(-this.radius * 0.1, -this.radius * 0.6);
      ctx.lineTo(this.radius * 0.1, -this.radius * 0.22);
      ctx.lineTo(this.radius * 0.44, -this.radius * 0.05);
      ctx.stroke();
    }

    const lifeArcAlpha = this.isUrgent ? 0.95 : 0.42;
    ctx.strokeStyle = `rgba(255,220,130,${lifeArcAlpha})`;
    ctx.lineWidth = Math.max(1, this.radius * 0.16);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 1.16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0.05, lifeRatio));
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.3, -this.radius * 0.25, this.radius * 0.33, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  onImpact(intensity, impactX, impactY, impactEventId = null) {
    if (this.destructionState === 'shattered') return;
    if (impactEventId != null && this.lastImpactEventId === impactEventId) return;
    if (impactEventId != null) this.lastImpactEventId = impactEventId;

    const objectiveCfg = this.engine.config.OBJECTIVE || {};
    const distanceToCore = Math.hypot(this.x - impactX, this.y - impactY);
    const qualityRadius = Math.max(4, this.radius * (objectiveCfg.hitQualityCenterRadiusMult || 1.7));
    const centerBias = Math.max(0, Math.min(1, 1 - (distanceToCore / qualityRadius)));
    const directBonus = objectiveCfg.hitQualityDirectBonus || 0;
    const glancePenalty = objectiveCfg.hitQualityGlancePenalty || 0;
    const glanceThreshold = objectiveCfg.hitQualityGlanceThreshold || 0.3;
    const qualityMult = 1 + centerBias * directBonus - (centerBias < glanceThreshold ? glancePenalty : 0);

    const appliedIntensity = Math.max(0.03, intensity * qualityMult);
    this.health -= appliedIntensity;
    this.lastImpactIntensity = appliedIntensity;
    this.hitQuality = centerBias >= 0.68 ? 'direct' : (centerBias <= glanceThreshold ? 'glancing' : 'normal');
    this.hitFlashMs = this.hitFlashDurationMs;

    const impulse = appliedIntensity / this.mass;
    this.vx += (this.x - impactX) * impulse;
    this.vy += (this.y - impactY) * impulse;
    this.vy -= impulse * 2;
    this.rotationSpeed += rand(-0.02, 0.02) * (1 + appliedIntensity);

    const healthRatio = this.maxHealth > 0 ? this.health / this.maxHealth : 0;
    const fractureThreshold = objectiveCfg.targetFractureThreshold || 0.42;
    const shatterThreshold = objectiveCfg.targetShatterThreshold || 0.88;
    const criticalShatterThreshold = objectiveCfg.targetCriticalShatterThreshold || 0.62;
    const shatterPower = appliedIntensity + (this.hitQuality === 'direct' ? (objectiveCfg.targetShatterDirectBonus || 0.14) : 0) + (this.healthState === 'critical' ? (objectiveCfg.targetShatterCriticalBonus || 0.18) : 0);

    if (healthRatio < 0.82) {
      this.fractureProgress = Math.max(this.fractureProgress, clamp(1 - healthRatio, 0, 0.82));
      if (this.destructionState === 'intact') this.destructionState = healthRatio <= 0.45 ? 'critical' : 'damaged';
    }

    const hitMeta = {
      hitQuality: this.hitQuality,
      isUrgent: this.isUrgent,
      wasCritical: this.healthState === 'critical',
      shatterPower,
      impactX,
      impactY,
      appliedIntensity
    };

    this.engine.onTargetDamaged?.(this, appliedIntensity, hitMeta);

    const directImmediateThreshold = shatterThreshold + (this.hitQuality === 'direct' ? 0 : 0.06);
    const shouldImmediateShatter = shatterPower >= directImmediateThreshold || (this.health <= 0 && shatterPower >= criticalShatterThreshold);
    const shouldFracture = this.health <= 0 || shatterPower >= fractureThreshold;

    if (shouldImmediateShatter) {
      this.shatter(hitMeta);
      return;
    }

    if (shouldFracture) {
      this.beginFracture(hitMeta);
    }
  }
}

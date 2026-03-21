import { rand, rgba, smoothstep01 } from '../core/utils.js';

export function renderChargeVisuals({ ctx, now, activePointers, config, engine }) {
  const chargeCfg = config.CHARGE_VISUALS || {};
  ctx.globalCompositeOperation = 'lighter';

  activePointers.forEach((p) => {
    const duration = now - p.startTime;
    if (duration < config.CHARGE.minDuration) return;

    let rawCharge = (duration - config.CHARGE.minDuration) / (config.CHARGE.maxDuration - config.CHARGE.minDuration);
    let chargeState = 'normal';
    if (rawCharge >= 1.0) {
      chargeState = 'overcharge';
      rawCharge = 1;
    } else if (rawCharge >= 0.95 && rawCharge < 1.0) {
      chargeState = 'perfect';
    }

    const ease = smoothstep01(rawCharge);
    let coreC = p.palette[0];
    let ringC = p.palette[1];
    const isWhiteHot = chargeState === 'perfect';
    const isDead = chargeState === 'overcharge';

    if (isWhiteHot) {
      coreC = '255,255,255';
      ringC = p.palette[0];
    } else if (isDead) {
      coreC = '150,150,150';
      ringC = '80,80,80';
    }

    ctx.fillStyle = rgba(coreC, isDead ? 0.4 : 0.78);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2 + ease * 4.5, 0, Math.PI * 2);
    ctx.fill();

    const glowScale = chargeCfg.glowScale || 1;
    const ringScale = chargeCfg.ringScale || 1;
    const glowRad = (isDead ? 10 + ease * 10 : 28 + ease * 95) * glowScale;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRad);
    g.addColorStop(0, rgba(coreC, isDead ? 0.1 : 0.15 + ease * 0.26));
    g.addColorStop(0.45, rgba(ringC, isDead ? 0.02 : 0.05 + ease * 0.11));
    g.addColorStop(1, rgba(coreC, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineCap = 'round';
    const r1 = (14 + ease * 24) * ringScale;
    const a1 = now * 0.0032;
    ctx.strokeStyle = rgba(ringC, isDead ? 0.1 : 0.38 + ease * 0.5);
    ctx.lineWidth = 1.4 + ease * 2.2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r1, a1, a1 + Math.PI);
    ctx.stroke();

    const r2 = (25 + ease * 46) * ringScale;
    const a2 = -now * 0.002;
    ctx.strokeStyle = rgba(coreC, isDead ? 0.1 : 0.2 + ease * 0.6);
    ctx.lineWidth = 1 + ease * 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r2, a2, a2 + Math.PI * 1.22);
    ctx.stroke();

    const orbitBoost = chargeCfg.orbitCountBoost || 0;
    const orbitCount = isWhiteHot ? 6 + orbitBoost : (isDead ? 0 : Math.floor(2 + rawCharge * 2 + orbitBoost));
    if (!isDead) {
      for (let i = 0; i < orbitCount; i++) {
        const ang = now * (0.002 + i * 0.00035) + i * (Math.PI / Math.max(1, orbitCount));
        const rad = 10 + ease * (18 + i * 8);
        ctx.fillStyle = rgba(ringC, 0.45 + ease * 0.4);
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(ang) * rad, p.y + Math.sin(ang) * rad, 1 + ease * 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const sparkChance = ease * (isWhiteHot ? 1.5 : 0.85) * (chargeCfg.sparkChanceMult || 1);
    if (!isDead && Math.random() < sparkChance) {
      const sAng = rand(0, Math.PI * 2);
      const sDist = rand(r1, r2 + 12);
      const sLen = rand(4, 12);
      ctx.strokeStyle = rgba('255,255,255', isWhiteHot ? 0.95 : 0.62);
      ctx.lineWidth = isWhiteHot ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(sAng) * sDist, p.y + Math.sin(sAng) * sDist);
      ctx.lineTo(p.x + Math.cos(sAng) * (sDist - sLen), p.y + Math.sin(sAng) * (sDist - sLen));
      ctx.stroke();
    }

    if (engine && engine.state && p.targetX !== undefined && !isDead) {
      const dist = Math.hypot(p.targetX - p.startX, p.targetY - p.startY);
      if (dist > 10) {
        const sx = p.launchX;
        const sy = engine.state.height + 24;
        const tx = p.targetX;
        const ty = p.targetY;

        const prestige = chargeState === 'perfect';
        const timeToTarget = 48 * (prestige ? 1.05 : 1);
        const vx = (tx - sx) / timeToTarget;
        const vy = (ty - sy) / timeToTarget - 0.5 * config.gravity * timeToTarget;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        let cx = sx;
        let cy = sy;
        let cvy = vy;

        if (ctx.setLineDash) ctx.setLineDash([4, 8]);
        ctx.strokeStyle = rgba(coreC, Math.max(0.15, ease * 0.7 * (chargeCfg.premiumTrailAlpha || 1)));
        ctx.lineWidth = 1.5 + ease * 1.5;

        for (let i = 1; i <= timeToTarget; i++) {
          cvy += config.gravity;
          cx += vx;
          cy += cvy;
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        if (ctx.setLineDash) ctx.setLineDash([]);

        const crosshairScale = chargeCfg.crosshairScale || 1;
        const crosshairRadius = 10 * crosshairScale;
        ctx.beginPath();
        ctx.moveTo(tx - crosshairRadius, ty);
        ctx.lineTo(tx + crosshairRadius, ty);
        ctx.moveTo(tx, ty - crosshairRadius);
        ctx.lineTo(tx, ty + crosshairRadius);
        ctx.lineWidth = 2 + ease;
        ctx.strokeStyle = rgba(isWhiteHot ? '255,255,255' : coreC, 0.4 + 0.6 * ease);
        ctx.stroke();
      }
    }
  });

  if (engine && engine.state) {
    const run = engine.state.objectiveRun;
    if (run && config.OBJECTIVE?.enabled) {
      const pressureNorm = Math.max(0, Math.min(1, run.pressure / config.OBJECTIVE.maxPressure));
      const pressureWarn = run.pressure >= config.OBJECTIVE.warningPressure;
      const isCompactHud = engine.state.width < 680;
      const pad = isCompactHud ? 10 : 16;
      const panelW = Math.min(engine.state.width * (isCompactHud ? 0.76 : 0.5), isCompactHud ? 280 : 320);
      const panelH = isCompactHud ? 136 : 126;
      const titleFont = isCompactHud ? '600 14px sans-serif' : '600 16px sans-serif';
      const bodyFont = isCompactHud ? '500 12px sans-serif' : '500 13px sans-serif';
      const miniFont = isCompactHud ? '500 11px sans-serif' : '500 12px sans-serif';
      const timerX = isCompactHud ? pad + 12 : pad + panelW - 76;
      const timerY = isCompactHud ? pad + 44 : pad + 24;

      ctx.fillStyle = 'rgba(10,14,26,0.62)';
      ctx.fillRect(pad, pad, panelW, panelH);

      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.font = titleFont;
      ctx.textAlign = 'left';
      ctx.fillText(`Score ${Math.floor(run.score)}`, pad + 12, pad + 24);
      ctx.fillText(`Phase ${run.phase}`, pad + 12, pad + (isCompactHud ? 44 : 46));
      ctx.fillStyle = 'rgba(215,226,255,0.9)';
      ctx.font = bodyFont;
      ctx.fillText(run.objectiveText, pad + 12, pad + (isCompactHud ? 64 : 66));

      const targetStatus = `Urgent ${run.urgentTargets || 0}  Critical ${run.criticalTargets || 0}`;
      ctx.fillStyle = 'rgba(255,220,170,0.9)';
      ctx.font = miniFont;
      ctx.fillText(targetStatus, pad + 12, pad + (isCompactHud ? 82 : 84));

      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.fillText(`Time ${Math.ceil(run.phaseTimerMs / 1000)}s`, timerX, timerY);
      ctx.fillText(engine.state.runtimeProfileLabel || 'Profile', timerX, timerY + 18);

      const barX = pad + 12;
      const barY = pad + (isCompactHud ? 96 : 96);
      const barW = panelW - 24;
      const barH = 12;
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = pressureWarn ? `rgba(255,110,110,${0.72 + Math.sin(now * 0.01) * 0.14})` : 'rgba(120,235,175,0.86)';
      ctx.fillRect(barX, barY, barW * pressureNorm, barH);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '600 11px sans-serif';
      ctx.fillText(`Pressure ${Math.round(run.pressure)}/${config.OBJECTIVE.maxPressure}`, barX, barY + 22);

      if (run.lastHitFeedbackTimerMs > 0 && run.lastHitFeedback) {
        const feedbackAlpha = Math.min(1, run.lastHitFeedbackTimerMs / 900);
        ctx.fillStyle = `rgba(255,255,255,${0.6 + feedbackAlpha * 0.35})`;
        ctx.font = '600 12px sans-serif';
        ctx.fillText(run.lastHitFeedback, barX, barY + 40);
      }

      if (run.status === 'failed') {
        ctx.fillStyle = 'rgba(12,8,18,0.76)';
        ctx.fillRect(engine.state.width * 0.2, engine.state.height * 0.38, engine.state.width * 0.6, 96);
        ctx.fillStyle = 'rgba(255,130,130,0.96)';
        ctx.font = '700 30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('RUN FAILED', engine.state.width / 2, engine.state.height * 0.38 + 40);
        ctx.fillStyle = 'rgba(255,255,255,0.88)';
        ctx.font = '500 16px sans-serif';
        ctx.fillText('Press R or tap/click to restart', engine.state.width / 2, engine.state.height * 0.38 + 70);
      }
    }

    if (engine.state.combo > 0) {
      ctx.fillStyle = rgba('255,255,255', 0.8 + Math.sin(now * 0.01) * 0.2);
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${engine.state.combo}x PERFECT`, engine.state.width / 2, 60);
    }

    if (engine.state.feverTimer > 0) {
      const feverProgress = engine.state.feverTimer / engine.state.feverDuration;
      const alpha = Math.min(1, feverProgress * 2);
      ctx.fillStyle = rgba(`255,${Math.floor(200 + Math.sin(now * 0.02) * 55)},100`, alpha);
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';

      const scale = 1 + Math.sin(now * 0.015) * 0.05;
      ctx.save();
      ctx.translate(engine.state.width / 2, 120);
      ctx.scale(scale, scale);
      ctx.fillText('FEVER MODE', 0, 0);
      ctx.restore();

      ctx.fillStyle = rgba('255,255,255', alpha * 0.5);
      ctx.fillRect(engine.state.width / 2 - 100, 140, 200, 4);
      ctx.fillStyle = rgba('255,200,100', alpha);
      ctx.fillRect(engine.state.width / 2 - 100, 140, 200 * feverProgress, 4);
    }

    if (engine.state.overchargeCueTimer > 0) {
      const cueAlpha = Math.min(1, engine.state.overchargeCueTimer / config.CHARGE.dirty.cueDurationMs);
      ctx.fillStyle = rgba('190,175,145', cueAlpha * 0.85);
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OVERCHARGED', engine.state.width / 2, 92);
    }
  }

  ctx.globalCompositeOperation = 'source-over';
}

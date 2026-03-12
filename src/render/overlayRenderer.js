import { rand, rgba, smoothstep01 } from '../core/utils.js';

export function renderChargeVisuals({ ctx, now, activePointers, config }) {
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
    let coreC = p.palette[0], ringC = p.palette[1];
    let isWhiteHot = chargeState === 'perfect';
    let isDead = chargeState === 'overcharge';

    if (isWhiteHot) {
      coreC = '255,255,255';
      ringC = p.palette[0];
    } else if (isDead) {
      coreC = '150,150,150';
      ringC = '80,80,80';
    }

    ctx.fillStyle = rgba(coreC, isDead ? 0.4 : 0.78);
    ctx.beginPath(); ctx.arc(p.x, p.y, 2 + ease * 4.5, 0, Math.PI * 2); ctx.fill();

    const glowRad = isDead ? 10 + ease * 10 : 28 + ease * 95;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRad);
    g.addColorStop(0, rgba(coreC, isDead ? 0.1 : 0.15 + ease * 0.26));
    g.addColorStop(0.45, rgba(ringC, isDead ? 0.02 : 0.05 + ease * 0.11));
    g.addColorStop(1, rgba(coreC, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2); ctx.fill();

    ctx.lineCap = 'round';
    const r1 = 14 + ease * 24;
    const a1 = now * 0.0032;
    ctx.strokeStyle = rgba(ringC, isDead ? 0.1 : 0.38 + ease * 0.5);
    ctx.lineWidth = 1.4 + ease * 2.2;
    ctx.beginPath(); ctx.arc(p.x, p.y, r1, a1, a1 + Math.PI); ctx.stroke();

    const r2 = 25 + ease * 46;
    const a2 = -now * 0.002;
    ctx.strokeStyle = rgba(coreC, isDead ? 0.1 : 0.2 + ease * 0.6);
    ctx.lineWidth = 1 + ease * 1.5;
    ctx.beginPath(); ctx.arc(p.x, p.y, r2, a2, a2 + Math.PI * 1.22); ctx.stroke();

    const orbitCount = isWhiteHot ? 6 : (isDead ? 0 : Math.floor(2 + rawCharge * 2));
    if (!isDead) {
      for (let i = 0; i < orbitCount; i++) {
        const ang = now * (0.002 + i * 0.00035) + i * (Math.PI / orbitCount);
        const rad = 10 + ease * (18 + i * 8);
        ctx.fillStyle = rgba(ringC, 0.45 + ease * 0.4);
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(ang) * rad, p.y + Math.sin(ang) * rad, 1 + ease * 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!isDead && Math.random() < ease * (isWhiteHot ? 1.5 : 0.85)) {
      const sAng = rand(0, Math.PI * 2), sDist = rand(r1, r2 + 12), sLen = rand(4, 12);
      ctx.strokeStyle = rgba('255,255,255', isWhiteHot ? 0.95 : 0.62);
      ctx.lineWidth = isWhiteHot ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(sAng) * sDist, p.y + Math.sin(sAng) * sDist);
      ctx.lineTo(p.x + Math.cos(sAng) * (sDist - sLen), p.y + Math.sin(sAng) * (sDist - sLen));
      ctx.stroke();
    }
  });
  ctx.globalCompositeOperation = 'source-over';
}

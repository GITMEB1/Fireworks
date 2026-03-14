import { renderChargeVisuals } from './overlayRenderer.js';
import { clamp } from '../core/utils.js';

export function createRenderer({ ctx, backgroundRenderer, activePointers, config, state }) {
  const bloomCanvas = document.createElement('canvas');
  const bloomCtx = bloomCanvas.getContext('2d', { willReadFrequently: false });
  let lastBloomW = 0, lastBloomH = 0;
  let bloomFrameCounter = 0;
  let bloomImpactPulseUntil = 0;
  let bloomNeedsRefresh = true;
  let smoothedBloomIntensity = 0;
  let bloomCompositeAlpha = 0.18;

  function render(now, engine) {
    backgroundRenderer.renderBackground(now, engine);

    // Draw main scene elements (those that should glow)
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < engine.activeCounts.fireworks; i++) engine.pools.fireworks[i].draw(ctx);
    for (let i = 0; i < engine.activeCounts.particles; i++) engine.pools.particles[i].draw(ctx, now);
    for (let i = 0; i < engine.activeCounts.shockwaves; i++) engine.pools.shockwaves[i].draw(ctx);

    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < engine.activeCounts.targets; i++) engine.pools.targets[i].draw(ctx);
    for (let i = 0; i < engine.activeCounts.embers; i++) engine.pools.embers[i].draw(ctx);

    // --- Dynamic Bloom Pass (stress-aware cadence + alpha guardrails) ---
    if (engine.state.qualityScale >= config.BLOOM.minQuality && !engine.state.reducedMotion) {
      const particleLoad = clamp(engine.activeCounts.particles / (config.LIMITS.maxParticles * 0.65), 0, 1);
      const shockwaveLoad = clamp(engine.activeCounts.shockwaves / Math.max(1, config.LIMITS.maxShockwaves), 0, 1);
      const hasImpactFlash = engine.state.flashTimer > 0;
      if (hasImpactFlash) bloomImpactPulseUntil = now + config.BLOOM.impactPulseMs;

      const impactPulseActive = now < bloomImpactPulseUntil;
      const impactIntensity = clamp(shockwaveLoad * 0.55 + (impactPulseActive ? 0.5 : 0), 0, 1);
      const targetBloomIntensity = clamp(0.08 + particleLoad * 0.32 + impactIntensity * 0.52, 0, 1);
      smoothedBloomIntensity += (targetBloomIntensity - smoothedBloomIntensity) * config.BLOOM.intensitySmoothing;

      const qualityFactor = clamp((engine.state.qualityScale - config.BLOOM.minQuality) / (1 - config.BLOOM.minQuality), 0, 1);
      const overload = Math.max(0, particleLoad - 0.72) / 0.28;
      const overloadFade = clamp(1 - overload * config.BLOOM.overloadFade, 0.55, 1);

      const cadence = qualityFactor < 0.45 || overload > 0.1 ? config.BLOOM.lowCadence : config.BLOOM.highCadence;
      bloomFrameCounter = (bloomFrameCounter + 1) % cadence;

      const scale = clamp(
        config.BLOOM.minScale + qualityFactor * (config.BLOOM.maxScale - config.BLOOM.minScale),
        config.BLOOM.minScale,
        config.BLOOM.maxScale
      );
      const bw = Math.max(1, Math.floor(ctx.canvas.width * scale));
      const bh = Math.max(1, Math.floor(ctx.canvas.height * scale));

      if (bw !== lastBloomW || bh !== lastBloomH) {
        bloomCanvas.width = bw;
        bloomCanvas.height = bh;
        lastBloomW = bw;
        lastBloomH = bh;
        bloomNeedsRefresh = true;
      }

      if (hasImpactFlash) bloomNeedsRefresh = true;

      const shouldRefreshBloom = bloomNeedsRefresh || bloomFrameCounter === 0;
      if (shouldRefreshBloom) {
        bloomCtx.clearRect(0, 0, bw, bh);
        const blurRadius = Math.max(1.8, (3.6 + smoothedBloomIntensity * 5.8) * scale);
        bloomCtx.filter = `blur(${blurRadius}px)`;
        bloomCtx.drawImage(ctx.canvas, 0, 0, bw, bh);
        bloomCtx.filter = 'none';
        bloomNeedsRefresh = false;
      }

      bloomCompositeAlpha = clamp((config.BLOOM.baseAlpha + smoothedBloomIntensity * config.BLOOM.impactAlphaBoost) * overloadFade, 0.1, 0.62);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = bloomCompositeAlpha;
      ctx.drawImage(bloomCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
    }

    // Draw UI elements absolute last so they don't blur
    renderChargeVisuals({ ctx, now, activePointers, config, engine });
  }

  return { render };
}

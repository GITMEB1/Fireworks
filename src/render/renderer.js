import { renderChargeVisuals } from './overlayRenderer.js';
import { clamp } from '../core/utils.js';

export function createRenderer({ ctx, backgroundRenderer, activePointers, config, state }) {
  // Two offscreen canvases for the two-pass bloom (downscale → upscale = GPU-accelerated blur)
  const bloomCanvas = document.createElement('canvas');
  const bloomCtx = bloomCanvas.getContext('2d', { willReadFrequently: false, alpha: false });
  const bloomPass2 = document.createElement('canvas');
  const bloomCtx2 = bloomPass2.getContext('2d', { willReadFrequently: false, alpha: false });
  let lastBloomW = 0;
  let lastBloomH = 0;
  let bloomFrameCounter = 0;
  let bloomImpactPulseUntil = 0;
  let bloomNeedsRefresh = true;
  let smoothedBloomIntensity = 0;
  let smoothedBloomAlpha = 0;

  function render(now, engine) {
    backgroundRenderer.renderBackground(now, engine);

    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < engine.activeCounts.fireworks; i++) engine.pools.fireworks[i].draw(ctx);
    for (let i = 0; i < engine.activeCounts.particles; i++) engine.pools.particles[i].draw(ctx, now);
    for (let i = 0; i < engine.activeCounts.shockwaves; i++) engine.pools.shockwaves[i].draw(ctx);

    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < engine.activeCounts.targets; i++) engine.pools.targets[i].draw(ctx);
    for (let i = 0; i < engine.activeCounts.targetFragments; i++) engine.pools.targetFragments[i].draw(ctx);
    for (let i = 0; i < engine.activeCounts.embers; i++) engine.pools.embers[i].draw(ctx);

    if (engine.state.qualityScale >= config.BLOOM.minQuality && !engine.state.reducedMotion) {
      const particleLoad = clamp(engine.activeCounts.particles / (config.LIMITS.maxParticles * 0.65), 0, 1);
      const shockwaveLoad = clamp(engine.activeCounts.shockwaves / Math.max(1, config.LIMITS.maxShockwaves), 0, 1);
      const premiumProfileBoost = state.runtimeProfileId === 'high-end-mobile-premium' ? 1.12 : 1;
      const hasImpactFlash = engine.state.flashTimer > 0;
      if (hasImpactFlash) bloomImpactPulseUntil = now + config.BLOOM.impactPulseMs;

      const impactPulseActive = now < bloomImpactPulseUntil;
      const impactIntensity = clamp(shockwaveLoad * 0.55 + (impactPulseActive ? 0.5 : 0), 0, 1);
      const targetBloomIntensity = clamp((0.08 + particleLoad * 0.32 + impactIntensity * 0.52) * premiumProfileBoost, 0, 1);
      smoothedBloomIntensity += (targetBloomIntensity - smoothedBloomIntensity) * config.BLOOM.intensitySmoothing;

      const qualityFactor = clamp((engine.state.qualityScale - config.BLOOM.minQuality) / (1 - config.BLOOM.minQuality), 0, 1);
      const overload = Math.max(0, particleLoad - 0.72) / 0.28;
      const overloadFade = clamp(1 - overload * config.BLOOM.overloadFade, 0.55, 1);

      const cadence = qualityFactor < 0.45 || overload > 0.1 ? config.BLOOM.lowCadence : config.BLOOM.highCadence;
      bloomFrameCounter = (bloomFrameCounter + 1) % cadence;

      // Two-pass downscale/upscale bloom — GPU-accelerated bilinear blur (no CSS filter needed)
      // Pass 1: tiny downscale (1/8 or 1/6 of main canvas) — approximates a wide Gaussian
      const scaleP1 = clamp(
        config.BLOOM.minScale + qualityFactor * (config.BLOOM.maxScale - config.BLOOM.minScale),
        config.BLOOM.minScale,
        config.BLOOM.maxScale
      );
      const bw = Math.max(2, Math.floor(ctx.canvas.width * scaleP1));
      const bh = Math.max(2, Math.floor(ctx.canvas.height * scaleP1));

      if (bw !== lastBloomW || bh !== lastBloomH) {
        bloomCanvas.width = bw;
        bloomCanvas.height = bh;
        bloomPass2.width = bw;
        bloomPass2.height = bh;
        lastBloomW = bw;
        lastBloomH = bh;
        bloomNeedsRefresh = true;
      }

      if (hasImpactFlash) bloomNeedsRefresh = true;

      const shouldRefreshBloom = bloomNeedsRefresh || bloomFrameCounter === 0;
      if (shouldRefreshBloom) {
        // First downscale pass — the GPU bilinear filter acts as a box-blur approximation
        bloomCtx.imageSmoothingEnabled = true;
        bloomCtx.imageSmoothingQuality = 'low';
        bloomCtx.drawImage(ctx.canvas, 0, 0, bw, bh);
        // Second pass: upscale from the tiny buffer back to further spread the glow
        bloomCtx2.imageSmoothingEnabled = true;
        bloomCtx2.imageSmoothingQuality = 'low';
        bloomCtx2.drawImage(bloomCanvas, 0, 0, bw, bh);
        bloomNeedsRefresh = false;
      }

      // Smooth the alpha value so frame-to-frame alpha jumps don't cause visible flicker
      const targetAlpha = clamp((config.BLOOM.baseAlpha + smoothedBloomIntensity * config.BLOOM.impactAlphaBoost) * overloadFade, 0.08, 0.65);
      smoothedBloomAlpha += (targetAlpha - smoothedBloomAlpha) * 0.18;

      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = smoothedBloomAlpha;
      ctx.drawImage(bloomPass2, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
    }

    renderChargeVisuals({ ctx, now, activePointers, config, engine });
  }

  return { render };
}

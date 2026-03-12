import { renderChargeVisuals } from './overlayRenderer.js';

export function createRenderer({ ctx, backgroundRenderer, activePointers, config, state }) {
  const bloomCanvas = document.createElement('canvas');
  const bloomCtx = bloomCanvas.getContext('2d', { willReadFrequently: false });
  let lastBloomW = 0, lastBloomH = 0;

  function render(now, engine) {
    backgroundRenderer.renderBackground(now, engine);

    // Draw main scene elements (those that should glow)
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < engine.activeCounts.fireworks; i++) engine.pools.fireworks[i].draw(ctx);
    for (let i = 0; i < engine.activeCounts.particles; i++) engine.pools.particles[i].draw(ctx, now);
    for (let i = 0; i < engine.activeCounts.shockwaves; i++) engine.pools.shockwaves[i].draw(ctx);

    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < engine.activeCounts.embers; i++) engine.pools.embers[i].draw(ctx);

    // --- Dynamic Bloom Pass ---
    if (engine.state.qualityScale >= 0.7 && !engine.state.reducedMotion) {
      // Calculate dynamic intensity based on engine activity
      // Base intensity from particle count (capped at maxParticles equivalent)
      const particleIntensity = Math.min(engine.activeCounts.particles / (config.LIMITS.maxParticles * 0.5), 1.0);
      // Extra punch from shockwaves and flashes
      const impactIntensity = Math.min((engine.activeCounts.shockwaves * 0.15) + (engine.state.flashTimer > 0 ? 0.6 : 0), 1.0);
      
      const bloomIntensity = Math.min(0.1 + (particleIntensity * 0.4) + (impactIntensity * 0.5), 1.0);
      
      const scale = Math.max(0.15, engine.state.qualityScale * 0.35); // 0.15 to 0.35 resolution
      const bw = Math.floor(ctx.canvas.width * scale);
      const bh = Math.floor(ctx.canvas.height * scale);
      
      if (bw !== lastBloomW || bh !== lastBloomH) {
        bloomCanvas.width = bw;
        bloomCanvas.height = bh;
        lastBloomW = bw;
        lastBloomH = bh;
      }

      bloomCtx.clearRect(0, 0, bw, bh);
      // Blur radius also scales slightly with intensity for larger "washes"
      const blurRadius = Math.max(2, (4 + bloomIntensity * 8) * scale);
      bloomCtx.filter = `blur(${blurRadius}px)`;
      bloomCtx.drawImage(ctx.canvas, 0, 0, bw, bh);
      bloomCtx.filter = 'none';

      // Composite bloom back over main canvas with dynamic alpha
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.2 + (bloomIntensity * 0.5); // alpha ranges from 0.2 to 0.7
      ctx.drawImage(bloomCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
    }

    // Draw UI elements absolute last so they don't blur
    renderChargeVisuals({ ctx, now, activePointers, config, engine });
  }

  return { render };
}

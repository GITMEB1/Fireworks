import { renderChargeVisuals } from './overlayRenderer.js';

export function createRenderer({ ctx, backgroundRenderer, activePointers, config }) {
  function render(now, engine) {
    backgroundRenderer.renderBackground(now, engine);

    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < engine.activeCounts.fireworks; i++) engine.pools.fireworks[i].draw(ctx);
    for (let i = 0; i < engine.activeCounts.particles; i++) engine.pools.particles[i].draw(ctx, now);
    renderChargeVisuals({ ctx, now, activePointers, config, engine });
    for (let i = 0; i < engine.activeCounts.shockwaves; i++) engine.pools.shockwaves[i].draw(ctx);

    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < engine.activeCounts.embers; i++) engine.pools.embers[i].draw(ctx);
  }

  return { render };
}

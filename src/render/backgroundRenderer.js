import { rand } from '../core/utils.js';

export function createBackgroundRenderer({ canvas, ctx, config, state }) {
  const bgCanvas = document.createElement('canvas');
  const bgCtx = bgCanvas.getContext('2d');
  let stars = [];
  let twinkleStars = [];

  function initStars() {
    stars = []; twinkleStars = [];
    const baseCount = Math.floor((state.width * state.height) / 5200);
    const twinkleCount = Math.floor(baseCount * 0.45);
    for (let i = 0; i < baseCount; i++) {
      stars.push({ x: Math.random() * state.width, y: Math.random() * state.height * 0.88, size: Math.random() * 1.15 + 0.15, alpha: rand(0.06, 0.26) });
    }
    for (let i = 0; i < twinkleCount; i++) {
      twinkleStars.push({ x: Math.random() * state.width, y: Math.random() * state.height * 0.88, size: Math.random() * 1.2 + 0.2, baseAlpha: rand(0.08, 0.34), speed: rand(0.0007, 0.0028), offset: rand(0, Math.PI * 2) });
    }
  }

  function rebuildBackgroundCache() {
    if (!state.width || !state.height || !bgCtx) return;
    bgCanvas.width = state.width * state.dpr;
    bgCanvas.height = state.height * state.dpr;
    bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    bgCtx.scale(state.dpr, state.dpr);

    const gradient = bgCtx.createRadialGradient(state.width / 2, state.height, 0, state.width / 2, state.height, state.height);
    gradient.addColorStop(0, '#0a0d20');
    gradient.addColorStop(0.55, '#060913');
    gradient.addColorStop(1, '#020206');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, state.width, state.height);

    for (const s of stars) {
      bgCtx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      bgCtx.beginPath(); bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2); bgCtx.fill();
    }

    if (config.hazeEnabled) {
      const haze = bgCtx.createLinearGradient(0, state.height * 0.55, 0, state.height);
      haze.addColorStop(0, 'rgba(20,24,40,0)');
      haze.addColorStop(1, 'rgba(20,24,40,0.11)');
      bgCtx.fillStyle = haze;
      bgCtx.fillRect(0, 0, state.width, state.height);
    }
  }

  function renderBackground(now, engine) {
    if (!state.width || !state.height) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(bgCanvas, 0, 0, state.width, state.height);

    if (config.backgroundPulse) {
      const horizonLift = Math.sin(now * 0.00025) * 0.02 + 0.08;
      ctx.fillStyle = `rgba(10,13,32,${0.02 + horizonLift * 0.15})`;
      ctx.fillRect(0, 0, state.width, state.height);
    }

    for (const s of twinkleStars) {
      const twinkle = s.baseAlpha + Math.sin(now * s.speed + s.offset) * 0.16;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, twinkle)})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
    }

    for (let i = 0; i < engine.activeCounts.smokes; i++) engine.pools.smokes[i].draw(ctx);

    if (engine.activeCounts.glows > 0) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < engine.activeCounts.glows; i++) engine.pools.glows[i].draw(ctx);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  return { initStars, rebuildBackgroundCache, renderBackground };
}

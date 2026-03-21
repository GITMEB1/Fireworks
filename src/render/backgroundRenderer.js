import { rand } from '../core/utils.js';

export function createBackgroundRenderer({ canvas, ctx, config, state }) {
  const bgCanvas = document.createElement('canvas');
  const bgCtx = bgCanvas.getContext('2d');
  let stars = [];
  let twinkleStars = [];
  let premiumBands = [];

  function initStars() {
    stars = [];
    twinkleStars = [];
    premiumBands = [];
    const skyCfg = config.SKY || {};
    const starDensity = skyCfg.starDensity || 1;
    const twinkleDensity = skyCfg.twinkleDensity || 1;
    const baseCount = Math.floor((state.width * state.height) / 5200 * starDensity);
    const twinkleCount = Math.floor(baseCount * 0.45 * twinkleDensity);
    const bandCount = Math.max(0, skyCfg.premiumBands || 0);

    for (let i = 0; i < baseCount; i++) {
      stars.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height * 0.88,
        size: Math.random() * 1.15 + 0.15,
        alpha: rand(0.06, 0.26)
      });
    }

    for (let i = 0; i < twinkleCount; i++) {
      twinkleStars.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height * 0.88,
        size: Math.random() * 1.2 + 0.2,
        baseAlpha: rand(0.08, 0.34),
        speed: rand(0.0007, 0.0028),
        offset: rand(0, Math.PI * 2)
      });
    }

    for (let i = 0; i < bandCount; i++) {
      premiumBands.push({
        x: rand(state.width * 0.15, state.width * 0.85),
        y: rand(state.height * 0.12, state.height * 0.7),
        radius: rand(state.width * 0.18, state.width * 0.34),
        alpha: rand(0.03, skyCfg.nebulaAlpha || 0.08),
        drift: rand(0.00008, 0.00022),
        offset: rand(0, Math.PI * 2),
        color: i % 2 === 0 ? '70,110,255' : '255,90,185'
      });
    }
  }

  function rebuildBackgroundCache() {
    if (!state.width || !state.height || !bgCtx) return;
    bgCanvas.width = state.width * state.dpr;
    bgCanvas.height = state.height * state.dpr;
    bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    bgCtx.scale(state.dpr, state.dpr);

    const saturation = config.SKY?.gradientSaturation || 1;
    const gradient = bgCtx.createRadialGradient(state.width / 2, state.height, 0, state.width / 2, state.height, state.height);
    gradient.addColorStop(0, `rgba(${Math.round(10 * saturation)},${Math.round(13 * saturation)},${Math.round(32 * saturation)},1)`);
    gradient.addColorStop(0.55, `rgba(${Math.round(6 * saturation)},${Math.round(9 * saturation)},${Math.round(19 * saturation)},1)`);
    gradient.addColorStop(1, '#020206');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, state.width, state.height);

    for (const band of premiumBands) {
      const halo = bgCtx.createRadialGradient(band.x, band.y, 0, band.x, band.y, band.radius);
      halo.addColorStop(0, `rgba(${band.color},${band.alpha})`);
      halo.addColorStop(0.45, `rgba(${band.color},${band.alpha * 0.42})`);
      halo.addColorStop(1, `rgba(${band.color},0)`);
      bgCtx.fillStyle = halo;
      bgCtx.beginPath();
      bgCtx.arc(band.x, band.y, band.radius, 0, Math.PI * 2);
      bgCtx.fill();
    }

    for (const s of stars) {
      bgCtx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      bgCtx.beginPath();
      bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      bgCtx.fill();
    }

    const horizonGlowAlpha = config.SKY?.horizonGlowAlpha || 0.14;
    const horizonGlow = bgCtx.createRadialGradient(state.width / 2, state.height * 0.92, 0, state.width / 2, state.height * 0.92, state.width * 0.75);
    horizonGlow.addColorStop(0, `rgba(255,180,96,${horizonGlowAlpha})`);
    horizonGlow.addColorStop(0.5, `rgba(102,88,255,${horizonGlowAlpha * 0.3})`);
    horizonGlow.addColorStop(1, 'rgba(6,6,14,0)');
    bgCtx.fillStyle = horizonGlow;
    bgCtx.fillRect(0, state.height * 0.38, state.width, state.height * 0.62);

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
      const profileBoost = state.runtimeProfileId === 'high-end-mobile-premium' ? 1.22 : 1;
      ctx.fillStyle = `rgba(10,13,32,${0.02 + horizonLift * 0.15 * profileBoost})`;
      ctx.fillRect(0, 0, state.width, state.height);
    }

    for (const band of premiumBands) {
      const pulse = 0.65 + Math.sin(now * band.drift + band.offset) * 0.35;
      const radius = band.radius * (0.94 + pulse * 0.08);
      const halo = ctx.createRadialGradient(band.x, band.y, 0, band.x, band.y, radius);
      halo.addColorStop(0, `rgba(${band.color},${band.alpha * 0.36 * pulse})`);
      halo.addColorStop(1, `rgba(${band.color},0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(band.x, band.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const s of twinkleStars) {
      const twinkle = s.baseAlpha + Math.sin(now * s.speed + s.offset) * 0.16;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, twinkle)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
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

import { clamp } from '../core/utils.js';

export function createQualitySystem({ config, state, statusEl }) {
  function applyQualityProfile(force = false) {
    let targetScale = state.qualityScale;
    if (state.reducedMotion) targetScale = Math.min(targetScale, config.QUALITY.reduceMotionScale);
    if (!config.QUALITY.enabled) targetScale = 1;
    if (!force && Math.abs(targetScale - state.qualityScale) < 0.0001) return;

    state.qualityScale = clamp(targetScale, config.QUALITY.minScale, config.QUALITY.maxScale);
    statusEl.textContent = `Quality ${Math.round(state.qualityScale * 100)}%`;
    statusEl.style.opacity = state.userInteracted ? '1' : '0';
  }

  function updateAdaptiveQuality(now, dt) {
    if (!config.QUALITY.enabled || state.hidden) return;
    state.fpsSamples.push(dt);
    if (state.fpsSamples.length > config.QUALITY.sampleSize) state.fpsSamples.shift();
    if (state.fpsSamples.length < config.QUALITY.sampleSize) return;
    if (now - state.lastQualityAdjust < config.QUALITY.cooldownMs) return;

    const avg = state.fpsSamples.reduce((a, b) => a + b, 0) / state.fpsSamples.length;
    let nextScale = state.qualityScale;

    if (avg > config.QUALITY.degradeAvgMs) nextScale = Math.max(config.QUALITY.minScale, state.qualityScale - config.QUALITY.stepDown);
    else if (!state.reducedMotion && avg < config.QUALITY.recoverAvgMs) nextScale = Math.min(config.QUALITY.maxScale, state.qualityScale + config.QUALITY.stepUp);

    if (Math.abs(nextScale - state.qualityScale) > 0.001) {
      state.qualityScale = nextScale;
      applyQualityProfile(true);
      state.lastQualityAdjust = now;
    }
  }

  return { applyQualityProfile, updateAdaptiveQuality };
}

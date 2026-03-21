import { createConfig, PALETTES } from '../core/config.js';
import { create2DContext } from '../core/context2d.js';
import { pick, rand } from '../core/utils.js';
import { createAppState } from './appState.js';
import { createEngine } from '../core/engine.js';
import { createResizeSystem } from '../systems/resizeSystem.js';
import { createQualitySystem } from '../systems/qualitySystem.js';
import { createInputSystem } from '../systems/inputSystem.js';
import { createAudioSystem } from '../systems/audioSystem.js';
import { bindReducedMotionListener } from '../systems/motionPreferenceSystem.js';
import { createRuntimeVNext } from '../runtime-vnext/createRuntimeVNext.js';
import { createRunMetricsCollector } from './runMetricsCollector.js';
import { readBrowserRuntimeInfo, resolveRuntimeProfile } from './runtimeProfiles.js';

function mergeConfigOverrides(profileOverrides = {}, configOverrides = {}) {
  return {
    ...profileOverrides,
    ...configOverrides,
    LIMITS: { ...(profileOverrides.LIMITS || {}), ...(configOverrides.LIMITS || {}) },
    QUALITY: { ...(profileOverrides.QUALITY || {}), ...(configOverrides.QUALITY || {}) },
    DISPLAY: { ...(profileOverrides.DISPLAY || {}), ...(configOverrides.DISPLAY || {}) },
    SKY: { ...(profileOverrides.SKY || {}), ...(configOverrides.SKY || {}) },
    CHARGE_VISUALS: { ...(profileOverrides.CHARGE_VISUALS || {}), ...(configOverrides.CHARGE_VISUALS || {}) },
    TARGET_VISUALS: { ...(profileOverrides.TARGET_VISUALS || {}), ...(configOverrides.TARGET_VISUALS || {}) },
    IMPACT_VISUALS: { ...(profileOverrides.IMPACT_VISUALS || {}), ...(configOverrides.IMPACT_VISUALS || {}) },
    BLOOM: { ...(profileOverrides.BLOOM || {}), ...(configOverrides.BLOOM || {}) },
    OBJECTIVE: { ...(profileOverrides.OBJECTIVE || {}), ...(configOverrides.OBJECTIVE || {}) }
  };
}

export function createFireworksApp({ canvas, hintEl, statusEl, configOverrides = {}, runtimeProfileId = null } = {}) {
  const runtimeInfo = readBrowserRuntimeInfo();
  const runtimeProfile = resolveRuntimeProfile({
    requestedProfileId: runtimeProfileId || runtimeInfo.requestedProfileId || configOverrides.runtimeProfileId || null,
    runtimeInfo
  });
  const mergedOverrides = mergeConfigOverrides(runtimeProfile.configOverrides, configOverrides);
  const config = createConfig(mergedOverrides);
  const ctx = create2DContext(canvas);
  const state = createAppState({
    qualityScale: runtimeProfile.stateOverrides.qualityScale ?? config.QUALITY.maxScale,
    reducedMotion: runtimeInfo.reducedMotion,
    runtimeProfileId: runtimeProfile.id,
    runtimeProfileLabel: runtimeProfile.label,
    runtimeProfileMeta: runtimeProfile.runtimeInfo,
    displayDprCap: runtimeProfile.stateOverrides.displayDprCap ?? config.DISPLAY.dprCap
  });
  const audio = createAudioSystem();
  const runtimeVNext = createRuntimeVNext({ canvas, ctx, config, state });
  const runMetricsCollector = createRunMetricsCollector({ events: runtimeVNext.events, state });
  canvas.dataset.runtimeProfile = runtimeProfile.id;
  canvas.dataset.runtimeProfileLabel = runtimeProfile.label;
  canvas.dataset.runtimeMobileLike = String(!!runtimeProfile.runtimeInfo.isMobileLike);
  canvas.dataset.rendererMode = runtimeVNext.mode;
  if (runtimeVNext.rendererAdapter?.fallbackReason) canvas.dataset.rendererFallbackReason = runtimeVNext.rendererAdapter.fallbackReason;
  canvas.dataset.rendererPreferredMode = runtimeVNext.preferredMode;
  canvas.dataset.rendererGpuInitialized = runtimeVNext.mode === 'webgl2-prototype' ? 'true' : 'false';

  const engine = createEngine({ config, palettes: PALETTES, state, audio, runtimeVNext });
  runtimeVNext.budgets.bindEngine(engine);
  const renderer = runtimeVNext.rendererAdapter;
  const resizeSystem = createResizeSystem({ canvas, ctx, state, rendererAdapter: renderer });
  const qualitySystem = createQualitySystem({ config, state, statusEl });

  createInputSystem({ canvas, hintEl, statusEl, palettes: PALETTES, state, config, engine });
  const unbindMotion = bindReducedMotionListener({ state, config, qualitySystem });

  function onVisibilityChange() {
    state.hidden = document.hidden;
    if (!state.hidden) state.lastNow = performance.now();
    else state.activePointers.clear();
  }

  function maybeAutoLaunch(timeScale) {
    if (config.OBJECTIVE?.enabled) return;
    if (state.userInteracted) return;
    state.autoLaunchTimer -= 1 * timeScale;
    if (state.autoLaunchTimer > 0) return;

    if (state.reducedMotion) {
      engine.launchPattern('single', null, null, 0);
      state.autoLaunchTimer = rand(config.autoLaunchMin * 2.5, config.autoLaunchMax * 2.5);
      return;
    }

    const isFinale = Math.random() < config.finaleChance;
    const charge = isFinale ? rand(0.5, 1.0) : (Math.random() < 0.22 ? rand(0.2, 0.6) : 0);
    engine.launchPattern(isFinale ? 'finale' : pick(['single', 'mirror', 'fan']), null, null, charge);
    state.autoLaunchTimer = rand(config.autoLaunchMin, config.autoLaunchMax);
  }

  function loop(now) {
    state.frameHandle = requestAnimationFrame(loop);
    if (!state.width || !state.height) return;
    if (!state.lastNow) state.lastNow = now;

    let dt = now - state.lastNow;
    if (dt > 100) dt = 16.666;
    const timeScale = dt / 16.666;
    state.lastNow = now;

    if (state.hidden) return;

    if (state.sleepTimer && state.sleepTimer > 0) {
      state.sleepTimer -= dt;
      return;
    }

    qualitySystem.updateAdaptiveQuality(now, dt);

    if (state.timeDilationTimer > 0) {
      state.timeDilationTimer -= dt;
      if (state.timeDilationTimer <= 0) {
        state.timeDilation = 1.0;
        state.timeDilationTimer = 0;
      }
    }

    engine.update(timeScale * state.timeDilation, now);

    const frame = renderer.composeFrame
      ? renderer.composeFrame({ dt, now, state })
      : { dt, shakeX: 0, shakeY: 0, flashColor: state.flashColor, flashIntensity: 0 };

    renderer.render(now, engine, frame);
    const rendererStats = renderer.getDebugStats ? renderer.getDebugStats() : null;
    if (rendererStats) {
      state.runtimeRendererDebug = rendererStats;
      canvas.dataset.rendererGpuInitialized = rendererStats.gpuInitialized ? 'true' : 'false';
      if (rendererStats.particleVertices != null) canvas.dataset.rendererParticleVertices = String(rendererStats.particleVertices);
      if (rendererStats.shockwaveVertices != null) canvas.dataset.rendererShockwaveVertices = String(rendererStats.shockwaveVertices);
      if (rendererStats.fragmentVertices != null) canvas.dataset.rendererFragmentVertices = String(rendererStats.fragmentVertices);
    }

    runMetricsCollector.sampleFrame();
    maybeAutoLaunch(timeScale);
  }

  function start() {
    engine.preAllocatePools();
    qualitySystem.applyQualityProfile(true);
    resizeSystem.resize();
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('resize', resizeSystem.resize);
    state.frameHandle = requestAnimationFrame(loop);
  }

  function stop() {
    if (state.frameHandle) cancelAnimationFrame(state.frameHandle);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('resize', resizeSystem.resize);
    runMetricsCollector.forceFinalize('app-stop');
    runMetricsCollector.dispose();
    if (renderer.dispose) renderer.dispose();
    unbindMotion();
  }

  return {
    start,
    stop,
    engine,
    state,
    resize: resizeSystem.resize,
    runtimeVNext,
    runtimeProfile,
    runMetricsCollector
  };
}

import { createConfig, PALETTES } from '../core/config.js';
import { create2DContext } from '../core/context2d.js';
import { pick, rand } from '../core/utils.js';
import { createAppState } from './appState.js';
import { createEngine } from '../core/engine.js';
import { createBackgroundRenderer } from '../render/backgroundRenderer.js';
import { createRenderer } from '../render/renderer.js';
import { createResizeSystem } from '../systems/resizeSystem.js';
import { createQualitySystem } from '../systems/qualitySystem.js';
import { createInputSystem } from '../systems/inputSystem.js';
import { bindReducedMotionListener } from '../systems/motionPreferenceSystem.js';

export function createFireworksApp({ canvas, hintEl, statusEl, configOverrides = {} }) {
  const config = createConfig(configOverrides);
  const ctx = create2DContext(canvas);
  const state = createAppState();

  const engine = createEngine({ config, palettes: PALETTES, state });
  const backgroundRenderer = createBackgroundRenderer({ canvas, ctx, config, state });
  const renderer = createRenderer({ ctx, backgroundRenderer, activePointers: state.activePointers, config });
  const resizeSystem = createResizeSystem({ canvas, ctx, state, backgroundRenderer });
  const qualitySystem = createQualitySystem({ config, state, statusEl });

  createInputSystem({ canvas, hintEl, statusEl, palettes: PALETTES, state, config, engine });
  const unbindMotion = bindReducedMotionListener({ state, config, qualitySystem });

  function onVisibilityChange() {
    state.hidden = document.hidden;
    if (!state.hidden) state.lastNow = performance.now();
    else state.activePointers.clear();
  }

  function maybeAutoLaunch(timeScale) {
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

    qualitySystem.updateAdaptiveQuality(now, dt);

    // Supernova Time Dilation
    if (state.timeDilationTimer > 0) {
      state.timeDilationTimer -= dt;
      if (state.timeDilationTimer <= 0) {
        state.timeDilation = 1.0;
        state.timeDilationTimer = 0;
      }
    }
    
    // Supernova Screen Shake
    let shakeX = 0, shakeY = 0;
    if (state.screenShakeTimer > 0) {
      state.screenShakeTimer -= dt;
      if (state.screenShakeTimer > 0) {
        const intensity = (state.screenShakeTimer / 400); // 400ms max
        shakeX = (Math.random() - 0.5) * 40 * intensity;
        shakeY = (Math.random() - 0.5) * 40 * intensity;
      } else {
        state.screenShakeTimer = 0;
      }
    }

    if (shakeX !== 0 || shakeY !== 0) {
      ctx.save();
      ctx.translate(shakeX, shakeY);
    }

    engine.update(timeScale * state.timeDilation, now);
    renderer.render(now, engine);

    // Supernova Color Flash
    if (state.flashTimer > 0) {
      state.flashTimer -= dt;
      if (state.flashTimer > 0) {
        const flashIntensity = state.flashTimer / 100; // 100ms max
        ctx.fillStyle = `rgba(${state.flashColor}, ${flashIntensity * 0.8})`;
        ctx.fillRect(-state.width, -state.height, state.width * 3, state.height * 3);
      } else {
        state.flashTimer = 0;
      }
    }

    if (shakeX !== 0 || shakeY !== 0) {
      ctx.restore();
    }

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
    unbindMotion();
  }

  return { start, stop, engine, state, resize: resizeSystem.resize };
}

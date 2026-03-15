import { createRenderer } from '../../render/renderer.js';
import { createBackgroundRenderer } from '../../render/backgroundRenderer.js';
import { createRendererAdapter } from '../contracts/rendererAdapter.js';
import { createFrameCompositionController } from './frameCompositionController.js';

export function createCanvas2DRendererAdapter({ canvas, ctx, config, state, activePointers }) {
  const backgroundRenderer = createBackgroundRenderer({ canvas, ctx, config, state });
  const renderer = createRenderer({ ctx, backgroundRenderer, activePointers, config, state });
  const frameController = createFrameCompositionController({ state });

  function composeFrame({ dt }) {
    return frameController.compose(dt);
  }

  function render(now, engine, frame = {}) {
    const shakeX = frame.shakeX || 0;
    const shakeY = frame.shakeY || 0;
    const useShake = shakeX !== 0 || shakeY !== 0;

    if (useShake) {
      ctx.save();
      ctx.translate(shakeX, shakeY);
    }

    renderer.render(now, engine);

    if (frame.flashIntensity > 0) {
      ctx.fillStyle = `rgba(${frame.flashColor || '255,255,255'}, ${(frame.flashIntensity || 0) * 0.8})`;
      ctx.fillRect(-state.width, -state.height, state.width * 3, state.height * 3);
    }

    if (useShake) ctx.restore();
  }

  function getDebugStats() {
    return {
      mode: 'canvas2d-baseline',
      gpuInitialized: false,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    };
  }

  return createRendererAdapter({
    id: 'canvas2d-baseline',
    kind: 'canvas2d',
    composeFrame,
    render,
    getDebugStats,
    resize: () => {
      backgroundRenderer.initStars();
      backgroundRenderer.rebuildBackgroundCache();
    }
  });
}

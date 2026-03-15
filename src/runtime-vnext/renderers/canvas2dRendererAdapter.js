import { createRenderer } from '../../render/renderer.js';
import { createBackgroundRenderer } from '../../render/backgroundRenderer.js';
import { createRendererAdapter } from '../contracts/rendererAdapter.js';

export function createCanvas2DRendererAdapter({ canvas, ctx, config, state, activePointers }) {
  const backgroundRenderer = createBackgroundRenderer({ canvas, ctx, config, state });
  const renderer = createRenderer({ ctx, backgroundRenderer, activePointers, config, state });

  return createRendererAdapter({
    id: 'canvas2d-baseline',
    kind: 'canvas2d',
    render: renderer.render,
    resize: () => {
      backgroundRenderer.initStars();
      backgroundRenderer.rebuildBackgroundCache();
    }
  });
}

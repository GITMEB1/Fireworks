import { createRuntimeEvents } from './contracts/runtimeEvents.js';
import { createRuntimeBudgetManager } from './contracts/runtimeBudgetManager.js';
import { createCanvas2DRendererAdapter } from './renderers/canvas2dRendererAdapter.js';
import { createWebGL2PrototypeRendererAdapter } from './renderers/webgl2PrototypeRendererAdapter.js';

/**
 * Runtime-vnext composition root.
 * Phase 1 adds WebGL2 prototype lane with fallback to Canvas2D baseline.
 */
export function createRuntimeVNext({ canvas, ctx, config, state }) {
  const events = createRuntimeEvents();
  const budgets = createRuntimeBudgetManager({ config, state, events });

  const selectedMode = resolveRendererMode(config);

  const fallbackFactory = (reason) => {
    const fallback = createCanvas2DRendererAdapter({
      canvas,
      ctx,
      config,
      state,
      activePointers: state.activePointers
    });
    fallback.fallbackReason = reason || null;
    return fallback;
  };

  const rendererAdapter = selectedMode === 'webgl2-prototype'
    ? createWebGL2PrototypeRendererAdapter({
        canvas,
        config,
        state,
        activePointers: state.activePointers,
        fallbackFactory
      })
    : fallbackFactory(null);

  return {
    events,
    budgets,
    rendererAdapter,
    mode: rendererAdapter.id,
    preferredMode: selectedMode
  };
}

function resolveRendererMode(config) {
  const urlMode = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('renderer')
    : null;
  const configMode = config?.RENDERER?.mode || null;
  const requestedMode = (urlMode || configMode || 'canvas2d-baseline').toLowerCase();
  return requestedMode === 'webgl2' || requestedMode === 'webgl2-prototype'
    ? 'webgl2-prototype'
    : 'canvas2d-baseline';
}

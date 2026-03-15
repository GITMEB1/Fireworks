import { createRuntimeEvents } from './contracts/runtimeEvents.js';
import { createRuntimeBudgetManager } from './contracts/runtimeBudgetManager.js';
import { createCanvas2DRendererAdapter } from './renderers/canvas2dRendererAdapter.js';

/**
 * Phase 0 scaffold for runtime-vnext.
 * Keeps Canvas2D as baseline while exposing explicit contracts for future lanes.
 */
export function createRuntimeVNext({ canvas, ctx, config, state }) {
  const events = createRuntimeEvents();
  const budgets = createRuntimeBudgetManager({ config, state, events });

  const rendererAdapter = createCanvas2DRendererAdapter({
    canvas,
    ctx,
    config,
    state,
    activePointers: state.activePointers
  });

  return {
    events,
    budgets,
    rendererAdapter,
    mode: 'baseline-canvas2d'
  };
}

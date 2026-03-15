/**
 * Renderer adapter boundary for current Canvas2D path and future GPU implementations.
 */
export function createRendererAdapter({ id, kind, render, resize = null }) {
  if (typeof render !== 'function') {
    throw new Error('Renderer adapter requires a render(now, engine) function.');
  }

  return {
    id,
    kind,
    render,
    resize: typeof resize === 'function' ? resize : null
  };
}

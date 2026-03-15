/**
 * Renderer adapter boundary for current Canvas2D path and future GPU implementations.
 */
export function createRendererAdapter({ id, kind, composeFrame = null, render, resize = null }) {
  if (typeof render !== 'function') {
    throw new Error('Renderer adapter requires a render(now, engine) function.');
  }

  return {
    id,
    kind,
    composeFrame: typeof composeFrame === 'function' ? composeFrame : null,
    render,
    resize: typeof resize === 'function' ? resize : null
  };
}

/**
 * Renderer adapter boundary for current Canvas2D path and future GPU implementations.
 */
export function createRendererAdapter({ id, kind, composeFrame = null, render, resize = null, getDebugStats = null }) {
  if (typeof render !== 'function') {
    throw new Error('Renderer adapter requires a render(now, engine) function.');
  }

  let frameCount = 0;
  const resolveDebugStats = typeof getDebugStats === 'function'
    ? getDebugStats
    : null;

  function renderWithStats(now, engine, frame) {
    frameCount += 1;
    return render(now, engine, frame);
  }

  return {
    id,
    kind,
    composeFrame: typeof composeFrame === 'function' ? composeFrame : null,
    render: renderWithStats,
    resize: typeof resize === 'function' ? resize : null,
    getDebugStats: resolveDebugStats || (() => ({
      id,
      kind,
      frameCount
    }))
  };
}

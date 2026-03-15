export function createResizeSystem({ canvas, ctx, state, backgroundRenderer = null, rendererAdapter = null }) {
  function resize() {
    const newW = window.innerWidth;
    const newH = window.innerHeight;
    if (newW === state.width && newH === state.height) return;
    if (!newW || !newH) return;

    state.width = newW;
    state.height = newH;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = state.width * state.dpr;
    canvas.height = state.height * state.dpr;
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(state.dpr, state.dpr);

    if (rendererAdapter?.resize) {
      rendererAdapter.resize();
      return;
    }

    backgroundRenderer?.initStars?.();
    backgroundRenderer?.rebuildBackgroundCache?.();
  }

  return { resize };
}

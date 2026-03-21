export function createResizeSystem({ canvas, ctx, state, backgroundRenderer = null, rendererAdapter = null }) {
  function resize() {
    const newW = window.innerWidth;
    const newH = window.innerHeight;
    if (newW === state.width && newH === state.height) return;
    if (!newW || !newH) return;

    state.width = newW;
    state.height = newH;
    const dprCap = state.displayDprCap || 2;
    state.dpr = Math.min(window.devicePixelRatio || 1, dprCap);

    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
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

export function bindReducedMotionListener({ state, config, qualitySystem }) {
  if (!window.matchMedia) return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const apply = () => {
    state.reducedMotion = mq.matches;
    state.qualityScale = state.reducedMotion ? Math.min(state.qualityScale, config.QUALITY.reduceMotionScale) : Math.max(state.qualityScale, 0.82);
    qualitySystem.applyQualityProfile(true);
  };

  if (mq.addEventListener) mq.addEventListener('change', apply);
  else if (mq.addListener) mq.addListener(apply);

  return () => {
    if (mq.removeEventListener) mq.removeEventListener('change', apply);
    else if (mq.removeListener) mq.removeListener(apply);
  };
}

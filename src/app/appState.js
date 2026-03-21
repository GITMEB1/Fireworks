export function createAppState(overrides = {}) {
  const hasWindow = typeof window !== 'undefined';
  const reducedMotion = overrides.reducedMotion ?? (hasWindow && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false);

  return {
    width: overrides.width ?? 0,
    height: overrides.height ?? 0,
    dpr: overrides.dpr ?? 1,
    hidden: false,
    userInteracted: overrides.userInteracted ?? false,
    autoLaunchTimer: 45,
    lastNow: 0,
    lastQualityAdjust: 0,
    qualityScale: overrides.qualityScale ?? 1,
    fpsSamples: [],
    reducedMotion,
    suppressMouseUntil: 0,
    activePointers: new Map(),
    scheduledLaunches: [],
    // Supernova states
    timeDilation: 1.0, 
    timeDilationTimer: 0,
    screenShakeTimer: 0,
    flashTimer: 0,
    flashColor: '255,255,255',
    overchargeCueTimer: 0,
    objectiveRun: null,
    runtimeRendererDebug: null
  };
}

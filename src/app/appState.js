export function createAppState() {
  return {
    width: 0,
    height: 0,
    dpr: 1,
    hidden: false,
    userInteracted: false,
    autoLaunchTimer: 45,
    lastNow: 0,
    lastQualityAdjust: 0,
    qualityScale: 1,
    fpsSamples: [],
    reducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    suppressMouseUntil: 0,
    activePointers: new Map(),
    scheduledLaunches: [],
    // Supernova states
    timeDilation: 1.0, 
    timeDilationTimer: 0,
    screenShakeTimer: 0,
    flashTimer: 0,
    flashColor: '255,255,255'
  };
}

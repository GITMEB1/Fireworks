export const CONFIG = {
  gravity: 0.065,
  baseFriction: 0.952,

  LIMITS: {
    maxParticles: 2000,
    maxSmoke: 80,
    maxGlows: 30,
    maxEmbers: 200,
    maxShockwaves: 15,
    maxFireworks: 25
  },

  autoLaunchMin: 60,
  autoLaunchMax: 160,
  glowIntensity: 1,
  smokeEnabled: true,
  hazeEnabled: true,
  backgroundPulse: true,
  finaleChance: 0.14,

  CHARGE: {
    minDuration: 180,
    maxDuration: 1450,
    maxMultiplier: 2.25,
    maxVelMultiplier: 1.45,
    prestigeThreshold: 0.9
  },

  QUALITY: {
    enabled: true,
    sampleSize: 30,
    degradeAvgMs: 22.5,
    recoverAvgMs: 16.0,
    minScale: 0.62,
    maxScale: 1.0,
    stepDown: 0.12,
    stepUp: 0.06,
    cooldownMs: 1800,
    reduceMotionScale: 0.72
  },

  shellWeights: {
    peony: 1.2, willow: 1.0, ring: 0.9, crossette: 0.8,
    crackle: 0.9, palm: 0.8, spiral: 0.7, brocade: 0.78,
    ghost: 0.62, doubleBreak: 0.68
  }
};

export const PALETTES = [
  ['255, 215, 0', '255, 240, 170', '255, 180, 90'],
  ['255, 120, 80', '255, 70, 120', '255, 180, 70'],
  ['120, 255, 255', '120, 180, 255', '200, 120, 255'],
  ['100, 255, 130', '70, 210, 255', '30, 120, 255'],
  ['255, 255, 255', '210, 225, 255', '180, 200, 255'],
  ['255, 80, 140', '255, 180, 80', '255, 225, 80'],
  ['180, 255, 110', '255, 110, 240', '110, 255, 255']
];

export function createConfig(overrides = {}) {
  return {
    ...CONFIG,
    ...overrides,
    LIMITS: { ...CONFIG.LIMITS, ...(overrides.LIMITS || {}) },
    CHARGE: { ...CONFIG.CHARGE, ...(overrides.CHARGE || {}) },
    QUALITY: { ...CONFIG.QUALITY, ...(overrides.QUALITY || {}) },
    shellWeights: { ...CONFIG.shellWeights, ...(overrides.shellWeights || {}) }
  };
}

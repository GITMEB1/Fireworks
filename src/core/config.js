export const CONFIG = {
  gravity: 0.065,
  baseFriction: 0.952,

  LIMITS: {
    maxParticles: 2000,
    maxSmoke: 80,
    maxGlows: 30,
    maxEmbers: 200,
    maxShockwaves: 15,
    maxFireworks: 25,
    maxTargets: 20,
    maxTargetFragments: 48
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
    prestigeThreshold: 0.9,
    dirty: {
      overchargeWindowMs: 650,
      minDegrade: 0.35,
      maxDegrade: 0.75,
      cueDurationMs: 800
    }
  },


  RENDERER: {
    mode: 'canvas2d-baseline'
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

  BLOOM: {
    minQuality: 0.66,
    minScale: 0.14,
    maxScale: 0.34,
    baseAlpha: 0.14,
    impactAlphaBoost: 0.42,
    overloadFade: 0.22,
    lowCadence: 2,
    highCadence: 1,
    impactPulseMs: 180,
    intensitySmoothing: 0.2
  },

  OBJECTIVE: {
    enabled: true,
    initialPressure: 18,
    maxConcurrentTargets: 4,
    spawnCooldownMs: 1520,
    spawnJitterMs: 480,
    targetLifetimeMs: 7600,
    maxPressure: 100,
    warningPressure: 72,
    failPressure: 100,
    pressurePerExpire: 18,
    pressurePerDirtyShot: 8,
    pressureDecayPerSecond: 1.8,
    pressureRecoveryOnClear: 9,
    pressureRecoveryOnPerfect: 12,
    scorePerHit: 20,
    scorePerClear: 120,
    scorePerfectBonus: 60,
    comboWindowMs: 2400,
    comboMax: 5,
    comboBonusPerStep: 0.15,
    phaseDurationMs: 26000,
    phaseClearTargetBase: 6,
    phaseClearTargetStep: 2,
    phaseTargetSpeedMultStep: 0.08,
    qualityTargetScaleMin: 0.55,
    targetBaseHealth: 1.4,
    targetHealthPhaseStep: 0.11,
    targetPriorityChance: 0.3,
    targetPriorityLifetimeMult: 0.72,
    targetPriorityHealthMult: 0.9,
    targetPriorityExpirePressureMult: 1.25,
    targetArmoredChance: 0.24,
    targetArmoredHealthMult: 1.35,
    targetArmoredLifetimeMult: 1.15,
    targetCriticalHealthRatio: 0.38,
    targetUrgentLifetimeRatio: 0.22,
    targetHitFlashMs: 180,
    hitQualityCenterRadiusMult: 1.7,
    hitQualityDirectBonus: 0.45,
    hitQualityGlancePenalty: 0.22,
    hitQualityGlanceThreshold: 0.32,
    scoreDirectHitBonus: 10,
    scoreCriticalFinishBonus: 45,
    pressureRecoveryCriticalBonus: 4,
    targetFractureThreshold: 0.5,
    targetShatterThreshold: 1.08,
    targetCriticalShatterThreshold: 0.82,
    targetShatterDirectBonus: 0.12,
    targetShatterCriticalBonus: 0.12,
    targetShatterBaseFragments: 1,
    targetShatterPriorityFragments: 1,
    targetShatterArmoredFragments: 1,
    targetShatterMaxFragments: 5,
    targetFragmentMaxConcurrent: 18,
    targetFragmentLifetimeMs: 980,
    targetFragmentLifetimeJitterMs: 240,
    targetFragmentDrag: 0.965,
    targetFragmentGravityMult: 1.06,
    targetFragmentSpinMax: 0.11,
    scoreShatterBonus: 30
  },

  PHYSICS: {
    shellAtmosphericDrag: {
      enabled: true,
      base: 0.0032,
      lowAltitudeBoost: 0.003,
      apexBoost: 0.0055,
      heavyMultiplier: 0.72,
      dirtyMultiplier: 1.2,
      minDamping: 0.965
    },
    shellFlightProfiles: {
      default: { dragMult: 1, gravityMult: 1, lateralDriftMult: 1 },
      heavy: { dragMult: 0.96, gravityMult: 1.04, lateralDriftMult: 0.9 },
      agile: { dragMult: 1.06, gravityMult: 0.98, lateralDriftMult: 1.08 },
      floaty: { dragMult: 1.03, gravityMult: 0.96, lateralDriftMult: 1.12 }
    },
    shellFlightProfileByType: {
      willow: 'heavy',
      palm: 'heavy',
      brocade: 'heavy',
      doubleBreak: 'heavy',
      ring: 'agile',
      crossette: 'agile',
      crackle: 'agile',
      spiral: 'agile',
      ghost: 'floaty'
    }
  },

  BSSDS: {
    enabled: true,
    shellTaxonomy: {
      peony: 'precisionBloom',
      ring: 'precisionBloom',
      palm: 'precisionBloom',
      heart: 'precisionBloom',
      star: 'precisionBloom',
      smiley: 'precisionBloom',

      willow: 'sustainCascade',
      brocade: 'sustainCascade',
      ghost: 'sustainCascade',

      crossette: 'volatileTransform',
      crackle: 'volatileTransform',
      spiral: 'volatileTransform',
      doubleBreak: 'volatileTransform'
    },
    signatures: {
      precisionBloom: {
        timingProfile: 'fastPunch',
        choreographyPhases: ['openingRing', 'cleanMainBreak', 'minimalSecondary'],
        particleCap: 220,
        secondaryCaps: { crossette: 4, crackle: 2, ghost: 1, doubleBreak: 3 },
        degradeLadder: [
          { triggerUsage: 0.68, countMult: 0.84, secondaryDensity: 0.72 },
          { triggerUsage: 0.82, countMult: 0.68, secondaryDensity: 0.45 },
          { triggerUsage: 0.92, countMult: 0.54, secondaryDensity: 0.18 }
        ]
      },
      sustainCascade: {
        timingProfile: 'lingeringCurtain',
        choreographyPhases: ['softOpen', 'cascadeMain', 'lateLinger'],
        particleCap: 250,
        secondaryCaps: { crossette: 2, crackle: 2, ghost: 2, doubleBreak: 2 },
        degradeLadder: [
          { triggerUsage: 0.64, countMult: 0.86, secondaryDensity: 0.8 },
          { triggerUsage: 0.79, countMult: 0.7, secondaryDensity: 0.58 },
          { triggerUsage: 0.9, countMult: 0.56, secondaryDensity: 0.32 }
        ]
      },
      volatileTransform: {
        timingProfile: 'stagedTransform',
        choreographyPhases: ['splitSeed', 'transformBreak', 'asymmetricAftershock'],
        particleCap: 230,
        secondaryCaps: { crossette: 3, crackle: 3, ghost: 1, doubleBreak: 6 },
        degradeLadder: [
          { triggerUsage: 0.62, countMult: 0.82, secondaryDensity: 0.68 },
          { triggerUsage: 0.76, countMult: 0.66, secondaryDensity: 0.44 },
          { triggerUsage: 0.88, countMult: 0.52, secondaryDensity: 0.24 }
        ]
      }
    }

  },

  shellWeights: {
    peony: 1.2, willow: 1.0, ring: 0.9, crossette: 0.8,
    crackle: 0.9, palm: 0.8, spiral: 0.7, brocade: 0.78,
    ghost: 0.62, doubleBreak: 0.68,
    heart: 0.8, star: 0.7, smiley: 0.6
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
    RENDERER: { ...CONFIG.RENDERER, ...(overrides.RENDERER || {}) },
    BLOOM: { ...CONFIG.BLOOM, ...(overrides.BLOOM || {}) },
    OBJECTIVE: { ...CONFIG.OBJECTIVE, ...(overrides.OBJECTIVE || {}) },
    PHYSICS: {
      ...CONFIG.PHYSICS,
      ...(overrides.PHYSICS || {}),
      shellAtmosphericDrag: {
        ...CONFIG.PHYSICS.shellAtmosphericDrag,
        ...((overrides.PHYSICS && overrides.PHYSICS.shellAtmosphericDrag) || {})
      },
      shellFlightProfiles: {
        ...CONFIG.PHYSICS.shellFlightProfiles,
        ...((overrides.PHYSICS && overrides.PHYSICS.shellFlightProfiles) || {})
      },
      shellFlightProfileByType: {
        ...CONFIG.PHYSICS.shellFlightProfileByType,
        ...((overrides.PHYSICS && overrides.PHYSICS.shellFlightProfileByType) || {})
      }
    },
    BSSDS: {
      ...CONFIG.BSSDS,
      ...(overrides.BSSDS || {}),
      shellTaxonomy: {
        ...CONFIG.BSSDS.shellTaxonomy,
        ...((overrides.BSSDS && overrides.BSSDS.shellTaxonomy) || {})
      },
      signatures: {
        ...CONFIG.BSSDS.signatures,
        ...((overrides.BSSDS && overrides.BSSDS.signatures) || {})
      }
    },
    shellWeights: { ...CONFIG.shellWeights, ...(overrides.shellWeights || {}) }
  };
}

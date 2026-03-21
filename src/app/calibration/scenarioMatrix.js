export const CALIBRATION_SCENARIOS = [
  {
    id: 'desktop-high-quality',
    runtimeProfileId: 'desktop-default',
    description: 'Desktop baseline with full quality and reduced motion disabled.',
    width: 1280,
    height: 720,
    qualityScale: 1,
    reducedMotion: false,
    qualityEnabled: true,
    strategy: {
      directHitChance: 0.52,
      glancingHitChance: 0.12,
      supernovaChance: 0.24,
      dirtyShotChance: 0.08,
      missChance: 0.08,
      finishBoost: 0.2,
      targetBias: 'urgent-first'
    }
  },
  {
    id: 'high-end-mobile-premium',
    runtimeProfileId: 'high-end-mobile-premium',
    description: 'Capable phone/tablet profile with DPR 3 headroom, premium render tuning, and tighter touch-first tension.',
    width: 430,
    height: 932,
    qualityScale: 0.96,
    reducedMotion: false,
    qualityEnabled: true,
    strategy: {
      directHitChance: 0.49,
      glancingHitChance: 0.14,
      supernovaChance: 0.22,
      dirtyShotChance: 0.1,
      missChance: 0.1,
      finishBoost: 0.18,
      targetBias: 'priority-first'
    }
  },
  {
    id: 'reduced-motion',
    runtimeProfileId: 'mobile-balanced',
    description: 'Reduced-motion path with quality clamped to the runtime reduced-motion scale.',
    width: 1280,
    height: 720,
    qualityScale: 0.72,
    reducedMotion: true,
    qualityEnabled: true,
    strategy: {
      directHitChance: 0.47,
      glancingHitChance: 0.15,
      supernovaChance: 0.18,
      dirtyShotChance: 0.1,
      missChance: 0.1,
      finishBoost: 0.16,
      targetBias: 'critical-first'
    }
  },
  {
    id: 'low-end-emulation',
    runtimeProfileId: 'mobile-balanced',
    description: 'Fixed low-end emulation with constrained quality scale and slightly noisier execution.',
    width: 960,
    height: 540,
    qualityScale: 0.62,
    reducedMotion: false,
    qualityEnabled: true,
    strategy: {
      directHitChance: 0.42,
      glancingHitChance: 0.18,
      supernovaChance: 0.14,
      dirtyShotChance: 0.12,
      missChance: 0.14,
      finishBoost: 0.12,
      targetBias: 'priority-first'
    }
  }
];

export const DEFAULT_CALIBRATION_BANDS = {
  minimumMeanHitsPerRun: 3,
  minimumNonZeroScoreBuckets: 2,
  minimumMeanPressurePeak: 30,
  minimumFailRate: 0.05,
  maximumFailRate: 0.45
};

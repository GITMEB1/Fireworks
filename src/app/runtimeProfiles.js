const RUNTIME_PROFILE_DEFINITIONS = {
  'desktop-default': {
    id: 'desktop-default',
    label: 'Desktop Default',
    configOverrides: {},
    stateOverrides: {
      qualityScale: 1,
      displayDprCap: 2
    }
  },
  'mobile-balanced': {
    id: 'mobile-balanced',
    label: 'Mobile Balanced',
    configOverrides: {
      DISPLAY: { dprCap: 2.2 },
      QUALITY: {
        minScale: 0.68,
        maxScale: 0.92,
        stepDown: 0.1,
        stepUp: 0.05,
        cooldownMs: 1600
      },
      BLOOM: {
        minQuality: 0.7,
        maxScale: 0.3,
        baseAlpha: 0.13,
        impactAlphaBoost: 0.38
      },
      SKY: {
        starDensity: 0.96,
        twinkleDensity: 0.95,
        nebulaAlpha: 0.07,
        horizonGlowAlpha: 0.13,
        premiumBands: 2
      },
      CHARGE_VISUALS: {
        glowScale: 0.98,
        orbitCountBoost: 0,
        sparkChanceMult: 1,
        crosshairScale: 1.02,
        premiumTrailAlpha: 1.02
      },
      TARGET_VISUALS: {
        haloAlpha: 0.16,
        haloScale: 1.14,
        accentAlpha: 0.18,
        lifeArcWidthBoost: 1.06,
        criticalRingBoost: 1.04,
        glyphAlpha: 0.64
      }
    },
    stateOverrides: {
      qualityScale: 0.84,
      displayDprCap: 2.2
    }
  },
  'high-end-mobile-premium': {
    id: 'high-end-mobile-premium',
    label: 'High-End Mobile Premium',
    configOverrides: {
      DISPLAY: { dprCap: 3 },
      LIMITS: {
        maxGlows: 40,
        maxSmoke: 96,
        maxEmbers: 240,
        maxShockwaves: 18,
        maxTargetFragments: 60
      },
      QUALITY: {
        minScale: 0.78,
        maxScale: 1,
        stepDown: 0.08,
        stepUp: 0.05,
        cooldownMs: 1400
      },
      BLOOM: {
        minQuality: 0.72,
        minScale: 0.16,
        maxScale: 0.38,
        baseAlpha: 0.16,
        impactAlphaBoost: 0.5,
        overloadFade: 0.16,
        intensitySmoothing: 0.24
      },
      SKY: {
        starDensity: 1.35,
        twinkleDensity: 1.28,
        nebulaAlpha: 0.12,
        horizonGlowAlpha: 0.2,
        premiumBands: 3,
        gradientSaturation: 1.08
      },
      CHARGE_VISUALS: {
        glowScale: 1.18,
        ringScale: 1.12,
        orbitCountBoost: 2,
        sparkChanceMult: 1.4,
        crosshairScale: 1.16,
        premiumTrailAlpha: 1.15
      },
      TARGET_VISUALS: {
        haloAlpha: 0.26,
        haloScale: 1.24,
        accentAlpha: 0.3,
        lifeArcWidthBoost: 1.18,
        criticalRingBoost: 1.14,
        glyphAlpha: 0.82
      },
      IMPACT_VISUALS: {
        shockwaveRadiusMult: 1.18,
        shockwaveLineWidthMult: 1.14,
        shockwaveAlphaMult: 1.16,
        glowRadiusMult: 1.22,
        glowAlphaMult: 1.1,
        emberCountMult: 1.18
      },
      OBJECTIVE: {
        maxConcurrentTargets: 6,
        spawnCooldownMs: 1200,
        spawnJitterMs: 320,
        targetLifetimeMs: 6600,
        pressureRecoveryOnClear: 5,
        pressureRecoveryOnPerfect: 7
      }
    },
    stateOverrides: {
      qualityScale: 0.96,
      displayDprCap: 3
    }
  }
};

export function getRuntimeProfileById(profileId = 'desktop-default') {
  return RUNTIME_PROFILE_DEFINITIONS[profileId] || RUNTIME_PROFILE_DEFINITIONS['desktop-default'];
}

export function resolveRuntimeProfile({ requestedProfileId = null, runtimeInfo = {} } = {}) {
  const resolvedId = requestedProfileId || detectRuntimeProfileId(runtimeInfo);
  const definition = getRuntimeProfileById(resolvedId);
  return {
    ...definition,
    requestedProfileId,
    resolvedId: definition.id,
    runtimeInfo: summarizeRuntimeInfo(runtimeInfo)
  };
}

export function detectRuntimeProfileId(runtimeInfo = {}) {
  const isMobileLike = !!runtimeInfo.isMobileLike;
  if (!isMobileLike) return 'desktop-default';

  const dpr = runtimeInfo.devicePixelRatio || 1;
  const cores = runtimeInfo.hardwareConcurrency || 0;
  const memory = runtimeInfo.deviceMemory || 0;
  const wideEnough = Math.max(runtimeInfo.width || 0, runtimeInfo.height || 0) >= 844;

  if (dpr >= 2.5 && wideEnough && (cores >= 6 || memory >= 6)) {
    return 'high-end-mobile-premium';
  }

  return 'mobile-balanced';
}

export function readBrowserRuntimeInfo() {
  if (typeof window === 'undefined') return {};

  const search = new URLSearchParams(window.location.search);
  const width = window.innerWidth || window.screen?.width || 0;
  const height = window.innerHeight || window.screen?.height || 0;
  const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches || false;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const ua = navigator.userAgent || '';
  const uaMobile = /android|iphone|ipad|mobile/i.test(ua);

  return {
    width,
    height,
    devicePixelRatio: window.devicePixelRatio || 1,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    coarsePointer,
    maxTouchPoints,
    reducedMotion,
    userAgent: ua,
    isMobileLike: coarsePointer || maxTouchPoints > 0 || uaMobile,
    requestedProfileId: search.get('profile')
  };
}

function summarizeRuntimeInfo(runtimeInfo = {}) {
  return {
    width: runtimeInfo.width || 0,
    height: runtimeInfo.height || 0,
    devicePixelRatio: runtimeInfo.devicePixelRatio || 1,
    hardwareConcurrency: runtimeInfo.hardwareConcurrency || 0,
    deviceMemory: runtimeInfo.deviceMemory || 0,
    isMobileLike: !!runtimeInfo.isMobileLike,
    coarsePointer: !!runtimeInfo.coarsePointer,
    maxTouchPoints: runtimeInfo.maxTouchPoints || 0,
    reducedMotion: !!runtimeInfo.reducedMotion
  };
}

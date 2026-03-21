export function createSeededRandom(seedInput) {
  const seed = normalizeSeed(seedInput);
  let state = seed || 0x6d2b79f5;

  return function seededRandom() {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function withDeterministicRandom(seedInput, fn) {
  const originalRandom = Math.random;
  Math.random = createSeededRandom(seedInput);
  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
}

function normalizeSeed(seedInput) {
  if (typeof seedInput === 'number' && Number.isFinite(seedInput)) {
    return seedInput >>> 0;
  }

  const text = String(seedInput || 'fireworks-seed');
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

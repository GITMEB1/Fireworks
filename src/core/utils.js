export const DEATH_NONE = 0;
export const DEATH_CROSSETTE = 1;
export const DEATH_CRACKLE = 2;
export const DEATH_GHOST = 3;
export const DEATH_DOUBLE_BREAK = 4;

export function rand(min, max) { return Math.random() * (max - min) + min; }
export function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
export function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
export function rgba(rgb, a) { return `rgba(${rgb}, ${a})`; }
export function smoothstep01(t) { return t * t * (3 - 2 * t); }

export function weightedShellType(config, charge = 0) {
  const weights = { ...config.shellWeights };
  if (charge > 0.2) { weights.willow += charge * 1.5; weights.palm += charge; }
  if (charge > 0.5) { weights.brocade += charge * 2.5; weights.spiral += charge * 1.5; }
  if (charge > 0.8) { weights.doubleBreak += charge * 4; weights.ghost += charge * 3; }

  const entries = Object.entries(weights);
  let total = 0;
  for (const [, w] of entries) total += w;
  let roll = Math.random() * total;
  for (const [type, w] of entries) {
    roll -= w;
    if (roll <= 0) return type;
  }
  return 'peony';
}

import { pick, rand } from '../core/utils.js';

export function createLaunchPatternRunner(engine) {
  return function launchPattern(pattern, type = null, palette = null, charge = 0) {
    const w = engine.state.width;
    const h = engine.state.height;
    switch (pattern) {
      case 'mirror': {
        const tx = rand(w * 0.22, w * 0.46);
        const ty = rand(h * 0.18, h * 0.48);
        engine.spawnShellTo(tx, ty, type, palette, w * 0.2, charge);
        engine.spawnShellTo(w - tx, ty + rand(-30, 24), type, palette, w * 0.8, charge);
        break;
      }
      case 'fan': {
        const shots = 3;
        for (let i = 0; i < shots; i++) {
          const tx = w * (0.25 + (i / (shots - 1)) * 0.5) + rand(-30, 30);
          const ty = rand(h * 0.14, h * 0.38);
          engine.queueLaunch(i * 85, tx, ty, type, palette, w * (0.22 + i * 0.28), charge);
        }
        break;
      }
      case 'finale': {
        const bursts = 6 + Math.floor(rand(0, 4));
        for (let i = 0; i < bursts; i++) {
          const tx = rand(w * 0.14, w * 0.86);
          const ty = rand(h * 0.12, h * 0.5);
          const bCharge = Math.max(charge, rand(0.45, 1));
          engine.queueLaunch(i * rand(40, 95), tx, ty, pick(['brocade', 'willow', 'doubleBreak', 'ghost', 'peony']), palette, tx + rand(-80, 80), bCharge, bCharge >= engine.config.CHARGE.prestigeThreshold);
        }
        break;
      }
      case 'single':
      default: {
        const tx = rand(w * 0.18, w * 0.82);
        const ty = rand(h * 0.14, h * 0.46);
        engine.spawnShellTo(tx, ty, type, palette, tx + rand(-35, 35), charge, charge >= engine.config.CHARGE.prestigeThreshold);
      }
    }
  };
}

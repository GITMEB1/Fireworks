export function createAudioSystem() {
  let ctx = null;
  let masterGain = null;
  let chargeOsc = null;
  let chargeGain = null;

  function init() {
    if (ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(ctx.destination);
  }

  function resume() {
    if (!ctx) init();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  return {
    playBassDrop() {
      resume();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.2);

      g.gain.setValueAtTime(0.6, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(g);
      g.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    },

    playCrackle() {
      resume();
      if (!ctx) return;

      // Simple white noise crackle
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800 + Math.random() * 1200;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      noise.connect(filter);
      filter.connect(g);
      g.connect(masterGain);

      noise.start();
    },

    updateCharge(intensity) {
      resume();
      if (!ctx) return;

      if (intensity <= 0) {
        if (chargeOsc) {
          chargeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          chargeOsc.stop(ctx.currentTime + 0.2);
          chargeOsc = null;
          chargeGain = null;
        }
        return;
      }

      if (!chargeOsc) {
        chargeOsc = ctx.createOscillator();
        chargeGain = ctx.createGain();
        chargeOsc.type = 'sawtooth';
        chargeGain.gain.value = 0;
        chargeOsc.connect(chargeGain);
        chargeGain.connect(masterGain);
        chargeOsc.start();
      }

      const freq = 60 + (intensity * 400);
      chargeOsc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.05);
      chargeGain.gain.setTargetAtTime(0.05 * intensity, ctx.currentTime, 0.05);
    }
  };
}

import { pick, rand } from '../core/utils.js';

export function createInputSystem({ canvas, hintEl, statusEl, palettes, state, config, engine }) {
  function beginInteraction(pointerId, x, y) {
    if (!state.userInteracted) {
      state.userInteracted = true;
      hintEl.style.opacity = '0';
      statusEl.style.opacity = '1';
    }
    state.activePointers.set(pointerId, { 
      startX: x, startY: y,
      x, y, 
      launchX: x + rand(-30, 30),
      targetX: x, targetY: y,
      startTime: performance.now(), 
      palette: pick(palettes) 
    });
  }

  function moveInteraction(pointerId, x, y) {
    const p = state.activePointers.get(pointerId);
    if (!p) return;
    
    // Slingshot logic: drag backwards to aim forwards
    const dragX = p.startX - x;
    const dragY = p.startY - y;
    p.targetX = p.startX + dragX * 1.5;
    p.targetY = Math.max(state.height * 0.1, p.startY + dragY * 1.5);

    // Sparkler effect during drag (using current pointer x,y)
    const dx = x - p.x;
    const dy = y - p.y;
    const dist = Math.hypot(dx, dy);
    
    if (dist > 2) {
      const steps = Math.min(15, Math.floor(dist / 4));
      const vx = dx * 0.05;
      const vy = dy * 0.05;
      for (let i = 1; i <= steps; i++) {
        if (Math.random() < 0.6) continue;
        const color = pick(p.palette);
        const t = i / steps;
        engine.spawnContinuousSpark(p.x + dx * t, p.y + dy * t, color, vx, vy);
      }
    }

    p.x = x; p.y = y;
  }

  function endInteraction(pointerId) {
    const p = state.activePointers.get(pointerId);
    if (!p) return;
    state.activePointers.delete(pointerId);

    const duration = performance.now() - p.startTime;
    let charge = 0;
    let chargeState = 'normal';
    
    if (duration >= config.CHARGE.minDuration) {
      charge = (duration - config.CHARGE.minDuration) / (config.CHARGE.maxDuration - config.CHARGE.minDuration);
      if (charge >= 1.0) {
        chargeState = 'overcharge';
        charge = 1;
      } else if (charge >= 0.95 && charge < 1.0) {
        chargeState = 'perfect';
      } else {
        chargeState = 'normal';
      }
    }

    if (chargeState === 'overcharge') {
      engine.registerShot('fizzle');
      engine.spawnShellTo(p.targetX, p.targetY, 'fizzle', p.palette, p.launchX, 0, false);
    } else if (chargeState === 'perfect') {
      engine.registerShot('supernova');
      engine.spawnShellTo(p.targetX, p.targetY, null, p.palette, p.launchX, 1.0, true);
    } else {
      engine.registerShot('normal');
      engine.spawnShellTo(p.targetX, p.targetY, null, p.palette, p.launchX, charge, charge >= config.CHARGE.prestigeThreshold);
    }
  }

  function handlePointerDown(e) {
    if (e.button !== 0) return;
    if (e.pointerType === 'mouse' && performance.now() < state.suppressMouseUntil) return;
    if (e.cancelable) e.preventDefault();
    beginInteraction(e.pointerId, e.clientX, e.clientY);
    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch {}
    }
  }

  function handlePointerMove(e) { moveInteraction(e.pointerId, e.clientX, e.clientY); }

  function handlePointerUp(e) {
    if (canvas.releasePointerCapture) {
      try {
        if (canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      } catch {}
    }
    endInteraction(e.pointerId);
  }

  function handlePointerCancel(e) {
    if (canvas.releasePointerCapture) {
      try {
        if (canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      } catch {}
    }
    state.activePointers.delete(e.pointerId);
  }

  function handleTouchStart(e) {
    if (window.PointerEvent) return;
    if (e.cancelable) e.preventDefault();
    state.suppressMouseUntil = performance.now() + 800;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      beginInteraction(`touch-${t.identifier}`, t.clientX, t.clientY);
    }
  }

  function handleTouchMove(e) {
    if (window.PointerEvent) return;
    if (e.cancelable) e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      moveInteraction(`touch-${t.identifier}`, t.clientX, t.clientY);
    }
  }

  function handleTouchEnd(e) {
    if (window.PointerEvent) return;
    if (e.cancelable) e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      endInteraction(`touch-${t.identifier}`);
    }
  }

  function handleMouseDown(e) {
    if (window.PointerEvent) return;
    if (e.button !== 0) return;
    if (performance.now() < state.suppressMouseUntil) return;
    if (e.cancelable) e.preventDefault();
    beginInteraction('mouse', e.clientX, e.clientY);
  }

  function handleMouseMove(e) {
    if (window.PointerEvent) return;
    moveInteraction('mouse', e.clientX, e.clientY);
  }

  function handleMouseUp() {
    if (window.PointerEvent) return;
    endInteraction('mouse');
  }

  canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
  canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
  canvas.addEventListener('pointerup', handlePointerUp, { passive: false });
  canvas.addEventListener('pointercancel', handlePointerCancel, { passive: false });
  window.addEventListener('pointerup', handlePointerUp, { passive: false });
  window.addEventListener('pointercancel', handlePointerCancel, { passive: false });

  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

  canvas.addEventListener('mousedown', handleMouseDown, { passive: false });
  window.addEventListener('mousemove', handleMouseMove, { passive: false });
  window.addEventListener('mouseup', handleMouseUp, { passive: false });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  return {
    dispose() {
      // intentionally omitted: demo app lifetime == page lifetime
    }
  };
}

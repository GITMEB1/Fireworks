function computeShakeOffsets(state, dt) {
  let shakeX = 0;
  let shakeY = 0;
  if (state.screenShakeTimer > 0) {
    state.screenShakeTimer -= dt;
    if (state.screenShakeTimer > 0) {
      const intensity = state.screenShakeTimer / 400;
      shakeX = (Math.random() - 0.5) * 40 * intensity;
      shakeY = (Math.random() - 0.5) * 40 * intensity;
    } else {
      state.screenShakeTimer = 0;
    }
  }
  return { shakeX, shakeY };
}

function computeFlashState(state, dt) {
  let flashIntensity = 0;
  if (state.flashTimer > 0) {
    state.flashTimer -= dt;
    if (state.flashTimer > 0) flashIntensity = state.flashTimer / 100;
    else state.flashTimer = 0;
  }

  return {
    flashColor: state.flashColor,
    flashIntensity
  };
}

export function createFrameCompositionController({ state }) {
  function compose(dt) {
    const shake = computeShakeOffsets(state, dt);
    const flash = computeFlashState(state, dt);
    return {
      dt,
      ...shake,
      ...flash
    };
  }

  return { compose };
}

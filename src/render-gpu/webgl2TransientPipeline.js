const RING_SEGMENTS = 28;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`WebGL shader compile failed: ${log}`);
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`WebGL program link failed: ${log}`);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

function colorToRgba(color, alpha = 1) {
  const parts = String(color || '255,255,255').split(',').map((v) => Number(v.trim()));
  return [
    Math.max(0, Math.min(255, parts[0] || 255)) / 255,
    Math.max(0, Math.min(255, parts[1] || 255)) / 255,
    Math.max(0, Math.min(255, parts[2] || 255)) / 255,
    Math.max(0, Math.min(1, alpha))
  ];
}

function createDynamicBatch(initialFloats = 8192) {
  let buffer = new Float32Array(initialFloats);
  let cursor = 0;

  function reset() {
    cursor = 0;
  }

  function ensure(additionalFloats) {
    const needed = cursor + additionalFloats;
    if (needed <= buffer.length) return;
    let next = buffer.length;
    while (next < needed) next *= 2;
    const grown = new Float32Array(next);
    grown.set(buffer);
    buffer = grown;
  }

  function appendVertex(x, y, rgba) {
    ensure(6);
    buffer[cursor++] = x;
    buffer[cursor++] = y;
    buffer[cursor++] = rgba[0];
    buffer[cursor++] = rgba[1];
    buffer[cursor++] = rgba[2];
    buffer[cursor++] = rgba[3];
  }

  function view() {
    return buffer.subarray(0, cursor);
  }

  return { reset, appendVertex, view, get vertexCount() { return cursor / 6; } };
}

export function createWebGL2TransientPipeline({ gl, state }) {
  let lastStats = {
    particleVertices: 0,
    shockwaveVertices: 0,
    fragmentVertices: 0
  };
  const sceneProgram = createProgram(
    gl,
    `#version 300 es
    in vec2 aPosition;
    in vec4 aColor;
    uniform vec2 uResolution;
    out vec4 vColor;
    void main() {
      vec2 zeroToOne = aPosition / uResolution;
      vec2 clip = zeroToOne * 2.0 - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      vColor = aColor;
    }`,
    `#version 300 es
    precision mediump float;
    in vec4 vColor;
    out vec4 outColor;
    void main() {
      outColor = vColor;
    }`
  );

  const flashProgram = createProgram(
    gl,
    `#version 300 es
    in vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }`,
    `#version 300 es
    precision mediump float;
    uniform vec4 uFlashColor;
    out vec4 outColor;
    void main() {
      outColor = uFlashColor;
    }`
  );

  const sceneBuffer = gl.createBuffer();
  const flashBuffer = gl.createBuffer();
  const scenePosLoc = gl.getAttribLocation(sceneProgram, 'aPosition');
  const sceneColorLoc = gl.getAttribLocation(sceneProgram, 'aColor');
  const sceneResLoc = gl.getUniformLocation(sceneProgram, 'uResolution');
  const flashPosLoc = gl.getAttribLocation(flashProgram, 'aPosition');
  const flashColorLoc = gl.getUniformLocation(flashProgram, 'uFlashColor');

  const particleBatch = createDynamicBatch(16384);
  const shockwaveBatch = createDynamicBatch(16384);
  const fragmentBatch = createDynamicBatch(16384);

  const fullscreen = new Float32Array([
    -1, -1, 0, 1,
    1, -1, 1, 1,
    -1, 1, 0, 0,
    -1, 1, 0, 0,
    1, -1, 1, 1,
    1, 1, 1, 0
  ]);

  function appendParticleSegments(engine, shakeX, shakeY) {
    const quality = state.reducedMotion ? Math.min(state.qualityScale, 0.78) : state.qualityScale;
    const sampleStride = quality < 0.65 ? 3 : (quality < 0.82 ? 2 : 1);
    for (let i = 0; i < engine.activeCounts.particles; i += sampleStride) {
      const p = engine.pools.particles[i];
      if (!p || p.isFlash || p.trailCount < 2) continue;
      const alpha = p.alpha * (p.isStrobe ? 0.85 : 1);
      const rgba = colorToRgba(p.sparkleChance > 0.2 ? '255,255,255' : p.color, alpha);
      let idx = p.trailIndex;
      let prevX = p.trail[idx] + shakeX;
      let prevY = p.trail[idx + 1] + shakeY;
      for (let k = 1; k < p.trailCount; k++) {
        idx = (idx + 2) & 62;
        const nextX = p.trail[idx] + shakeX;
        const nextY = p.trail[idx + 1] + shakeY;
        particleBatch.appendVertex(prevX, prevY, rgba);
        particleBatch.appendVertex(nextX, nextY, rgba);
        prevX = nextX;
        prevY = nextY;
      }
    }
  }

  function appendShockwaves(engine, shakeX, shakeY) {
    const segments = state.reducedMotion ? Math.floor(RING_SEGMENTS * 0.6) : RING_SEGMENTS;
    for (let i = 0; i < engine.activeCounts.shockwaves; i++) {
      const s = engine.pools.shockwaves[i];
      if (!s) continue;
      const outer = s.radius + s.lineWidth * 0.7;
      const inner = Math.max(0.5, s.radius - s.lineWidth * 0.7);
      const rgba = colorToRgba(s.color, s.alpha);
      for (let seg = 0; seg < segments; seg++) {
        const t0 = (seg / segments) * Math.PI * 2;
        const t1 = ((seg + 1) / segments) * Math.PI * 2;

        const ox0 = s.x + Math.cos(t0) * outer + shakeX;
        const oy0 = s.y + Math.sin(t0) * outer + shakeY;
        const ix0 = s.x + Math.cos(t0) * inner + shakeX;
        const iy0 = s.y + Math.sin(t0) * inner + shakeY;
        const ox1 = s.x + Math.cos(t1) * outer + shakeX;
        const oy1 = s.y + Math.sin(t1) * outer + shakeY;
        const ix1 = s.x + Math.cos(t1) * inner + shakeX;
        const iy1 = s.y + Math.sin(t1) * inner + shakeY;

        shockwaveBatch.appendVertex(ox0, oy0, rgba);
        shockwaveBatch.appendVertex(ix0, iy0, rgba);
        shockwaveBatch.appendVertex(ox1, oy1, rgba);

        shockwaveBatch.appendVertex(ix0, iy0, rgba);
        shockwaveBatch.appendVertex(ix1, iy1, rgba);
        shockwaveBatch.appendVertex(ox1, oy1, rgba);
      }
    }
  }

  function appendTargetFragments(engine, shakeX, shakeY) {
    for (let i = 0; i < engine.activeCounts.targetFragments; i++) {
      const f = engine.pools.targetFragments[i];
      if (!f) continue;
      const r = f.radius;
      const c = Math.cos(f.rotation);
      const s = Math.sin(f.rotation);
      const rgba = colorToRgba(f.color, f.alpha);
      const points = [
        [-r * 0.9, -r * 0.5],
        [r, -r * 0.2],
        [r * 0.7, r * 0.82],
        [-r * 0.6, r * 0.7]
      ];
      const world = points.map(([px, py]) => [
        f.x + px * c - py * s + shakeX,
        f.y + px * s + py * c + shakeY
      ]);

      fragmentBatch.appendVertex(world[0][0], world[0][1], rgba);
      fragmentBatch.appendVertex(world[1][0], world[1][1], rgba);
      fragmentBatch.appendVertex(world[2][0], world[2][1], rgba);

      fragmentBatch.appendVertex(world[0][0], world[0][1], rgba);
      fragmentBatch.appendVertex(world[2][0], world[2][1], rgba);
      fragmentBatch.appendVertex(world[3][0], world[3][1], rgba);
    }
  }

  function drawBatch(batch, mode, additive) {
    const data = batch.view();
    if (!data.length) return;
    gl.useProgram(sceneProgram);
    gl.uniform2f(sceneResLoc, state.width, state.height);
    gl.bindBuffer(gl.ARRAY_BUFFER, sceneBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    gl.enableVertexAttribArray(scenePosLoc);
    gl.vertexAttribPointer(scenePosLoc, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(sceneColorLoc);
    gl.vertexAttribPointer(sceneColorLoc, 4, gl.FLOAT, false, 24, 8);

    if (additive) gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.drawArrays(mode, 0, batch.vertexCount);
  }

  function render(engine, frame) {
    particleBatch.reset();
    shockwaveBatch.reset();
    fragmentBatch.reset();

    appendParticleSegments(engine, frame.shakeX || 0, frame.shakeY || 0);
    appendShockwaves(engine, frame.shakeX || 0, frame.shakeY || 0);
    appendTargetFragments(engine, frame.shakeX || 0, frame.shakeY || 0);

    lastStats = {
      particleVertices: particleBatch.vertexCount,
      shockwaveVertices: shockwaveBatch.vertexCount,
      fragmentVertices: fragmentBatch.vertexCount
    };

    drawBatch(particleBatch, gl.LINES, true);
    drawBatch(shockwaveBatch, gl.TRIANGLES, true);
    drawBatch(fragmentBatch, gl.TRIANGLES, false);
  }

  function getLastStats() {
    return { ...lastStats };
  }

  function drawFlashOverlay(flashColor, flashIntensity) {
    if (flashIntensity <= 0) return;
    const [r, g, b] = colorToRgba(flashColor, flashIntensity * 0.8);
    gl.useProgram(flashProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, flashBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, fullscreen, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(flashPosLoc);
    gl.vertexAttribPointer(flashPosLoc, 2, gl.FLOAT, false, 16, 0);
    gl.uniform4f(flashColorLoc, r, g, b, flashIntensity * 0.8);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  return { render, drawFlashOverlay, getLastStats };
}

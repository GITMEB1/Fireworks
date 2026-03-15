import { createRendererAdapter } from '../contracts/rendererAdapter.js';
import { createBackgroundRenderer } from '../../render/backgroundRenderer.js';
import { renderChargeVisuals } from '../../render/overlayRenderer.js';

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

export function createWebGL2PrototypeRendererAdapter({ canvas, config, state, activePointers, fallbackFactory }) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, desynchronized: true, powerPreference: 'high-performance' });
  if (!gl) return fallbackFactory('webgl2-not-supported');

  const overlayCanvas = document.createElement('canvas');
  const overlayCtx = overlayCanvas.getContext('2d', { willReadFrequently: false });
  if (!overlayCtx) return fallbackFactory('overlay-canvas2d-unavailable');

  const backgroundRenderer = createBackgroundRenderer({ canvas: overlayCanvas, ctx: overlayCtx, config, state });

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

  const textureProgram = createProgram(
    gl,
    `#version 300 es
    in vec2 aPosition;
    in vec2 aTexCoord;
    out vec2 vTexCoord;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      vTexCoord = aTexCoord;
    }`,
    `#version 300 es
    precision mediump float;
    in vec2 vTexCoord;
    uniform sampler2D uTexture;
    out vec4 outColor;
    void main() {
      outColor = texture(uTexture, vTexCoord);
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
  const textureBuffer = gl.createBuffer();
  const overlayTexture = gl.createTexture();

  const scenePosLoc = gl.getAttribLocation(sceneProgram, 'aPosition');
  const sceneColorLoc = gl.getAttribLocation(sceneProgram, 'aColor');
  const sceneResLoc = gl.getUniformLocation(sceneProgram, 'uResolution');

  const texPosLoc = gl.getAttribLocation(textureProgram, 'aPosition');
  const texUvLoc = gl.getAttribLocation(textureProgram, 'aTexCoord');

  const flashPosLoc = gl.getAttribLocation(flashProgram, 'aPosition');
  const flashColorLoc = gl.getUniformLocation(flashProgram, 'uFlashColor');

  const fullscreen = new Float32Array([
    -1, -1, 0, 1,
    1, -1, 1, 1,
    -1, 1, 0, 0,
    -1, 1, 0, 0,
    1, -1, 1, 1,
    1, 1, 1, 0
  ]);

  gl.bindTexture(gl.TEXTURE_2D, overlayTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  function syncOverlayCanvasSize() {
    const width = Math.max(1, Math.floor(state.width || 1));
    const height = Math.max(1, Math.floor(state.height || 1));
    if (overlayCanvas.width !== width || overlayCanvas.height !== height) {
      overlayCanvas.width = width;
      overlayCanvas.height = height;
      backgroundRenderer.initStars();
      backgroundRenderer.rebuildBackgroundCache();
    }
  }

  function appendVertex(target, x, y, rgba) {
    target.push(x, y, rgba[0], rgba[1], rgba[2], rgba[3]);
  }

  function drawOverlayTexture() {
    gl.useProgram(textureProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, fullscreen, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texPosLoc);
    gl.vertexAttribPointer(texPosLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(texUvLoc);
    gl.vertexAttribPointer(texUvLoc, 2, gl.FLOAT, false, 16, 8);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, overlayTexture);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function drawGeometry(vertices, mode, additive = false) {
    if (vertices.length === 0) return;
    gl.useProgram(sceneProgram);
    gl.uniform2f(sceneResLoc, state.width, state.height);
    gl.bindBuffer(gl.ARRAY_BUFFER, sceneBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.enableVertexAttribArray(scenePosLoc);
    gl.vertexAttribPointer(scenePosLoc, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(sceneColorLoc);
    gl.vertexAttribPointer(sceneColorLoc, 4, gl.FLOAT, false, 24, 8);

    if (additive) gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.drawArrays(mode, 0, vertices.length / 6);
  }

  function appendParticleSegments(engine, vertices, shakeX, shakeY) {
    const quality = state.qualityScale;
    const sampleStride = quality < 0.72 ? 2 : 1;
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
        appendVertex(vertices, prevX, prevY, rgba);
        appendVertex(vertices, nextX, nextY, rgba);
        prevX = nextX;
        prevY = nextY;
      }
    }
  }

  function appendShockwaves(engine, vertices, shakeX, shakeY) {
    for (let i = 0; i < engine.activeCounts.shockwaves; i++) {
      const s = engine.pools.shockwaves[i];
      if (!s) continue;
      const outer = s.radius + s.lineWidth * 0.7;
      const inner = Math.max(0.5, s.radius - s.lineWidth * 0.7);
      const rgba = colorToRgba(s.color, s.alpha);
      for (let seg = 0; seg < RING_SEGMENTS; seg++) {
        const t0 = (seg / RING_SEGMENTS) * Math.PI * 2;
        const t1 = ((seg + 1) / RING_SEGMENTS) * Math.PI * 2;

        const ox0 = s.x + Math.cos(t0) * outer + shakeX;
        const oy0 = s.y + Math.sin(t0) * outer + shakeY;
        const ix0 = s.x + Math.cos(t0) * inner + shakeX;
        const iy0 = s.y + Math.sin(t0) * inner + shakeY;
        const ox1 = s.x + Math.cos(t1) * outer + shakeX;
        const oy1 = s.y + Math.sin(t1) * outer + shakeY;
        const ix1 = s.x + Math.cos(t1) * inner + shakeX;
        const iy1 = s.y + Math.sin(t1) * inner + shakeY;

        appendVertex(vertices, ox0, oy0, rgba);
        appendVertex(vertices, ix0, iy0, rgba);
        appendVertex(vertices, ox1, oy1, rgba);

        appendVertex(vertices, ix0, iy0, rgba);
        appendVertex(vertices, ix1, iy1, rgba);
        appendVertex(vertices, ox1, oy1, rgba);
      }
    }
  }

  function appendTargetFragments(engine, vertices, shakeX, shakeY) {
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

      appendVertex(vertices, world[0][0], world[0][1], rgba);
      appendVertex(vertices, world[1][0], world[1][1], rgba);
      appendVertex(vertices, world[2][0], world[2][1], rgba);

      appendVertex(vertices, world[0][0], world[0][1], rgba);
      appendVertex(vertices, world[2][0], world[2][1], rgba);
      appendVertex(vertices, world[3][0], world[3][1], rgba);
    }
  }

  function drawFlashOverlay(flashColor, flashIntensity) {
    if (flashIntensity <= 0) return;
    const [r, g, b] = colorToRgba(flashColor, flashIntensity * 0.8);
    gl.useProgram(flashProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, fullscreen, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(flashPosLoc);
    gl.vertexAttribPointer(flashPosLoc, 2, gl.FLOAT, false, 16, 0);
    gl.uniform4f(flashColorLoc, r, g, b, flashIntensity * 0.8);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function render(now, engine, frame = {}) {
    if (!state.width || !state.height) return;
    syncOverlayCanvasSize();

    const shakeX = frame.shakeX || 0;
    const shakeY = frame.shakeY || 0;

    overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
    overlayCtx.clearRect(0, 0, state.width, state.height);
    overlayCtx.save();
    overlayCtx.translate(shakeX, shakeY);

    backgroundRenderer.renderBackground(now, engine);

    overlayCtx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < engine.activeCounts.fireworks; i++) engine.pools.fireworks[i].draw(overlayCtx);
    overlayCtx.globalCompositeOperation = 'source-over';

    for (let i = 0; i < engine.activeCounts.targets; i++) engine.pools.targets[i].draw(overlayCtx);
    for (let i = 0; i < engine.activeCounts.embers; i++) engine.pools.embers[i].draw(overlayCtx);

    renderChargeVisuals({ ctx: overlayCtx, now, activePointers, config, engine });
    overlayCtx.restore();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);

    gl.bindTexture(gl.TEXTURE_2D, overlayTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, overlayCanvas);
    drawOverlayTexture();

    const particleVertices = [];
    const shockwaveVertices = [];
    const fragmentVertices = [];

    appendParticleSegments(engine, particleVertices, shakeX, shakeY);
    appendShockwaves(engine, shockwaveVertices, shakeX, shakeY);
    appendTargetFragments(engine, fragmentVertices, shakeX, shakeY);

    drawGeometry(particleVertices, gl.LINES, true);
    drawGeometry(shockwaveVertices, gl.TRIANGLES, true);
    drawGeometry(fragmentVertices, gl.TRIANGLES, false);

    drawFlashOverlay(frame.flashColor, frame.flashIntensity || 0);
  }

  function resize() {
    syncOverlayCanvasSize();
    backgroundRenderer.initStars();
    backgroundRenderer.rebuildBackgroundCache();
  }

  return createRendererAdapter({ id: 'webgl2-prototype', kind: 'webgl2', render, resize });
}

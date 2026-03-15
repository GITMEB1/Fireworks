import { createRendererAdapter } from '../contracts/rendererAdapter.js';
import { createBackgroundRenderer } from '../../render/backgroundRenderer.js';
import { renderChargeVisuals } from '../../render/overlayRenderer.js';
import { createWebGL2TransientPipeline } from '../../render-gpu/webgl2TransientPipeline.js';
import { createFrameCompositionController } from './frameCompositionController.js';

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

export function createWebGL2PrototypeRendererAdapter({ canvas, config, state, activePointers, fallbackFactory }) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, desynchronized: true, powerPreference: 'high-performance' });
  if (!gl) return fallbackFactory('webgl2-not-supported');

  const overlayCanvas = document.createElement('canvas');
  const overlayCtx = overlayCanvas.getContext('2d', { willReadFrequently: false });
  if (!overlayCtx) return fallbackFactory('overlay-canvas2d-unavailable');

  const frameController = createFrameCompositionController({ state });
  const backgroundRenderer = createBackgroundRenderer({ canvas: overlayCanvas, ctx: overlayCtx, config, state });
  const transientPipeline = createWebGL2TransientPipeline({ gl, state, config });
  let lastRenderStats = {
    mode: 'webgl2-prototype',
    gpuInitialized: true,
    overlayWidth: 0,
    overlayHeight: 0,
    particleVertices: 0,
    shockwaveVertices: 0,
    fragmentVertices: 0
  };
  let disposed = false;

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

  const textureBuffer = gl.createBuffer();
  const overlayTexture = gl.createTexture();
  const texPosLoc = gl.getAttribLocation(textureProgram, 'aPosition');
  const texUvLoc = gl.getAttribLocation(textureProgram, 'aTexCoord');

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

  function composeFrame({ dt }) {
    return frameController.compose(dt);
  }

  function drawOverlayTexture() {
    if (disposed) return;
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

  function drawOverlayCanvas(now, engine, frame) {
    if (disposed) return;
    overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
    overlayCtx.clearRect(0, 0, state.width, state.height);
    overlayCtx.save();
    overlayCtx.translate(frame.shakeX, frame.shakeY);

    backgroundRenderer.renderBackground(now, engine);

    overlayCtx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < engine.activeCounts.fireworks; i++) engine.pools.fireworks[i].draw(overlayCtx);
    overlayCtx.globalCompositeOperation = 'source-over';

    for (let i = 0; i < engine.activeCounts.targets; i++) engine.pools.targets[i].draw(overlayCtx);
    for (let i = 0; i < engine.activeCounts.embers; i++) engine.pools.embers[i].draw(overlayCtx);

    renderChargeVisuals({ ctx: overlayCtx, now, activePointers, config, engine });
    overlayCtx.restore();

    gl.bindTexture(gl.TEXTURE_2D, overlayTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, overlayCanvas);
    drawOverlayTexture();
  }

  function render(now, engine, frame = {}) {
    if (disposed) return;
    if (!state.width || !state.height) return;
    syncOverlayCanvasSize();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);

    drawOverlayCanvas(now, engine, frame);
    transientPipeline.render(engine, frame);
    const transientStats = transientPipeline.getLastStats();
    lastRenderStats = {
      ...lastRenderStats,
      overlayWidth: overlayCanvas.width,
      overlayHeight: overlayCanvas.height,
      ...transientStats
    };
    transientPipeline.drawFlashOverlay(frame.flashColor, frame.flashIntensity || 0);
  }

  function resize() {
    if (disposed) return;
    syncOverlayCanvasSize();
    backgroundRenderer.initStars();
    backgroundRenderer.rebuildBackgroundCache();
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    transientPipeline.dispose?.();
    gl.deleteBuffer(textureBuffer);
    gl.deleteTexture(overlayTexture);
    gl.deleteProgram(textureProgram);
    lastRenderStats = {
      ...lastRenderStats,
      gpuInitialized: false,
      disposed: true
    };
  }

  return createRendererAdapter({
    id: 'webgl2-prototype',
    kind: 'webgl2',
    composeFrame,
    render,
    resize,
    dispose,
    getDebugStats: () => ({ ...lastRenderStats, disposed })
  });
}

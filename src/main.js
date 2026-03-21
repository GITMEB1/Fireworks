import { createFireworksApp } from './app/createFireworksApp.js';

const app = createFireworksApp({
  canvas: document.getElementById('fwCanvas'),
  hintEl: document.getElementById('hint'),
  statusEl: document.getElementById('status')
});

app.start();

// Intentional browser debug hook; deterministic repo-local calibration is now the primary validation lane.
if (typeof window !== 'undefined') window.__fireworksApp = app;

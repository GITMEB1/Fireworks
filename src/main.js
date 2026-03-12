import { createFireworksApp } from './app/createFireworksApp.js';

const app = createFireworksApp({
  canvas: document.getElementById('fwCanvas'),
  hintEl: document.getElementById('hint'),
  statusEl: document.getElementById('status')
});

app.start();

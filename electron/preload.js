/*
  guaitaCaptura — build Electron EXPERIMENTAL (no RC)
  Copyright © 2026 SBS BiM Consulting, Jordi Subirós
  SPDX-License-Identifier: AGPL-3.0-only
  Aquest programa és programari lliure: el podeu redistribuir i/o modificar
  sota els termes de la GNU Affero General Public License versió 3.

  Preload: l'únic pont entre el procés principal (Node) i la pàgina
  (guaitaCaptura.html). Exposa window.guaitaBridge amb el mateix contracte
  que l'app ja sap detectar i utilitzar (vegeu la constant BRIDGE a l'app).
*/
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('guaitaBridge', {
  // retorna un ArrayBuffer PNG, o null si l'usuari ha cancel·lat el selector
  captureScreen: async (opts) => {
    const buf = await ipcRenderer.invoke('guaita:capture-screen', opts || {});
    if (!buf) return null;
    const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    return u8.slice().buffer;
  },
  endCaptureSession: () => ipcRenderer.send('guaita:end-session'),

  readClipboard: async () => {
    const r = await ipcRenderer.invoke('guaita:clipboard-read');
    if (r && r.image) { const u8 = new Uint8Array(r.image); r.image = u8.slice().buffer; }
    return r;
  },
  writeClipboard: (data) => {
    const payload = { ...data };
    if (payload.image) payload.image = new Uint8Array(payload.image instanceof ArrayBuffer ? payload.image : (payload.image.buffer || payload.image));
    return ipcRenderer.invoke('guaita:clipboard-write', payload);
  },
  onClipboardChange: (cb) => { const f = () => cb(); ipcRenderer.on('guaita:clipboard-changed', f); return () => ipcRenderer.removeListener('guaita:clipboard-changed', f); },

  onGlobalCapture: (cb) => { const f = () => cb(); ipcRenderer.on('guaita:global-capture', f); return () => ipcRenderer.removeListener('guaita:global-capture', f); },
  onToast: (cb) => { const f = (_e, msg) => cb(msg); ipcRenderer.on('guaita:toast', f); return () => ipcRenderer.removeListener('guaita:toast', f); },

  platform: process.platform,
  version: '0.1.0'
});

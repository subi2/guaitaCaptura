/*
  guaitaCaptura — build Electron EXPERIMENTAL (no RC)
  Copyright © 2026 SBS BiM Consulting, Jordi Subirós
  SPDX-License-Identifier: AGPL-3.0-only
  Aquest programa és programari lliure: el podeu redistribuir i/o modificar
  sota els termes de la GNU Affero General Public License versió 3.

  Procés principal. Exposa a la pàgina (via preload.js, window.guaitaBridge)
  el que el navegador no permet: captura sense diàleg de Chrome, porta-retalls
  vigilat en segon pla, drecera global i icona a la safata.
*/
const { app, BrowserWindow, Tray, Menu, globalShortcut, desktopCapturer, clipboard,
        nativeImage, screen, ipcMain, shell } = require('electron');
const path = require('path');

const LANG = process.env.GUAITA_LANG === 'en' ? 'pagesENG' : 'pagesCAT';
const APP_HTML = app.isPackaged
  ? path.join(process.resourcesPath, LANG, 'guaitaCaptura.html')
  : path.join(__dirname, '..', LANG, 'guaitaCaptura.html');

let win = null, tray = null;
let sessionSourceId = null; // font recordada mentre dura una "sessió de captura"
let lastClipHash = null;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 820, minHeight: 560,
    title: 'guaitaCaptura',
    backgroundColor: '#15161a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  win.loadFile(APP_HTML);
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  win.on('close', e => {
    // amaga a la safata en lloc de tancar, perquè la drecera global i la vigilància
    // del porta-retalls segueixin actives (comportament típic d'un gestor de captures)
    if (!app.isQuitting) { e.preventDefault(); win.hide(); }
  });
}

function waitForBlurOrTimeout(max) {
  return new Promise(resolve => {
    if (!win.isFocused()) return resolve(true);
    let done = false;
    const onBlur = () => { if (!done) { done = true; win.removeListener('blur', onBlur); resolve(true); } };
    win.on('blur', onBlur);
    setTimeout(() => { if (!done) { done = true; win.removeListener('blur', onBlur); resolve(false); } }, max);
  });
}

/* ───────── captura ───────── */
async function captureMonitor() {
  const primary = screen.getPrimaryDisplay();
  const size = { width: Math.round(primary.size.width * primary.scaleFactor), height: Math.round(primary.size.height * primary.scaleFactor) };
  const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: size });
  const src = sources.find(s => s.display_id === String(primary.id)) || sources[0];
  return src || null;
}
async function captureWithPicker(remembered) {
  const list = await desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 320, height: 200 } });
  if (remembered) { const hit = list.find(s => s.id === remembered); if (hit) return hit; }
  return openPicker(list);
}
function openPicker(sources) {
  return new Promise(resolve => {
    const pick = new BrowserWindow({
      width: 640, height: 460, parent: win, modal: true, resizable: false,
      title: 'Tria què vols capturar', backgroundColor: '#15161a',
      // finestreta pròpia, 100% local (picker.html), sense contingut remot: nodeIntegration
      // hi és segur i permet un IPC mínim sense necessitar un preload a part
      webPreferences: { contextIsolation: false, nodeIntegration: true }
    });
    pick.setMenu(null);
    pick.loadFile(path.join(__dirname, 'picker.html'));
    let settled = false;
    const onChoice = (_e, id) => { if (settled) return; settled = true;
      ipcMain.removeListener('guaita:picker-choice', onChoice);
      resolve(sources.find(s => s.id === id) || null); pick.close(); };
    ipcMain.on('guaita:picker-choice', onChoice);
    pick.webContents.once('did-finish-load', () => pick.webContents.send('guaita:picker-sources',
      sources.map(s => ({ id: s.id, name: s.name, thumb: s.thumbnail.toDataURL() }))));
    pick.once('closed', () => { if (!settled) { settled = true; ipcMain.removeListener('guaita:picker-choice', onChoice); resolve(null); } });
  });
}

ipcMain.handle('guaita:capture-screen', async (_evt, opts = {}) => {
  const { surface = 'monitor', armBlur = true, remember = false } = opts;
  if (armBlur && surface === 'monitor') {
    await sleep(350);
    if (win.isFocused()) {
      win.webContents.send('guaita:toast', 'Canvia a la finestra que vols capturar: es capturarà en uns instants.');
      await waitForBlurOrTimeout(10000);
      await sleep(1500);
    }
  }
  let src;
  if (surface === 'monitor') { src = await captureMonitor(); sessionSourceId = null; }
  else { src = await captureWithPicker(remember ? sessionSourceId : null); if (remember && src) sessionSourceId = src.id; }
  if (!src) return null;
  // recaptura la font triada a alta resolució (el llistat del selector era de mida reduïda)
  if (surface !== 'monitor') {
    const hi = await desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 3840, height: 2160 } });
    const match = hi.find(s => s.id === src.id);
    if (match) src = match;
  }
  return src.thumbnail.toPNG();
});
ipcMain.on('guaita:end-session', () => { sessionSourceId = null; });

/* ───────── porta-retalls ───────── */
ipcMain.handle('guaita:clipboard-read', () => {
  const formats = clipboard.availableFormats();
  const img = clipboard.readImage();
  const hasImg = !img.isEmpty();
  const text = clipboard.readText();
  return {
    image: hasImg ? img.toPNG() : null,
    text: (!hasImg && text) ? text : null,
    types: formats
  };
});
ipcMain.handle('guaita:clipboard-write', (_evt, data) => {
  if (data && data.text != null) { clipboard.writeText(data.text); return true; }
  if (data && data.image) {
    const buf = Buffer.isBuffer(data.image) ? data.image : Buffer.from(data.image);
    clipboard.writeImage(nativeImage.createFromBuffer(buf));
    return true;
  }
  return false;
});
function clipHash() {
  const img = clipboard.readImage();
  if (!img.isEmpty()) return 'img:' + Buffer.from(img.toPNG()).length + ':' + img.getSize().width + 'x' + img.getSize().height;
  const t = clipboard.readText();
  return t ? 'txt:' + t.length + ':' + t.slice(0, 40) : 'buit';
}
function startClipboardWatch() {
  lastClipHash = clipHash();
  setInterval(() => {
    const h = clipHash();
    if (h !== lastClipHash) { lastClipHash = h; if (win) win.webContents.send('guaita:clipboard-changed'); }
  }, 900);
}

/* ───────── drecera global i safata ───────── */
function triggerGlobalCapture() { if (win) win.webContents.send('guaita:global-capture'); }
function registerShortcuts() {
  // Alt+Maj+C (no Alt+Maj+S, que ja és "sessió de captura" dins l'app): captura encara que la
  // finestra estigui amagada o minimitzada, cosa que el navegador no permet.
  globalShortcut.register('Alt+Shift+C', triggerGlobalCapture);
}
function buildTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'icons', 'tray.png'));
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);
  tray.setToolTip('guaitaCaptura');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Mostra guaitaCaptura', click: () => { win.show(); win.focus(); } },
    { label: 'Captura ara (Alt+Maj+C)', click: triggerGlobalCapture },
    { type: 'separator' },
    { label: 'Surt', click: () => { app.isQuitting = true; app.quit(); } }
  ]));
  tray.on('click', () => { win.isVisible() ? win.hide() : win.show(); });
}

app.whenReady().then(() => {
  createWindow();
  buildTray();
  registerShortcuts();
  startClipboardWatch();
});
app.on('before-quit', () => { app.isQuitting = true; });
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => { /* es queda viu a la safata (Tray) */ });
app.on('activate', () => { if (win) { win.show(); } else createWindow(); });

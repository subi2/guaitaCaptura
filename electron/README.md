# guaitaCaptura — build Electron (EXPERIMENTAL, no RC)

**Això no és una versió estable ni una Release Candidate.** És un empaquetat
experimental per provar la integració amb el sistema operatiu que el
navegador no permet. Pot fallar, canviar de disseny o desaparèixer sense
avís. L'HTML de l'app (`pagesCAT/guaitaCaptura.html`, `pagesENG/guaitaCaptura.html`)
és el mateix PWA de sempre: aquesta carpeta només l'empaqueta.

## Què aporta respecte al PWA del navegador

| Funció | Navegador (PWA) | Electron |
|---|---|---|
| Captura de pantalla sencera | Sempre amb el diàleg de Chrome | Sense diàleg (tria la pantalla principal automàticament) |
| Captura de finestra/pestanya | Diàleg de Chrome | Finestreta pròpia de tria (una sola vegada per sessió) |
| Porta-retalls | Cal permís del navegador; només en primer pla | Lectura/escriptura directes, vigilat en segon pla cada ~0,9 s |
| Drecera **Alt+Maj+C** | No es pot (el navegador no ho permet) | Captura encara que la finestra estigui amagada o minimitzada |
| Icona a la safata del sistema | No existeix | Mostra/amaga l'app, capturar, sortir |

La resta de l'app (arxiu, editor, retall, impressió…) funciona exactament
igual que al navegador: és el mateix fitxer HTML.

## Com provar-ho en local

```
cd electron
npm install
npm start
```

Per defecte carrega `pagesCAT`. Per provar la versió en anglès:

```
GUAITA_LANG=en npm start
```

## Com generar l'instal·lador

```
npm run dist
```

Genera a `electron/dist/` l'instal·lador per a la teva plataforma
(`.dmg` a macOS, `.exe`/NSIS a Windows, `.AppImage` a Linux) amb
`electron-builder`.

## Limitacions conegudes d'aquest experiment

- **macOS**: cal concedir permís de "Gravació de pantalla" al Sistema la
  primera vegada (Preferències del Sistema → Privadesa i seguretat). Sense
  signatura de codi ni notarització d'Apple, macOS pot avisar que l'app
  "no és d'un desenvolupador identificat": cal autoritzar-ho manualment
  (clic dret → Obre). Per distribuir-ho de debò caldria un compte de
  desenvolupador Apple.
- **Windows/Linux**: no hi ha signatura de codi; l'instal·lador pot generar
  avisos de l'antivirus o del SmartScreen la primera vegada.
- La captura de finestra/pestanya torna a demanar-se cada vegada que s'atura
  la sessió de captura (Alt+Maj+S dins l'app); mentre la sessió és activa,
  es reutilitza la mateixa font sense tornar a preguntar.
- La drecera global és **Alt+Maj+C** (no Alt+Maj+S): Alt+Maj+S ja és, dins
  l'app, "inicia/atura la sessió de captura", i una drecera global del
  sistema no es pot fer servir dues vegades amb significats diferents.
- No hi ha actualització automàtica (auto-updater) en aquesta versió
  experimental.
- No hi ha signatura ni notarització: cada sistema operatiu ho farà notar
  a la seva manera la primera vegada que s'executi.

---

# guaitaCaptura — Electron build (EXPERIMENTAL, not RC)

**This is not a stable or Release Candidate build.** It is an experimental
package to try out OS integration that the browser does not allow. It may
fail, change shape, or be dropped without notice. The app's HTML
(`pagesCAT/guaitaCaptura.html`, `pagesENG/guaitaCaptura.html`) is the exact
same PWA as always: this folder only packages it.

## What it adds over the browser PWA

| Feature | Browser (PWA) | Electron |
|---|---|---|
| Full-screen capture | Always shows Chrome's dialog | No dialog (auto-picks the main screen) |
| Window/tab capture | Chrome's dialog | Its own small picker (once per session) |
| Clipboard | Needs browser permission; foreground only | Direct read/write, watched in the background every ~0.9 s |
| **Alt+Shift+C** shortcut | Not possible (browser won't allow it) | Captures even while the window is hidden or minimized |
| System tray icon | Doesn't exist | Show/hide the app, capture, quit |

Everything else (archive, editor, cropping, printing…) works exactly as in
the browser: it's the same HTML file.

## Try it locally

```
cd electron
npm install
npm start
```

Loads `pagesCAT` by default. To try the English build:

```
GUAITA_LANG=en npm start
```

## Build an installer

```
npm run dist
```

Produces the installer for your platform under `electron/dist/`
(`.dmg` on macOS, NSIS `.exe` on Windows, `.AppImage` on Linux) via
`electron-builder`.

## Known limitations of this experiment

- **macOS**: you must grant "Screen Recording" permission the first time
  (System Settings → Privacy & Security). Without Apple code signing and
  notarization, macOS may warn the app is "from an unidentified
  developer": authorize it manually (right-click → Open). Real
  distribution would need an Apple Developer account.
- **Windows/Linux**: no code signing; the installer may trigger antivirus
  or SmartScreen warnings the first time.
- Window/tab capture is asked again every time the capture session is
  stopped (Alt+Shift+S inside the app); while the session is active, the
  same source is reused without asking again.
- The global shortcut is **Alt+Shift+C** (not Alt+Shift+S): inside the app,
  Alt+Shift+S already means "start/stop the capture session", and a
  system-wide shortcut can't carry two different meanings.
- No auto-updater in this experimental build.
- No code signing or notarization: each OS will flag that in its own way
  the first time it runs.

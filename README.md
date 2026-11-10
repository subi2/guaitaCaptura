# guaitaCaptura 0.2.0 — versió preliminar / preview (no RC)

> ⚠️ **Aquesta versió no és una Release Candidate.** És una PWA de proves prèvia a la versió d'escriptori (Electron). El format intern de l'arxiu pot canviar entre versions: exporteu l'arxiu (.zip) sovint.
> ⚠️ **This is not a Release Candidate.** It is a test PWA ahead of the desktop (Electron) version. The internal archive format may change between versions: export the archive (.zip) often.

[Català](#català) · [English](#english)

---

## Català

Gestor de captures de pantalla i de porta-retalls de la suite **Guaita Apps**. Un sol fitxer HTML, sense dependències externes, i tot es processa localment al navegador.

**Capturar** — pantalla (per defecte), finestra o pestanya; sessió de captura (un sol diàleg per a moltes captures); previsualització abans de desar; temporitzador (3/5/10 s) i ràfega; enganxar (Ctrl+V), arrossegar o importar imatges i text.
**Retallar** — rectangle ajustable amb nanses, mides exactes i proporcions; retall no rectangular (cantonades arrodonides, el·lipse, polígon, llaç) amb exterior transparent; lupa de píxels. També sobre imatges de l'arxiu.
**Arxivar** — arxiu local (IndexedDB) amb col·leccions, etiquetes, destacades, notes i cerca; exportació i importació de l'arxiu complet en .zip.
**Anomenar** — plantilla de nom configurable (`{origen}_{data}_{hora}_{n}`) i reanomenat per lots amb previsualització.
**Reutilitzar** — gestor del porta-retalls (veure'l, substituir-lo per qualsevol element, amb reescalat) i historial automàtic.
**Editar** — objectes editables (moure, redimensionar, girar, ordre) que es desen amb la captura: rectangles, el·lipses, triangles, rombes, estrelles, línies, fletxes, polilínies, polígons, núvols de revisió, bafarades, text, llapis, marcador, passos, segells, difuminat i pixelat. Ajustos de color (brillantor, contrast, saturació, to, grisos, sèpia, invertir), substitució de color, vareta màgica, goma i seleccions per fer zones transparents; girar, emmirallar, redimensionar i marges.
**Menú contextual** — botó dret a miniatures, fons, col·leccions, porta-retalls, retall i editor.
**Imprimir** — 1, 2, 4, 6, 9 o 16 per pàgina (A4 vertical o horitzontal) i exportació a PDF sense dependències.

### Ús

1. Obriu l'app per `https://` (per exemple, GitHub Pages) o per `http://localhost`. Amb `file://` el navegador no recorda el permís del porta-retalls.
2. Obriu [`pagesCAT/guaitaCaptura.html`](pagesCAT/guaitaCaptura.html) i, amb Chrome o Edge, instal·leu-la com a app.
3. Manual d'ús: [`pagesCAT/HLP guaitaCaptura-ajuda.html`](pagesCAT/HLP%20guaitaCaptura-ajuda.html) (també amb **F1** dins l'app).

En local: `python -m http.server 8000` dins la carpeta i obriu `http://localhost:8000/`.

### Limitacions de la PWA

- La captura passa sempre pel diàleg del navegador (`getDisplayMedia`): l'app només hi pot proposar un tipus (pantalla, finestra o pestanya). No hi ha drecera global ni captura silenciosa. No funciona en mòbils.
- Els ajustos de color necessiten filtres de canvas (navegadors recents). Girar, emmirallar, redimensionar i el retall no rectangular fusionen les anotacions.
- El porta-retalls no es pot vigilar en segon pla: només es llegeix quan l'app torna a primer pla. Només imatge (PNG en escriure) i text pla. Cal https o localhost.
- Les dades són del navegador i de l'adreça: esborrar les dades de navegació les esborra.
- PDF: imatges en JPEG (les zones transparents surten blanques) i textos limitats a Latin-1.
- Pendent: enviar a guaitaPDF Edit i altres apps Guaita, OCR.

### Camí cap a Electron

L'app detecta `window.guaitaBridge` (exposat des del *preload* d'Electron) i, si existeix, l'usa en lloc de les API del navegador:

```js
window.guaitaBridge = {
  captureScreen(): Promise<Blob>,                       // captura sense diàleg (desktopCapturer)
  readClipboard(): Promise<{ image?: Blob, text?: string, types?: string[] }>,
  writeClipboard({ image?: Blob, text?: string }): Promise<void>,
  onClipboardChange(callback): void                     // vigilància contínua → historial complet
};
```

### Estructura del repositori

```
index.html                       presentació (CAT i ENG)
pagesCAT/guaitaCaptura.html      app en català
pagesCAT/HLP guaitaCaptura-ajuda.html
pagesCAT/manifest.webmanifest, sw.js, icones
pagesENG/guaitaCaptura.html      app en anglès
pagesENG/HLP guaitaCaptura-help_EN.html
pagesENG/manifest.webmanifest, sw.js, icones
tests/                           proves jsdom (node tests/test.js)
LICENSE · NOTICE.md · CLA.md
```

### Proves

```
npm i jsdom
node tests/test.js
```

### Llicència

Copyright © 2026 SBS BiM Consulting, Jordi Subirós · **AGPL-3.0-only** (vegeu [`LICENSE`](LICENSE) i [`NOTICE.md`](NOTICE.md)). Les contribucions s'accepten sota el [`CLA.md`](CLA.md).

*Guaita Apps es distribueix «tal com és», sense cap garantia. Les eines estan pensades desde la recerca i com a suport tècnic i educatiu; la verificació dels resultats i la responsabilitat derivada del seu ús recauen únicament sobre l'usuari final.*

---

## English

Screenshot and clipboard manager of the **Guaita Apps** suite. A single HTML file, no external dependencies; everything is processed locally in the browser.

**Capture** — screen (default), window or tab; capture session (one dialog for many captures); preview before saving; timer (3/5/10 s) and burst; paste (Ctrl+V), drag or import images and text.
**Crop** — adjustable rectangle with handles, exact sizes and aspect ratios; non-rectangular crop (rounded corners, ellipse, polygon, lasso) with a transparent outside; pixel loupe. Also on archived images.
**Archive** — local archive (IndexedDB) with collections, tags, stars, notes and search; export and import of the whole archive as .zip.
**Name** — configurable name template (`{source}_{date}_{time}_{n}`) and batch rename with preview.
**Reuse** — clipboard manager (view it, replace it with any item, with optional rescaling) and automatic history.
**Edit** — editable objects (move, resize, rotate, order) saved with the capture: rectangles, ellipses, triangles, rhombi, stars, lines, arrows, polylines, polygons, revision clouds, callouts, text, pencil, marker, steps, stamps, blur and pixelate. Colour adjustments (brightness, contrast, saturation, hue, greyscale, sepia, invert), colour replacement, magic wand, eraser and selections to make areas transparent; rotate, flip, resize and margins.
**Context menu** — right-click on thumbnails, background, collections, clipboard, crop and editor.
**Print** — 1, 2, 4, 6, 9 or 16 per page (A4 portrait or landscape) and dependency-free PDF export.

### Usage

1. Open the app over `https://` (for example GitHub Pages) or `http://localhost`. With `file://` the browser does not remember the clipboard permission.
2. Open [`pagesENG/guaitaCaptura.html`](pagesENG/guaitaCaptura.html) and, in Chrome or Edge, install it as an app.
3. User guide: [`pagesENG/HLP guaitaCaptura-help_EN.html`](pagesENG/HLP%20guaitaCaptura-help_EN.html) (also with **F1** inside the app).

Locally: `python -m http.server 8000` inside the folder and open `http://localhost:8000/`.

### PWA limitations

- Capture always goes through the browser dialog (`getDisplayMedia`): the app can only propose a type (screen, window or tab). No global shortcut and no silent capture. It does not work on phones.
- Colour adjustments need canvas filters (recent browsers). Rotating, flipping, resizing and non-rectangular cropping merge the annotations.
- The clipboard cannot be watched in the background: it is only read when the app returns to the foreground. Image (PNG when writing) and plain text only. https or localhost required.
- Data belongs to the browser and the address: clearing browsing data deletes it.
- PDF: JPEG images (transparent areas come out white) and Latin-1 text only.
- Not yet available: sending to guaitaPDF Edit and other Guaita apps, OCR.

### Towards Electron

The app detects `window.guaitaBridge` (exposed from the Electron preload) and, if present, uses it instead of the browser APIs (see the interface above).

### Licence

Copyright © 2026 SBS BiM Consulting, Jordi Subirós · **AGPL-3.0-only** (see [`LICENSE`](LICENSE) and [`NOTICE.md`](NOTICE.md)). Contributions are accepted under the [`CLA.md`](CLA.md).

*Guaita Apps is distributed “as is”, without any warranty. The tools are designed from research and as technical and educational support; verification of the results and the responsibility arising from their use rest solely with the end user.*

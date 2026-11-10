/* guaitaCaptura 0.1.2 (preview, not RC) · service worker
   Copyright (c) 2026 SBS BiM Consulting, Jordi Subirós · SPDX-License-Identifier: AGPL-3.0-only
   Network first (always the latest version), cache as fallback. */
const CACHE = 'guaita-captura-en-012';
const SHELL = ['./guaitaCaptura.html', "HLP guaitaCaptura-help_EN.html", 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k.startsWith('guaita-captura-en-')).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('./guaitaCaptura.html') : undefined))));
});

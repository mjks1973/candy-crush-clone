/* Candy Pop Party service worker: makes the game work offline once it has loaded once.
   Bump VERSION when you change the list of app files below. */
const VERSION = 'candy-pop-party-v1';
const FONTS = 'candy-pop-party-fonts-v1';
const SHELL = [
  '/', '/styles.css', '/js/engine.js', '/js/levels.js', '/js/game.js', '/manifest.webmanifest',
  '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png', '/icons/favicon-32.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const withTimeout = (p, ms) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('timeout')), ms);
  p.then((v) => { clearTimeout(t); resolve(v); }, (err) => { clearTimeout(t); reject(err); });
});

/* App files: network first so new deploys arrive straight away, cached copy when offline or slow. */
async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  const key = req.mode === 'navigate' ? '/' : req;
  const net = fetch(req).then((res) => {
    if (res.ok && !res.redirected) cache.put(key, res.clone());
    return res;
  });
  try {
    return await withTimeout(net, 4000);
  } catch (err) {
    const hit = await cache.match(key, { ignoreSearch: true });
    return hit || net;
  }
}

/* Google Fonts: cache first, they never change. */
async function cacheFirst(req) {
  const cache = await caches.open(FONTS);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(cacheFirst(req));
  } else if (url.origin === self.location.origin) {
    e.respondWith(networkFirst(req));
  }
});

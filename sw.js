// Serves the unlocked prototype (decrypted into Cache Storage by the password page) under ./app/.
// Nothing under ./app/ exists on the server, so without the password there is nothing to load.
const CACHE = 'bevel-proto-app';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const app = new URL('app/', self.registration.scope);
  if (url.origin !== app.origin || !url.pathname.startsWith(app.pathname)) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    let key = url.origin + url.pathname;
    if (key.endsWith('/')) key += 'index.html';
    const hit = await cache.match(key);
    if (hit) return hit;
    if (e.request.mode === 'navigate') return Response.redirect(self.registration.scope, 302);
    return new Response('Not found', { status: 404 });
  })());
});

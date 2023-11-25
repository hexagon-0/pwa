
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwa-offline-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";
const fCache = [
  'https://jaisson.github.io/oficina/',
  'js/pwa.js'
];


if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();

  workbox.routing.registerRoute(
    new RegExp('/*'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE
    })
  );
}

/* 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       Registrar os eventos 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
*/ 

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
          .then((cache) => cache.addAll(fCache))
  );

  self.skipWaiting();  
});

self.addEventListener('push', (event) => {
  event.waitUntil(
    self.registration.showNotification('Titulo', {
      body: 'Mensagem',
      icon: 'favicon.png',
    })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'database-sync') {
    event.waitUntil(
      upLocalDataBase()
    );
  }
});

function upLocalDataBase() {
  () => self.registration.showNotification('Atualizei o banco local');
}



/*
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
*/
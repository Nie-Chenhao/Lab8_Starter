const CACHE_NAME = 'lab-8-starter';

// oh seems like I need to have not only the six links
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/styles/main.css',
  '/assets/scripts/main.js',
  '/assets/scripts/RecipeCard.js',
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

//todo 1
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching all files');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});


self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      try {
        const networkResponse = await fetch(event.request);
        if (event.request.method === 'GET') {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.log('failed', error);
        if (event.request.mode === 'navigate') {
          return cache.match('/index.html');
        }
        return null;
      }
    })()
  );
});
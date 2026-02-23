const CACHE_NAME = 'editor-cache-v0.6.2';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/editor.js',
    '/manifest.json',
    '/media/favicon.png',
    '/media/settings.png',
    '/media/keyPress.mp3'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => 
            cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key); // remove old caches
                    }
                })
            )
        )
    );

    self.clients.claim(); // take control immediately
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});



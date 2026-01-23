const CACHE_NAME = 'editor-cache-v1';
const FILES_TO_CACHE = [
    '/',           // root path
    '/index.html',
    '/style.css',
    '/editor.js',
    '/manifest.json',
    '/favicon.png'
];

// Install: cache all files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

// Intercept fetch requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

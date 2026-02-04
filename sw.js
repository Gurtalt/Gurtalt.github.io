const CACHE_NAME = 'editor-cache-v0.3.2';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/editor.js',
    '/manifest.json',
    '/favicon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

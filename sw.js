const CACHE_NAME = 'editor-cache-v0.6.0';
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
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => 
            cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});



const CACHE_NAME = 'my-site-cache-v';
const OFFLINE_URL = 'offline.html';

const urlsToCache = [
    OFFLINE_URL,
    'app.js',
    'style.css',
    'manifest.json',
    'https://unsplash.it/400/200', // Hanya jika ingin meng-cache gambar SweetAlert
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    'https://code.jquery.com/jquery-3.5.1.slim.min.js',
    'https://code.jquery.com/jquery-3.7.1.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching offline page and essential files');
            return cache.addAll(urlsToCache).catch((error) => {
                console.error('Failed to cache:', error);
            });
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Log permintaan yang masuk
    console.log('Fetching:', event.request.url);

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            }).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
    }
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

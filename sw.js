const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'about.html',
    'contact.html',
    'style.css',
    'ore.jpg',
    'rumah.png',
    'offline.html',
    'The Maker.jpeg',
    'manifest.json',
    'https://unsplash.it/400/200', // Opsional, hanya jika ingin meng-cache gambar SweetAlert
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    'https://code.jquery.com/jquery-3.5.1.slim.min.js',
    'https://code.jquery.com/jquery-3.7.1.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
];

// Install Service Worker dan cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching files');
                return cache.addAll(urlsToCache).catch((err) => {
                    console.error('Error while caching:', err);
                });
            })
    );
});

// Fetch event to serve cached files
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ada dalam cache, kembalikan response
                if (response) {
                    return response;
                }

                // Jika tidak ada dalam cache, lakukan fetch
                return fetch(event.request).catch(() => {
                    // Jika fetch gagal, tampilkan halaman offline
                    return caches.match('offline.html');
                });
            })
    );
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}


// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyASs7sZguFNaxcIoxETDdmrROZ2Awyp7Ug",
  authDomain: "gen-lang-client-0687295290.firebaseapp.com",
  projectId: "gen-lang-client-0687295290",
  storageBucket: "gen-lang-client-0687295290.firebasestorage.app",
  messagingSenderId: "704063038935",
  appId: "1:704063038935:web:d668f2c4685979f8e05792",
  measurementId: "G-3DK3KVEY2E"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://picsum.photos/seed/safeguard/192/192',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = 'safeguard-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Push Notification Event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SafeGuard Alert';
  const options = {
    body: data.body || 'New behavioral health update available.',
    icon: 'https://picsum.photos/seed/safeguard/192/192',
    badge: 'https://picsum.photos/seed/safeguard/192/192',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

const CACHE_NAME = 'buhanor-cache-v2';
const RUNTIME_CACHE = 'buhanor-runtime-v2';
const IMAGE_CACHE = 'buhanor-images-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/192.jpg',
  '/512.jpg',
  '/logo.svg',
  '/reservations.html',
  '/excursions.html',
  '/offline.html' // Page offline personnalisée
];

// ----------------------------------------------------------------------
// INSTALLATION
// ----------------------------------------------------------------------

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('❌ Erreur lors de la mise en cache:', err);
      })
  );
  self.skipWaiting();
});

// ----------------------------------------------------------------------
// GESTION DES REQUÊTES (FETCH)
// ----------------------------------------------------------------------

// Stratégies de cache différentes selon le type de ressource
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore les requêtes non-GET (POST, PUT, DELETE, etc.) — Géré par Sync
  if (request.method !== 'GET') {
    // Si la requête n'est pas GET, on la laisse passer.
    // Pour les POST de réservations, le script principal doit utiliser IndexedDB
    // et Request.registerBackgroundSync.
    return;
  }

  // 1. Stratégie Cache First pour les images (Rapide)
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // 2. Stratégie Stale-While-Revalidate pour les API (Frais + Rapide)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  // 3. Stratégie Network First pour les pages HTML (Toujours le plus frais)
  if (request.destination === 'document') {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // 4. Cache First pour le reste (CSS, JS, fonts)
  event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
});


// ----------------------------------------------------------------------
// STRATÉGIES DE CACHE
// ----------------------------------------------------------------------

// Cache First: Cherche d'abord dans le cache
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    // Met en cache uniquement si la réponse est valide (status 200)
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error(`Erreur fetch pour ${request.url}:`, error);
    // Retourne la page offline si l'accès à internet est impossible
    return caches.match('/offline.html');
  }
}

// Network First: Essaie le réseau en premier
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    // Met en cache la réponse réussie
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error(`Erreur réseau pour ${request.url}. Tentative de cache.`, error);
    
    // Tente de récupérer la version mise en cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Fall-back ultime : Page offline
    return caches.match('/offline.html');
  }
}

// Stale While Revalidate: Sert le cache, met à jour en arrière-plan
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Tente le fetch pour rafraîchir le cache
  const networkFetch = fetch(request)
    .then(async response => {
      // Met à jour le cache uniquement si la réponse est OK
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      // Ignore les erreurs réseau ici car le 'cached' est servi en parallèle
      console.warn(`Mise à jour SWR échouée pour ${request.url}:`, error);
      // S'il n'y a pas de cache, l'échec doit être remonté
      if (!cached) throw error;
    });

  // Retourne immédiatement la version en cache si elle existe, sinon attend le réseau
  return cached || networkFetch;
}


// ----------------------------------------------------------------------
// NETTOYAGE (ACTIVATION)
// ----------------------------------------------------------------------

// Nettoyage des anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ----------------------------------------------------------------------
// FONCTIONNALITÉS PWA AVANCÉES
// ----------------------------------------------------------------------

// Notifications Push
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: '/192.jpg',
    badge: '/logo.svg',
    vibrate: [200, 100, 200],
    actions: [
      { action: 'explore', title: 'Voir', icon: '/logo.svg' },
      { action: 'close', title: 'Fermer', icon: '/logo.svg' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Buhanor', options)
  );
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Synchronisation en arrière-plan (pour les réservations hors ligne)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-reservations') {
    event.waitUntil(syncReservations());
  }
});

async function syncReservations() {
  // Logique pour synchroniser les réservations en attente
  console.log('🔄 Synchronisation des réservations...');
  // TODO: Ajouter ici la logique pour lire les données des réservations
  // dans IndexedDB et les envoyer au serveur.
}
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  function swContent() {
    return `importScripts('https://www.gstatic.com/firebasejs/11.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.3.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "${env.VITE_FIREBASE_API_KEY}",
  authDomain: "${env.VITE_FIREBASE_AUTH_DOMAIN}",
  projectId: "${env.VITE_FIREBASE_PROJECT_ID}",
  storageBucket: "${env.VITE_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${env.VITE_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${env.VITE_FIREBASE_APP_ID}"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Sol de Terreros', {
    body: body || 'Hay novedades en la app.',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    data: { url: payload.fcmOptions?.link || '/' },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
`
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Plugin: genera firebase-messaging-sw.js con env vars (sin hardcodear secretos)
      {
        name: 'firebase-messaging-sw',
        configureServer(server) {
          server.middlewares.use('/firebase-messaging-sw.js', (_req, res) => {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
            res.end(swContent())
          })
        },
        generateBundle() {
          this.emitFile({ type: 'asset', fileName: 'firebase-messaging-sw.js', source: swContent() })
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icon-192.svg', 'icon-512.svg'],
        manifest: {
          name: 'Sol de Terreros',
          short_name: 'Sol Terreros',
          description: 'Tu guía de verano en San Juan de Los Terreros v1.0.2. Playas, restaurantes y eventos.',
          version: '1.0.2',
          theme_color: '#F97316',
          background_color: '#fffbf7',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          lang: 'es',
          categories: ['travel', 'lifestyle'],
          icons: [
            { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
            { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
          ],
          screenshots: [],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpeg,jpg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'unsplash-images', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 } },
            },
            {
              urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
              handler: 'NetworkFirst',
              options: { cacheName: 'firestore', expiration: { maxEntries: 100 } },
            },
          ],
        },
      }),
    ],
  }
})

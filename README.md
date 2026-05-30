# Sol de Terreros 🌞

**Tu guía de verano para San Juan de Los Terreros (Pulpí, Almería)**

App web progresiva (PWA) con toda la información que necesitas para disfrutar al máximo de Los Terreros: playas, restaurantes, eventos, mapa interactivo y mucho más.

🌐 **Producción:** [soldeterreros.web.app](https://soldeterreros.web.app)

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 8 |
| Estilos | Tailwind CSS v4 |
| Routing | React Router v7 |
| Animaciones | Framer Motion |
| Mapa | Leaflet + react-leaflet |
| Backend | Firebase (Firestore, Auth, Storage, Hosting) |
| Push | Firebase Cloud Messaging (FCM) |
| PWA | vite-plugin-pwa (Workbox) |

---

## Secciones

- **🏖️ Playas** — Estado en tiempo real: bandera, temperatura, oleaje, servicios, Cruz Roja y Bandera Azul
- **🍽️ Restaurantes** — Restaurantes, chiringuitos, bares, heladerías, cafeterías y servicios
- **📅 Eventos** — Fiestas, conciertos y mercadillos del pueblo
- **🗺️ Mapa** — Mapa interactivo Leaflet con marcadores por tipo y botón "Estoy aquí"
- **🔭 Descubrir** — Isla de Terreros, El Pichirichi, Castillo de los Terreros, buceo y actividades
- **ℹ️ Info útil** — Emergencias, taxis, farmacias, transporte y servicios locales
- **⚙️ Admin** — Panel de administración protegido con Google Sign-In

---

## Desarrollo local

### Requisitos

- Node.js 18+
- Cuenta Firebase (proyecto `soldeterreros`)

### Instalación

```bash
npm install
```

### Variables de entorno

Copia `.env.example` como `.env` y rellena los valores:

```bash
cp .env.example .env
```

Las variables necesarias están documentadas en `.env.example`. Obtenlas en [Firebase Console → Project Settings](https://console.firebase.google.com/project/soldeterreros/settings/general).

### Arrancar en desarrollo

```bash
npm run dev
```

> El service worker de Firebase Messaging se genera automáticamente en `localhost:5173/firebase-messaging-sw.js` con las variables de entorno — no se incluye en el repo.

---

## Despliegue

```bash
npm run build
firebase deploy --only hosting
```

Para desplegar las Cloud Functions (requiere plan Blaze):

```bash
firebase deploy --only functions
```

---

## Firebase — estructura de datos

| Colección | Contenido |
|---|---|
| `playas/{id}` | Datos de playas y calas |
| `restaurantes/{id}` | Restaurantes, bares y servicios |
| `eventos/{id}` | Eventos y actividades |
| `suscriptores/{token}` | Tokens FCM de push notifications |
| `notificaciones/{id}` | Cola de notificaciones (trigger Cloud Function) |

Para cargar los datos iniciales en Firestore: accede a `/admin` → **Poblar Firestore con datos iniciales**.

---

## Seguridad

- **Firebase API Key**: las claves del cliente Firebase son públicas por diseño (identifican el proyecto, no dan acceso admin). La protección real viene de las Firebase Security Rules.
- **Admin auth**: acceso al panel `/admin` restringido a Google Sign-In con email específico configurado en `VITE_ADMIN_EMAIL`.
- **Secretos**: ningún secreto se versiona en el repositorio. El service worker de FCM se genera en build a partir de las variables de entorno.
- **Restricción recomendada**: limita la API key en [Google Cloud Console → Credenciales](https://console.cloud.google.com/apis/credentials) al dominio `soldeterreros.web.app`.

---

## Notas sobre coordenadas

Las coordenadas GPS de los establecimientos son **estimaciones aproximadas** basadas en:
- Fuentes verificadas (verplayas.com, webs oficiales de restaurantes, Nominatim OSM)
- Dirección postal de cada establecimiento
- Ancla confirmada: Mesón Pepa (#133, Av. Puerta Litoral Andaluz) → `37.360168, -1.664801`

Para mayor precisión, cada punto puede ajustarse manualmente desde Google Maps.

---

## Changelog

### v1.0.2 (Mayo 2026)
- Mapa: coordenadas corregidas con ancla verificada (Mesón Pepa confirmado)
- Portada: foto de El Pichirichi
- Descubrir: sección de El Pichirichi + foto real del Castillo de los Terreros
- Restaurantes: carta de Annie's Bistró scraped del website oficial
- Restaurantes: webs oficiales enlazadas (Mesón Pepa, Gemva, Annie's Bistró, Dulche Gusto, La Consentía)
- Seguridad: SW de FCM generado en build (sin secretos en el repo)

### v1.0.1 (Mayo 2026)
- Mapa interactivo con Leaflet (reemplaza iframe OSM)
- 6 nuevos establecimientos reales verificados en TripAdvisor
- Playa Las Palmeras añadida
- Login admin migrado a Google Sign-In con restricción por email
- Config Firebase movida a variables de entorno

### v1.0.0 (Mayo 2026)
- Versión inicial

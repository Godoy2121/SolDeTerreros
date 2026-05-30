import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Waves, UtensilsCrossed, Locate, ExternalLink, Navigation2 } from 'lucide-react';
import { playas, getBanderaInfo } from '../data/playas';
import { restaurantes, getTipoLabel, getTipoIcono } from '../data/restaurantes';

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CENTRO = [37.3553, -1.6740];

function calcDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return d < 1000 ? `${Math.round(d)} m` : `${(d / 1000).toFixed(1)} km`;
}

function makeIcon(color, emoji) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      border:2.5px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      width:34px;height:34px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 10px rgba(0,0,0,0.25);
    "><span style="transform:rotate(45deg);font-size:15px;line-height:1">${emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -36],
  });
}

function makeUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:20px;height:20px;
      background:#2563eb;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 4px rgba(37,99,235,0.25);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}

const BANDERA_COLOR = {
  verde: '#22c55e',
  amarilla: '#eab308',
  roja: '#ef4444',
};

const TIPO_COLOR = {
  restaurante: '#f97316',
  chiringuito: '#fb923c',
  bar: '#f59e0b',
  heladeria: '#ec4899',
  cafeteria: '#10b981',
  'comida-llevar': '#84cc16',
  supermercado: '#059669',
  farmacia: '#6366f1',
  panaderia: '#d97706',
  peluqueria: '#a855f7',
  estanco: '#64748b',
  gasolinera: '#475569',
};

function FlyToPoint({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 17, { duration: 1 });
  }, [target, map]);
  return null;
}

function LocateButton({ onLocate }) {
  const map = useMap();
  const handleClick = useCallback(() => {
    map.locate({ setView: true, maxZoom: 17 });
    map.once('locationfound', (e) => onLocate({ lat: e.latlng.lat, lng: e.latlng.lng }));
  }, [map, onLocate]);
  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', marginTop: '10px', marginRight: '10px' }}>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 bg-white shadow-lg rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-gray-200"
      >
        <Locate className="w-4 h-4" />
        Estoy aquí
      </button>
    </div>
  );
}

const CAPAS = [
  { key: 'playas', label: 'Playas', icon: Waves, color: 'sky' },
  { key: 'restaurantes', label: 'Restaurantes', icon: UtensilsCrossed, color: 'orange' },
];

export default function Mapa() {
  const [capasActivas, setCapasActivas] = useState({ playas: true, restaurantes: true });
  const [userPos, setUserPos] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const tiposRestaurante = ['todos', ...new Set(restaurantes.map(r => r.tipo))];

  const restaurantesFiltrados = filtroTipo === 'todos'
    ? restaurantes
    : restaurantes.filter(r => r.tipo === filtroTipo);

  const googleMapsUrl = `https://www.google.com/maps/@${CENTRO[0]},${CENTRO[1]},15z`;

  return (
    <div className="min-h-screen bg-[#fffbf7] flex flex-col">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 pt-20 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white font-display mb-1">Mapa</h1>
            <p className="text-emerald-200 text-sm">San Juan de Los Terreros · Toca cualquier punto para más info</p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-4">
        {/* Panel lateral */}
        <div className="lg:w-72 flex-shrink-0 flex flex-col gap-3">
          {/* Capas */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Mostrar en el mapa</h3>
            <div className="flex flex-col gap-2">
              {CAPAS.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => setCapasActivas(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                    capasActivas[key]
                      ? `bg-${color}-50 border border-${color}-200`
                      : 'border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${capasActivas[key] ? `text-${color}-600` : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${capasActivas[key] ? `text-${color}-800` : 'text-gray-500'}`}>
                    {label}
                  </span>
                  <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    capasActivas[key] ? `bg-${color}-500 border-${color}-500` : 'border-gray-300'
                  }`}>
                    {capasActivas[key] && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filtro de tipo restaurante */}
          {capasActivas.restaurantes && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Tipo de local</h3>
              <div className="flex flex-wrap gap-1.5">
                {tiposRestaurante.map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => setFiltroTipo(tipo)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                      filtroTipo === tipo
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tipo === 'todos' ? 'Todos' : getTipoLabel(tipo)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lista de puntos playas */}
          {capasActivas.playas && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-64 overflow-y-auto">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white">
                <Waves className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-gray-900 text-sm">Playas y calas</h3>
                <span className="ml-auto text-xs text-gray-400">{playas.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {playas.map(p => {
                  const info = getBanderaInfo(p.bandera);
                  const dist = userPos ? calcDistancia(userPos.lat, userPos.lng, p.lat, p.lng) : null;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelected({ lat: p.lat, lng: p.lng })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50 transition-colors text-left group"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0`} style={{ background: BANDERA_COLOR[p.bandera] }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{p.nombre}</p>
                        <p className="text-xs text-gray-400">{p.temperatura}°C{dist ? ` · ${dist}` : ''}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lista de puntos restaurantes */}
          {capasActivas.restaurantes && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-64 overflow-y-auto">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-gray-900 text-sm">Locales</h3>
                <span className="ml-auto text-xs text-gray-400">{restaurantesFiltrados.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {restaurantesFiltrados.map(r => {
                  const dist = userPos ? calcDistancia(userPos.lat, userPos.lng, r.lat, r.lng) : null;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelected({ lat: r.lat, lng: r.lng })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0`} style={{ background: r.abierto ? '#22c55e' : '#d1d5db' }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{r.nombre}</p>
                        <p className="text-xs text-gray-400">{getTipoLabel(r.tipo)}{dist ? ` · ${dist}` : ''}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Abrir en Google Maps */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-white rounded-2xl p-3.5 border border-gray-100 hover:border-emerald-300 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Navigation2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Google Maps</p>
                <p className="text-xs text-gray-400">Ver mapa completo</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </a>
        </div>

        {/* Mapa Leaflet */}
        <div className="flex-1 min-h-[480px] lg:min-h-0 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
          <MapContainer
            center={CENTRO}
            zoom={15}
            style={{ width: '100%', height: '100%', minHeight: '480px' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyToPoint target={selected} />
            <LocateButton onLocate={setUserPos} />

            {/* Marcador usuario */}
            {userPos && (
              <Marker position={[userPos.lat, userPos.lng]} icon={makeUserIcon()}>
                <Popup>
                  <div className="text-sm font-semibold text-blue-700">📍 Estás aquí</div>
                </Popup>
              </Marker>
            )}

            {/* Marcadores playas */}
            {capasActivas.playas && playas.map(p => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={makeIcon(BANDERA_COLOR[p.bandera], '🏖️')}
              >
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{p.nombre}</p>
                    <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                      {p.temperatura}°C · {p.oleaje}
                      {userPos && ` · ${calcDistancia(userPos.lat, userPos.lng, p.lat, p.lng)}`}
                    </p>
                    <a
                      href={`/playas/${p.id}`}
                      style={{ fontSize: 12, color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Ver detalle →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Marcadores restaurantes */}
            {capasActivas.restaurantes && restaurantesFiltrados.map(r => (
              <Marker
                key={r.id}
                position={[r.lat, r.lng]}
                icon={makeIcon(TIPO_COLOR[r.tipo] || '#f97316', getTipoIcono(r.tipo))}
              >
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{r.nombre}</p>
                    <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>
                      {getTipoLabel(r.tipo)} · ⭐ {r.valoracion}
                    </p>
                    <p style={{ fontSize: 12, color: r.abierto ? '#16a34a' : '#9ca3af', marginBottom: 6, fontWeight: 600 }}>
                      {r.abierto ? '● Abierto' : '○ Cerrado'}
                      {userPos && ` · ${calcDistancia(userPos.lat, userPos.lng, r.lat, r.lng)}`}
                    </p>
                    <a
                      href={`/restaurantes/${r.id}`}
                      style={{ fontSize: 12, color: '#ea580c', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Ver detalle →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Leyenda */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-md border border-gray-100 text-xs space-y-1 pointer-events-none">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#22c55e' }} /> Bandera verde</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#eab308' }} /> Precaución</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#f97316' }} /> Restaurante / bar</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#2563eb' }} /> Tu posición</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Clock, Navigation, Phone } from 'lucide-react';
import { getTipoLabel, getTipoColor, getTipoIcono } from '../data/restaurantes';
import { useRestaurantes } from '../hooks/useRestaurantes';
import { SkeletonRestauranteCard } from '../components/SkeletonCard';

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-sm text-gray-900">{rating}</span>
    </div>
  );
}

function RestauranteCard({ restaurante, distancia, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        to={`/restaurantes/${restaurante.id}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group"
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={restaurante.foto}
            alt={restaurante.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTipoColor(restaurante.tipo)}`}>
              {getTipoLabel(restaurante.tipo)}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow ${
              restaurante.abierto ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
            }`}>
              {restaurante.abierto ? '● Abierto' : '● Cerrado'}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{restaurante.nombre}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm">{restaurante.valoracion}</span>
              <span className="text-xs text-gray-400">({restaurante.numReseñas})</span>
            </div>
          </div>

          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{restaurante.descripcion}</p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {restaurante.horario}
            </span>
            {distancia !== null && (
              <span className="flex items-center gap-1 text-sky-600 font-medium">
                <Navigation className="w-3.5 h-3.5" />
                {distancia < 1 ? `${Math.round(distancia * 1000)}m` : `${distancia.toFixed(1)}km`}
              </span>
            )}
          </div>

          {restaurante.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
              {restaurante.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

const TIPOS_SERVICIOS = ['supermercado', 'farmacia', 'panaderia', 'peluqueria', 'estanco', 'gasolinera'];

function ServicioCard({ servicio, index }) {
  const telUrl = servicio.telefono ? `tel:${servicio.telefono.replace(/\s/g, '')}` : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
        {getTipoIcono(servicio.tipo)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 leading-snug">{servicio.nombre}</p>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${getTipoColor(servicio.tipo)}`}>
              {getTipoLabel(servicio.tipo)}
            </span>
          </div>
          <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
            servicio.abierto ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {servicio.abierto ? '● Abierto' : '● Cerrado'}
          </span>
        </div>
        <p className="text-gray-500 text-xs mb-2 leading-relaxed">{servicio.descripcion}</p>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {servicio.horario}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {servicio.direccion}
          </span>
          {telUrl && (
            <a href={telUrl} className="flex items-center gap-1.5 text-xs text-orange-600 font-medium">
              <Phone className="w-3 h-3 flex-shrink-0" />
              {servicio.telefono}
            </a>
          )}
        </div>
        {servicio.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-50">
            {servicio.tags.slice(0, 4).map(tag => (
              <span key={tag} className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5 text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Restaurantes() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('comer');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [ordenar, setOrdenar] = useState('valoracion');
  const [userPos, setUserPos] = useState(null);
  const [geoError, setGeoError] = useState(false);
  const { data: restaurantes, loading } = useRestaurantes();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGeoError(true),
        { timeout: 8000 }
      );
    }
  }, []);

  const categorias = [
    { key: 'comer', label: '🍴 Restaurantes & Bares' },
    { key: 'dulces', label: '🍦 Heladerías & Cafés' },
    { key: 'servicios', label: '🏪 Servicios' },
  ];

  const tiposPorCategoria = {
    comer: ['todos', 'chiringuito', 'restaurante', 'bar', 'comida-llevar'],
    dulces: ['todos', 'heladeria', 'cafeteria'],
    servicios: ['todos', ...TIPOS_SERVICIOS],
  };

  const tipos = tiposPorCategoria[filtroCategoria];

  const tiposPermitidos = filtroCategoria === 'comer'
    ? ['chiringuito', 'restaurante', 'bar', 'comida-llevar']
    : filtroCategoria === 'dulces'
    ? ['heladeria', 'cafeteria']
    : TIPOS_SERVICIOS;

  const handleCategoriaChange = (key) => {
    setFiltroCategoria(key);
    setFiltroTipo('todos');
    setFiltroEspecialidad('todas');
  };

  const especialidades = [
    { key: 'todas', label: 'Cualquier cocina' },
    { key: 'mariscos', label: '🦞 Mariscos', tags: ['marisco', 'mariscos', 'pulpo', 'pescado', 'pescados'] },
    { key: 'arroces', label: '🍚 Arroces', tags: ['paellas', 'arroces', 'arroz', 'paella'] },
    { key: 'carnes', label: '🥩 Carnes', tags: ['carnes', 'carne', 'parrilla', 'parrillada', 'brasa', 'solomillo'] },
    { key: 'tapas', label: '🫒 Tapas', tags: ['tapas', 'pinchos', 'raciones', 'montaditos'] },
    { key: 'italiana', label: '🍕 Italiana', tags: ['pizza', 'pasta', 'italiano', 'italiana'] },
    { key: 'desayunos', label: '☕ Desayunos', tags: ['desayunos', 'bollería', 'café', 'coffee'] },
    { key: 'helados', label: '🍦 Helados', tags: ['helados', 'helados artesanos', 'granizados'] },
  ];

  const restaurantesProcesados = restaurantes
    .map(r => ({
      ...r,
      distancia: userPos ? distanciaKm(userPos.lat, userPos.lng, r.lat, r.lng) : null
    }))
    .filter(r => {
      const matchBusqueda =
        r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(busqueda.toLowerCase()));
      const matchCategoria = !tiposPermitidos || tiposPermitidos.includes(r.tipo);
      const matchTipo = filtroTipo === 'todos' || r.tipo === filtroTipo;
      const especialidadActiva = especialidades.find(e => e.key === filtroEspecialidad);
      const matchEspecialidad = filtroEspecialidad === 'todas' ||
        (especialidadActiva?.tags || []).some(t =>
          r.tags.some(rt => rt.toLowerCase().includes(t.toLowerCase()))
        );
      const matchEstado =
        filtroEstado === 'todos' ||
        (filtroEstado === 'abierto' && r.abierto) ||
        (filtroEstado === 'cerrado' && !r.abierto);
      return matchBusqueda && matchCategoria && matchTipo && matchEspecialidad && matchEstado;
    })
    .sort((a, b) => {
      if (ordenar === 'valoracion') return b.valoracion - a.valoracion;
      if (ordenar === 'distancia' && a.distancia !== null) return a.distancia - b.distancia;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#fffbf7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-700 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white font-display mb-2">Restaurantes</h1>
            <p className="text-orange-100">Chiringuitos, bares y restaurantes de Los Terreros</p>
          </motion.div>

          {/* Geolocalización info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center gap-2 text-orange-200 text-sm"
          >
            <Navigation className="w-4 h-4" />
            {userPos
              ? '📍 Ordenando por distancia a tu posición'
              : geoError
              ? 'No se pudo obtener tu posición'
              : 'Activando geolocalización...'}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="sticky top-16 z-10 bg-[#fffbf7]/95 backdrop-blur-sm pb-4 -mx-4 px-4 flex flex-col gap-2.5 mb-4">
          {/* Categoría principal */}
          <div className="scroll-x flex gap-2 pt-1">
            {categorias.map(cat => (
              <button
                key={cat.key}
                onClick={() => handleCategoriaChange(cat.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  filtroCategoria === cat.key
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar restaurante, tipo de comida..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {busqueda && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {restaurantesProcesados.length}
              </span>
            )}
          </div>

          <div className="scroll-x flex gap-2">
            {tipos.map(tipo => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  filtroTipo === tipo
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {tipo === 'todos' ? 'Todos' : getTipoLabel(tipo)}
              </button>
            ))}
          </div>

          {filtroCategoria === 'comer' && (
            <div className="scroll-x flex gap-2">
              {especialidades.map(esp => (
                <button
                  key={esp.key}
                  onClick={() => setFiltroEspecialidad(esp.key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    filtroEspecialidad === esp.key
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                >
                  {esp.label}
                </button>
              ))}
            </div>
          )}

          {filtroCategoria !== 'servicios' && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltroEstado('todos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${filtroEstado === 'todos' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltroEstado('abierto')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${filtroEstado === 'abierto' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                  ● Abiertos
                </button>
              </div>
              <select
                value={ordenar}
                onChange={e => setOrdenar(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="valoracion">Mejor valoración</option>
                {userPos && <option value="distancia">Más cercano</option>}
              </select>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-4">{restaurantesProcesados.length} resultados</p>

        {loading ? (
          <div className={filtroCategoria === 'servicios' ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}>
            {[1,2,3,4,5,6].map(n => <SkeletonRestauranteCard key={n} />)}
          </div>
        ) : restaurantesProcesados.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">{filtroCategoria === 'servicios' ? '🏪' : '🍽️'}</p>
            <p>No se encontraron resultados</p>
          </div>
        ) : filtroCategoria === 'servicios' ? (
          <div className="flex flex-col gap-3">
            {restaurantesProcesados.map((r, i) => (
              <ServicioCard key={r.id} servicio={r} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurantesProcesados.map((r, i) => (
              <RestauranteCard key={r.id} restaurante={r} distancia={r.distancia} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

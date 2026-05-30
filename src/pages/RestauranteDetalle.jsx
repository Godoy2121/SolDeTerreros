import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Star, Clock, Phone, MapPin, ExternalLink,
  ChevronDown, ChevronUp, Navigation
} from 'lucide-react';
import { getTipoLabel, getTipoColor } from '../data/restaurantes';
import { useRestaurantes } from '../hooks/useRestaurantes';

function PlatoRow({ plato }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-start justify-between gap-3 py-3 border-b border-gray-50 last:border-0 ${
        plato.popular ? 'relative' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 text-sm">{plato.nombre}</span>
          {plato.popular && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
              ⭐ Estrella
            </span>
          )}
        </div>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{plato.descripcion}</p>
      </div>
      {plato.precio > 0 && (
        <span className="font-bold text-gray-900 text-sm flex-shrink-0">
          {plato.precio.toFixed(2)}€
        </span>
      )}
    </motion.div>
  );
}

function CategoriaSection({ categoria, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoria.icono}</span>
          <span className="font-bold text-gray-900">{categoria.nombre}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {categoria.platos.length}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {categoria.platos.map(plato => (
                <PlatoRow key={plato.nombre} plato={plato} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RestauranteDetalle() {
  const { id } = useParams();
  const { data: restaurantes, loading } = useRestaurantes();
  const restaurante = restaurantes.find(r => r.id === id);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="skeleton h-64 sm:h-80 w-full" />
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!restaurante) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-4xl">🍽️</p>
        <p className="text-gray-500">Restaurante no encontrado</p>
        <Link to="/restaurantes" className="text-orange-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurante.lat},${restaurante.lng}`;
  const telUrl = restaurante.telefono ? `tel:${restaurante.telefono.replace(/\s/g, '')}` : null;

  return (
    <div className="min-h-screen bg-[#fffbf7]">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={restaurante.foto}
          alt={restaurante.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute top-20 left-4">
          <Link
            to="/restaurantes"
            className="glass inline-flex items-center gap-2 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Restaurantes
          </Link>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2 ${getTipoColor(restaurante.tipo)}`}>
              {getTipoLabel(restaurante.tipo)}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display text-shadow">
              {restaurante.nombre}
            </h1>
          </div>
          <div className="glass rounded-2xl px-4 py-2 text-white text-center flex-shrink-0">
            <p className="text-xl font-bold">⭐ {restaurante.valoracion}</p>
            <p className="text-xs opacity-70">{restaurante.numReseñas} reseñas</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Info básica */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 mb-6"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${restaurante.abierto ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className={`font-medium ${restaurante.abierto ? 'text-green-700' : 'text-gray-500'}`}>
                {restaurante.abierto ? 'Abierto ahora' : 'Cerrado ahora'}
              </span>
            </div>
            <span className="text-sm text-gray-500">{restaurante.horario}</span>
          </div>
          <div className="flex items-center gap-3 p-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{restaurante.direccion}</span>
          </div>
          {telUrl && (
            <div className="flex items-center gap-3 p-4">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={telUrl} className="text-sm text-orange-600 font-medium hover:underline">
                {restaurante.telefono}
              </a>
            </div>
          )}
          {restaurante.web && (
            <div className="flex items-center gap-3 p-4">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <a href={restaurante.web} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 font-medium hover:underline truncate">
                {restaurante.web.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}
        </motion.div>

        <p className="text-gray-600 mb-6 leading-relaxed">{restaurante.descripcion}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {restaurante.tags.map(tag => (
            <span key={tag} className="bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-1 text-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Carta */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-gray-900 font-display">Carta</h2>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          {restaurante.carta.categorias.map((cat, i) => (
            <CategoriaSection key={cat.nombre} categoria={cat} index={i} />
          ))}
          <p className="text-xs text-gray-400 mt-3 text-center">
            Los precios pueden variar. Consultar disponibilidad según temporada.
          </p>
        </div>

        {/* Botones de acción */}
        <div className={`grid gap-3 ${telUrl ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {telUrl && (
            <a
              href={telUrl}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-2xl transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Llamar
            </a>
          )}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
          >
            <Navigation className="w-4 h-4" />
            Cómo llegar
          </a>
        </div>
      </div>
    </div>
  );
}

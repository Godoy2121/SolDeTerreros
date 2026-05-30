import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin, Tag, Ticket } from 'lucide-react';
import { eventos, getTipoEventoColor, formatFecha } from '../data/eventos';

const categorias = ['Todos', 'Tradición', 'Feria', 'Mercado', 'Naturaleza', 'Deporte', 'Música'];

function EventoCard({ evento, index }) {
  const tipoColor = getTipoEventoColor(evento.tipo);
  const fechaObj = new Date(evento.fecha + 'T00:00:00');
  const mes = fechaObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
  const dia = fechaObj.getDate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border card-hover ${
        evento.destacado ? 'border-orange-200 ring-1 ring-orange-200' : 'border-gray-100'
      }`}
    >
      <div className="flex">
        {/* Fecha lateral */}
        <div className={`flex flex-col items-center justify-center px-4 py-4 min-w-[72px] ${
          evento.destacado ? 'bg-orange-500' : 'bg-gray-800'
        }`}>
          <span className="text-white/70 text-xs font-semibold tracking-wider">{mes}</span>
          <span className="text-white text-3xl font-bold leading-none">{dia}</span>
        </div>

        {/* Imagen */}
        <div className="w-28 h-auto flex-shrink-0 overflow-hidden hidden sm:block">
          <img src={evento.foto} alt={evento.nombre} className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Contenido */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {evento.destacado && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">Destacado</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoColor}`}>
              {evento.categoria}
            </span>
            {evento.gratis ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Gratis</span>
            ) : (
              <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Ticket className="w-3 h-3" /> {evento.precio}€
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base leading-snug">{evento.nombre}</h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-2">{evento.descripcion}</p>

          <div className="flex flex-col gap-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {evento.frecuencia || evento.hora}
              {evento.fechaFin && ` — ${new Date(evento.fechaFin + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {evento.lugar}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Eventos() {
  const [categoria, setCategoria] = useState('Todos');
  const [mostrarPasados, setMostrarPasados] = useState(false);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const eventosFiltrados = eventos
    .filter(e => {
      const fecha = new Date(e.fecha + 'T00:00:00');
      const esPasado = fecha < hoy;
      if (!mostrarPasados && esPasado) return false;
      if (categoria !== 'Todos' && e.categoria !== categoria) return false;
      return true;
    })
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const proximos = eventosFiltrados.filter(e => new Date(e.fecha + 'T00:00:00') >= hoy);
  const pasados = eventosFiltrados.filter(e => new Date(e.fecha + 'T00:00:00') < hoy);

  return (
    <div className="min-h-screen bg-[#fffbf7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 to-violet-700 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white font-display mb-2">Eventos</h1>
            <p className="text-violet-200">Fiestas, conciertos y tradiciones de Los Terreros</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filtros de categoría */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                categoria === cat
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Próximos */}
        {proximos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="w-5 h-5 text-violet-600" />
              <h2 className="text-lg font-bold text-gray-900">Próximos eventos</h2>
              <span className="text-sm text-gray-400">{proximos.length} eventos</span>
            </div>
            <div className="flex flex-col gap-3">
              {proximos.map((evento, i) => (
                <EventoCard key={evento.id} evento={evento} index={i} />
              ))}
            </div>
          </div>
        )}

        {proximos.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🎉</p>
            <p>No hay eventos próximos en esta categoría</p>
          </div>
        )}

        {/* Botón ver pasados */}
        <button
          onClick={() => setMostrarPasados(!mostrarPasados)}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
        >
          {mostrarPasados ? '▲ Ocultar eventos pasados' : '▼ Ver eventos pasados'}
        </button>

        {mostrarPasados && pasados.length > 0 && (
          <div className="mt-6 opacity-60">
            <h2 className="text-lg font-bold text-gray-500 mb-4">Eventos pasados</h2>
            <div className="flex flex-col gap-3">
              {pasados.map((evento, i) => (
                <EventoCard key={evento.id} evento={evento} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

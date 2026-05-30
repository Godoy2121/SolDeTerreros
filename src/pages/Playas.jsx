import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Waves, Thermometer, Wind, Users, Search, Info } from 'lucide-react';
import { getBanderaInfo, getOleajeLabel, getOcupacionInfo } from '../data/playas';
import { usePlayas } from '../hooks/usePlayas';
import { SkeletonPlayaCard } from '../components/SkeletonCard';

const instalacionIconos = {
  duchas: { emoji: '🚿', label: 'Duchas' },
  aseos: { emoji: '🚻', label: 'Aseos' },
  parking: { emoji: '🅿️', label: 'Parking' },
  chiringuito: { emoji: '🍹', label: 'Chiringuito' },
  socorrista: { emoji: '🏊', label: 'Socorrista' },
  'acceso-discapacitados': { emoji: '♿', label: 'Acceso PMR' },
  'zona-infantil': { emoji: '👶', label: 'Zona infantil' },
  'zona-pesca': { emoji: '🎣', label: 'Zona pesca' },
  'zona-natural-protegida': { emoji: '🌿', label: 'Zona protegida' },
};

function OcupacionBars({ nivel }) {
  const info = getOcupacionInfo(nivel);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className={`w-2 h-3 rounded-sm ${n <= info.bars ? 'bg-current' : 'bg-gray-200'} ${info.color}`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${info.color}`}>{info.label}</span>
    </div>
  );
}

function PlayaCard({ playa, index }) {
  const bandera = getBanderaInfo(playa.bandera);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        to={`/playas/${playa.id}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group"
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={playa.foto}
            alt={playa.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Bandera + badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${bandera.bg} ${bandera.textColor}`}>
              <span className={`w-2 h-2 rounded-full ${bandera.color}`} />
              {bandera.label}
            </span>
            {playa.banderaAzul && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                🏅 Bandera Azul{playa.calidadQ ? ' · Q' : ''}
              </span>
            )}
            {playa.cruzRoja && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                🔴 Cruz Roja
              </span>
            )}
            {playa.instalaciones?.includes('acceso-discapacitados') && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-700 shadow-sm">
                ♿ Accesible PMR
              </span>
            )}
          </div>

          {/* Temperatura del mar */}
          <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-1.5 text-white text-sm font-medium flex items-center gap-1.5">
            <Thermometer className="w-4 h-4" />
            {playa.temperatura}°C
          </div>

          <div className="absolute bottom-3 right-3 glass rounded-xl px-3 py-1.5 text-white text-xs">
            {playa.longitud}
          </div>
        </div>

        <div className="p-5">
          <h2 className="font-bold text-gray-900 text-lg mb-1">{playa.nombre}</h2>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{playa.descripcion}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sky-600 text-sm">
              <Waves className="w-4 h-4" />
              <span className="font-medium">{getOleajeLabel(playa.oleaje)}</span>
            </div>
            <OcupacionBars nivel={playa.ocupacion} />
          </div>

          {/* Instalaciones */}
          {playa.instalaciones.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
              {playa.instalaciones.slice(0, 5).map(inst => (
                <span key={inst} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1" title={instalacionIconos[inst]?.label}>
                  {instalacionIconos[inst]?.emoji} {instalacionIconos[inst]?.label}
                </span>
              ))}
              {playa.instalaciones.length > 5 && (
                <span className="text-xs text-gray-400 px-2 py-1">+{playa.instalaciones.length - 5} más</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function Playas() {
  const [filtro, setFiltro] = useState('todas');
  const [soloBanderaAzul, setSoloBanderaAzul] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const { data: playas, loading } = usePlayas();

  const playasFiltradas = playas.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchFiltro = filtro === 'todas' || p.categoria === filtro;
    const matchAzul = !soloBanderaAzul || p.banderaAzul;
    return matchBusqueda && matchFiltro && matchAzul;
  });

  return (
    <div className="min-h-screen bg-[#fffbf7]">
      {/* Header */}
      <div className="wave-bg pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white font-display mb-2">Playas</h1>
            <p className="text-white/80">Estado actualizado de todas las playas de Los Terreros</p>
          </motion.div>

          {/* Leyenda banderas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            {[
              { color: 'bg-green-500', label: 'Apta para el baño', desc: 'Sin peligro' },
              { color: 'bg-yellow-400', label: 'Precaución', desc: 'Oleaje o medusa' },
              { color: 'bg-red-500', label: 'Prohibido el baño', desc: 'Peligro' },
            ].map(b => (
              <div key={b.label} className="glass rounded-xl px-3 py-2 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${b.color} flex-shrink-0`} />
                <div>
                  <p className="text-white text-xs font-semibold">{b.label}</p>
                  <p className="text-white/60 text-xs">{b.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="sticky top-16 z-10 bg-[#fffbf7]/95 backdrop-blur-sm pb-4 -mx-4 px-4 flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar playa o cala..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            {busqueda && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {playasFiltradas.length}
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'todas', label: 'Todas' },
              { key: 'playa', label: '🏖️ Playas' },
              { key: 'cala', label: '🌊 Calas' },
              { key: 'paraje', label: '🌋 Parajes' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  filtro === f.key
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                }`}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={() => setSoloBanderaAzul(!soloBanderaAzul)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                soloBanderaAzul
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              🏅 Bandera Azul
            </button>
          </div>
        </div>

        {/* Info de actualización */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
          <Info className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <p>El estado de las playas se actualiza diariamente. Consulta siempre la señalización en la propia playa antes de bañarte.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5].map(n => <SkeletonPlayaCard key={n} />)}
          </div>
        ) : playasFiltradas.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Waves className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No se encontraron playas con ese criterio</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {playasFiltradas.map((playa, i) => (
              <PlayaCard key={playa.id} playa={playa} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

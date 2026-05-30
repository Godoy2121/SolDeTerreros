import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Thermometer, Waves, Users, Clock, Car, AlertTriangle, CheckCircle, MapPin, ExternalLink } from 'lucide-react';
import { getBanderaInfo, getOleajeLabel, getOcupacionInfo } from '../data/playas';
import { usePlayas } from '../hooks/usePlayas';

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

function StatCard({ icon: Icon, label, value, color = 'text-gray-900' }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
      <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
      <p className={`font-bold text-lg ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function PlayaDetalle() {
  const { id } = useParams();
  const { data: playas, loading } = usePlayas();
  const playa = playas.find(p => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="skeleton h-72 sm:h-96 w-full" />
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!playa) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Waves className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500">Playa no encontrada</p>
        <Link to="/playas" className="text-orange-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Volver a playas
        </Link>
      </div>
    );
  }

  const bandera = getBanderaInfo(playa.bandera);
  const ocupacion = getOcupacionInfo(playa.ocupacion);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${playa.lat},${playa.lng}`;

  return (
    <div className="min-h-screen bg-[#fffbf7]">
      {/* Hero photo */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={playa.foto}
          alt={playa.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-4">
          <Link
            to="/playas"
            className="glass inline-flex items-center gap-2 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Playas
          </Link>
        </div>

        {/* Bandera */}
        <div className="absolute bottom-4 left-4">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow-lg ${bandera.bg} ${bandera.textColor}`}>
            <span className={`w-3 h-3 rounded-full ${bandera.color}`} />
            Bandera {playa.bandera.charAt(0).toUpperCase() + playa.bandera.slice(1)}: {bandera.label}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Título y descripción */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">{playa.nombre}</h1>

          {/* Badges de calidad */}
          {(playa.banderaAzul || playa.calidadQ || playa.cruzRoja || playa.instalaciones?.includes('acceso-discapacitados')) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {playa.banderaAzul && (
                <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  🏅 Bandera Azul
                </span>
              )}
              {playa.calidadQ && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
                  ✅ Q de Calidad
                </span>
              )}
              {playa.cruzRoja && (
                <span className="inline-flex items-center gap-1 bg-white border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  ⛑️ Puesto Cruz Roja
                </span>
              )}
              {playa.instalaciones?.includes('acceso-discapacitados') && (
                <span className="inline-flex items-center gap-1 bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  ♿ Accesible PMR
                </span>
              )}
            </div>
          )}

          <p className="text-gray-600 leading-relaxed">{playa.descripcionLarga}</p>
        </motion.div>

        {/* Secciones de calidad */}
        {(playa.banderaAzul || playa.calidadQ || playa.cruzRoja) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 flex flex-col gap-2"
          >
            {playa.banderaAzul && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">🏅</span>
                <div>
                  <p className="font-bold text-blue-900 text-sm">Bandera Azul {playa.calidadQ ? '· Q de Calidad' : ''}</p>
                  <p className="text-blue-700 text-xs mt-0.5 leading-relaxed">
                    Galardón internacional de la FEE que certifica la excelente calidad del agua, la seguridad, los servicios y la gestión medioambiental. Pulpí es uno de los municipios almerienses con más distinciones de este tipo.
                    {playa.calidadQ && ' También cuenta con el sello Q de Calidad Turística.'}
                  </p>
                </div>
              </div>
            )}
            {playa.cruzRoja && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">⛑️</span>
                <div>
                  <p className="font-bold text-rose-800 text-sm">Puesto Cruz Roja</p>
                  <p className="text-rose-700 text-xs mt-0.5 leading-relaxed">
                    Puesto de Cruz Roja activo en temporada de verano. Ofrece primeros auxilios, silla anfibia para personas con movilidad reducida y atención a bañistas.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mt-6"
        >
          <StatCard
            icon={Thermometer}
            label="Temp. del mar"
            value={`${playa.temperatura}°C`}
            color="text-orange-600"
          />
          <StatCard
            icon={Waves}
            label="Oleaje"
            value={getOleajeLabel(playa.oleaje)}
            color="text-sky-600"
          />
          <StatCard
            icon={Users}
            label="Afluencia"
            value={ocupacion.label}
            color={ocupacion.color}
          />
        </motion.div>

        {/* Alerta de bandera */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`mt-4 rounded-2xl p-4 flex items-start gap-3 ${bandera.bg}`}
        >
          {playa.bandera === 'verde' ? (
            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${bandera.textColor}`} />
          ) : (
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${bandera.textColor}`} />
          )}
          <div>
            <p className={`font-semibold ${bandera.textColor}`}>{bandera.label}</p>
            <p className={`text-sm mt-0.5 ${bandera.textColor} opacity-80`}>
              {playa.bandera === 'verde' && 'Las condiciones son seguras para el baño. Respeta siempre las normas de la playa.'}
              {playa.bandera === 'amarilla' && 'Hay que tener precaución al bañarse. Puede haber oleaje moderado o presencia de medusas.'}
              {playa.bandera === 'roja' && 'El baño está prohibido por las autoridades. No entres al agua.'}
            </p>
          </div>
        </motion.div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100"
        >
          <div className="flex items-center gap-3 p-4">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Horario socorrista</p>
              <p className="font-medium text-gray-900 text-sm">{playa.horarioSocorrista}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Aparcamiento</p>
              <p className="font-medium text-gray-900 text-sm">{playa.aparcamiento}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Waves className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Longitud de la playa</p>
              <p className="font-medium text-gray-900 text-sm">{playa.longitud}</p>
            </div>
          </div>
        </motion.div>

        {/* Instalaciones */}
        {playa.instalaciones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6"
          >
            <h2 className="font-bold text-gray-900 mb-3">Instalaciones y servicios</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {playa.instalaciones.map(inst => (
                <div key={inst} className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
                  <span className="text-lg">{instalacionIconos[inst]?.emoji}</span>
                  <span className="text-sm text-gray-700">{instalacionIconos[inst]?.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actividades */}
        {playa.actividades?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <h2 className="font-bold text-gray-900 mb-3">Actividades disponibles</h2>
            <div className="flex flex-wrap gap-2">
              {playa.actividades.map(act => (
                <span key={act} className="bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-3 py-1.5 text-sm font-medium">
                  {act}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Cómo llegar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          <h2 className="font-bold text-gray-900 mb-3">Cómo llegar</h2>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white px-5 py-4 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="font-semibold">Abrir en Google Maps</p>
                <p className="text-orange-200 text-xs">Obtener indicaciones</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 opacity-70" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

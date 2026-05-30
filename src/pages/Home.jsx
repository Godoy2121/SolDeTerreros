import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Waves, Thermometer, Wind, Eye, ChevronRight, Sun,
  UtensilsCrossed, CalendarDays, Map, ArrowRight,
  CloudSun, Droplets, AlertTriangle, Compass, Phone
} from 'lucide-react';
import { playas, getBanderaInfo } from '../data/playas';
import { restaurantes } from '../data/restaurantes';
import { eventos, formatFecha, getEventosProximos } from '../data/eventos';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=37.3601&longitude=-1.6648&current_weather=true&hourly=relative_humidity_2m,wind_speed_10m&timezone=Europe%2FMadrid&forecast_days=1'
    )
      .then(r => r.json())
      .then(data => {
        setWeather(data.current_weather);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getWeatherIcon = (code) => {
    if (code <= 1) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    return '⛈️';
  };

  const getWeatherLabel = (code) => {
    if (code <= 0) return 'Despejado';
    if (code <= 1) return 'Principalmente despejado';
    if (code <= 2) return 'Parcialmente nublado';
    if (code <= 3) return 'Nublado';
    if (code <= 45) return 'Brumoso';
    if (code <= 67) return 'Lluvia ligera';
    return 'Tormenta';
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-white/30 rounded w-24 mb-2" />
        <div className="h-8 bg-white/30 rounded w-16" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl p-4 text-white"
    >
      <div className="flex items-center gap-2 mb-1">
        <CloudSun className="w-4 h-4 opacity-80" />
        <span className="text-xs opacity-80 uppercase tracking-wide">Ahora mismo</span>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-4xl">{getWeatherIcon(weather.weathercode)}</span>
        <div>
          <p className="text-3xl font-bold">{Math.round(weather.temperature)}°C</p>
          <p className="text-xs opacity-80">{getWeatherLabel(weather.weathercode)}</p>
        </div>
      </div>
      <div className="flex gap-3 mt-3 pt-3 border-t border-white/20">
        <div className="flex items-center gap-1 text-xs opacity-80">
          <Wind className="w-3 h-3" />
          {Math.round(weather.windspeed)} km/h
        </div>
      </div>
    </motion.div>
  );
}

function BanderaChip({ bandera }) {
  const info = getBanderaInfo(bandera);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${info.bg} ${info.textColor}`}>
      <span className={`w-2 h-2 rounded-full ${info.color}`} />
      {info.label}
    </span>
  );
}

const secciones = [
  {
    to: '/playas',
    icon: Waves,
    titulo: 'Playas',
    descripcion: 'Estado, bandera, temperatura y oleaje en tiempo real',
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    to: '/restaurantes',
    icon: UtensilsCrossed,
    titulo: 'Restaurantes',
    descripcion: 'Chiringuitos, bares, heladerías y cafeterías',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    to: '/eventos',
    icon: CalendarDays,
    titulo: 'Eventos',
    descripcion: 'Fiestas, conciertos y mercadillos del pueblo',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    to: '/mapa',
    icon: Map,
    titulo: 'Mapa',
    descripcion: 'Encuentra todo lo que te rodea en el mapa',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    to: '/descubrir',
    icon: Compass,
    titulo: 'Descubrir',
    descripcion: 'Islas, castillo, buceo y actividades para todos',
    bg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
  {
    to: '/info',
    icon: Phone,
    titulo: 'Info útil',
    descripcion: 'Emergencias, taxis, autobús y servicios locales',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
];

export default function Home() {
  const playasDestacadas = playas.filter(p => p.categoria === 'playa').slice(0, 3);
  const restaurantesDestacados = restaurantes
    .filter(r => !['heladeria', 'cafeteria'].includes(r.tipo))
    .sort((a, b) => b.valoracion - a.valoracion)
    .slice(0, 3);
  const eventosProximos = getEventosProximos().slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-end pb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/pichirichi.jpg')" }}
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 to-slate-900/70" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <span className="inline-block text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">
                ☀️ Verano 2026
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-shadow leading-tight font-display mb-4">
                San Juan<br />de Los<br />
                <span className="text-orange-400">Terreros</span>
              </h1>
              <p className="text-white/80 text-lg max-w-md">
                Tu guía de verano. Playas, chiringuitos, eventos y mucho más del Mediterráneo almeriense.
              </p>
              <div className="flex gap-3 mt-6">
                <Link
                  to="/playas"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all hover:scale-105"
                >
                  <Waves className="w-4 h-4" />
                  Ver playas
                </Link>
                <Link
                  to="/mapa"
                  className="inline-flex items-center gap-2 glass text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/25 transition-all"
                >
                  <Map className="w-4 h-4" />
                  Mapa
                </Link>
              </div>
            </motion.div>

            <div className="flex flex-col gap-3 lg:min-w-[220px]">
              <WeatherWidget />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-4 text-white"
              >
                <p className="text-xs opacity-70 mb-2 uppercase tracking-wide">Mar hoy</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌊</span>
                  <div className="text-right">
                    <p className="font-bold text-lg">24°C</p>
                    <p className="text-xs opacity-70">Oleaje tranquilo</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 36.7C1200 33.3 1320 26.7 1380 23.3L1440 20V80H0Z" fill="#fffbf7" />
          </svg>
        </div>
      </section>

      {/* Quick sections */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {secciones.map(({ to, icon: Icon, titulo, descripcion, bg, iconColor }) => (
            <Link
              key={to}
              to={to}
              className={`${bg} rounded-2xl p-5 card-hover group border border-white`}
            >
              <div className={`w-10 h-10 rounded-xl ${bg} ${iconColor} border border-current/20 flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{titulo}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{descripcion}</p>
              <ArrowRight className={`w-4 h-4 ${iconColor} mt-3 group-hover:translate-x-1 transition-transform`} />
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Playas destacadas */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">Estado de las playas</h2>
            <p className="text-gray-500 text-sm mt-0.5">Actualizado hoy</p>
          </div>
          <Link to="/playas" className="flex items-center gap-1 text-orange-600 text-sm font-semibold hover:text-orange-700">
            Ver todas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playasDestacadas.map((playa, i) => (
            <motion.div
              key={playa.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/playas/${playa.id}`} className="block card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={playa.foto}
                    alt={playa.nombre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <BanderaChip bandera={playa.bandera} />
                  </div>
                  <div className="absolute bottom-3 right-3 glass rounded-xl px-2.5 py-1 text-white text-xs font-medium flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {playa.temperatura}°C mar
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{playa.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{playa.descripcion}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">📍 {playa.longitud}</span>
                    <span className="text-xs text-sky-600 font-medium">Oleaje {playa.oleaje}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Restaurantes destacados */}
      <section className="bg-orange-50/50 py-12 mt-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-display">Mejor valorados</h2>
              <p className="text-gray-500 text-sm mt-0.5">Chiringuitos y restaurantes</p>
            </div>
            <Link to="/restaurantes" className="flex items-center gap-1 text-orange-600 text-sm font-semibold hover:text-orange-700">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurantesDestacados.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/restaurantes/${r.id}`} className="block card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-100">
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={r.foto}
                      alt={r.nombre}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 glass-dark rounded-xl px-2.5 py-1 text-white text-xs font-bold">
                      ⭐ {r.valoracion}
                    </div>
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${
                      r.abierto ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {r.abierto ? 'Abierto' : 'Cerrado'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{r.nombre}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{r.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-2">🕐 {r.horario}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Próximos eventos */}
      {eventosProximos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-display">Próximos eventos</h2>
              <p className="text-gray-500 text-sm mt-0.5">No te pierdas nada</p>
            </div>
            <Link to="/eventos" className="flex items-center gap-1 text-orange-600 text-sm font-semibold hover:text-orange-700">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventosProximos.map((evento, i) => (
              <motion.div
                key={evento.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex"
              >
                <div className="w-24 h-auto flex-shrink-0 relative overflow-hidden">
                  <img src={evento.foto} alt={evento.nombre} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {evento.gratis
                        ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Gratis</span>
                        : <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">{evento.precio}€</span>
                      }
                      <span className="text-xs text-gray-400">{evento.categoria}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{evento.nombre}</h3>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{evento.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-orange-600 font-medium">📅 {formatFecha(evento.fecha)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Banner inferior */}
      <section className="wave-bg py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-white"
        >
          <p className="text-5xl mb-4">🌊</p>
          <h2 className="text-3xl font-bold font-display mb-3">El Mediterráneo te espera</h2>
          <p className="text-white/80 mb-6">
            Aguas cristalinas, arena dorada y el mejor ambiente de la costa almeriense. Verano en San Juan de Los Terreros.
          </p>
          <Link
            to="/playas"
            className="inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-6 py-3 rounded-2xl hover:bg-sky-50 transition-colors"
          >
            <Waves className="w-4 h-4" />
            Explorar playas
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

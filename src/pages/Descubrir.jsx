import { motion } from 'framer-motion';
import { Anchor, Mountain, Fish, Users, ExternalLink, Phone, Star } from 'lucide-react';

const lugares = [
  {
    id: "isla-terreros",
    nombre: "Isla de Terreros",
    emoji: "🏝️",
    tipo: "Monumento Natural",
    descripcion: "Islote volcánico a 700 m de la playa. Con 11.150 m² y 30 m de altura, es el punto de buceo más emblemático de la zona. Corales, peces de roca y una visibilidad excepcional hacen de cada inmersión una experiencia única.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/0/03/Terreros_1.jpg",
    datos: ["11.150 m² de superficie", "30 m de altura", "700 m desde la orilla", "Monumento Natural desde 2001"],
    badge: "Monumento Natural",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "isla-negra",
    nombre: "Isla Negra",
    emoji: "🖤",
    tipo: "Monumento Natural",
    descripcion: "La compañera de la Isla de Terreros, con un color oscuro inconfundible. Formada por andesitas, hornblendas y magnetitas volcánicas que le dan esa tonalidad negra única. Junto con la Isla de Terreros forman el Monumento Natural protegido desde 2001.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Terreros.jpg",
    datos: ["6.015 m² de superficie", "Roca volcánica oscura", "Origen: placa tectónica del levante", "Declarada en 2001"],
    badge: "Monumento Natural",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "castillo",
    nombre: "Castillo de Los Terreros",
    emoji: "🏰",
    tipo: "Patrimonio histórico",
    descripcion: "Construido en 1764 por orden de Carlos III como defensa costera contra piratas y corsarios berberiscos. Desde su promontorio se divisa gran parte del litoral almeriense y murciano en días claros. Acceso libre y gratuito, con las mejores vistas del pueblo.",
    foto: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
    datos: ["Construido en 1764", "Época de Carlos III", "Defensa anti-piratas", "Mirador de acceso libre"],
    badge: "Patrimonio siglo XVIII",
    badgeColor: "bg-amber-100 text-amber-700",
  },
];

const actividades = [
  {
    id: "buceo",
    titulo: "Submarinismo",
    emoji: "🤿",
    descripcion: "San Juan de los Terreros tiene 15 puntos de inmersión únicos, incluyendo las islas volcánicas y praderas de posidonia. Ideal para todos los niveles.",
    proveedor: "Buceo Isla Negra",
    telefono: "950 462 010",
    web: "https://buceoislanegra.com",
    direccion: "C/ Puerta del Litoral Andaluz, 60",
    servicios: ["Bautismo de buceo", "Cursos PADI", "Buceo técnico", "Fotografía submarina", "Biología marina"],
    color: "bg-sky-50 border-sky-100",
    iconColor: "text-sky-600",
    iconBg: "bg-sky-100",
  },
  {
    id: "nautica",
    titulo: "Kayak y Paddle Surf",
    emoji: "🚣",
    descripcion: "Explora la costa volcánica a tu ritmo. Rutas por las calas con vistas a las islas. Alquiler disponible en temporada junto a la playa.",
    proveedor: null,
    color: "bg-orange-50 border-orange-100",
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
    servicios: ["Rutas guiadas por las calas", "Acceso a la Isla de Terreros", "Kayak individual y doble", "Paddle surf"],
  },
  {
    id: "vela",
    titulo: "Vela y Windsurf",
    emoji: "⛵",
    descripcion: "Las condiciones de viento del levante almeriense hacen de esta costa un lugar ideal para la vela y el windsurf, especialmente en tardes de verano.",
    proveedor: null,
    color: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
    servicios: ["Canal náutico", "Viento de levante predecible", "Clases disponibles en verano"],
  },
];

const paraNinos = [
  {
    titulo: "Campamento Náutico",
    descripcion: "Campamento de verano en San Juan de los Terreros con actividades náuticas: kayak, buceo, vela, voleibol, tenis de playa y paddling. Inmersión completa en el ambiente marinero de Los Terreros.",
    web: "https://summercampinspain.com/campamento-nautico-en-terreros/",
    tags: ["Kayak", "Buceo", "Vela", "Voleibol playa", "Tenis playa"],
    emoji: "⛵",
  },
  {
    titulo: "Expláyate Pulpí",
    descripcion: "Programa municipal gratuito de actividades deportivas y de ocio durante julio y agosto, organizado por el Ayuntamiento de Pulpí. Para niños y adultos de todas las edades.",
    web: "https://explayatepulpi.es",
    tags: ["Gratuito", "Julio y agosto", "Deportes", "Ocio", "Para todos"],
    emoji: "🎉",
  },
  {
    titulo: "Snorkel en las Calas",
    descripcion: "Práctica ideal para los más pequeños: las aguas cristalinas de El Calipso, La Invencible y otras calas son perfectas para iniciarse en el mundo submarino con una simple máscara y tubo.",
    web: null,
    tags: ["Sin experiencia", "Todas las edades", "El Calipso", "La Invencible"],
    emoji: "🐟",
  },
];

function LugarCard({ lugar, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div className="relative h-52 overflow-hidden">
        <img src={lugar.foto} alt={lugar.nombre} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${lugar.badgeColor}`}>
            {lugar.badge}
          </span>
        </div>
        <div className="absolute bottom-3 left-4">
          <span className="text-3xl">{lugar.emoji}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{lugar.nombre}</h3>
        <p className="text-gray-500 text-sm mb-4">{lugar.descripcion}</p>
        <div className="flex flex-wrap gap-1.5">
          {lugar.datos.map(d => (
            <span key={d} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
              {d}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ActividadCard({ act, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl border p-5 ${act.color}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${act.iconBg} rounded-xl flex items-center justify-center text-xl`}>
          {act.emoji}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{act.titulo}</h3>
          {act.proveedor && <p className="text-xs text-gray-500">{act.proveedor}</p>}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{act.descripcion}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {act.servicios.map(s => (
          <span key={s} className="text-xs bg-white/70 border border-white rounded-lg px-2 py-0.5 text-gray-700">
            {s}
          </span>
        ))}
      </div>
      {(act.telefono || act.web) && (
        <div className="flex gap-2 flex-wrap pt-3 border-t border-white/50">
          {act.telefono && (
            <a href={`tel:${act.telefono.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-sm font-semibold text-sky-700 shadow-sm">
              <Phone className="w-3.5 h-3.5" /> {act.telefono}
            </a>
          )}
          {act.web && (
            <a href={act.web} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-sm font-medium text-gray-600 shadow-sm">
              <ExternalLink className="w-3.5 h-3.5" /> Web
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function Descubrir() {
  return (
    <div className="min-h-screen bg-[#fffbf7]">
      <div className="bg-gradient-to-br from-teal-600 to-sky-700 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white font-display mb-2">Descubrir</h1>
            <p className="text-teal-100">Islas volcánicas, el castillo, buceo y actividades para toda la familia</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* Monumentos naturales */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Mountain className="w-5 h-5 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900 font-display">Monumentos Naturales e Históricos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {lugares.map((l, i) => <LugarCard key={l.id} lugar={l} index={i} />)}
          </div>
        </section>

        {/* Actividades */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Anchor className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900 font-display">Deportes y Actividades</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {actividades.map((a, i) => <ActividadCard key={a.id} act={a} index={i} />)}
          </div>
        </section>

        {/* Para los más pequeños */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-900 font-display">Para los más pequeños</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {paraNinos.map((item, i) => (
              <motion.div
                key={item.titulo}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm"
              >
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.titulo}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.descripcion}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map(t => (
                    <span key={t} className="text-xs bg-pink-50 text-pink-700 border border-pink-100 rounded-lg px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
                {item.web && (
                  <a href={item.web} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-sky-600 font-medium hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" /> Ver más información
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Buceo destacado */}
        <section className="bg-sky-900 rounded-3xl p-8 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">🤿</div>
            <div>
              <h2 className="text-2xl font-bold font-display mb-1">Buceo Isla Negra</h2>
              <p className="text-sky-200 text-sm">Centro de buceo oficial · San Juan de los Terreros</p>
            </div>
          </div>
          <p className="text-sky-100 mb-6">
            El centro de buceo de referencia de Los Terreros. Con 15 puntos de inmersión únicos incluyendo las islas volcánicas,
            fondos de posidonia y paredes verticales. Ofrecen desde bautismos para principiantes hasta cursos de buceo técnico y
            profesional con titulación PADI.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="tel:950462010"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-sky-900 rounded-xl font-bold hover:bg-sky-50 transition-colors">
              <Phone className="w-4 h-4" /> 950 462 010
            </a>
            <a href="https://buceoislanegra.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-700 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors">
              <ExternalLink className="w-4 h-4" /> buceoislanegra.com
            </a>
          </div>
          <p className="text-sky-300 text-xs mt-4">C/ Puerta del Litoral Andaluz, 60 · San Juan de los Terreros</p>
        </section>

      </div>
    </div>
  );
}

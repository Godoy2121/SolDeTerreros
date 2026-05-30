import { motion } from 'framer-motion';
import { Phone, Bus, Plane, Building2, AlertTriangle, Car, ExternalLink, Clock, Bell, BellOff } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const secciones = [
  {
    id: "emergencias",
    titulo: "Emergencias",
    icono: AlertTriangle,
    color: "red",
    bg: "bg-red-50",
    border: "border-red-100",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    contactos: [
      {
        nombre: "Emergencias generales",
        numero: "112",
        descripcion: "Policía · Bomberos · Ambulancia",
        importante: true,
      },
      {
        nombre: "Guardia Civil",
        numero: "062",
        descripcion: "Puesto de Pulpí",
      },
      {
        nombre: "Policía Local Pulpí",
        numero: "950 465 049",
        descripcion: "También disponible: 670 618 181",
      },
      {
        nombre: "Centro Médico Los Terreros",
        numero: "950 466 065",
        descripcion: "Atención primaria en San Juan de los Terreros",
      },
      {
        nombre: "Cruz Roja — Emergencias",
        numero: "900 222 292",
        descripcion: "Asistencia urgente Cruz Roja",
      },
      {
        nombre: "Urgencias médicas (consejo)",
        numero: "061",
        descripcion: "Consejo médico telefónico SAS",
      },
    ],
  },
  {
    id: "ayuntamiento",
    titulo: "Ayuntamiento de Pulpí",
    icono: Building2,
    color: "sky",
    bg: "bg-sky-50",
    border: "border-sky-100",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    contactos: [
      {
        nombre: "Ayuntamiento de Pulpí",
        numero: "950 464 001",
        descripcion: "Calle Limones, 1 · Pulpí",
        horario: "L–V 9:00–14:00",
        web: "https://www.pulpi.es",
      },
    ],
  },
  {
    id: "taxis",
    titulo: "Taxis",
    icono: Car,
    color: "amber",
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    contactos: [
      {
        nombre: "Taxi Pulpí · Terreros",
        numero: "600 042 790",
        descripcion: "Traslados locales y a aeropuertos",
        web: "https://taxipulpiterreros.com",
      },
      {
        nombre: "Taxi Terreros · Mar de Pulpí",
        numero: "",
        descripcion: "Base en San Juan de los Terreros",
        web: "https://www.taxiterreros.com",
      },
    ],
  },
  {
    id: "autobus",
    titulo: "Autobús",
    icono: Bus,
    color: "green",
    bg: "bg-green-50",
    border: "border-green-100",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    contactos: [
      {
        nombre: "Alsa — Línea Almería · Águilas",
        numero: "912 422 242",
        descripcion: "Parada en San Juan de los Terreros · Consulta horarios en la web",
        web: "https://www.alsa.com",
      },
    ],
  },
  {
    id: "aeropuerto",
    titulo: "Aeropuerto de Murcia (MJV)",
    icono: Plane,
    color: "purple",
    bg: "bg-purple-50",
    border: "border-purple-100",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    nota: "A ~60 km de Los Terreros · Aprox. 55 min en taxi · Precio orientativo 60–75 €",
    contactos: [
      {
        nombre: "Aeropuerto Internacional Región de Murcia",
        numero: "902 404 704",
        descripcion: "Información de vuelos y servicios",
        web: "https://www.aena.es/es/internacional-region-de-murcia.html",
      },
      {
        nombre: "Traslado en taxi (puerta a puerta)",
        numero: "600 042 790",
        descripcion: "Taxi Pulpí–Terreros · Reserva con antelación",
        web: "https://taxipulpiterreros.com",
      },
    ],
  },
];

function ContactoCard({ contacto, colorClass }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0`}>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-gray-900 ${contacto.importante ? 'text-base' : 'text-sm'}`}>
          {contacto.nombre}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{contacto.descripcion}</p>
        {contacto.horario && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {contacto.horario}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {contacto.numero && (
          <a
            href={`tel:${contacto.numero.replace(/\s/g, '')}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${
              contacto.importante
                ? 'bg-red-500 text-white hover:bg-red-600'
                : `${colorClass} font-semibold`
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            {contacto.numero}
          </a>
        )}
        {contacto.web && (
          <a
            href={contacto.web}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Ver web
          </a>
        )}
      </div>
    </div>
  );
}

function NotificacionesCard() {
  const { permiso, suscrito, cargando, suscribirse, desuscribirse } = useNotifications();

  const isDenied = permiso === 'denied';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden"
    >
      <div className="bg-orange-50 px-5 py-4 flex items-center gap-3 border-b border-orange-100">
        <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
          <Bell className="w-5 h-5 text-orange-600" />
        </div>
        <h2 className="font-bold text-gray-900">Notificaciones</h2>
      </div>
      <div className="px-5 py-4">
        {isDenied ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Las notificaciones están <strong>bloqueadas</strong> en tu navegador. Para activarlas:
            </p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Pulsa el <strong>🔒 candado</strong> en la barra de dirección</li>
              <li>Busca <strong>Notificaciones</strong> → cámbialo a <strong>Permitir</strong></li>
              <li>Recarga la página y vuelve aquí</li>
            </ol>
          </div>
        ) : suscrito ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">✅ Notificaciones activas</p>
              <p className="text-xs text-gray-500 mt-0.5">Recibirás avisos de eventos, playas y novedades.</p>
            </div>
            <button
              onClick={desuscribirse}
              disabled={cargando}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition-colors"
            >
              {cargando
                ? <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                : <BellOff className="w-3.5 h-3.5" />}
              Desactivar
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Recibe novedades al instante</p>
              <p className="text-xs text-gray-500 mt-0.5">Eventos, playas y actualizaciones de la app.</p>
            </div>
            <button
              onClick={suscribirse}
              disabled={cargando}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors flex-shrink-0"
            >
              {cargando
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Bell className="w-4 h-4" />}
              Activar
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Info() {
  return (
    <div className="min-h-screen bg-[#fffbf7]">
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white font-display mb-2">Información útil</h1>
            <p className="text-sky-100">Teléfonos, taxis y transportes de Los Terreros</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">
        {secciones.map((seccion, i) => {
          const Icon = seccion.icono;
          return (
            <motion.div
              key={seccion.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white rounded-2xl shadow-sm border ${seccion.border} overflow-hidden`}
            >
              <div className={`${seccion.bg} px-5 py-4 flex items-center gap-3 border-b ${seccion.border}`}>
                <div className={`w-9 h-9 ${seccion.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${seccion.iconColor}`} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{seccion.titulo}</h2>
                  {seccion.nota && <p className="text-xs text-gray-500 mt-0.5">{seccion.nota}</p>}
                </div>
              </div>
              <div className="px-5">
                {seccion.contactos.map(c => (
                  <ContactoCard
                    key={c.nombre}
                    contacto={c}
                    colorClass={`bg-${seccion.color}-50 text-${seccion.color}-700 border border-${seccion.color}-200`}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}

        <NotificacionesCard />

        <p className="text-center text-xs text-gray-400 pb-4">
          Información orientativa. Verifica horarios y precios antes de usar los servicios.
        </p>
      </div>
    </div>
  );
}

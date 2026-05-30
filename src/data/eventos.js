export const eventos = [
  {
    id: "verbena-san-juan",
    nombre: "Verbena de San Juan",
    tipo: "fiesta",
    fecha: "2026-06-23",
    hora: "22:00",
    lugar: "Playa de Los Terreros",
    descripcion: "La noche más mágica del año. Hogueras en la playa, petardos, música y la tradición de bañarse a medianoche para purificarse. La gran fiesta del solsticio de verano.",
    foto: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    gratis: true,
    destacado: true,
    categoria: "Tradición",
    organizador: "Ayuntamiento de Pulpí"
  },
  {
    id: "virgen-carmen",
    nombre: "Procesión de la Virgen del Carmen",
    tipo: "fiesta",
    fecha: "2026-07-16",
    hora: "19:30",
    lugar: "Puerto de Los Terreros",
    descripcion: "La patrona de los marineros sale en procesión marinera por las aguas. Las barcas engalanadas acompañan a la Virgen mientras la playa se llena de flores y velas. Una tradición emocionante.",
    foto: "https://images.unsplash.com/photo-1598717123623-994ab270a08e?w=800&q=80",
    gratis: true,
    destacado: true,
    categoria: "Tradición"
  },
  {
    id: "mercadillo-verano",
    nombre: "Mercadillo Artesanal de Verano",
    tipo: "mercado",
    fecha: "2026-06-27",
    fechaFin: "2026-08-29",
    hora: "19:00 - 24:00",
    frecuencia: "Todos los sábados de verano",
    lugar: "Paseo Marítimo",
    descripcion: "Cada sábado el paseo marítimo se llena de artesanos locales con joyería, cerámica, ropa, artículos de decoración y productos gourmet de Almería. Ambiente festivo con música en directo.",
    foto: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
    gratis: true,
    destacado: false,
    categoria: "Mercado"
  },
  {
    id: "feria-agosto",
    nombre: "Feria y Fiestas de Agosto",
    tipo: "fiesta",
    fecha: "2026-08-07",
    fechaFin: "2026-08-12",
    hora: "21:00",
    lugar: "Recinto Ferial",
    descripcion: "Las fiestas más importantes del año. Cinco días de feria con atracciones, casetas de comida y bebida, conciertos nocturnos, verbenas y fuegos artificiales. El pueblo entero se vuelca en la celebración.",
    foto: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80",
    gratis: true,
    destacado: true,
    categoria: "Feria"
  },
  {
    id: "perseidas",
    nombre: "Noche de las Perseidas",
    tipo: "evento",
    fecha: "2026-08-11",
    hora: "23:00",
    lugar: "Playa del Algarrobico",
    descripcion: "Observación de la lluvia de meteoritos con telescopios profesionales. El cielo de Cabo de Gata, sin contaminación lumínica, es uno de los mejores de Europa para ver las estrellas. Guiada por un astrónomo local.",
    foto: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80",
    gratis: false,
    precio: 8,
    destacado: true,
    categoria: "Naturaleza"
  },
  {
    id: "regata-vela",
    nombre: "Regata de Vela Latina",
    tipo: "deporte",
    fecha: "2026-07-19",
    fechaFin: "2026-07-20",
    hora: "10:00",
    lugar: "Bahía de Los Terreros",
    descripcion: "Regata de vela latina con embarcaciones tradicionales. Puedes seguir la regata desde la playa o apuntarte como tripulante con previa solicitud. Un espectáculo visual impresionante en la bahía.",
    foto: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    gratis: true,
    destacado: false,
    categoria: "Deporte"
  },
  {
    id: "concierto-verano",
    nombre: "Concierto de Verano en la Plaza",
    tipo: "concierto",
    fecha: "2026-07-31",
    hora: "22:30",
    lugar: "Plaza de España",
    descripcion: "Concierto de música en directo con artistas locales y regionales. Géneros: flamenco fusión, pop mediterráneo y rumba. Ambiente familiar con barras de bebidas y tapas alrededor de la plaza.",
    foto: "https://images.unsplash.com/photo-1501386761578-eaa54b-c677-3d?w=800&q=80",
    gratis: true,
    destacado: false,
    categoria: "Música"
  },
  {
    id: "torneo-voleibol",
    nombre: "Torneo de Voleibol Playa",
    tipo: "deporte",
    fecha: "2026-08-01",
    fechaFin: "2026-08-02",
    hora: "09:00",
    lugar: "Playa de Los Terreros",
    descripcion: "Torneo abierto de voleibol playa. Apúntate individualmente o en equipo. Categorías: mixto, masculino y femenino. Trofeos para los ganadores y tapas para todos los participantes.",
    foto: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
    gratis: false,
    precio: 5,
    destacado: false,
    categoria: "Deporte"
  }
];

export const getTipoEventoColor = (tipo) => {
  const colors = {
    fiesta: "bg-orange-100 text-orange-700",
    mercado: "bg-emerald-100 text-emerald-700",
    evento: "bg-purple-100 text-purple-700",
    deporte: "bg-sky-100 text-sky-700",
    concierto: "bg-pink-100 text-pink-700"
  };
  return colors[tipo] || "bg-gray-100 text-gray-700";
};

export const formatFecha = (fechaStr) => {
  const fecha = new Date(fechaStr + 'T00:00:00');
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getEventosProximos = () => {
  const hoy = new Date();
  return eventos
    .filter(e => new Date(e.fecha + 'T00:00:00') >= hoy)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
};

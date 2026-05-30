import { NavLink } from 'react-router-dom';
import { Sun, Waves, UtensilsCrossed, CalendarDays, Map, Heart, Camera, Share2, Compass, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg font-display">Sol de Terreros</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tu guía de verano en San Juan de Los Terreros. Playas, restaurantes, eventos y todo lo que necesitas para disfrutar del Mediterráneo.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-orange-500 transition-colors flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-sky-500 transition-colors flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Explorar</h3>
            <ul className="space-y-2">
              {[
                { to: '/playas', icon: Waves, label: 'Estado de playas' },
                { to: '/restaurantes', icon: UtensilsCrossed, label: 'Restaurantes' },
                { to: '/eventos', icon: CalendarDays, label: 'Eventos' },
                { to: '/mapa', icon: Map, label: 'Mapa interactivo' },
                { to: '/descubrir', icon: Compass, label: 'Descubrir' },
                { to: '/info', icon: Phone, label: 'Info útil' },
              ].map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Información</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>📍 San Juan de Los Terreros</li>
              <li>🗺️ Almería, Andalucía</li>
              <li>🌡️ Temperatura media: 28°C</li>
              <li>🌊 Aguas cristalinas todo el verano</li>
              <li>🅿️ Aparcamiento gratuito disponible</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-500 text-xs">
          <p>© 2026 Sol de Terreros. Hecho con <Heart className="w-3 h-3 inline text-orange-500" /> en Almería.</p>
          <p>Datos actualizados diariamente</p>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Waves, UtensilsCrossed, CalendarDays, Map, Sun, Menu, X, Phone, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/', label: 'Inicio', icon: Sun, exact: true },
  { to: '/playas', label: 'Playas', icon: Waves },
  { to: '/restaurantes', label: 'Restaurantes', icon: UtensilsCrossed },
  { to: '/eventos', label: 'Eventos', icon: CalendarDays },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/descubrir', label: 'Descubrir', icon: Compass },
  { to: '/info', label: 'Info útil', icon: Phone },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              transparent ? 'bg-white/20' : 'bg-orange-500'
            }`}>
              <Sun className={`w-5 h-5 ${transparent ? 'text-white' : 'text-white'}`} />
            </div>
            <div>
              <span className={`font-bold text-lg leading-none block font-display transition-colors ${
                transparent ? 'text-white' : 'text-orange-600'
              }`}>
                Sol de Terreros
              </span>
              <span className={`text-xs leading-none transition-colors ${
                transparent ? 'text-white/70' : 'text-gray-400'
              }`}>
                San Juan de Los Terreros
              </span>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? transparent
                        ? 'bg-white/20 text-white'
                        : 'bg-orange-500 text-white'
                      : transparent
                      ? 'text-white/90 hover:bg-white/15 hover:text-white'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              transparent ? 'text-white hover:bg-white/15' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-orange-100 overflow-hidden"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

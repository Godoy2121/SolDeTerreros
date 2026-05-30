import { NavLink, useNavigate } from 'react-router-dom';
import { Waves, UtensilsCrossed, CalendarDays, LayoutDashboard, LogOut, Sun, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/playas', label: 'Playas', icon: Waves },
  { to: '/admin/restaurantes', label: 'Restaurantes', icon: UtensilsCrossed },
  { to: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
];

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">Sol de Terreros</p>
              <p className="text-slate-400 text-xs mt-0.5">Panel Admin</p>
            </div>
          </div>
        </div>

        <nav className="p-3 flex-1">
          <p className="text-slate-500 text-xs uppercase tracking-wider px-3 mb-2">Gestión</p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}

          <div className="mt-6 pt-4 border-t border-slate-700">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver la app
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <p className="text-slate-500 text-xs truncate mb-2">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

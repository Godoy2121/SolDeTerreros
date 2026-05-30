import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InstallBanner from './components/InstallBanner';
import PWAUpdater from './components/PWAUpdater';
import NotificationPrompt from './components/NotificationPrompt';
import Home from './pages/Home';
import Playas from './pages/Playas';
import PlayaDetalle from './pages/PlayaDetalle';
import Restaurantes from './pages/Restaurantes';
import RestauranteDetalle from './pages/RestauranteDetalle';
import Eventos from './pages/Eventos';
import Mapa from './pages/Mapa';
import Info from './pages/Info';
import Descubrir from './pages/Descubrir';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminPlayas from './admin/pages/AdminPlayas';
import AdminRestaurantes from './admin/pages/AdminRestaurantes';
import AdminEventos from './admin/pages/AdminEventos';
import AdminLayout from './admin/components/AdminLayout';
import AdminRoute from './admin/components/AdminRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playas" element={<Playas />} />
          <Route path="/playas/:id" element={<PlayaDetalle />} />
          <Route path="/restaurantes" element={<Restaurantes />} />
          <Route path="/restaurantes/:id" element={<RestauranteDetalle />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/info" element={<Info />} />
          <Route path="/descubrir" element={<Descubrir />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <InstallBanner />
      <PWAUpdater />
      <NotificationPrompt />
    </div>
  );
}

function AdminLayoutWrapper() {
  return (
    <AdminRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/playas" element={<AdminPlayas />} />
          <Route path="/restaurantes" element={<AdminRestaurantes />} />
          <Route path="/eventos" element={<AdminEventos />} />
        </Routes>
      </AdminLayout>
    </AdminRoute>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">🌊</p>
      <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Página no encontrada</h1>
      <p className="text-gray-500 mb-6">Esta página se ha perdido en el mar</p>
      <a href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
        Volver al inicio
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayoutWrapper />} />
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const STORAGE_KEY = 'notif-prompt-dismissed';

export default function NotificationPrompt() {
  const { permiso, suscrito, cargando, suscribirse } = useNotifications();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 8 seconds if permission not yet decided and not dismissed before
    if (permiso !== 'default' || suscrito) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const t = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(t);
  }, [permiso, suscrito]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  const handleSuscribirse = async () => {
    await suscribirse();
    setVisible(false);
  };

  // Don't render if already granted/denied or suscrito
  if (permiso === 'denied' || suscrito) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-4">
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">¿Te avisamos de novedades?</p>
                <p className="text-gray-500 text-xs mt-0.5 mb-3">
                  Recibe notificaciones sobre eventos, playas y actualizaciones de Sol de Terreros.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleSuscribirse}
                    disabled={cargando}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    {cargando ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Bell className="w-3 h-3" />
                    )}
                    Activar
                  </button>
                  <button
                    onClick={dismiss}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
                  >
                    Ahora no
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

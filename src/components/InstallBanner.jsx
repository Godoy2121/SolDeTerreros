import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsStandalone(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isStandalone) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsStandalone(true);
      setDeferredPrompt(null);
    } else {
      toast('Toca Compartir → "Añadir a pantalla de inicio"', { icon: '📲', duration: 4000 });
    }
  };

  return (
    <motion.button
      onClick={handleInstall}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 25 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-4 z-40 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-orange-200 text-orange-600 px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold hover:bg-orange-50 transition-colors"
      title="Instalar aplicación"
    >
      <Download className="w-4 h-4" />
      <span>Instalar app</span>
    </motion.button>
  );
}

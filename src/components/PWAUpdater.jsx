import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAUpdater() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      // Comprueba actualizaciones cada 60 segundos
      if (registration) {
        setInterval(() => registration.update(), 60_000);
      }
    },
  });

  useEffect(() => {
    if (needRefresh) {
      // Aplica la actualización y recarga la página automáticamente
      updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}

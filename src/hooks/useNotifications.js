import { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { messagingPromise, db } from '../firebase';
import toast from 'react-hot-toast';

export function useNotifications() {
  const [permiso, setPermiso] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [suscrito, setSuscrito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const suscribirse = async () => {
    const messaging = await messagingPromise;
    if (!messaging) {
      toast.error('Las notificaciones no están disponibles en este navegador.');
      return;
    }

    setCargando(true);
    try {
      const permission = await Notification.requestPermission();
      setPermiso(permission);
      if (permission !== 'granted') {
        toast.error('Permiso de notificaciones denegado.');
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        await setDoc(doc(db, 'suscriptores', token), {
          token,
          createdAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        });
        setSuscrito(true);
        toast.success('¡Notificaciones activadas! Te avisaremos de todas las novedades.', {
          icon: '🏖️',
          duration: 4000,
        });
      }
    } catch (err) {
      console.error('Error al suscribirse a notificaciones:', err);
      toast.error('No se pudo activar las notificaciones. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let unsubscribe;
    messagingPromise.then(messaging => {
      if (!messaging) return;
      unsubscribe = onMessage(messaging, payload => {
        const { title, body } = payload.notification || {};
        toast(body || 'Hay novedades en Sol de Terreros', {
          icon: '🏖️',
          duration: 6000,
          style: { maxWidth: 360 },
        });
      });
    });
    return () => unsubscribe?.();
  }, []);

  return { permiso, suscrito, cargando, suscribirse };
}

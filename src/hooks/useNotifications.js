import { useState, useEffect } from 'react';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { messagingPromise, db } from '../firebase';
import toast from 'react-hot-toast';

const LS_KEY = 'fcm_token';

export function useNotifications() {
  const [permiso, setPermiso] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [suscrito, setSuscrito] = useState(() => !!localStorage.getItem(LS_KEY));
  const [cargando, setCargando] = useState(false);

  const suscribirse = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      toast.error('Tu navegador no soporta notificaciones push.');
      return;
    }

    setCargando(true);
    try {
      // 1. Pedir permiso PRIMERO (iOS exige que sea la primera llamada async)
      const permission = await Notification.requestPermission();
      setPermiso(permission);
      if (permission !== 'granted') {
        toast.error('Permiso de notificaciones denegado.');
        setCargando(false);
        return;
      }

      const messaging = await messagingPromise;
      if (!messaging) {
        toast.error('FCM no disponible en este navegador.');
        setCargando(false);
        return;
      }

      // 2. Cancelar TODAS las suscripciones push existentes en cualquier SW
      const swRegs = await navigator.serviceWorker.getRegistrations();
      for (const reg of swRegs) {
        const sub = await reg.pushManager.getSubscription().catch(() => null);
        if (sub) await sub.unsubscribe().catch(() => {});
      }

      // 3. Registrar el SW de FCM explícitamente
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;

      // 4. Obtener token FCM (Firebase busca /firebase-messaging-sw.js automáticamente)
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (!token) {
        toast.error('No se pudo obtener el token. Comprueba la conexión.');
        return;
      }

      // 5. Guardar token en Firestore y localStorage
      await setDoc(doc(db, 'suscriptores', token), {
        token,
        createdAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });
      localStorage.setItem(LS_KEY, token);
      setSuscrito(true);
      toast.success('¡Notificaciones activadas!', { icon: '🏖️', duration: 4000 });

    } catch (err) {
      console.error('[FCM] Error al suscribirse:', err);
      // Mostrar error específico para poder diagnosticar
      const msg = err?.message || err?.code || 'Error desconocido';
      toast.error(`Error: ${msg}`, { duration: 6000 });
    } finally {
      setCargando(false);
    }
  };

  const desuscribirse = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem(LS_KEY);
      if (token) {
        await deleteDoc(doc(db, 'suscriptores', token)).catch(() => {});
        const messaging = await messagingPromise;
        if (messaging) await deleteToken(messaging).catch(() => {});
        const swRegs = await navigator.serviceWorker.getRegistrations();
        for (const reg of swRegs) {
          const sub = await reg.pushManager.getSubscription().catch(() => null);
          if (sub) await sub.unsubscribe().catch(() => {});
        }
      }
      localStorage.removeItem(LS_KEY);
      setSuscrito(false);
      toast('Notificaciones desactivadas.', { icon: '🔕' });
    } catch (err) {
      console.error('[FCM] Error al desuscribirse:', err);
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

  return { permiso, suscrito, cargando, suscribirse, desuscribirse };
}

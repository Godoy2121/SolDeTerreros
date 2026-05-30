import { useState, useEffect } from 'react';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { messagingPromise, db } from '../firebase';
import toast from 'react-hot-toast';

const LS_KEY = 'fcm_token';
const FCM_SW = '/firebase-messaging-sw.js';

async function getFcmSwReg() {
  // Registrar siempre el SW de FCM explícitamente para no mezclar con el SW del PWA
  const reg = await navigator.serviceWorker.register(FCM_SW);
  await navigator.serviceWorker.ready;
  return reg;
}

export function useNotifications() {
  const [permiso, setPermiso] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [suscrito, setSuscrito] = useState(() => !!localStorage.getItem(LS_KEY));
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

      // Usar siempre el SW de FCM específico (no el del PWA)
      const fswReg = await getFcmSwReg();

      // Cancelar suscripción push anterior para evitar conflicto de VAPID key
      const subAnterior = await fswReg.pushManager.getSubscription();
      if (subAnterior) await subAnterior.unsubscribe();

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: fswReg,
      });

      if (token) {
        await setDoc(doc(db, 'suscriptores', token), {
          token,
          createdAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        });
        localStorage.setItem(LS_KEY, token);
        setSuscrito(true);
        toast.success('¡Notificaciones activadas!', { icon: '🏖️', duration: 4000 });
      }
    } catch (err) {
      console.error('Error al suscribirse:', err);
      toast.error('No se pudo activar las notificaciones. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const desuscribirse = async () => {
    const messaging = await messagingPromise;
    setCargando(true);
    try {
      const token = localStorage.getItem(LS_KEY);
      if (token) {
        await deleteDoc(doc(db, 'suscriptores', token)).catch(() => {});
        if (messaging) await deleteToken(messaging).catch(() => {});
        const fswReg = await getFcmSwReg();
        const sub = await fswReg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
      }
      localStorage.removeItem(LS_KEY);
      setSuscrito(false);
      toast('Notificaciones desactivadas.', { icon: '🔕' });
    } catch (err) {
      console.error('Error al desuscribirse:', err);
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

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Waves, UtensilsCrossed, CalendarDays, Database, CheckCircle, AlertTriangle, ArrowRight, Bell, Users, Send } from 'lucide-react';
import { collection, writeBatch, doc, addDoc, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase';
import { playas } from '../../data/playas';
import { restaurantes } from '../../data/restaurantes';
import { eventos } from '../../data/eventos';
import { usePlayas } from '../../hooks/usePlayas';
import { useRestaurantes } from '../../hooks/useRestaurantes';
import { useEventos } from '../../hooks/useEventos';
import toast from 'react-hot-toast';

const APP_VERSION = '1.0.1';

async function seedCollection(collectionName, items) {
  const batch = writeBatch(db);
  items.forEach(item => {
    const ref = doc(collection(db, collectionName), item.id);
    batch.set(ref, item);
  });
  await batch.commit();
}

function StatCard({ icon: Icon, label, count, to, color }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-200 transition-colors group"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-gray-500 text-sm">{label}</p>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

function NotificacionPanel() {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [url, setUrl] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [totalSuscriptores, setTotalSuscriptores] = useState(null);

  useEffect(() => {
    getCountFromServer(collection(db, 'suscriptores'))
      .then(snap => setTotalSuscriptores(snap.data().count))
      .catch(() => setTotalSuscriptores(0));
  }, []);

  const handleEnviar = async () => {
    if (!titulo.trim() || !mensaje.trim()) {
      toast.error('El título y el mensaje son obligatorios.');
      return;
    }
    setEnviando(true);
    try {
      await addDoc(collection(db, 'notificaciones'), {
        titulo: titulo.trim(),
        mensaje: mensaje.trim(),
        url: url.trim() || 'https://soldeterreros.web.app',
        creadaAt: new Date().toISOString(),
        enviada: false,
      });
      toast.success('¡Notificación enviada! La Cloud Function la procesará en segundos.', {
        icon: '🚀',
        duration: 5000,
      });
      setTitulo('');
      setMensaje('');
      setUrl('');
      // Refresh subscriber count
      getCountFromServer(collection(db, 'suscriptores'))
        .then(snap => setTotalSuscriptores(snap.data().count))
        .catch(() => {});
    } catch (err) {
      console.error(err);
      toast.error('Error al enviar la notificación. Comprueba la consola.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900">Enviar notificación push</h2>
            {totalSuscriptores !== null && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                <Users className="w-3 h-3" />
                {totalSuscriptores} suscriptor{totalSuscriptores !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Escribe la novedad y se enviará a todos los usuarios suscritos a notificaciones.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                maxLength={60}
                placeholder="ej. Nueva actividad este fin de semana"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mensaje *</label>
              <textarea
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="ej. Este sábado habrá mercadillo artesanal en el paseo marítimo de 10h a 20h."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
              />
              <p className="text-right text-xs text-gray-400 mt-0.5">{mensaje.length}/160</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">URL de destino (opcional)</label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://soldeterreros.web.app/eventos"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleEnviar}
              disabled={enviando || !titulo.trim() || !mensaje.trim()}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {enviando ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {enviando ? 'Enviando...' : 'Enviar a todos los suscriptores'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: playasData } = usePlayas();
  const { data: restaurantesData } = useRestaurantes();
  const { data: eventosData } = useEventos();
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await Promise.all([
        seedCollection('playas', playas),
        seedCollection('restaurantes', restaurantes),
        seedCollection('eventos', eventos),
      ]);
      toast.success('¡Base de datos poblada correctamente!');
    } catch (err) {
      console.error(err);
      toast.error('Error al poblar la base de datos');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Panel de control de Sol de Terreros</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full font-mono">
          v{APP_VERSION}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Waves} label="Playas" count={playasData.length} to="/admin/playas" color="bg-sky-500" />
        <StatCard icon={UtensilsCrossed} label="Restaurantes" count={restaurantesData.length} to="/admin/restaurantes" color="bg-orange-500" />
        <StatCard icon={CalendarDays} label="Eventos" count={eventosData.length} to="/admin/eventos" color="bg-violet-500" />
      </div>

      {/* Push notifications panel */}
      <NotificacionPanel />

      {/* Firestore seed */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 mb-1">Base de datos Firestore</h2>
            <p className="text-gray-500 text-sm mb-4">
              Si es la primera vez que usas el admin, carga los datos iniciales en Firestore.
              Después podrás editarlos desde aquí sin tocar código.
            </p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              {seeding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              {seeding ? 'Cargando datos...' : 'Poblar Firestore con datos iniciales'}
            </button>
          </div>
        </div>
      </div>

      {/* Setup checklist */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Configuración Firebase</h2>
        <div className="space-y-3">
          {[
            { label: 'Habilitar Firestore Database en la consola Firebase', done: true },
            { label: 'Habilitar Authentication → Email/Password en la consola Firebase', done: true },
            { label: 'Habilitar Cloud Messaging en la consola Firebase', done: true },
            { label: 'Crear usuario admin en Authentication → Users', done: false },
            { label: 'Poblar Firestore con datos iniciales (botón de arriba)', done: false },
            { label: 'Obtener VAPID key en Project Settings → Cloud Messaging → Web Push certificates', done: false },
            { label: 'Configurar reglas de Firestore para proteger el admin', done: false },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-start gap-3">
              {done ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

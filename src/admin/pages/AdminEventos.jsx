import { useState } from 'react';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEventos } from '../../hooks/useEventos';
import { Pencil, Trash2, Plus, X, Save } from 'lucide-react';
import { formatFecha } from '../../data/eventos';
import toast from 'react-hot-toast';

const TIPO_OPTS = ['fiesta', 'mercado', 'evento', 'deporte', 'concierto'];
const CAT_OPTS = ['Tradición', 'Feria', 'Mercado', 'Naturaleza', 'Deporte', 'Música', 'Gastronomía', 'Otro'];

const EMPTY = {
  nombre: '', tipo: 'evento', categoria: 'Otro',
  fecha: '', hora: '', lugar: '', descripcion: '',
  foto: '', gratis: true, precio: 0, destacado: false,
  organizador: '',
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EventoForm({ inicial, onSave, onClose }) {
  const [form, setForm] = useState(inicial);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.nombre || !form.fecha) { toast.error('Nombre y fecha son obligatorios'); return; }
    setSaving(true);
    try {
      const id = form.id || `${form.fecha}-${form.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
      await setDoc(doc(db, 'eventos', id), { ...form, id });
      toast.success('Evento guardado');
      onSave();
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Nombre del evento</label>
          <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">URL Foto</label>
          <input className="input" placeholder="https://..." value={form.foto} onChange={e => set('foto', e.target.value)} />
          {form.foto && <img src={form.foto} className="mt-2 h-24 w-full object-cover rounded-xl" alt="preview" />}
        </div>
        <div>
          <label className="label">Tipo</label>
          <select className="input" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            {TIPO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Categoría</label>
          <select className="input" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
            {CAT_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Fecha inicio</label>
          <input type="date" className="input" value={form.fecha} onChange={e => set('fecha', e.target.value)} />
        </div>
        <div>
          <label className="label">Fecha fin (opcional)</label>
          <input type="date" className="input" value={form.fechaFin || ''} onChange={e => set('fechaFin', e.target.value)} />
        </div>
        <div>
          <label className="label">Hora</label>
          <input className="input" placeholder="22:00" value={form.hora} onChange={e => set('hora', e.target.value)} />
        </div>
        <div>
          <label className="label">Frecuencia (si es periódico)</label>
          <input className="input" placeholder="Todos los sábados" value={form.frecuencia || ''} onChange={e => set('frecuencia', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Lugar</label>
          <input className="input" value={form.lugar} onChange={e => set('lugar', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Descripción</label>
          <textarea className="input h-24 resize-none" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
        </div>
        <div>
          <label className="label">Precio</label>
          <select className="input" value={form.gratis ? 'gratis' : 'pago'} onChange={e => set('gratis', e.target.value === 'gratis')}>
            <option value="gratis">Gratuito</option>
            <option value="pago">De pago</option>
          </select>
        </div>
        {!form.gratis && (
          <div>
            <label className="label">Precio (€)</label>
            <input type="number" className="input" value={form.precio} onChange={e => set('precio', Number(e.target.value))} />
          </div>
        )}
        <div className="col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="destacado"
            checked={form.destacado}
            onChange={e => set('destacado', e.target.checked)}
            className="w-4 h-4 accent-orange-500"
          />
          <label htmlFor="destacado" className="text-sm font-medium text-gray-700">Marcar como evento destacado</label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar
        </button>
      </div>
    </div>
  );
}

export default function AdminEventos() {
  const { data: eventos } = useEventos();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await deleteDoc(doc(db, 'eventos', id));
      toast.success('Evento eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const eventosSorted = [...eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-500 text-sm">{eventos.length} eventos registrados</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo evento
        </button>
      </div>

      <div className="space-y-3">
        {eventosSorted.map(evento => {
          const fecha = new Date(evento.fecha + 'T00:00:00');
          const pasado = fecha < new Date();
          return (
            <div key={evento.id} className={`bg-white rounded-2xl border flex items-center gap-4 p-4 ${pasado ? 'opacity-50 border-gray-100' : 'border-gray-100'}`}>
              <div className={`w-12 text-center flex-shrink-0 rounded-xl py-2 ${evento.destacado ? 'bg-orange-500' : 'bg-gray-800'}`}>
                <p className="text-white/70 text-xs">{fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}</p>
                <p className="text-white font-bold text-lg leading-none">{fecha.getDate()}</p>
              </div>
              {evento.foto && (
                <img src={evento.foto} alt={evento.nombre} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{evento.nombre}</p>
                <p className="text-sm text-gray-500 mt-0.5">{evento.hora} · {evento.lugar} · {evento.gratis ? 'Gratis' : `${evento.precio}€`}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(evento)} className="p-2 hover:bg-sky-50 text-sky-600 rounded-xl transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(evento.id, evento.nombre)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <Modal title={`Editar: ${editing.nombre}`} onClose={() => setEditing(null)}>
          <EventoForm inicial={editing} onSave={() => setEditing(null)} onClose={() => setEditing(null)} />
        </Modal>
      )}
      {creating && (
        <Modal title="Nuevo evento" onClose={() => setCreating(false)}>
          <EventoForm inicial={EMPTY} onSave={() => setCreating(false)} onClose={() => setCreating(false)} />
        </Modal>
      )}
    </div>
  );
}

import { useState } from 'react';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { usePlayas } from '../../hooks/usePlayas';
import { Pencil, Trash2, Plus, X, Save, Waves } from 'lucide-react';
import toast from 'react-hot-toast';

const BANDERA_OPTS = ['verde', 'amarilla', 'roja'];
const OLEAJE_OPTS = ['tranquilo', 'moderado', 'fuerte'];
const OCUPACION_OPTS = ['baja', 'media', 'alta'];

const EMPTY_PLAYA = {
  nombre: '', descripcion: '', descripcionLarga: '',
  bandera: 'verde', temperatura: 23, oleaje: 'tranquilo', ocupacion: 'media',
  longitud: '', tipo: 'arena', lat: 37.545, lng: -1.700,
  foto: '', instalaciones: [], actividades: [],
  horarioSocorrista: '10:00 - 20:00', aparcamiento: '',
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PlayaForm({ inicial, onSave, onClose }) {
  const [form, setForm] = useState(inicial);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.nombre) { toast.error('El nombre es obligatorio'); return; }
    setSaving(true);
    try {
      const id = form.id || form.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await setDoc(doc(db, 'playas', id), { ...form, id });
      toast.success('Playa guardada');
      onSave();
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Nombre</label>
          <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">URL Foto</label>
          <input className="input" placeholder="https://..." value={form.foto} onChange={e => set('foto', e.target.value)} />
          {form.foto && <img src={form.foto} className="mt-2 h-24 w-full object-cover rounded-xl" alt="preview" />}
        </div>
        <div className="col-span-2">
          <label className="label">Descripción corta</label>
          <textarea className="input h-20 resize-none" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
        </div>
        <div>
          <label className="label">Bandera</label>
          <select className="input" value={form.bandera} onChange={e => set('bandera', e.target.value)}>
            {BANDERA_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Temp. mar (°C)</label>
          <input type="number" className="input" value={form.temperatura} onChange={e => set('temperatura', Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Oleaje</label>
          <select className="input" value={form.oleaje} onChange={e => set('oleaje', e.target.value)}>
            {OLEAJE_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Ocupación</label>
          <select className="input" value={form.ocupacion} onChange={e => set('ocupacion', e.target.value)}>
            {OCUPACION_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Longitud</label>
          <input className="input" placeholder="850m" value={form.longitud} onChange={e => set('longitud', e.target.value)} />
        </div>
        <div>
          <label className="label">Horario socorrista</label>
          <input className="input" value={form.horarioSocorrista} onChange={e => set('horarioSocorrista', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Aparcamiento</label>
          <input className="input" value={form.aparcamiento} onChange={e => set('aparcamiento', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar
        </button>
      </div>
    </div>
  );
}

export default function AdminPlayas() {
  const { data: playas, loading } = usePlayas();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await deleteDoc(doc(db, 'playas', id));
      toast.success('Playa eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Playas</h1>
          <p className="text-gray-500 text-sm">{playas.length} playas registradas</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva playa
        </button>
      </div>

      <div className="space-y-3">
        {playas.map(playa => (
          <div key={playa.id} className="bg-white rounded-2xl border border-gray-100 flex items-center gap-4 p-4">
            {playa.foto && (
              <img src={playa.foto} alt={playa.nombre} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{playa.nombre}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  playa.bandera === 'verde' ? 'bg-green-500' :
                  playa.bandera === 'amarilla' ? 'bg-yellow-400' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-500">Bandera {playa.bandera}</span>
                <span className="text-sm text-gray-400">· {playa.temperatura}°C · Oleaje {playa.oleaje}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(playa)}
                className="p-2 hover:bg-sky-50 text-sky-600 rounded-xl transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(playa.id, playa.nombre)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={`Editar: ${editing.nombre}`} onClose={() => setEditing(null)}>
          <PlayaForm inicial={editing} onSave={() => setEditing(null)} onClose={() => setEditing(null)} />
        </Modal>
      )}
      {creating && (
        <Modal title="Nueva playa" onClose={() => setCreating(false)}>
          <PlayaForm inicial={EMPTY_PLAYA} onSave={() => setCreating(false)} onClose={() => setCreating(false)} />
        </Modal>
      )}
    </div>
  );
}

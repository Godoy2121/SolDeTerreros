import { useState } from 'react';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRestaurantes } from '../../hooks/useRestaurantes';
import { Pencil, Trash2, Plus, X, Save, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const TIPO_OPTS = ['chiringuito', 'restaurante', 'bar', 'heladeria', 'cafeteria'];

const EMPTY = {
  nombre: '', tipo: 'restaurante', descripcion: '',
  valoracion: 4.5, numReseñas: 0, horario: '',
  telefono: '', direccion: '', foto: '',
  lat: 37.545, lng: -1.700, abierto: true, tags: [],
  carta: { categorias: [] },
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

function RestForm({ inicial, onSave, onClose }) {
  const [form, setForm] = useState(inicial);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState((inicial.tags || []).join(', '));

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.nombre) { toast.error('El nombre es obligatorio'); return; }
    setSaving(true);
    try {
      const id = form.id || form.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await setDoc(doc(db, 'restaurantes', id), { ...form, id, tags });
      toast.success('Restaurante guardado');
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
          <label className="label">Nombre</label>
          <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>
        <div>
          <label className="label">Tipo</label>
          <select className="input" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            {TIPO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Estado</label>
          <select className="input" value={form.abierto ? 'true' : 'false'} onChange={e => set('abierto', e.target.value === 'true')}>
            <option value="true">Abierto</option>
            <option value="false">Cerrado</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">URL Foto</label>
          <input className="input" placeholder="https://..." value={form.foto} onChange={e => set('foto', e.target.value)} />
          {form.foto && <img src={form.foto} className="mt-2 h-24 w-full object-cover rounded-xl" alt="preview" />}
        </div>
        <div className="col-span-2">
          <label className="label">Descripción</label>
          <textarea className="input h-20 resize-none" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Dirección</label>
          <input className="input" value={form.direccion} onChange={e => set('direccion', e.target.value)} />
        </div>
        <div>
          <label className="label">Teléfono</label>
          <input className="input" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
        </div>
        <div>
          <label className="label">Horario</label>
          <input className="input" placeholder="12:00 - 23:00" value={form.horario} onChange={e => set('horario', e.target.value)} />
        </div>
        <div>
          <label className="label">Valoración (0-5)</label>
          <input type="number" step="0.1" min="0" max="5" className="input" value={form.valoracion} onChange={e => set('valoracion', Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Nº Reseñas</label>
          <input type="number" className="input" value={form.numReseñas} onChange={e => set('numReseñas', Number(e.target.value))} />
        </div>
        <div className="col-span-2">
          <label className="label">Tags (separados por comas)</label>
          <input className="input" placeholder="paellas, mariscos, terraza" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
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

export default function AdminRestaurantes() {
  const { data: restaurantes } = useRestaurantes();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await deleteDoc(doc(db, 'restaurantes', id));
      toast.success('Restaurante eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurantes</h1>
          <p className="text-gray-500 text-sm">{restaurantes.length} locales registrados</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo restaurante
        </button>
      </div>

      <div className="space-y-3">
        {restaurantes.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 flex items-center gap-4 p-4">
            {r.foto && (
              <img src={r.foto} alt={r.nombre} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{r.nombre}</p>
                <span className={`w-2 h-2 rounded-full ${r.abierto ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm text-gray-500">{r.valoracion} · {r.tipo} · {r.horario}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(r)} className="p-2 hover:bg-sky-50 text-sky-600 rounded-xl transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(r.id, r.nombre)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={`Editar: ${editing.nombre}`} onClose={() => setEditing(null)}>
          <RestForm inicial={editing} onSave={() => setEditing(null)} onClose={() => setEditing(null)} />
        </Modal>
      )}
      {creating && (
        <Modal title="Nuevo restaurante" onClose={() => setCreating(false)}>
          <RestForm inicial={EMPTY} onSave={() => setCreating(false)} onClose={() => setCreating(false)} />
        </Modal>
      )}
    </div>
  );
}

import { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRestaurantes } from '../../hooks/useRestaurantes';
import { Pencil, Trash2, Plus, X, Save, Star, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const TIPO_OPTS = [
  'restaurante', 'chiringuito', 'bar', 'heladeria', 'cafeteria',
  'comida-llevar', 'supermercado', 'farmacia', 'panaderia',
  'peluqueria', 'estanco', 'gasolinera',
];

const EMPTY_PLATO = { nombre: '', precio: 0, descripcion: '', popular: false };
const EMPTY_CAT = { nombre: '', icono: '🍽️', platos: [] };

const EMPTY = {
  nombre: '', tipo: 'restaurante', descripcion: '',
  valoracion: 4.5, numReseñas: 0, horario: '',
  telefono: '', direccion: '', foto: '', web: '',
  lat: 37.3601, lng: -1.6648, abierto: true, tags: [],
  carta: { categorias: [] },
};

// ── Carta editor ──────────────────────────────────────────────────────────────

function PlatoRow({ plato, onChange, onDelete }) {
  return (
    <div className="flex gap-2 items-start bg-gray-50 rounded-xl p-2.5">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <input
          className="input text-xs col-span-2"
          placeholder="Nombre del plato"
          value={plato.nombre}
          onChange={e => onChange({ ...plato, nombre: e.target.value })}
        />
        <input
          type="number"
          step="0.5"
          min="0"
          className="input text-xs"
          placeholder="Precio €"
          value={plato.precio || ''}
          onChange={e => onChange({ ...plato, precio: Number(e.target.value) })}
        />
        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600 self-center">
          <input
            type="checkbox"
            checked={!!plato.popular}
            onChange={e => onChange({ ...plato, popular: e.target.checked })}
            className="w-3.5 h-3.5 accent-orange-500"
          />
          ⭐ Estrella
        </label>
        <input
          className="input text-xs col-span-2"
          placeholder="Descripción (opcional)"
          value={plato.descripcion || ''}
          onChange={e => onChange({ ...plato, descripcion: e.target.value })}
        />
      </div>
      <button
        onClick={onDelete}
        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg mt-0.5 flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function CategoriaEditor({ cat, onChange, onDelete }) {
  const [open, setOpen] = useState(true);

  const updatePlato = (i, updated) => {
    const platos = [...cat.platos];
    platos[i] = updated;
    onChange({ ...cat, platos });
  };

  const deletePlato = (i) => {
    onChange({ ...cat, platos: cat.platos.filter((_, idx) => idx !== i) });
  };

  const addPlato = () => {
    onChange({ ...cat, platos: [...cat.platos, { ...EMPTY_PLATO }] });
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 flex-1 text-left">
          <input
            className="input text-sm w-10 px-2 py-1 text-center"
            value={cat.icono}
            onChange={e => onChange({ ...cat, icono: e.target.value })}
            onClick={e => e.stopPropagation()}
          />
          <input
            className="input text-sm flex-1"
            placeholder="Nombre de categoría"
            value={cat.nombre}
            onChange={e => onChange({ ...cat, nombre: e.target.value })}
            onClick={e => e.stopPropagation()}
          />
          <span className="text-xs text-gray-400">{cat.platos.length} platos</span>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
        </button>
        <button onClick={onDelete} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {open && (
        <div className="p-3 space-y-2">
          {cat.platos.map((p, i) => (
            <PlatoRow
              key={i}
              plato={p}
              onChange={updated => updatePlato(i, updated)}
              onDelete={() => deletePlato(i)}
            />
          ))}
          <button
            onClick={addPlato}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir plato
          </button>
        </div>
      )}
    </div>
  );
}

function CartaEditor({ carta, onChange }) {
  const cats = carta?.categorias || [];

  const updateCat = (i, updated) => {
    const categorias = [...cats];
    categorias[i] = updated;
    onChange({ categorias });
  };

  const deleteCat = (i) => {
    onChange({ categorias: cats.filter((_, idx) => idx !== i) });
  };

  const addCat = () => {
    onChange({ categorias: [...cats, { ...EMPTY_CAT, platos: [] }] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="label mb-0">Carta / Menú</label>
        <span className="text-xs text-gray-400">{cats.length} categorías</span>
      </div>
      {cats.map((cat, i) => (
        <CategoriaEditor
          key={i}
          cat={cat}
          onChange={updated => updateCat(i, updated)}
          onDelete={() => deleteCat(i)}
        />
      ))}
      <button
        onClick={addCat}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-orange-300 rounded-2xl text-sm text-orange-600 hover:bg-orange-50 transition-colors"
      >
        <Plus className="w-4 h-4" /> Añadir categoría
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Formulario principal ──────────────────────────────────────────────────────

function RestForm({ inicial, onSave, onClose }) {
  const [form, setForm] = useState(inicial);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState((inicial.tags || []).join(', '));

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.nombre) { toast.error('El nombre es obligatorio'); return; }
    setSaving(true);
    try {
      const id = form.id || form.nombre.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
      {/* Datos básicos */}
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
          <label className="label">Web (opcional)</label>
          <input className="input" placeholder="https://..." value={form.web || ''} onChange={e => set('web', e.target.value)} />
        </div>
        <div>
          <label className="label">Horario</label>
          <input className="input" placeholder="12:00 - 23:00" value={form.horario} onChange={e => set('horario', e.target.value)} />
        </div>
        <div className="col-span-1">
          <label className="label">Valoración</label>
          <input type="number" step="0.1" min="0" max="5" className="input" value={form.valoracion} onChange={e => set('valoracion', Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Nº Reseñas</label>
          <input type="number" className="input" value={form.numReseñas} onChange={e => set('numReseñas', Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Lat</label>
          <input type="number" step="0.0001" className="input" value={form.lat} onChange={e => set('lat', Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Lng</label>
          <input type="number" step="0.0001" className="input" value={form.lng} onChange={e => set('lng', Number(e.target.value))} />
        </div>
        <div className="col-span-2">
          <label className="label">Tags (separados por comas)</label>
          <input className="input" placeholder="paellas, mariscos, terraza" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Editor de carta */}
      <CartaEditor
        carta={form.carta}
        onChange={carta => set('carta', carta)}
      />

      <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {saving
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Save className="w-4 h-4" />}
          Guardar
        </button>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

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
          <Plus className="w-4 h-4" /> Nuevo
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
                <p className="font-semibold text-gray-900 truncate">{r.nombre}</p>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${r.abierto ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-gray-500">{r.valoracion} · {r.tipo}</span>
                {r.carta?.categorias?.length > 0 && (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">
                    {r.carta.categorias.length} cat. en carta
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
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

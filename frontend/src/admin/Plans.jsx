
import React, { useState, useEffect } from 'react';
import { adminService } from './adminService';

const slugify = (text) =>
  text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const FORM_VACIO = {
  name: '', price: '', duration_days: '', max_properties: '',
  max_photos: '', description: '', features: '', is_featured: false,
};

export default function Plans() {
  const [planes, setPlanes]           = useState([]);
  const [modalTipo, setModalTipo]     = useState(null);
  const [idSeleccionado, setId]       = useState(null);
  const [formPlan, setFormPlan]       = useState(FORM_VACIO);
  const [error, setError]             = useState('');
  const [exito, setExito]             = useState('');

  useEffect(() => { cargarPlanes(); }, []);

  const cargarPlanes = async () => {
    try {
      const datos = await adminService.getPlanes();
      setPlanes(datos);
      setError('');
    } catch {
      setError('No se pudieron cargar los planes.');
    }
  };

  const abrirModal = (plan, tipo) => {
    setModalTipo(tipo);
    setError('');
    setExito('');
    if (tipo === 'editar' && plan) {
      setId(plan.id);
      setFormPlan({
        name:           plan.name          || '',
        price:          plan.price         || '',
        duration_days:  plan.duration_days || '',
        max_properties: plan.max_properties|| '',
        max_photos:     plan.max_photos    || '',
        description:    plan.description   || '',
        features:       (() => {
                          try {
                            const arr = JSON.parse(plan.features || '[]');
                            return Array.isArray(arr) ? arr.join('\n') : (plan.features || '');
                          } catch { return plan.features || ''; }
                        })(),
        is_featured:    plan.is_featured   || false,
      });
    } else {
      setId(plan?.id || null);
      setFormPlan(FORM_VACIO);
    }
  };

  const cerrarModal = () => {
    setModalTipo(null);
    setId(null);
    setFormPlan(FORM_VACIO);
    setError('');
    setExito('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormPlan(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Convierte el form al formato exacto que espera el backend
  const buildPayload = () => {
    const featuresArray = formPlan.features
      ? formPlan.features.split('\n').map(f => f.trim()).filter(Boolean)
      : [];
    return {
      name:           formPlan.name,
      slug:           slugify(formPlan.name),
      price:          parseFloat(formPlan.price) || 0,
      duration_days:  parseInt(formPlan.duration_days) || 30,
      max_properties: parseInt(formPlan.max_properties) || 1,
      max_photos:     parseInt(formPlan.max_photos) || 5,
      description:    formPlan.description || '',
      features:       JSON.stringify(featuresArray),
      is_featured:    formPlan.is_featured || false,
    };
  };

  const procesar = async () => {
    try {
      if (modalTipo === 'eliminar') {
        await adminService.desactivarPlan(idSeleccionado);
        setPlanes(prev => prev.map(p =>
          p.id === idSeleccionado ? { ...p, is_active: false } : p
        ));
        setExito('Plan desactivado.');
      } else if (modalTipo === 'borrar') {
        await adminService.eliminarPlan(idSeleccionado);
        setPlanes(prev => prev.filter(p => p.id !== idSeleccionado));
        setExito('Plan eliminado.');
      } else {
        const { name, price, duration_days, max_properties, max_photos } = formPlan;
        if (!name || price === '' || !duration_days || !max_properties || !max_photos) {
          setError('Completa los campos obligatorios: nombre, precio, duración, inmuebles y fotos.');
          return;
        }
        const payload = buildPayload();
        if (modalTipo === 'crear') {
          await adminService.crearPlan(payload);
          setExito('Plan creado.');
        } else {
          await adminService.actualizarPlan(idSeleccionado, payload);
          setExito('Plan actualizado.');
        }
      }
      await cargarPlanes();
      setTimeout(cerrarModal, 1200);
    } catch (err) {
      console.error(err);
      setError('Error al procesar. Revisa los datos.');
    }
  };

  const esPago = parseFloat(formPlan.price) > 0;

  return (
    <div className="p-8 bg-[#070708] min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
        <div>
          <p className="text-[11px] font-bold uppercase mb-3" style={{ color: '#C9A84C', letterSpacing: '7px' }}>
            LUXHABITAT · PLANES
          </p>
          <h1 className="text-4xl font-serif text-white" style={{ fontWeight: 500 }}>
            Gestión de Planes
          </h1>
          <div className="h-px w-12 mt-4" style={{ background: '#C9A84C' }} />
        </div>
        <button
          onClick={() => abrirModal(null, 'crear')}
          className="text-sm bg-white/5 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] border border-white/10 text-white/50 px-6 py-3 rounded-[2rem] transition-all font-bold tracking-wide"
        >
          + Agregar nuevo plan
        </button>
      </div>

      {error   && <div className="mb-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 p-4 text-rose-200 text-sm">{error}</div>}
      {exito   && <div className="mb-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-200 text-sm">{exito}</div>}

      <div className="border border-white/10 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-[#070708] text-white/50 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-6">Nombre</th>
              <th className="px-8 py-6">Precio</th>
              <th className="px-8 py-6">Duración</th>
              <th className="px-8 py-6">Inmuebles</th>
              <th className="px-8 py-6">Fotos</th>
              <th className="px-8 py-6">Destacado</th>
              <th className="px-8 py-6">Estado</th>
              <th className="px-8 py-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-white/80">
            {planes.map((plan) => (
              <tr key={plan.id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6 font-semibold text-white">{plan.name}</td>
                <td className="px-8 py-6 font-bold" style={{ color: '#C9A84C' }}>
                  {parseFloat(plan.price) === 0
                    ? <span className="text-emerald-400">GRATIS</span>
                    : `$${Number(plan.price).toLocaleString('es-CO')}`}
                </td>
                <td className="px-8 py-6 text-white/50">{plan.duration_days} días</td>
                <td className="px-8 py-6 text-white/50">{plan.max_properties}</td>
                <td className="px-8 py-6 text-white/30">{plan.max_photos}</td>
                <td className="px-8 py-6">
                  {plan.is_featured
                    ? <span className="text-[#C9A84C] font-bold text-xs">⭐ Sí</span>
                    : <span className="text-white/30 text-xs">No</span>}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-[2rem] text-xs font-bold border ${
                    plan.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {plan.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-8 py-6 flex flex-wrap gap-2">
                  <button onClick={() => abrirModal(plan, 'editar')}
                    className="text-xs bg-white/5 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] border border-white/10 px-4 py-2 rounded-[2rem] font-bold">
                    Editar
                  </button>
                  <button onClick={() => abrirModal(plan, 'eliminar')}
                    className="text-xs bg-white/5 hover:bg-amber-500/10 hover:text-amber-400 border border-white/10 px-4 py-2 rounded-[2rem] font-bold">
                    Desactivar
                  </button>
                  <button onClick={() => abrirModal(plan, 'borrar')}
                    className="text-xs bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/10 px-4 py-2 rounded-[2rem] font-bold">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalTipo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="border border-white/10 p-8 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl w-full max-w-lg">

            {(modalTipo === 'crear' || modalTipo === 'editar') ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-3xl mb-3" style={{ color: '#C9A84C' }}>{modalTipo === 'crear' ? '✨' : '📋'}</div>
                  <h3 className="text-2xl font-serif text-white" style={{ fontWeight: 500 }}>
                    {modalTipo === 'crear' ? 'Crear Nuevo Plan' : 'Editar Plan'}
                  </h3>
                  <p className="text-sm text-white/60 mt-2">
                    Campos con * son obligatorios
                  </p>
                </div>

                {error && <div className="mb-4 text-rose-300 text-xs bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-4">{error}</div>}
                {exito && <div className="mb-4 text-emerald-300 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-4">{exito}</div>}

                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">

                  {/* Nombre */}
                  <div>
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">Nombre del Plan *</label>
                    <input type="text" name="name" value={formPlan.name} onChange={handleChange}
                      placeholder="Ej: Plan Premium"
                      className="w-full bg-[#070708] border border-white/10 rounded-[2rem] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
                  </div>

                  {/* Precio + Duración */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">Precio COP *</label>
                      <input type="number" name="price" value={formPlan.price} onChange={handleChange}
                        placeholder="0 = Gratis" min="0"
                        className="w-full bg-[#070708] border border-white/10 rounded-[2rem] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">Duración (días) *</label>
                      <input type="number" name="duration_days" value={formPlan.duration_days} onChange={handleChange}
                        placeholder="30" min="1"
                        className="w-full bg-[#070708] border border-white/10 rounded-[2rem] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>
                  </div>

                  {/* Inmuebles + Fotos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">Límite Inmuebles *</label>
                      <input type="number" name="max_properties" value={formPlan.max_properties} onChange={handleChange}
                        placeholder="1" min="1"
                        className="w-full bg-[#070708] border border-white/10 rounded-[2rem] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">Máx. Fotos *</label>
                      <input type="number" name="max_photos" value={formPlan.max_photos} onChange={handleChange}
                        placeholder="5" min="1"
                        className="w-full bg-[#070708] border border-white/10 rounded-[2rem] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>
                  </div>

                  {/* CAMPOS EXTRA — solo si precio > 0 */}
                  {esPago && (
                    <>
                      <div className="border-t border-white/10 pt-6 mt-2">
                        <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider mb-4">
                          ⭐ Opciones de Plan de Pago
                        </p>

                        {/* Descripción */}
                        <div className="mb-4">
                          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">Descripción</label>
                          <textarea name="description" value={formPlan.description} onChange={handleChange}
                            rows={2} placeholder="Descripción visible para el usuario..."
                            className="w-full bg-[#070708] border border-white/10 rounded-[2rem] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] resize-none" />
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">
                            Características (una por línea)
                          </label>
                          <textarea name="features" value={formPlan.features} onChange={handleChange}
                            rows={4}
                            placeholder={"Publicación destacada\nSoporte prioritario\nEstadísticas avanzadas"}
                            className="w-full bg-[#070708] border border-white/10 rounded-[2rem] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] resize-none" />
                          <p className="text-[10px] text-white/30 mt-2">Cada línea será un ítem en la tarjeta del plan</p>
                        </div>

                        {/* Destacado */}
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" name="is_featured" checked={formPlan.is_featured} onChange={handleChange}
                            className="w-4 h-4 rounded accent-[#C9A84C]" />
                          <span className="text-sm text-white/70 font-medium">
                            Marcar como plan <span className="text-[#C9A84C] font-bold">Más Popular</span>
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={cerrarModal}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm font-bold rounded-[2rem] transition-all">
                    Cancelar
                  </button>
                  <button onClick={procesar}
                    className="flex-1 py-3 text-sm font-bold rounded-[2rem] transition-all"
                    style={{ background: 'linear-gradient(to right, #b38b1d, #f9d85b)', color: '#070708' }}>
                    {modalTipo === 'crear' ? 'Crear Plan' : 'Guardar Cambios'}
                  </button>
                </div>
              </>
            ) : modalTipo === 'borrar' ? (
              <>
                <div className="text-center">
                  <div className="text-5xl mb-4 text-rose-500">🗑️</div>
                  <h3 className="text-2xl font-serif text-white mb-3" style={{ fontWeight: 500 }}>¿Eliminar plan?</h3>
                  <p className="text-sm text-white/60 mb-8">Esta acción eliminará el plan permanentemente y no se puede deshacer.</p>
                  <div className="flex gap-4">
                    <button onClick={cerrarModal} className="flex-1 py-3 bg-white/5 border border-white/10 text-white/70 text-sm font-bold rounded-[2rem]">Cancelar</button>
                    <button onClick={procesar} className="flex-1 py-3 bg-rose-500 hover:bg-rose-400 text-white text-sm font-bold rounded-[2rem]">Eliminar</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-5xl mb-4" style={{ color: '#C9A84C' }}>⚠️</div>
                  <h3 className="text-2xl font-serif text-white mb-3" style={{ fontWeight: 500 }}>¿Desactivar plan?</h3>
                  <p className="text-sm text-white/60 mb-8">El plan quedará inactivo y no podrá ser elegido por nuevos clientes.</p>
                  <div className="flex gap-4">
                    <button onClick={cerrarModal} className="flex-1 py-3 bg-white/5 border border-white/10 text-white/70 text-sm font-bold rounded-[2rem]">Cancelar</button>
                    <button onClick={procesar} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-[2rem]">Desactivar</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

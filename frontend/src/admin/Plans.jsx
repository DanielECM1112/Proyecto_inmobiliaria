import React, { useState, useEffect } from 'react';
import { adminService } from './adminService';

export default function Plans() {
  const [planes, setPlanes] = useState([]);
  const [modalTipo, setModalTipo] = useState(null);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [formPlan, setFormPlan] = useState({ nombre: '', precio: '', duracion: '', inmuebles: '', imagenes: '' });
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => { cargarPlanes(); }, []);

  const cargarPlanes = async () => {
    try {
      const datos = await adminService.getPlanes();
      setPlanes(datos);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los planes. Intenta nuevamente.');
    }
  };

  const abrirModal = (plan, tipo) => {
    setModalTipo(tipo);
    if (tipo === 'editar') {
      setIdSeleccionado(plan.id);
      setFormPlan({ nombre: plan.nombre, precio: plan.precio, duracion: plan.duracion, inmuebles: plan.inmuebles, imagenes: plan.imagenes });
    } else {
      setIdSeleccionado(null);
      setFormPlan({ nombre: '', precio: '', duracion: '', inmuebles: '', imagenes: '' });
    }
  };

  const cerrarModal = () => {
    setModalTipo(null);
    setIdSeleccionado(null);
    setFormPlan({ nombre: '', precio: '', duracion: '', inmuebles: '', imagenes: '' });
    setError('');
    setMensajeExito('');
  };

  const handleChange = (e) => {
    setFormPlan({ ...formPlan, [e.target.name]: e.target.value });
  };

  const procesarAccionConfirmada = async () => {
    try {
      if (modalTipo === 'eliminar') {
        await adminService.desactivarPlan(idSeleccionado);
        setMensajeExito('Plan desactivado correctamente.');
      } else {
        if (!formPlan.nombre || !formPlan.precio || !formPlan.duracion || !formPlan.inmuebles || !formPlan.imagenes) {
          setError('Por favor completa todos los campos.');
          return;
        }
        if (modalTipo === 'crear') {
          await adminService.crearPlan(formPlan);
          setMensajeExito('Plan creado correctamente.');
        } else {
          await adminService.actualizarPlan(idSeleccionado, formPlan);
          setMensajeExito('Plan actualizado correctamente.');
        }
      }
      await cargarPlanes();
      cerrarModal();
    } catch (err) {
      setError('No se pudo procesar la acción. Revisa los datos e intenta nuevamente.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen text-slate-100 transition-all duration-1000 hover:to-indigo-950/80 relative">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-wide text-white">Gestión de Planes</h1>
        <button
          onClick={() => abrirModal(null, 'crear')}
          className="text-xs bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-slate-300 px-4 py-2 rounded-lg transition-all duration-300 font-bold tracking-wide shadow-md"
        >
          + Agregar nuevo plan
        </button>
      </div>

      {error && <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-100 text-sm">{error}</div>}
      {mensajeExito && <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-100 text-sm">{mensajeExito}</div>}

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/60 text-left">
          <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Nombre del Plan</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Duración</th>
              <th className="px-6 py-4">Límite Inmuebles</th>
              <th className="px-6 py-4">Fotos</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
            {planes.map((plan) => (
              <tr key={plan.id} className="hover:bg-slate-800/20 transition-colors duration-200">
                <td className="px-6 py-4 font-semibold text-white">{plan.nombre}</td>
                <td className="px-6 py-4 text-cyan-400 font-bold">{plan.precio}</td>
                <td className="px-6 py-4 text-slate-400">{plan.duracion} días</td>
                <td className="px-6 py-4 text-slate-400">{plan.inmuebles}</td>
                <td className="px-6 py-4 text-slate-500">{plan.imagenes}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${plan.activo ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950/50 text-amber-400 border border-amber-500/20'}`}>
                    {plan.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  <button onClick={() => abrirModal(plan, 'editar')} className="text-xs bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide">Editar</button>
                  <button onClick={() => abrirModal(plan, 'eliminar')} className="text-xs bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide">Desactivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalTipo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full text-center relative hover:border-cyan-500/20 transition-all duration-300">
            {(modalTipo === 'crear' || modalTipo === 'editar') ? (
              <>
                <div className="text-cyan-400 text-4xl mb-3">{modalTipo === 'crear' ? '✨' : '📋'}</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{modalTipo === 'crear' ? 'Crear Nuevo Plan' : 'Editar Plan'}</h3>
                <p className="text-sm text-slate-400 mb-6">Completa los datos del plan para que pueda ser usado por los vendedores.</p>
                <div className="grid grid-cols-1 gap-4 text-left mb-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Nombre del Plan</label>
                    <input type="text" name="nombre" value={formPlan.nombre} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="Ej: Plan Premium" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Precio</label>
                      <input type="text" name="precio" value={formPlan.precio} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500" placeholder="$0" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Duración (días)</label>
                      <input type="text" name="duracion" value={formPlan.duracion} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="60" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Límite inmuebles</label>
                      <input type="text" name="inmuebles" value={formPlan.inmuebles} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="5" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Máx. imágenes</label>
                      <input type="text" name="imagenes" value={formPlan.imagenes} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="10" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-rose-500 text-4xl mb-3">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">¿Desactivar plan?</h3>
                <p className="text-sm text-slate-400 mb-6">El plan quedará inactivo y ya no podrá ser elegido por nuevos clientes.</p>
              </>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={cerrarModal} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all duration-300 tracking-wide">Cancelar</button>
              <button onClick={procesarAccionConfirmada} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300 tracking-wide border ${modalTipo === 'eliminar' ? 'bg-rose-500 hover:bg-rose-400 border-rose-500 text-slate-950' : 'bg-cyan-500 hover:bg-cyan-400 border-cyan-500 text-slate-950'}`}>
                {modalTipo === 'crear' ? 'Crear plan' : modalTipo === 'editar' ? 'Guardar cambios' : 'Desactivar plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

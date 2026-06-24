import React, { useState, useEffect } from 'react';
import { adminService } from './adminService';

const FORM_VACIO = {
  titulo: '', tipo: 'casa', precio: '', area: '',
  habitaciones: '1', banos: '1', ubicacion: '',
  descripcion: '', estado: 'disponible',
  estrato: '', garaje: false, piscina: false, amoblado: false,
  contacto_nombre: '', contacto_telefono: '', contacto_email: '',
};

const estadoBadge = (estado) => {
  const map = {
    disponible:  'bg-emerald-950/50 text-emerald-400 border-emerald-500/20',
    negociacion: 'bg-amber-950/50 text-amber-400 border-amber-500/20',
    vendido:     'bg-rose-950/50 text-rose-400 border-rose-500/20',
  };
  const label = {
    disponible:  'Disponible',
    negociacion: 'En Negociación',
    vendido:     'Vendido',
  };
  const cls = map[estado] || 'bg-slate-950/80 text-slate-300 border-slate-700';
  const txt = label[estado] || (estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'Desconocido');
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${cls}`}>{txt}</span>;
};

const inputCls = "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500";
const labelCls = "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1";

export default function Properties() {
  const [inmuebles, setInmuebles]         = useState([]);
  const [modalTipo, setModalTipo]         = useState(null);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [formData, setFormData]           = useState(FORM_VACIO);
  const [error, setError]                 = useState('');
  const [exito, setExito]                 = useState('');

  useEffect(() => { cargarInmuebles(); }, []);

  const cargarInmuebles = async () => {
    try {
      const datos = await adminService.getInmuebles();
      setInmuebles(datos);
      setError('');
    } catch {
      setError('No se pudieron cargar los inmuebles. Intenta nuevamente.');
    }
  };

  const abrirModal = (inmueble, tipo) => {
    setIdSeleccionado(inmueble.id);
    setModalTipo(tipo);
    setError('');
    setExito('');
    if (tipo === 'editar') {
      setFormData({
        titulo:       inmueble.titulo       || '',
        tipo:         inmueble.tipo         || 'casa',
        precio:       inmueble.precio       || '',
        area:         inmueble.area         || '',
        habitaciones: String(inmueble.habitaciones || 1),
        banos:        String(inmueble.banos        || 1),
        ubicacion:    inmueble.ubicacion    || '',
        descripcion:  inmueble.descripcion  || '',
        estado:       inmueble.estado       || 'disponible',
        estrato:          inmueble.estrato          ?? '',
        garaje:           inmueble.garaje           || false,
        piscina:          inmueble.piscina          || false,
        amoblado:         inmueble.amoblado         || false,
        contacto_nombre:  inmueble.contacto_nombre  || '',
        contacto_telefono:inmueble.contacto_telefono|| '',
        contacto_email:   inmueble.contacto_email   || '',
      });
    }
  };

  const cerrarModal = () => {
    setModalTipo(null);
    setIdSeleccionado(null);
    setFormData(FORM_VACIO);
    setError('');
    setExito('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const procesarAccion = async () => {
    if (!idSeleccionado) return;
    try {
      if (modalTipo === 'editar') {
        await adminService.editarInmueble(idSeleccionado, formData);
        setExito('Inmueble actualizado correctamente.');
        await cargarInmuebles();
        setTimeout(cerrarModal, 1200);
        return;
      }
      if (modalTipo === 'aprobar')   await adminService.aprobarInmueble(idSeleccionado);
      if (modalTipo === 'finalizar') await adminService.finalizarInmueble(idSeleccionado);
      if (modalTipo === 'eliminar')  await adminService.eliminarInmueble(idSeleccionado);
      await cargarInmuebles();
      cerrarModal();
    } catch {
      setError('No se pudo ejecutar la acción. Revisa la conexión e intenta de nuevo.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen text-slate-100 transition-all duration-1000 hover:to-indigo-950/80 relative">
      <h1 className="text-3xl font-bold mb-6 tracking-wide text-white">Gestión de Inmuebles</h1>

      {error && <div className="mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-100 text-sm">{error}</div>}
      {exito && <div className="mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-200 text-sm">{exito}</div>}

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/60 text-left">
          <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Inmueble</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
            {inmuebles.map((inmueble) => (
              <tr key={inmueble.id} className="hover:bg-slate-800/20 transition-colors duration-200">
                <td className="px-6 py-4 font-semibold text-white">{inmueble.titulo}</td>
                <td className="px-6 py-4 text-slate-400">
                  ${parseFloat(inmueble.precio || 0).toLocaleString('es-CO')}
                </td>
                <td className="px-6 py-4">{estadoBadge(inmueble.estado)}</td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => abrirModal(inmueble, 'editar')}
                    className="text-xs bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-all font-bold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => abrirModal(inmueble, 'aprobar')}
                    disabled={inmueble.estado === 'disponible'}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all font-bold border ${
                      inmueble.estado === 'disponible'
                        ? 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                        : 'bg-slate-800 hover:bg-emerald-900/60 hover:text-emerald-300 border-slate-700 hover:border-emerald-500/40 text-slate-300'
                    }`}
                  >
                    Disponible
                  </button>
                  <button
                    onClick={() => abrirModal(inmueble, 'finalizar')}
                    disabled={inmueble.estado === 'vendido'}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all font-bold border ${
                      inmueble.estado === 'vendido'
                        ? 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                        : 'bg-slate-800 hover:bg-amber-900/60 hover:text-amber-300 border-slate-700 hover:border-amber-500/40 text-slate-300'
                    }`}
                  >
                    Vendido
                  </button>
                  <button
                    onClick={() => abrirModal(inmueble, 'eliminar')}
                    className="text-xs bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-all font-bold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MODAL ── */}
      {modalTipo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg">

            {modalTipo === 'editar' ? (
              <>
                <div className="text-center mb-5">
                  <div className="text-3xl mb-2">📝</div>
                  <h3 className="text-xl font-bold text-white">Editar Inmueble</h3>
                </div>

                {error && <div className="mb-3 text-rose-300 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">{error}</div>}
                {exito && <div className="mb-3 text-emerald-300 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">{exito}</div>}

                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">

                  {/* Título */}
                  <div>
                    <label className={labelCls}>Título *</label>
                    <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className={inputCls} />
                  </div>

                  {/* Tipo + Estado */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Tipo</label>
                      <select name="tipo" value={formData.tipo} onChange={handleChange} className={inputCls}>
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="local">Local Comercial</option>
                        <option value="finca">Finca</option>
                        <option value="lote">Lote</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Estado</label>
                      <select name="estado" value={formData.estado} onChange={handleChange} className={inputCls}>
                        <option value="disponible">Disponible</option>
                        <option value="negociacion">En Negociación</option>
                        <option value="vendido">Vendido</option>
                      </select>
                    </div>
                  </div>

                  {/* Precio + Área */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Precio COP *</label>
                      <input type="number" name="precio" value={formData.precio} onChange={handleChange} min="0" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Área m² *</label>
                      <input type="number" name="area" value={formData.area} onChange={handleChange} min="1" className={inputCls} />
                    </div>
                  </div>

                  {/* Habitaciones + Baños */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Habitaciones</label>
                      <select name="habitaciones" value={formData.habitaciones} onChange={handleChange} className={inputCls}>
                        {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Baños</label>
                      <select name="banos" value={formData.banos} onChange={handleChange} className={inputCls}>
                        {[...Array(6)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Estrato + checkboxes */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Estrato</label>
                      <select name="estrato" value={formData.estrato} onChange={handleChange} className={inputCls}>
                        <option value="">Sin estrato</option>
                        {[...Array(6)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col justify-end gap-2 pb-1">
                      {[['garaje','Garaje'],['piscina','Piscina'],['amoblado','Amoblado']].map(([k,l]) => (
                        <label key={k} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name={k} checked={formData[k]} onChange={handleChange}
                            className="w-4 h-4 rounded accent-cyan-400" />
                          <span className="text-xs text-slate-300">{l}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div>
                    <label className={labelCls}>Barrio / Ubicación *</label>
                    <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} className={inputCls} />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className={labelCls}>Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}
                      rows={3} className={`${inputCls} resize-none`} />
                  </div>

                  {/* Datos de contacto */}
                  <div className="pt-1">
                    <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider mb-3 border-t border-slate-800 pt-3">
                      Datos de Contacto
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className={labelCls}>Nombre del contacto</label>
                        <input type="text" name="contacto_nombre" value={formData.contacto_nombre} onChange={handleChange} className={inputCls} placeholder="Nombre del propietario" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Teléfono / WhatsApp</label>
                          <input type="tel" name="contacto_telefono" value={formData.contacto_telefono} onChange={handleChange} className={inputCls} placeholder="3001234567" />
                        </div>
                        <div>
                          <label className={labelCls}>Correo de contacto</label>
                          <input type="email" name="contacto_email" value={formData.contacto_email} onChange={handleChange} className={inputCls} placeholder="correo@ejemplo.com" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={cerrarModal}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all">
                    Cancelar
                  </button>
                  <button onClick={procesarAccion}
                    className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-all">
                    Guardar Cambios
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                {modalTipo === 'aprobar'  && <><div className="text-emerald-400 text-4xl mb-3">✔️</div><h3 className="text-xl font-bold text-white mb-2">¿Marcar como Disponible?</h3><p className="text-sm text-slate-400 mb-6">El inmueble será visible en el catálogo.</p></>}
                {modalTipo === 'finalizar'&& <><div className="text-amber-400 text-4xl mb-3">🏷️</div><h3 className="text-xl font-bold text-white mb-2">¿Marcar como Vendido?</h3><p className="text-sm text-slate-400 mb-6">El inmueble quedará marcado como vendido.</p></>}
                {modalTipo === 'eliminar' && <><div className="text-rose-500 text-4xl mb-3">⚠️</div><h3 className="text-xl font-bold text-white mb-2">¿Eliminar inmueble?</h3><p className="text-sm text-slate-400 mb-6">Esta acción borrará el inmueble del sistema y no podrá recuperarse.</p></>}
                {error && <div className="mb-4 text-rose-300 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">{error}</div>}
                <div className="flex gap-3 justify-center">
                  <button onClick={cerrarModal}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all">
                    Cancelar
                  </button>
                  <button onClick={procesarAccion}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border ${
                      modalTipo === 'eliminar'  ? 'bg-rose-500 hover:bg-rose-400 border-rose-500 text-slate-950' :
                      modalTipo === 'finalizar' ? 'bg-amber-500 hover:bg-amber-400 border-amber-500 text-slate-950' :
                                                  'bg-emerald-500 hover:bg-emerald-400 border-emerald-500 text-slate-950'
                    }`}>
                    {modalTipo === 'aprobar'   && 'Sí, disponible'}
                    {modalTipo === 'finalizar' && 'Sí, vendido'}
                    {modalTipo === 'eliminar'  && 'Sí, eliminar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

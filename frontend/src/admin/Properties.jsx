import React, { useState, useEffect } from 'react';
import { adminService } from './adminService'; 

export default function Properties() {
  const [inmuebles, setInmuebles] = useState([]);
  
  // ESTADOS PARA CONTROLAR LOS MODALES
  const [modalTipo, setModalTipo] = useState(null); // Puede ser: 'aprobar', 'desaprobar', 'eliminar' o null
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  useEffect(() => {
    cargarInmuebles();
  }, []);

  const cargarInmuebles = async () => {
    const datos = await adminService.getInmuebles();
    setInmuebles(datos);
  };

  // Disparadores que abren la ventana correcta guardando el ID del inmueble
  const abrirModal = (id, tipo) => {
    setIdSeleccionado(id);
    setModalTipo(tipo);
  };

  const cerrarModal = () => {
    setModalTipo(null);
    setIdSeleccionado(null);
  };

  // Ejecución de acciones reales al confirmar en las ventanas clasudas
  const procesarAccionConfirmada = async () => {
    if (!idSeleccionado) return;

    if (modalTipo === 'aprobar') {
      await adminService.aprobarInmueble(idSeleccionado);
    } else if (modalTipo === 'desaprobar') {
      await adminService.desaprobarInmueble(idSeleccionado);
    } else if (modalTipo === 'eliminar') {
      await adminService.eliminarInmueble(idSeleccionado);
    }

    cargarInmuebles(); // Refresca las tablas con la simulación del backend
    cerrarModal();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen text-slate-100 transition-all duration-1000 hover:to-indigo-950/80 relative">
      <h1 className="text-3xl font-bold mb-6 tracking-wide text-white">Gestión de Inmuebles</h1>
      
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
                <td className="px-6 py-4 text-slate-400">{inmueble.precio}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    inmueble.estado === 'Activo' 
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-950/50 text-amber-400 border border-amber-500/20'
                  }`}>
                    {inmueble.estado}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {/* LAS TRES OPCIONES SIEMPRE VISIBLES Y OPERATIVAS */}
                  <button 
                    onClick={() => abrirModal(inmueble.id, 'aprobar')}
                    disabled={inmueble.estado === 'Activo'}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide border ${
                      inmueble.estado === 'Activo'
                        ? 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                        : 'bg-slate-800 hover:bg-emerald-900/60 hover:text-emerald-300 border-slate-700 hover:border-emerald-500/40 text-slate-300'
                    }`}
                  >
                    Aprobar
                  </button>

                  <button 
                    onClick={() => abrirModal(inmueble.id, 'desaprobar')}
                    disabled={inmueble.estado === 'Pendiente'}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide border ${
                      inmueble.estado === 'Pendiente'
                        ? 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                        : 'bg-slate-800 hover:bg-amber-900/60 hover:text-amber-300 border-slate-700 hover:border-amber-500/40 text-slate-300'
                    }`}
                  >
                    Desaprobar
                  </button>

                  <button 
                    onClick={() => abrirModal(inmueble.id, 'eliminar')}
                    className="text-xs bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VENTANA DE CONFIRMACIÓN DINÁMICA (MODAL CLASUDO DE 3 ACCIONES) */}
      {modalTipo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center relative hover:border-cyan-500/20 transition-all duration-300">
            
            {/* Íconos y Mensajes Personalizados según la Acción */}
            {modalTipo === 'aprobar' && (
              <>
                <div className="text-emerald-400 text-4xl mb-3">✔️</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">¿Aprobar Publicación?</h3>
                <p className="text-sm text-slate-400 mb-6">Esta acción cambiará el estado a Activo y el inmueble será visible públicamente en la plataforma.</p>
              </>
            )}

            {modalTipo === 'desaprobar' && (
              <>
                <div className="text-amber-400 text-4xl mb-3">⏸️</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">¿Pausar Publicación?</h3>
                <p className="text-sm text-slate-400 mb-6">Esta acción devolverá el estado a Pendiente. El inmueble se ocultará de las búsquedas de los clientes.</p>
              </>
            )}

            {modalTipo === 'eliminar' && (
              <>
                <div className="text-rose-500 text-4xl mb-3">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">¿Confirmar Eliminación?</h3>
                <p className="text-sm text-slate-400 mb-6">Esta acción borrará de forma definitiva el inmueble del sistema. No se podrá revertir.</p>
              </>
            )}
            
            {/* Botones de Confirmación Estilizados */}
            <div className="flex gap-3 justify-center">
              <button 
                onClick={cerrarModal}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all duration-300 tracking-wide"
              >
                Cancelar
              </button>
              <button 
                onClick={procesarAccionConfirmada}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300 tracking-wide border ${
                  modalTipo === 'aprobar' ? 'bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-400 border-slate-700 hover:border-emerald-500/40 text-slate-200' :
                  modalTipo === 'desaprobar' ? 'bg-slate-800 hover:bg-amber-950/80 hover:text-amber-400 border-slate-700 hover:border-amber-500/40 text-slate-200' :
                  'bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-slate-200'
                }`}
              >
                {modalTipo === 'aprobar' && 'Sí, Aprobar'}
                {modalTipo === 'desaprobar' && 'Sí, Pausar'}
                {modalTipo === 'eliminar' && 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

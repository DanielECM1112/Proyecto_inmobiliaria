import React, { useState, useEffect } from 'react';
import { adminService } from './adminService'; 

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  
  // ESTADOS PARA CONTROLAR LOS MODALES DE USUARIOS
  const [modalTipo, setModalTipo] = useState(null); // 'promover', 'degradar', 'eliminar' o null
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const datos = await adminService.getUsuarios();
    setUsuarios(datos);
  };

  const abrirModal = (id, tipo) => {
    setIdSeleccionado(id);
    setModalTipo(tipo);
  };

  const cerrarModal = () => {
    setModalTipo(null);
    setIdSeleccionado(null);
  };

  const procesarAccionConfirmada = async () => {
    if (!idSeleccionado) return;

    if (modalTipo === 'promover') {
      await adminService.editarRolUsuario(idSeleccionado, 'Administrador');
    } else if (modalTipo === 'degradar') {
      await adminService.editarRolUsuario(idSeleccionado, 'Usuario');
    } else if (modalTipo === 'eliminar') {
      await adminService.eliminarUsuario(idSeleccionado);
    }

    cargarUsuarios(); // Refresca la tabla simulando la respuesta del backend
    cerrarModal();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen text-slate-100 transition-all duration-1000 hover:to-indigo-950/80 relative">
      <h1 className="text-3xl font-bold mb-6 tracking-wide text-white">Control de Usuarios</h1>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/60 text-left">
          <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Nombre Completo</th>
              <th className="px-6 py-4">Correo Electrónico</th>
              <th className="px-6 py-4">Rol de Acceso</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/20 transition-colors duration-200">
                <td className="px-6 py-4 font-semibold text-white">{user.nombre}</td>
                <td className="px-6 py-4 text-slate-400">{user.correo}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    user.rol === 'Administrador'
                      ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/20' 
                      : 'bg-slate-950/80 text-slate-400 border border-slate-800'
                  }`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {/* BOTONES EXCLUSIVOS DE CONTROL DE ROLES Y SEGURIDAD */}
                  {user.rol === 'Usuario' ? (
                    <button 
                      onClick={() => abrirModal(user.id, 'promover')}
                      className="text-xs bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide"
                    >
                      Hacer Admin
                    </button>
                  ) : (
                    <button 
                      onClick={() => abrirModal(user.id, 'degradar')}
                      className="text-xs bg-slate-800 hover:bg-amber-900/60 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide"
                    >
                      Quitar Admin
                    </button>
                  )}

                  <button 
                    onClick={() => abrirModal(user.id, 'eliminar')}
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

      {/* VENTANA DE CONFIRMACIÓN DINÁMICA DE USUARIOS */}
      {modalTipo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center relative hover:border-cyan-500/20 transition-all duration-300">
            
            {/* Mensajes según la acción de seguridad de la cuenta */}
            {modalTipo === 'promover' && (
              <>
                <div className="text-cyan-400 text-4xl mb-3">🔑</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">¿Ascender a Administrador?</h3>
                <p className="text-sm text-slate-400 mb-6">Este usuario obtendrá permisos para gestionar inmuebles, pagos, planes y controlar otras cuentas.</p>
              </>
            )}

            {modalTipo === 'degradar' && (
              <>
                <div className="text-amber-400 text-4xl mb-3">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">¿Revocar Permisos?</h3>
                <p className="text-sm text-slate-400 mb-6">Se removerá el rol administrativo. El usuario volverá a tener accesos restringidos de cliente común.</p>
              </>
            )}

            {modalTipo === 'eliminar' && (
              <>
                <div className="text-rose-500 text-4xl mb-3">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">¿Eliminar Cuenta?</h3>
                <p className="text-sm text-slate-400 mb-6">Esta acción dará de baja de forma definitiva la cuenta del usuario en el sistema inmobiliario.</p>
              </>
            )}
            
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
                  modalTipo === 'promover' ? 'bg-slate-800 hover:bg-cyan-950/80 hover:text-cyan-400 border-slate-700 hover:border-cyan-500/40 text-slate-200' :
                  modalTipo === 'degradar' ? 'bg-slate-800 hover:bg-amber-950/80 hover:text-amber-400 border border-slate-700 hover:border-amber-500/40 text-slate-200' :
                  'bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-slate-200'
                }`}
              >
                {modalTipo === 'promover' && 'Sí, Ascender'}
                {modalTipo === 'degradar' && 'Sí, Revocar'}
                {modalTipo === 'eliminar' && 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

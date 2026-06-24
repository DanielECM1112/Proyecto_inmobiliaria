import React, { useState, useEffect } from 'react';
import { adminService } from './adminService';

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalTipo, setModalTipo] = useState(null); // 'activar' | 'desactivar' | 'rol'
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Usuario');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const datos = await adminService.getUsuarios();
      setUsuarios(datos);
      setMensajeError('');
    } catch (err) {
      setMensajeError('No se pudieron cargar los usuarios. Intenta de nuevo más tarde.');
    }
  };

  const abrirModal = (id, tipo, rol = 'Usuario') => {
    setIdSeleccionado(id);
    setModalTipo(tipo);
    setSelectedRole(rol);
  };

  const cerrarModal = () => {
    setModalTipo(null);
    setIdSeleccionado(null);
    setSelectedRole('Usuario');
    setMensajeError('');
    setMensajeExito('');
  };

  const procesarAccionConfirmada = async () => {
    if (!idSeleccionado) return;

    try {
      if (modalTipo === 'activar') {
        await adminService.toggleUsuarioActivo(idSeleccionado, true);
        setMensajeExito('Usuario activado correctamente.');
      } else if (modalTipo === 'desactivar') {
        await adminService.toggleUsuarioActivo(idSeleccionado, false);
        setMensajeExito('Usuario desactivado correctamente.');
      } else if (modalTipo === 'eliminar') {
        await adminService.eliminarUsuario(idSeleccionado);
        setMensajeExito('Usuario eliminado correctamente.');
      } else if (modalTipo === 'rol') {
        await adminService.editarRolUsuario(idSeleccionado, selectedRole);
        setMensajeExito(`Rol actualizado a ${selectedRole}.`);
      }
      await cargarUsuarios();
      cerrarModal();
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      setMensajeError('No se pudo actualizar el usuario. Por favor verifica tu conexión.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen text-slate-100 transition-all duration-1000 hover:to-indigo-950/80 relative">
      <h1 className="text-3xl font-bold mb-6 tracking-wide text-white">Control de Usuarios</h1>

      {mensajeError && (
        <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-100 text-sm">
          {mensajeError}
        </div>
      )}
      {mensajeExito && (
        <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-100 text-sm">
          {mensajeExito}
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/60 text-left">
          <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Nombre Completo</th>
              <th className="px-6 py-4">Correo Electrónico</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Activo</th>
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
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    user.activo
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-950/50 text-amber-400 border border-amber-500/20'
                  }`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => abrirModal(user.id, 'rol', user.rol)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 border border-slate-700 text-slate-300"
                  >
                    Cambiar rol
                  </button>
                  <button
                    onClick={() => abrirModal(user.id, user.activo ? 'desactivar' : 'activar')}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide border ${
                      user.activo
                        ? 'bg-slate-800 hover:bg-rose-900/80 hover:text-rose-300 border border-slate-700 text-slate-300'
                        : 'bg-slate-800 hover:bg-emerald-900/80 hover:text-emerald-300 border border-slate-700 text-slate-300'
                    }`}
                  >
                    {user.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => abrirModal(user.id, 'eliminar')}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all duration-300 font-bold tracking-wide bg-rose-700 hover:bg-rose-600 border border-rose-800 text-white"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalTipo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center relative hover:border-cyan-500/20 transition-all duration-300">
            {modalTipo === 'rol' ? (
              <>
                <div className="text-cyan-400 text-4xl mb-3">⚙️</div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Cambiar rol del usuario</h3>
                <p className="text-sm text-slate-400 mb-6">Selecciona el rol que deseas asignar a este usuario.</p>
                <div className="mb-6">
                  <label className="block text-left text-sm font-semibold text-slate-300 mb-2">Rol</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option>Usuario</option>
                    <option>Administrador</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className={`text-4xl mb-3 ${modalTipo === 'activar' ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {modalTipo === 'activar' ? '✔️' : '⚠️'}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                  {modalTipo === 'activar' ? '¿Activar usuario?' : '¿Desactivar usuario?'}
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  {modalTipo === 'activar'
                    ? 'El usuario recuperará acceso al sistema y podrá iniciar sesión nuevamente.'
                    : 'El usuario quedará bloqueado y no podrá acceder hasta que se reactive.'}
                </p>
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
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300 tracking-wide border ${modalTipo === 'activar' || modalTipo === 'rol' ? 'bg-cyan-500 hover:bg-cyan-400 border-cyan-500 text-slate-950' : 'bg-rose-500 hover:bg-rose-400 border-rose-500 text-slate-950'}`}
              >
                {modalTipo === 'activar' ? 'Sí, Activar' : modalTipo === 'desactivar' ? 'Sí, Desactivar' : 'Guardar rol'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

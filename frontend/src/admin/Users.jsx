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
    <div className="p-8 bg-[#070708] min-h-screen">
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase mb-3" style={{ color: '#C9A84C', letterSpacing: '7px' }}>
          LUXHABITAT · USUARIOS
        </p>
        <h1 className="text-4xl font-serif text-white" style={{ fontWeight: 500 }}>
          Control de Usuarios
        </h1>
        <div className="h-px w-12 mt-4" style={{ background: '#C9A84C' }} />
      </div>

      {mensajeError && (
        <div className="mb-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 p-4 text-rose-100 text-sm">
          {mensajeError}
        </div>
      )}
      {mensajeExito && (
        <div className="mb-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-200 text-sm">
          {mensajeExito}
        </div>
      )}

      <div className="border border-white/10 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-[#070708] text-white/50 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-6">Nombre Completo</th>
              <th className="px-8 py-6">Correo Electrónico</th>
              <th className="px-8 py-6">Rol</th>
              <th className="px-8 py-6">Activo</th>
              <th className="px-8 py-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-white/80">
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors duration-200">
                <td className="px-8 py-6 font-semibold text-white">{user.nombre}</td>
                <td className="px-8 py-6 text-white/50">{user.correo}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-[2rem] text-xs font-bold border ${
                    user.rol === 'Administrador'
                      ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20'
                      : 'bg-white/5 text-white/50 border-white/10'
                  }`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-[2rem] text-xs font-bold border ${
                    user.activo
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-8 py-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => abrirModal(user.id, 'rol', user.rol)}
                    className="text-xs px-4 py-2 rounded-[2rem] transition-all duration-300 font-bold tracking-wide bg-white/5 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] border border-white/10 text-white/50"
                  >
                    Cambiar rol
                  </button>
                  <button
                    onClick={() => abrirModal(user.id, user.activo ? 'desactivar' : 'activar')}
                    className={`text-xs px-4 py-2 rounded-[2rem] transition-all duration-300 font-bold tracking-wide border ${
                      user.activo
                        ? 'bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border-white/10 text-white/50'
                        : 'bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 border-white/10 text-white/50'
                    }`}
                  >
                    {user.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => abrirModal(user.id, 'eliminar')}
                    className="text-xs px-4 py-2 rounded-[2rem] transition-all duration-300 font-bold tracking-wide bg-rose-500 hover:bg-rose-400 border border-rose-500 text-white"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="border border-white/10 p-8 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl max-w-md w-full text-center relative">
            {modalTipo === 'rol' ? (
              <>
                <div className="text-5xl mb-4" style={{ color: '#C9A84C' }}>⚙️</div>
                <h3 className="text-2xl font-serif text-white mb-3" style={{ fontWeight: 500 }}>Cambiar rol del usuario</h3>
                <p className="text-sm text-white/60 mb-8">Selecciona el rol que deseas asignar a este usuario.</p>
                <div className="mb-8">
                  <label className="block text-left text-sm font-semibold text-white/50 mb-3">Rol</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full rounded-[2rem] border border-white/10 bg-[#070708] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option>Usuario</option>
                    <option>Administrador</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className={`text-5xl mb-4 ${modalTipo === 'activar' ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {modalTipo === 'activar' ? '✔️' : '⚠️'}
                </div>
                <h3 className="text-2xl font-serif text-white mb-3" style={{ fontWeight: 500 }}>
                  {modalTipo === 'activar' ? '¿Activar usuario?' : '¿Desactivar usuario?'}
                </h3>
                <p className="text-sm text-white/60 mb-8">
                  {modalTipo === 'activar'
                    ? 'El usuario recuperará acceso al sistema y podrá iniciar sesión nuevamente.'
                    : 'El usuario quedará bloqueado y no podrá acceder hasta que se reactive.'}
                </p>
              </>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={cerrarModal}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm font-bold rounded-[2rem] transition-all duration-300 tracking-wide"
              >
                Cancelar
              </button>
              <button
                onClick={procesarAccionConfirmada}
                className={`px-6 py-3 text-sm font-bold rounded-[2rem] transition-all duration-300 tracking-wide border ${modalTipo === 'activar' || modalTipo === 'rol' ? 'bg-emerald-500 hover:bg-emerald-400 border-emerald-500 text-white' : 'bg-rose-500 hover:bg-rose-400 border-rose-500 text-white'}`}
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

import React, { useState, useEffect } from 'react';
import { adminService } from './adminService'; 

export default function Payments() {
  const [pagos, setPagos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');

  useEffect(() => { cargarPagos(); }, []);

  const cargarPagos = async () => {
    const datos = await adminService.getPagos();
    setPagos(datos);
  };

  const abrirModal = (id, estado) => {
    setIdSeleccionado(id);
    setNuevoEstado(estado);
    setModalAbierto(true);
  };

  const confirmarEstado = async () => {
    if (idSeleccionado && nuevoEstado) {
      await adminService.cambiarEstadoPago(idSeleccionado, nuevoEstado);
      cargarPagos();
    }
    setModalAbierto(false);
    setIdSeleccionado(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen text-slate-100 transition-all duration-1000 hover:to-indigo-950/80 relative">
      <h1 className="text-3xl font-bold mb-6 tracking-wide text-white">Historial de Pagos</h1>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/60 text-left">
          <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Referencia</th>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Plan Comprado</th>
              <th className="px-6 py-4">Monto Recibido</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Auditar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
            {pagos.map((pago) => (
              <tr key={pago.id} className="hover:bg-slate-800/20 transition-colors duration-200">
                <td className="px-6 py-4 font-mono font-bold text-cyan-400 bg-cyan-950/20 rounded-md tracking-wider">{pago.id}</td>
                <td className="px-6 py-4 font-semibold text-white">{pago.usuario}</td>
                <td className="px-6 py-4 text-slate-400">{pago.plan}</td>
                <td className="px-6 py-4 text-emerald-400 font-extrabold text-base">{pago.monto}</td>
                <td className="px-6 py-4 text-slate-500">{pago.fecha}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    pago.estado === 'Aprobado' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' :
                    pago.estado === 'Pendiente' ? 'bg-amber-950/50 text-amber-400 border border-amber-500/20' :
                    'bg-rose-950/50 text-rose-400 border border-rose-500/20'
                  }`}>
                    {pago.estado}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => abrirModal(pago.id, 'Aprobado')} disabled={pago.estado === 'Aprobado'} className="text-[10px] bg-slate-800 hover:bg-emerald-900/40 hover:text-emerald-400 border border-slate-700 text-slate-400 px-2 py-1 rounded font-bold disabled:opacity-20 disabled:cursor-not-allowed">Aprobar</button>
                  <button onClick={() => abrirModal(pago.id, 'Rechazado')} disabled={pago.estado === 'Rechazado'} className="text-[10px] bg-slate-800 hover:bg-rose-900/40 hover:text-rose-400 border border-slate-700 text-slate-400 px-2 py-1 rounded font-bold disabled:opacity-20 disabled:cursor-not-allowed">Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE AUDITORÍA BANCARIA */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center relative">
            <div className="text-cyan-400 text-4xl mb-3">💳</div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide">¿Modificar Estado de Pago?</h3>
            <p className="text-sm text-slate-400 mb-6">Vas a cambiar la transacción a estado <span className="text-white font-bold">{nuevoEstado}</span>. Asegúrate de verificar el extracto bancario.</p>
            
            <div className="flex gap-3 justify-center">
              <button onClick={() => setModalAbierto(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all duration-300">Cancelar</button>
              <button onClick={confirmarEstado} className="px-4 py-2 bg-slate-800 hover:bg-cyan-950/80 hover:text-cyan-400 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all duration-300">Sí, Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

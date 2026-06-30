import React, { useState, useEffect } from 'react';
import { adminService } from './adminService';

export default function Payments() {
  const [pagos, setPagos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { cargarPagos(); }, []);

  const cargarPagos = async () => {
    try {
      const datos = await adminService.getPagos();
      setPagos(datos);
      setError('');
    } catch (err) {
      setError('No se pudo cargar el historial de pagos. Intenta de nuevo más tarde.');
    }
  };

  const abrirModal = (id, estado) => {
    setIdSeleccionado(id);
    setNuevoEstado(estado);
    setModalAbierto(true);
  };

  const confirmarEstado = async () => {
    if (!idSeleccionado || !nuevoEstado) return;

    try {
      await adminService.cambiarEstadoPago(idSeleccionado, nuevoEstado);
      await cargarPagos();
      setModalAbierto(false);
      setIdSeleccionado(null);
    } catch (err) {
      setError('No se pudo actualizar el estado del pago. Intenta nuevamente.');
    }
  };

  return (
    <div className="p-8 bg-[#070708] min-h-screen">
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase mb-3" style={{ color: "#D4B05E", letterSpacing: "7px" }}>
          LUXHABITAT · PAGOS
        </p>
        <h1 className="text-4xl font-serif text-white" style={{ fontWeight: 500 }}>
          Historial de Pagos
        </h1>
        <div className="h-px w-12 mt-4" style={{ background: "#C9A84C" }} />
      </div>

      {error && (
        <div className="mb-8 rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="border border-white/10 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-[#0b0c10] text-white/50 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-6">Referencia</th>
              <th className="px-8 py-6">Usuario</th>
              <th className="px-8 py-6">Plan</th>
              <th className="px-8 py-6">Monto</th>
              <th className="px-8 py-6">Fecha</th>
              <th className="px-8 py-6">Estado</th>
              <th className="px-8 py-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-white/80">
            {pagos.map((pago) => (
              <tr key={pago.id} className="hover:bg-white/5 transition-colors duration-200">
                <td className="px-8 py-6 font-mono font-bold rounded-md tracking-wider" style={{ color: "#C9A84C", background: "rgba(201, 168, 76, 0.1)" }}>{pago.referencia}</td>
                <td className="px-8 py-6 font-semibold text-white">{pago.usuario}</td>
                <td className="px-8 py-6 text-white/50">{pago.plan}</td>
                <td className="px-8 py-6 font-extrabold" style={{ color: "#C9A84C" }}>{pago.monto}</td>
                <td className="px-8 py-6 text-white/40">{pago.fecha}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-[2rem] text-xs font-bold border ${
                    pago.estado === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    pago.estado === 'Pendiente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {pago.estado}
                  </span>
                </td>
                <td className="px-8 py-6 flex flex-wrap gap-2">
                  <button 
                    onClick={() => abrirModal(pago.id, 'Aprobado')} 
                    disabled={pago.estado === 'Aprobado'} 
                    className="text-xs bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 border border-white/10 text-white/50 px-4 py-2 rounded-[2rem] font-bold disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    Aprobar
                  </button>
                  <button 
                    onClick={() => abrirModal(pago.id, 'Rechazado')} 
                    disabled={pago.estado === 'Rechazado'} 
                    className="text-xs bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/10 text-white/50 px-4 py-2 rounded-[2rem] font-bold disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="border border-white/10 p-8 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl max-w-md w-full text-center relative">
            <div className="text-5xl mb-4" style={{ color: "#C9A84C" }}>💳</div>
            <h3 className="text-2xl font-serif text-white mb-3" style={{ fontWeight: 500 }}>¿Modificar estado del pago?</h3>
            <p className="text-sm text-white/60 mb-8">Vas a cambiar la transacción a estado <span className="text-white font-bold">{nuevoEstado}</span>. Verifica antes de confirmar.</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setModalAbierto(false)} 
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm font-bold rounded-[2rem] transition-all duration-300"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEstado} 
                className="px-6 py-3 text-sm font-bold rounded-[2rem] transition-all duration-300"
                style={{ background: "linear-gradient(to right, #b38b1d, #f9d85b)", color: "#070708" }}
              >
                Sí, confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

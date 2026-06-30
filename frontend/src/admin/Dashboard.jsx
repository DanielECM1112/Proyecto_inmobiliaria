import React, { useState, useEffect } from 'react';
import { adminService } from './adminService';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    inmueblesActivos: 0,
    inmueblesPendientes: 0,
    usuariosRegistrados: 0,
    ingresos: '$0.00'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const datosCalculados = await adminService.getMetrics();
      setMetrics(datosCalculados);
      setError('');
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setError('No se pudieron cargar las estadísticas. Por favor, recarga la página.');
    }
  };

  // Cálculos dinámicos para los porcentajes visuales de los gráficos
  const maxInmuebles = 10;
  const pctInmuebles = Math.min(((metrics.inmueblesActivos + metrics.inmueblesPendientes) / maxInmuebles) * 100, 100);

  const maxUsuarios = 20;
  const pctUsuarios = Math.min((metrics.usuariosRegistrados / maxUsuarios) * 100, 100);

  // Extrae el número flotante del string para calcular el progreso de ingresos
  const valorIngresos = parseFloat(metrics.ingresos.replace('$', '').replace(/,/g, '')) || 0;
  const maxIngresos = 5000000; // Ajustado a COP
  const pctIngresos = Math.min((valorIngresos / maxIngresos) * 100, 100);

  return (
    <div className="p-8 bg-[#070708] min-h-screen">
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase mb-3" style={{ color: "#D4B05E", letterSpacing: "7px" }}>
          LUXHABITAT · DASHBOARD
        </p>
        <h1 className="text-4xl font-serif text-white" style={{ fontWeight: 500 }}>
          Panel de Control
        </h1>
        <div className="h-px w-12 mt-4" style={{ background: "#C9A84C" }} />
        <p className="text-sm mt-4 text-white/70 max-w-2xl">
          Monitoreo analítico del sistema inmobiliario en tiempo real.
        </p>
      </div>
      
      {error && (
        <div className="mb-8 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}
      
      {/* Tarjetas Analíticas con Widgets Circulares Dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* WIDGET 1: INMUEBLES */}
        <div className="p-8 border border-white/10 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl hover:border-[#b38b1d]/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Inmuebles Totales</p>
            <p className="text-4xl font-black text-white mt-4">
              {metrics.inmueblesActivos + metrics.inmueblesPendientes}
            </p>
            <p className="text-xs mt-2" style={{ color: "#D4B05E" }}>{metrics.inmueblesActivos} Activos</p>
            <p className="text-xs mt-1 text-white/50">{metrics.inmueblesPendientes} Pendientes</p>
          </div>
          {/* Gráfico Circular de Progreso */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path style={{ stroke: "#C9A84C", transition: "all 1s ease-out" }} strokeDasharray={`${pctInmuebles}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-bold" style={{ color: "#C9A84C" }}>{Math.round(pctInmuebles)}%</span>
          </div>
        </div>
        
        {/* WIDGET 2: USUARIOS */}
        <div className="p-8 border border-white/10 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl hover:border-[#b38b1d]/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Usuarios Registrados</p>
            <p className="text-4xl font-black text-white mt-4">
              {metrics.usuariosRegistrados}
            </p>
            <p className="text-xs mt-2 text-white/50">Capacidad de escala: {maxUsuarios} cuentas</p>
          </div>
          {/* Gráfico Circular de Progreso */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path style={{ stroke: "#C9A84C", transition: "all 1s ease-out" }} strokeDasharray={`${pctUsuarios}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-bold" style={{ color: "#C9A84C" }}>{Math.round(pctUsuarios)}%</span>
          </div>
        </div>
        
        {/* WIDGET 3: INGRESOS RECAUDADOS */}
        <div className="p-8 border border-white/10 rounded-[2rem] bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl hover:border-[#b38b1d]/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Ingresos Mensuales</p>
            <p className="text-4xl font-black mt-4" style={{ color: "#C9A84C" }}>
              {metrics.ingresos}
            </p>
            <p className="text-xs mt-2 text-white/50">Meta comercial: ${maxIngresos}.00 COP</p>
          </div>
          {/* Gráfico Circular de Progreso */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path style={{ stroke: "#C9A84C", transition: "all 1s ease-out" }} strokeDasharray={`${pctIngresos}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-bold" style={{ color: "#C9A84C" }}>{Math.round(pctIngresos)}%</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}

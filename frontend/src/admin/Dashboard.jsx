import React, { useState, useEffect } from 'react';
import { adminService } from './adminService';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    inmueblesActivos: 0,
    usuariosRegistrados: 0,
    ingresos: '$0.00'
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    const datosCalculados = await adminService.getMetrics();
    setMetrics(datosCalculados);
  };

  // Cálculos dinámicos para los porcentajes visuales de los gráficos
  const maxInmuebles = 10;
  const pctInmuebles = Math.min((metrics.inmueblesActivos / maxInmuebles) * 100, 100);

  const maxUsuarios = 20;
  const pctUsuarios = Math.min((metrics.usuariosRegistrados / maxUsuarios) * 100, 100);

  // Extrae el número flotante del string para calcular el progreso de ingresos
  const valorIngresos = parseFloat(metrics.ingresos.replace('$', '')) || 0;
  const maxIngresos = 500;
  const pctIngresos = Math.min((valorIngresos / maxIngresos) * 100, 100);

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen text-slate-100 transition-all duration-1000 hover:to-indigo-950/80">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow-sm">Panel de Control</h1>
        <p className="text-sm text-slate-400 mt-1">Monitoreo analítico del sistema inmobiliario en tiempo real.</p>
      </div>
      
      {/* Tarjetas Analíticas con Widgets Circulares Dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* WIDGET 1: INMUEBLES */}
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md hover:border-cyan-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inmuebles Activos</p>
            <p className="text-4xl font-black text-white mt-2 drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
              {metrics.inmueblesActivos}
            </p>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Meta operativa: {maxInmuebles} aprobados</p>
          </div>
          {/* Gráfico Circular de Progreso */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-emerald-400 transition-all duration-1000 ease-out" strokeDasharray={`${pctInmuebles}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-bold text-emerald-400">{Math.round(pctInmuebles)}%</span>
          </div>
        </div>
        
        {/* WIDGET 2: USUARIOS */}
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md hover:border-cyan-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usuarios Registrados</p>
            <p className="text-4xl font-black text-white mt-2 drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
              {metrics.usuariosRegistrados}
            </p>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Capacidad de escala: {maxUsuarios} cuentas</p>
          </div>
          {/* Gráfico Circular de Progreso */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-indigo-400 transition-all duration-1000 ease-out" strokeDasharray={`${pctUsuarios}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-bold text-indigo-400">{Math.round(pctUsuarios)}%</span>
          </div>
        </div>
        
        {/* WIDGET 3: INGRESOS RECAUDADOS */}
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md hover:border-cyan-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingresos Mensuales</p>
            <p className="text-4xl font-black text-cyan-400 mt-2 drop-shadow-[0_2px_10px_rgba(34,211,238,0.2)]">
              {metrics.ingresos}
            </p>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Meta comercial: ${maxIngresos}.00 USD</p>
          </div>
          {/* Gráfico Circular de Progreso */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-cyan-400 transition-all duration-1000 ease-out" strokeDasharray={`${pctIngresos}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-bold text-cyan-400">{Math.round(pctIngresos)}%</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}

import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Panel de Control</h1>
      
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Inmuebles Activos</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Usuarios Registrados</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">142</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ingresos Mensuales</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">$2,450.00</p>
        </div>
      </div>
    </div>
  );
}

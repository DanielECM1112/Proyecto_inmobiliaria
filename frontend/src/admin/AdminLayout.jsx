import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import PropertiesAdmin from './Properties';

export default function AdminLayout() {
  const [seccion, setSeccion] = useState('dashboard');

  return (
    <div className="flex bg-slate-100 min-h-screen">
      {/* Menú lateral fijo */}
      <Sidebar setSeccion={setSeccion} />

      {/* Contenedor de pantallas con espacio a la izquierda para no taparse con el Sidebar */}
      <div className="flex-1 ml-64 bg-slate-100 min-h-screen">
        {seccion === 'dashboard' && <Dashboard />}
        {seccion === 'properties' && <PropertiesAdmin />}
        {seccion === 'users' && (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800">Gestión de Usuarios</h1>
            <p className="mt-2 text-slate-600">Sección en desarrollo para la administración de cuentas.</p>
          </div>
        )}
        {seccion === 'payments' && (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800">Historial de Pagos</h1>
            <p className="mt-2 text-slate-600">Sección en desarrollo para la auditoría de transacciones.</p>
          </div>
        )}
      </div>
    </div>
  );
}

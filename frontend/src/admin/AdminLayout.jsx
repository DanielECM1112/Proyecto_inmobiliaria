import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import PropertiesAdmin from './Properties';
import UsersAdmin from './Users';       
import PaymentsAdmin from './Payments'; 
import PlansAdmin from './Plans';       // Nueva importación definitiva

export default function AdminLayout() {
  const [seccion, setSeccion] = useState('dashboard');

  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Menú lateral fijo */}
      <Sidebar setSeccion={setSeccion} />

      {/* Contenedor dinámico oscuro unificado */}
      <div className="flex-1 ml-64 bg-slate-950 min-h-screen">
        {seccion === 'dashboard' && <Dashboard />}
        {seccion === 'properties' && <PropertiesAdmin />}
        {seccion === 'users' && <UsersAdmin />}
        {seccion === 'payments' && <PaymentsAdmin />}
        {seccion === 'plans' && <PlansAdmin />} {/* Activación de la pestaña comercial */}
      </div>
    </div>
  );
}

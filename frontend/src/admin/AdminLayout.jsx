import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import PropertiesAdmin from './Properties';
import UsersAdmin from './Users';       
import PaymentsAdmin from './Payments'; 
import PlansAdmin from './Plans';      

export default function AdminLayout() {
  const [seccion, setSeccion] = useState('dashboard');

  return (
    <div className="flex bg-[#070708] min-h-screen">
      <Sidebar setSeccion={setSeccion} seccionActual={seccion} />
      <div className="flex-1 ml-72 min-h-screen">
        {seccion === 'dashboard' && <Dashboard />}
        {seccion === 'properties' && <PropertiesAdmin />}
        {seccion === 'users' && <UsersAdmin />}
        {seccion === 'payments' && <PaymentsAdmin />}
        {seccion === 'plans' && <PlansAdmin />}
      </div>
    </div>
  );
}

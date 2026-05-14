import React from 'react';

export default function Sidebar({ setSeccion }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'properties', name: 'Inmuebles' },
    { id: 'users', name: 'Usuarios' },
    { id: 'payments', name: 'Pagos' }
  ];

  return (
    <div className="w-64 h-screen bg-slate-800 text-white flex flex-col p-4 fixed left-0 top-0 z-50">
      <h2 className="text-xl font-bold mb-8 text-center text-emerald-400 border-b border-slate-700 pb-4">
        LUXHABITAT Admin
      </h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSeccion(item.id)}
            className="text-left px-4 py-3 rounded hover:bg-slate-700 transition font-medium text-sm"
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

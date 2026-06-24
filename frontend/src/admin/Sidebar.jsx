import React from 'react';

export default function Sidebar({ setSeccion }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'properties', name: 'Inmuebles' },
    { id: 'users', name: 'Usuarios' },
    { id: 'payments', name: 'Pagos' },
     { id: 'plans', name: 'Planes' }
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white flex flex-col p-4 fixed left-0 top-0 z-50 shadow-2xl transition-all duration-500 hover:to-indigo-900">
      
      {/* Título con efecto Hover Tornasolado */}
      <h2 className="text-xl font-extrabold mb-8 text-center text-slate-100 border-b border-slate-700/50 pb-4 tracking-wide cursor-pointer transition-all duration-300 hover:text-cyan-400 hover:border-cyan-500/50 drop-shadow-[0_2px_8px_rgba(34,211,238,0.2)]">
        LUXHABITAT <span className="text-cyan-400 hover:text-slate-100">Admin</span>
      </h2>
      
      {/* Menú de Opciones */}
      <nav className="flex flex-col gap-2.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSeccion(item.id)}
            className="text-left px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm tracking-wide bg-slate-900/40 border border-transparent hover:bg-gradient-to-r hover:from-cyan-950 hover:to-blue-950 hover:text-cyan-300 hover:border-cyan-500/30 hover:translate-x-1 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

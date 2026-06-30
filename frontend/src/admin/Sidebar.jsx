import React from 'react';

export default function Sidebar({ setSeccion, seccionActual }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'properties', name: 'Inmuebles' },
    { id: 'users', name: 'Usuarios' },
    { id: 'payments', name: 'Pagos' },
    { id: 'plans', name: 'Planes' }
  ];

  return (
    <div className="w-72 h-screen bg-[#070708] text-white flex flex-col p-8 fixed left-0 top-0 z-50 border-r border-white/10">
      
      {/* Título */}
      <div className="mb-12">
        <p className="text-[11px] font-bold uppercase mb-2 text-center" style={{ color: "#D4B05E", letterSpacing: "7px" }}>
          LUXHABITAT
        </p>
        <h2 className="text-2xl font-serif text-center" style={{ fontWeight: 500 }}>
          Panel Admin
        </h2>
        <div className="h-px w-16 mt-4 mx-auto" style={{ background: "#C9A84C" }} />
      </div>
      
      {/* Menú de Opciones */}
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSeccion(item.id)}
            className={`text-left px-6 py-4 rounded-[2rem] transition-all duration-300 font-semibold text-sm tracking-wider border ${
              seccionActual === item.id 
                ? 'border-[#b38b1d]/30 bg-[#b38b1d]/10 text-white' 
                : 'border-transparent bg-transparent text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

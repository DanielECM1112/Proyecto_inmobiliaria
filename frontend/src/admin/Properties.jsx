import React from 'react';

export default function Properties() {
  const inmueblesMock = [
    { id: 1, titulo: "Apartamento Amoblado para enanos", precio: "$1,800,000", estado: "Pendiente" },
    { id: 2, titulo: "Casa Campestre Santa Helena", precio: "$450,000,000", estado: "Activo" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Gestión de Inmuebles</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Inmueble</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {inmueblesMock.map((inmueble) => (
              <tr key={inmueble.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{inmueble.titulo}</td>
                <td className="px-6 py-4">{inmueble.precio}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    inmueble.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inmueble.estado}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition font-medium">Aprobar</button>
                  <button className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded transition font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const services = [
    "Compra de Propiedades",
    "Venta de Inmuebles",
    "Alquileres",
    "Asesoría Inmobiliaria",
    "Tasaciones",
    "Gestión Documental"
  ];

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className="text-3xl font-black tracking-tighter">LUX<span className="text-gray-400">HABITAT</span></h2>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Tu aliado confiable en el mercado inmobiliario premium. Conectamos sueños con hogares desde hace más de una década.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider">Servicios</h3>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="text-gray-400 hover:text-white transition-colors cursor-default">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider">Enlaces</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/properties" className="text-gray-400 hover:text-white transition-colors">Propiedades</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link to="/location" className="text-gray-400 hover:text-white transition-colors">Ubicación</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider">Newsletter</h3>
            <p className="text-gray-400 mb-6">Suscríbete para recibir las últimas ofertas.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="bg-gray-800 border-none rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-white transition-all"
              />
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all">
                Ir
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-10 text-center text-gray-500">
          <p>© 2026 LUXHABITAT Inmobiliaria Premium. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

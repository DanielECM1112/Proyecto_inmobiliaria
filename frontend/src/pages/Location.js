import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LocationIcon3D from '../components/LocationIcon3D';

export default function Location() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-8 relative">
        {/* Fondo con imagen */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.08
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'var(--section-overlay)' }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero con icono 3D */}
          <div className="text-center mb-20">
            <div className="flex justify-center mb-8">
              <LocationIcon3D />
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              Nuestra <span className="text-violet-400">Ubicación</span>
            </h1>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-medium">
              Encuéntranos en nuestras oficinas principales y comienza tu viaje hacia tu hogar ideal
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Información de Contacto */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-12 shadow-2xl shadow-black/50 space-y-10">
              <div>
                <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Información de Contacto
                </h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 p-6 bg-gray-950/50 rounded-2xl border border-gray-800 hover:border-violet-500/50 transition-colors">
                    <div className="w-14 h-14 bg-violet-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Dirección</h3>
                      <p className="text-gray-400 text-lg">Av. Principal Calle 100 #15-30, Bogotá, Colombia</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 p-6 bg-gray-950/50 rounded-2xl border border-gray-800 hover:border-violet-500/50 transition-colors">
                    <div className="w-14 h-14 bg-violet-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Teléfono</h3>
                      <p className="text-gray-400 text-lg">+57 601 234 5678</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 p-6 bg-gray-950/50 rounded-2xl border border-gray-800 hover:border-violet-500/50 transition-colors">
                    <div className="w-14 h-14 bg-violet-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Email</h3>
                      <p className="text-gray-400 text-lg">contacto@luxhabitat.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-2xl border border-violet-500/20">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Horario de Atención
                </h3>
                <ul className="space-y-3 text-xl">
                  <li className="flex justify-between text-gray-300">
                    <span className="font-medium">Lunes - Viernes:</span>
                    <span className="text-white font-bold">8:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between text-gray-300">
                    <span className="font-medium">Sábados:</span>
                    <span className="text-white font-bold">9:00 AM - 1:00 PM</span>
                  </li>
                  <li className="flex justify-between text-gray-300">
                    <span className="font-medium">Domingos:</span>
                    <span className="text-gray-500 font-bold">Cerrado</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127253.28186196226!2d-74.131745421582!3d4.648283733230635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d3955c3e387fd!2zQm9nb3TDoA!5e0!3m2!1ses!2sco!4v1715424000000!5m2!1ses!2sco" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

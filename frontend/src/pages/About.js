import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Sobre Nosotros</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos líderes en el mercado inmobiliario, dedicados a conectar a las personas con sus hogares ideales a través de un servicio excepcional y transparente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
                alt="Nuestro Equipo" 
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">Nuestra Misión</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transformar la experiencia de compra y venta de inmuebles mediante el uso de tecnología avanzada y un equipo humano altamente capacitado, garantizando seguridad y satisfacción total.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2">+10</h3>
                  <p className="text-gray-500 font-semibold uppercase tracking-wider">Años de Experiencia</p>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2">+500</h3>
                  <p className="text-gray-500 font-semibold uppercase tracking-wider">Propiedades Vendidas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-8">¿Por qué elegirnos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Seguridad</h3>
                <p className="text-gray-400">Procesos legales transparentes y garantizados.</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Rapidez</h3>
                <p className="text-gray-400">Encontramos tu hogar en tiempo récord.</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Precio Justo</h3>
                <p className="text-gray-400">Tasaciones precisas y competitivas.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Terms() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDarkMode ? "bg-[#05080a]" : "bg-white"
    }`}>
      <Navbar />
      <div className={`pt-44 pb-32 text-center px-8 relative overflow-hidden transition-colors duration-500 ${
        isDarkMode 
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
      }`}>
        {/* Imagen de fondo con opacidad ajustada para ambos temas */}
        <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center transition-opacity duration-500 ${
          isDarkMode ? "opacity-15" : "opacity-20"
        }`}></div>
        
        {/* Overlay inteligente que mejora contraste */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isDarkMode 
            ? "bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80" 
            : "bg-gradient-to-r from-white/70 via-blue-50/50 to-white/70"
        }`}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight ${
            isDarkMode ? "text-white" : "text-dark-900"
          }`}>Términos y <span className={`italic font-light ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Condiciones</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className={`text-xl font-light max-w-2xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-dark-700"
          }`}>Acuerdo legal para el uso de nuestra plataforma inmobiliaria premium.</motion.p>
        </div>
      </div>
      <main className={`flex-grow py-24 px-8 transition-colors duration-500 ${
        isDarkMode ? "bg-[#05080a]" : "bg-white"
      }`}>
        <div className={`max-w-4xl mx-auto space-y-12 font-light leading-relaxed ${
          isDarkMode ? "text-gray-300" : "text-slate-700"
        }`}>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar el sitio web de LUXHABITAT, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.</p>
          </section>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>2. Publicación de Propiedades</h2>
            <p>Los usuarios que contraten planes de publicación son responsables de la veracidad de la información proporcionada. LUXHABITAT se reserva el derecho de retirar cualquier publicación que contenga información falsa o engañosa.</p>
          </section>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>3. Responsabilidad</h2>
            <p>LUXHABITAT actúa como una plataforma de conexión entre compradores y vendedores. No nos hacemos responsables de las negociaciones directas entre las partes ni de los vicios ocultos de las propiedades publicadas.</p>
          </section>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>4. Propiedad Intelectual</h2>
            <p>Todo el contenido, diseño y material gráfico de este sitio es propiedad exclusiva de LUXHABITAT y está protegido por las leyes de derechos de autor en Colombia.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

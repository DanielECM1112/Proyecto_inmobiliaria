import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Cookies() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDarkMode ? "bg-[#05080a]" : "bg-white"
    }`}>
      <Navbar />
      <div className={`pt-44 pb-32 text-center px-8 relative overflow-hidden transition-colors duration-500 ${
        isDarkMode 
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
          : "bg-gradient-to-br from-slate-50 via-gold-50 to-slate-100"
      }`}>
        {/* Imagen de fondo con opacidad ajustada para ambos temas */}
        <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center transition-opacity duration-500 ${
          isDarkMode ? "opacity-15" : "opacity-20"
        }`}></div>
        
        {/* Overlay inteligente que mejora contraste */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isDarkMode 
            ? "bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80" 
            : "bg-gradient-to-r from-white/70 via-gold-50/50 to-white/70"
        }`}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight ${
            isDarkMode ? "text-white" : "text-dark-900"
          }`}>Política de <span className={`italic font-light ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Cookies</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className={`text-xl font-light max-w-2xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-dark-700"
          }`}>Mejorando tu experiencia digital de forma inteligente.</motion.p>
        </div>
      </div>
      <main className={`flex-grow py-24 px-8 transition-colors duration-500 ${
        isDarkMode ? "bg-[#05080a]" : "bg-white"
      }`}>
        <div className={`max-w-4xl mx-auto space-y-12 font-light leading-relaxed ${
          isDarkMode ? "text-gray-300" : "text-slate-700"
        }`}>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestro sitio web. Nos ayudan a recordar sus preferencias y mejorar su experiencia de navegación.</p>
          </section>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>Uso de Cookies en LuxHabitat</h2>
            <p>Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y cookies de análisis para entender cómo los usuarios interactúan con nuestra plataforma. Estas últimas nos permiten optimizar nuestro diseño y contenido.</p>
          </section>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>Control de Cookies</h2>
            <p>Usted puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envíe una. Sin embargo, algunas partes de nuestro sitio pueden no funcionar correctamente si deshabilita las cookies.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

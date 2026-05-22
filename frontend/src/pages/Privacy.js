import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Privacy() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDarkMode ? "bg-[#05080a]" : "bg-white"
    }`}>
      <Navbar />
      <div className={`pt-44 pb-32 text-center px-8 relative overflow-hidden transition-colors duration-500 ${
        isDarkMode 
          ? "bg-gradient-to-br from-[#0f1419] to-[#1a2332]" 
          : "bg-gradient-to-br from-light-100 to-light-200"
      }`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight ${
            isDarkMode ? "text-white" : "text-dark-900"
          }`}>Política de <span className={`italic font-light ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Privacidad</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className={`text-xl font-light max-w-2xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-dark-700"
          }`}>Tu privacidad y la seguridad de tus datos son nuestra prioridad absoluta.</motion.p>
        </div>
      </div>
      <main className={`flex-grow py-24 px-8 transition-colors duration-500 ${
        isDarkMode ? "text-white" : "text-dark-900"
      }`}>
        <div className={`max-w-4xl mx-auto space-y-12 font-light leading-relaxed ${
          isDarkMode ? "text-gray-400" : "text-dark-700"
        }`}>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>1. Recolección de Información</h2>
            <p>Recopilamos información personal básica como nombre, correo electrónico y teléfono únicamente cuando el usuario decide contactarnos o contratar un plan de publicación.</p>
          </section>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>2. Uso de los Datos</h2>
            <p>Sus datos se utilizan para gestionar su cuenta, procesar pagos y mejorar la experiencia del usuario. Nunca compartimos su información personal con terceros con fines comerciales sin su consentimiento explícito.</p>
          </section>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>3. Seguridad</h2>
            <p>Implementamos protocolos de cifrado y medidas de seguridad técnicas para proteger sus datos personales contra acceso no autorizado, alteración o divulgación.</p>
          </section>
          <section>
            <h2 className={`text-2xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-dark-900"}`}>4. Tus Derechos</h2>
            <p>De acuerdo con la Ley 1581 de 2012 (Habeas Data), usted tiene derecho a conocer, actualizar y rectificar sus datos personales en cualquier momento a través de nuestros canales de contacto.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

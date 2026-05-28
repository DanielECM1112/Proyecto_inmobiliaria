import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Terms() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="pt-44 pb-32 text-center px-8 relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {/* Imagen de fondo con opacidad ajustada */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.1
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'var(--section-overlay)' }} />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>Términos y <span className="italic font-light" style={{ color: 'var(--text-secondary)' }}>Condiciones</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl font-light max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Acuerdo legal para el uso de nuestra plataforma inmobiliaria premium.</motion.p>
        </div>
      </div>
      <main className="flex-grow py-24 px-8 transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-4xl mx-auto space-y-12 font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--text-primary)' }}>1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar el sitio web de LUXHABITAT, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--text-primary)' }}>2. Publicación de Propiedades</h2>
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

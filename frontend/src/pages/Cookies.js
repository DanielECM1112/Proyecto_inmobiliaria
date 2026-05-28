import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Cookies() {
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
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>Política de <span className="italic font-light" style={{ color: 'var(--text-secondary)' }}>Cookies</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl font-light max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Mejorando tu experiencia digital de forma inteligente.</motion.p>
        </div>
      </div>
      <main className="flex-grow py-24 px-8 transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-4xl mx-auto space-y-12 font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--text-primary)' }}>¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestro sitio web. Nos ayudan a recordar sus preferencias y mejorar su experiencia de navegación.</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Uso de Cookies en LuxHabitat</h2>
            <p>Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y cookies de análisis para entender cómo los usuarios interactúan con nuestra plataforma. Estas últimas nos permiten optimizar nuestro diseño y contenido.</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Control de Cookies</h2>
            <p>Usted puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envíe una. Sin embargo, algunas partes de nuestro sitio pueden no funcionar correctamente si deshabilita las cookies.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineLightningBolt, HiOutlineCash, HiOutlineSparkles } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { isDarkMode } = useTheme();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const stats = [
    { label: "Años de Experiencia", value: "+12", icon: <HiOutlineSparkles /> },
    { label: "Propiedades Entregadas", value: "+500", icon: <HiOutlineCash /> },
    { label: "Clientes Satisfechos", value: "100%", icon: <HiOutlineShieldCheck /> },
    { label: "Proyectos en Curso", value: "25", icon: <HiOutlineLightningBolt /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDarkMode ? "bg-primary-dark" : "bg-light-100"
    }`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
            alt="About Background" 
            className="w-full h-full object-cover"
            style={{
              opacity: isDarkMode ? 0.15 : 0.20,
              transition: "opacity 500ms"
            }}
          />
          <div className={`absolute inset-0 transition-colors duration-500 ${
            isDarkMode 
              ? "bg-gradient-to-br from-slate-900/85 via-slate-800/70 to-slate-900/85" 
              : "bg-gradient-to-br from-white/80 via-blue-50/60 to-white/80"
          }`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className={`text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight ${
              isDarkMode ? "text-white" : "text-dark-950"
            }`}>
              Nuestra <span className="text-blue-600 italic font-light">Historia</span>
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>
            <p className={`text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-slate-700"
            }`}>
              Definiendo el estándar del lujo inmobiliario en Colombia desde hace más de una década con excelencia y distinción.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-grow py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section 1: Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl -z-10 transition-colors duration-500 ${
                isDarkMode ? "bg-blue-500/5" : "bg-blue-600/10"
              }`}></div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" 
                alt="Nuestro Equipo" 
                className={`rounded-[3rem] shadow-2xl border-8 transition-colors duration-500 ${
                  isDarkMode ? "border-white/5" : "border-white"
                }`}
              />
              <div className={`absolute -bottom-8 -right-8 p-10 rounded-3xl shadow-2xl border hidden md:block transition-colors duration-500 backdrop-blur-xl ${
                isDarkMode 
                  ? "bg-midnight-DEFAULT/90 border-white/10" 
                  : "bg-white/90 border-light-200"
              }`}>
                <p className={`font-serif italic text-2xl transition-colors duration-500 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>"Excelencia en cada detalle."</p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className={`text-5xl font-serif font-bold leading-tight transition-colors duration-500 ${
                isDarkMode ? "text-white" : "text-dark-950"
              }`}>Misión & Visión</h2>
              <p className={`text-2xl font-light leading-relaxed italic transition-colors duration-500 ${
                isDarkMode ? "text-blue-400/80" : "text-blue-600/80"
              }`}>
                "No solo vendemos propiedades; creamos el escenario perfecto para los momentos más importantes de tu vida."
              </p>
              <p className={`text-lg leading-relaxed font-light transition-colors duration-500 ${
                isDarkMode ? "text-gray-400" : "text-dark-700"
              }`}>
                Transformamos la experiencia inmobiliaria mediante un enfoque personalizado, 
                tecnología de vanguardia y una integridad inquebrantable. Nuestra meta es ser el puente 
                entre tus sueños y la realidad de un hogar excepcional.
              </p>
              
              <div className="grid grid-cols-2 gap-10 pt-10">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2 group">
                    <div className={`text-4xl mb-4 transition-all duration-500 transform group-hover:scale-110 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}>{stat.icon}</div>
                    <h3 className={`text-5xl font-bold transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-dark-950"
                    }`}>{stat.value}</h3>
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 ${
                      isDarkMode ? "text-gray-500" : "text-dark-400"
                    }`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Section 2: Values */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl transition-all duration-500 ${
              isDarkMode 
                ? "bg-midnight-DEFAULT border border-white/5 shadow-black/40" 
                : "bg-blue-600 text-white shadow-blue-600/30"
            }`}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-20 relative z-10 ${isDarkMode ? "text-white" : "text-white"}`}>¿Por qué elegir LUXHABITAT?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
              <div className="space-y-6 group">
                <div className={`w-24 h-24 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border transition-all duration-500 transform group-hover:-translate-y-2 ${
                  isDarkMode 
                    ? "bg-white/5 border-white/10 group-hover:bg-blue-600 group-hover:text-white" 
                    : "bg-white/20 border-white/30 group-hover:bg-white group-hover:text-blue-600"
                }`}>
                  <HiOutlineShieldCheck className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold">Seguridad Total</h3>
                <p className={`font-light leading-relaxed text-lg ${isDarkMode ? "text-gray-300" : "text-gray-100"}`}>
                  Procesos legales blindados y total transparencia en cada transacción. Tu tranquilidad es nuestra prioridad.
                </p>
              </div>

              <div className="space-y-6 group">
                <div className={`w-24 h-24 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border transition-all duration-500 transform group-hover:-translate-y-2 ${
                  isDarkMode 
                    ? "bg-white/5 border-white/10 group-hover:bg-blue-600 group-hover:text-white" 
                    : "bg-white/20 border-white/30 group-hover:bg-white group-hover:text-blue-600"
                }`}>
                  <HiOutlineLightningBolt className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold">Gestión Ágil</h3>
                <p className={`font-light leading-relaxed text-lg ${isDarkMode ? "text-gray-300" : "text-gray-100"}`}>
                  Optimizamos cada paso para que encuentres tu hogar ideal o cierres tu venta en tiempo récord.
                </p>
              </div>

              <div className="space-y-6 group">
                <div className={`w-24 h-24 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border transition-all duration-500 transform group-hover:-translate-y-2 ${
                  isDarkMode 
                    ? "bg-white/5 border-white/10 group-hover:bg-blue-600 group-hover:text-white" 
                    : "bg-white/20 border-white/30 group-hover:bg-white group-hover:text-blue-600"
                }`}>
                  <HiOutlineCash className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold">Valor Real</h3>
                <p className={`font-light leading-relaxed text-lg ${isDarkMode ? "text-gray-300" : "text-gray-100"}`}>
                  Tasaciones precisas basadas en análisis de mercado en tiempo real para garantizar el precio justo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

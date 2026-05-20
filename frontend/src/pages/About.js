import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineLightningBolt, HiOutlineCash, HiOutlineSparkles } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
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
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-primary text-white text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Nuestra <span className="text-gray-400 italic font-light">Historia</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Definiendo el estándar del lujo inmobiliario en Colombia desde hace más de una década.
          </motion.p>
        </div>
      </div>

      <main className="flex-grow py-24 px-8">
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
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" 
                alt="Nuestro Equipo" 
                className="rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border-8 border-white"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 hidden md:block">
                <p className="text-primary font-serif italic text-xl">"Excelencia en cada detalle."</p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-5xl font-serif font-bold text-primary leading-tight">Nuestra Misión y Visión</h2>
              <p className="text-xl text-gray-500 font-light leading-relaxed italic">
                "No solo vendemos propiedades; creamos el escenario perfecto para los momentos más importantes de tu vida."
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Transformamos la experiencia inmobiliaria mediante un enfoque personalizado, 
                tecnología de vanguardia y una integridad inquebrantable. Nuestra meta es ser el puente 
                entre tus sueños y la realidad de un hogar excepcional.
              </p>
              
              <div className="grid grid-cols-2 gap-10 pt-10">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-primary text-3xl mb-2 opacity-50">{stat.icon}</div>
                    <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</p>
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
            className="bg-primary rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-16 relative z-10">¿Por qué elegir LUXHABITAT?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
              <div className="space-y-6 group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20 group-hover:bg-white group-hover:text-primary transition-all duration-500 transform group-hover:-translate-y-2">
                  <HiOutlineShieldCheck className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold">Seguridad Total</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Procesos legales blindados y total transparencia en cada transacción. Tu tranquilidad es nuestra prioridad.
                </p>
              </div>

              <div className="space-y-6 group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20 group-hover:bg-white group-hover:text-primary transition-all duration-500 transform group-hover:-translate-y-2">
                  <HiOutlineLightningBolt className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold">Gestión Ágil</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Optimizamos cada paso para que encuentres tu hogar ideal o cierres tu venta en tiempo récord.
                </p>
              </div>

              <div className="space-y-6 group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20 group-hover:bg-white group-hover:text-primary transition-all duration-500 transform group-hover:-translate-y-2">
                  <HiOutlineCash className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold">Valor Real</h3>
                <p className="text-gray-400 font-light leading-relaxed">
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

import React from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaRegLightbulb, FaCity, FaBalanceScale } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Consulting() {
  const points = [
    {
      title: "Planificación Financiera",
      desc: "Te ayudamos a estructurar tu inversión para maximizar el retorno.",
      icon: <FaRegLightbulb className="text-3xl" />
    },
    {
      title: "Desarrollo de Proyectos",
      desc: "Asesoría integral para constructores y desarrolladores en Ibagué.",
      icon: <FaCity className="text-3xl" />
    },
    {
      title: "Análisis Normativo",
      desc: "Estudio de usos de suelo y normatividad urbanística vigente.",
      icon: <FaBalanceScale className="text-3xl" />
    },
    {
      title: "Acompañamiento VIP",
      desc: "Consultoría personalizada uno a uno con expertos del sector.",
      icon: <FaUserTie className="text-3xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-primary text-white text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165833767-027ff33026b6?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Asesoría <span className="text-gray-400 italic font-light">Especializada</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Tomar decisiones inteligentes requiere información privilegiada y experiencia.
          </motion.p>
        </div>
      </div>

      <main className="flex-grow py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2rem] overflow-hidden shadow-2xl order-2 md:order-1"
            >
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80" alt="Consultoría" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 md:order-2"
            >
              <h2 className="text-4xl font-serif font-bold text-primary">Conocimiento al servicio de tu inversión</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                El mercado inmobiliario es dinámico y complejo. Nuestra asesoría va más allá de mostrar propiedades; 
                analizamos tendencias, proyecciones de valorización y viabilidad técnica para asegurar que cada 
                paso que des sea firme.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Ya sea que busques diversificar tu portafolio o iniciar un desarrollo inmobiliario, 
                LUXHABITAT es tu socio estratégico.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {points.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group"
              >
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform">{p.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">{p.title}</h3>
                <p className="text-gray-500 font-light">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

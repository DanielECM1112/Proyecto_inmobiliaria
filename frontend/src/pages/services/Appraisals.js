import React from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaFileAlt, FaMapMarkedAlt, FaSearchPlus } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Appraisals() {
  const items = [
    {
      title: "Avalúos Comerciales",
      desc: "Determinamos el valor real de mercado con rigor técnico y profesionalismo.",
      icon: <FaCalculator className="text-3xl" />
    },
    {
      title: "Informes Técnicos",
      desc: "Documentación detallada sobre el estado físico y jurídico del inmueble.",
      icon: <FaFileAlt className="text-3xl" />
    },
    {
      title: "Georreferenciación",
      desc: "Análisis del entorno, servicios y factores externos que afectan el valor.",
      icon: <FaMapMarkedAlt className="text-3xl" />
    },
    {
      title: "Estudio de Mercado",
      desc: "Comparativa actualizada con propiedades similares en la zona.",
      icon: <FaSearchPlus className="text-3xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-primary text-white text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Tasaciones y <span className="text-gray-400 italic font-light">Avalúos</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Conoce el valor real de tu patrimonio con expertos certificados.
          </motion.p>
        </div>
      </div>

      <main className="flex-grow py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-serif font-bold text-primary">Precisión en cada valoración</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Una tasación precisa es fundamental para cualquier operación inmobiliaria exitosa. 
                Nuestros peritos expertos utilizan metodologías estandarizadas para entregar informes 
                veraces que sirven como base para ventas, créditos hipotecarios o sucesiones.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Garantizamos imparcialidad y un profundo conocimiento del mercado inmobiliario en el Tolima.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80" alt="Avalúos" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group"
              >
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">{item.title}</h3>
                <p className="text-gray-500 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

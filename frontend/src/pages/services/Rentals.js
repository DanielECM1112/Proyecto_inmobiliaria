import React from 'react';
import { motion } from 'framer-motion';
import { FaKey, FaShieldAlt, FaUserCheck, FaFileContract } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Rentals() {
  const benefits = [
    {
      title: "Selección de Inquilinos",
      desc: "Realizamos un riguroso estudio de seguridad y solvencia económica.",
      icon: <FaUserCheck className="text-3xl" />
    },
    {
      title: "Contratos Blindados",
      desc: "Elaboramos contratos legales que protegen tus intereses y tu propiedad.",
      icon: <FaFileContract className="text-3xl" />
    },
    {
      title: "Gestión de Pagos",
      desc: "Nos encargamos del recaudo y seguimiento de los pagos mensuales.",
      icon: <FaKey className="text-3xl" />
    },
    {
      title: "Seguro de Arrendamiento",
      desc: "Convenios con aseguradoras para garantizar tu renta pase lo que pase.",
      icon: <FaShieldAlt className="text-3xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-primary text-white text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Gestión de <span className="text-gray-400 italic font-light">Alquileres</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Renta tu inmueble con total tranquilidad y seguridad jurídica.
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
              <h2 className="text-4xl font-serif font-bold text-primary">Arrendamientos sin preocupaciones</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                En LUXHABITAT, nos encargamos de todo el proceso de arrendamiento. Desde la promoción 
                de la propiedad hasta la entrega de llaves, nuestro equipo gestiona cada detalle para que 
                tú solo recibas tu renta.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Ofrecemos opciones de arrendamiento tanto para viviendas como para locales comerciales 
                en las zonas de mayor demanda de Ibagué.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80" alt="Alquiler Lujo" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group"
              >
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform">{b.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">{b.title}</h3>
                <p className="text-gray-500 font-light">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

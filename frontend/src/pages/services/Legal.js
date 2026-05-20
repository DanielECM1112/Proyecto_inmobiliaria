import React from 'react';
import { motion } from 'framer-motion';
import { FaGavel, FaFileSignature, FaRegFolderOpen, FaBuilding } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Legal() {
  const services = [
    {
      title: "Estudio de Títulos",
      desc: "Análisis exhaustivo de la tradición jurídica para garantizar una compra segura.",
      icon: <FaGavel className="text-3xl" />
    },
    {
      title: "Promesas de Compraventa",
      desc: "Redacción de contratos personalizados que blindan legalmente tu transacción.",
      icon: <FaFileSignature className="text-3xl" />
    },
    {
      title: "Trámites Notariales",
      desc: "Gestión completa ante notarías y oficinas de registro de instrumentos públicos.",
      icon: <FaRegFolderOpen className="text-3xl" />
    },
    {
      title: "Propiedad Horizontal",
      desc: "Asesoría en reglamentos y constitución de regímenes de propiedad horizontal.",
      icon: <FaBuilding className="text-3xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-primary text-white text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Gestión <span className="text-gray-400 italic font-light">Documental</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Seguridad jurídica total en cada paso de tu proceso inmobiliario.
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
              <img src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80" alt="Legal" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 md:order-2"
            >
              <h2 className="text-4xl font-serif font-bold text-primary">Blindaje jurídico para tu patrimonio</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Evita sorpresas desagradables. Nuestro equipo legal se encarga de verificar que cada 
                documento, escritura y certificado esté en perfecto orden. Nos especializamos en 
                simplificar la burocracia para que tú puedas disfrutar de tu nueva propiedad con tranquilidad.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Acompañamos desde la firma de la promesa hasta el registro final de la escritura.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group"
              >
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">{s.title}</h3>
                <p className="text-gray-500 font-light">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

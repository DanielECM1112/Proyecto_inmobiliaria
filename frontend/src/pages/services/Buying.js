import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaCheckCircle, FaHandshake, FaChartLine } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Buying() {
  const features = [
    {
      title: "Búsqueda Personalizada",
      desc: "Filtramos las mejores opciones según tus necesidades y presupuesto.",
      icon: <FaHome className="text-3xl" />
    },
    {
      title: "Asesoría Legal",
      desc: "Acompañamiento completo en trámites notariales y legales.",
      icon: <FaCheckCircle className="text-3xl" />
    },
    {
      title: "Negociación Experta",
      desc: "Obtenemos el mejor precio posible para tu futura propiedad.",
      icon: <FaHandshake className="text-3xl" />
    },
    {
      title: "Análisis de Mercado",
      desc: "Información actualizada sobre la valorización en Ibagué.",
      icon: <FaChartLine className="text-3xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-primary text-white text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Compra de <span className="text-gray-400 italic font-light">Propiedades</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Encuentra el hogar de tus sueños con la asesoría más exclusiva de Ibagué.
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
              <h2 className="text-4xl font-serif font-bold text-primary">Tu inversión, nuestra prioridad</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                En LUXHABITAT, entendemos que comprar una propiedad es una de las decisiones más importantes de tu vida. 
                Por eso, ofrecemos un servicio boutique diseñado para encontrar residencias que no solo cumplen con tus requisitos, 
                sino que superan tus expectativas.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Desde apartamentos de lujo en El Vergel hasta casas campestres exclusivas, nuestro portafolio está 
                cuidadosamente seleccionado para ofrecer solo lo mejor de Ibagué.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" alt="Interior Lujo" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group"
              >
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">{f.title}</h3>
                <p className="text-gray-500 font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Process Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white p-16 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-4xl font-serif font-bold mb-12 text-center relative z-10">Proceso de Compra</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="text-center space-y-4">
                <div className="text-5xl font-serif italic text-white/20">01</div>
                <h4 className="text-xl font-bold">Consulta Inicial</h4>
                <p className="text-gray-400 font-light">Definimos tu perfil de comprador y preferencias de ubicación.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="text-5xl font-serif italic text-white/20">02</div>
                <h4 className="text-xl font-bold">Selección y Visitas</h4>
                <p className="text-gray-400 font-light">Visitamos las propiedades que mejor se adaptan a tu estilo de vida.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="text-5xl font-serif italic text-white/20">03</div>
                <h4 className="text-xl font-bold">Cierre y Entrega</h4>
                <p className="text-gray-400 font-light">Gestionamos la promesa y escrituración hasta la entrega de llaves.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

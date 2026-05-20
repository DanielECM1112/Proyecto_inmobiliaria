import React from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaCamera, FaSearchDollar, FaChartPie } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Selling() {
  const steps = [
    {
      title: "Marketing Digital",
      desc: "Promocionamos tu propiedad en los portales más exclusivos y redes sociales.",
      icon: <FaBullhorn className="text-3xl" />
    },
    {
      title: "Fotografía Profesional",
      desc: "Sesiones de fotos y video con drones para resaltar cada detalle de tu inmueble.",
      icon: <FaCamera className="text-3xl" />
    },
    {
      title: "Valoración Real",
      desc: "Análisis comparativo de mercado para fijar el precio de venta óptimo.",
      icon: <FaSearchDollar className="text-3xl" />
    },
    {
      title: "Reportes Mensuales",
      desc: "Informes detallados sobre el alcance y los interesados en tu propiedad.",
      icon: <FaChartPie className="text-3xl" />
    }
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
            Venta de <span className="text-gray-400 italic font-light">Inmuebles</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Vende tu propiedad de forma rápida, segura y al mejor precio del mercado.
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
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" alt="Venta Casa" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 md:order-2"
            >
              <h2 className="text-4xl font-serif font-bold text-primary">Estrategia de Venta Premium</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Vender una propiedad de lujo requiere más que un simple anuncio. En LUXHABITAT diseñamos una 
                estrategia de marketing personalizada para cada inmueble, asegurando que llegue a los 
                compradores correctos.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Utilizamos herramientas de vanguardia y nuestra amplia red de contactos para garantizar 
                una transacción exitosa y en tiempo récord.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {steps.map((s, i) => (
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

          {/* Marketing Strategy Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white p-16 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <h2 className="text-4xl font-serif font-bold mb-12 text-center relative z-10">Estrategia de Comercialización</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="text-center space-y-4">
                <div className="text-5xl font-serif italic text-white/20">01</div>
                <h4 className="text-xl font-bold">Preparación (Staging)</h4>
                <p className="text-gray-400 font-light">Asesoramos en la adecuación de tu inmueble para hacerlo irresistible.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="text-5xl font-serif italic text-white/20">02</div>
                <h4 className="text-xl font-bold">Exposición Máxima</h4>
                <p className="text-gray-400 font-light">Lanzamiento en canales premium y base de datos de compradores VIP.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="text-5xl font-serif italic text-white/20">03</div>
                <h4 className="text-xl font-bold">Venta Exitosa</h4>
                <p className="text-gray-400 font-light">Negociación experta para cerrar la venta en las mejores condiciones.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

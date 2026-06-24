import React from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaCamera, FaSearchDollar, FaChartPie } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageWrapper from '../../components/PageWrapper';
import { useTheme } from '../../context/ThemeContext';

export default function Selling() {
  const { isDarkMode } = useTheme();
  
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
    <PageWrapper>
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${isDarkMode ? "bg-[#05080a]" : "bg-white"}`}>
      <Navbar />
      
      {/* Hero Section */}
      <div className={`pt-40 pb-20 text-center px-8 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? "bg-slate-900/80" : "bg-slate-50"}`}>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"
          style={{
            opacity: isDarkMode ? 0.12 : 0.15,
            transition: "opacity 500ms"
          }}
        ></div>
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isDarkMode 
            ? "bg-gradient-to-br from-slate-900/85 via-slate-800/70 to-slate-900/85"
            : "bg-gradient-to-br from-white/80 via-gold-50/60 to-white/80"
        }`}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight ${isDarkMode ? "text-white" : "text-slate-950"}`}
          >
            Venta de <span className={`italic font-light ${isDarkMode ? "text-gray-400" : "text-slate-600"}`}>Inmuebles</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-xl font-light max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}
          >
            Vende tu propiedad de forma rápida, segura y al mejor precio del mercado.
          </motion.p>
        </div>
      </div>

      <main className={`flex-grow py-24 px-8 transition-colors duration-500 ${isDarkMode ? "bg-[#05080a]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`rounded-[2rem] overflow-hidden shadow-2xl border transition-colors order-2 md:order-1 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}
            >
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" alt="Venta Casa" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 md:order-2"
            >
              <h2 className={`text-4xl font-serif font-bold ${isDarkMode ? "text-white" : "text-slate-950"}`}>Estrategia de Venta Premium</h2>
              <p className={`leading-relaxed text-lg font-light ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>
                Vender una propiedad de lujo requiere más que un simple anuncio. En LUXHABITAT diseñamos una 
                estrategia de marketing personalizada para cada inmueble, asegurando que llegue a los 
                compradores correctos.
              </p>
              <p className={`leading-relaxed text-lg font-light ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>
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
                className={`p-10 rounded-[2rem] border shadow-xl transition-all group ${
                  isDarkMode
                    ? "bg-slate-800/50 border-white/10 shadow-black/20 hover:shadow-gold-500/10 hover:border-gold-500/30"
                    : "bg-white border-slate-200 shadow-slate-200/50 hover:shadow-gold-600/10 hover:border-gold-600/30"
                }`}
              >
                <div className={`mb-6 group-hover:scale-110 transition-transform ${isDarkMode ? "text-gold-400" : "text-gold-600"}`}>{s.icon}</div>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-950"}`}>{s.title}</h3>
                <p className={`font-light ${isDarkMode ? "text-gray-400" : "text-slate-600"}`}>{s.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Marketing Strategy Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-16 rounded-[3rem] relative overflow-hidden transition-colors duration-500 border ${
              isDarkMode
                ? "bg-gradient-to-br from-gold-900/40 to-slate-900/60 border-gold-500/20"
                : "bg-gradient-to-br from-gold-600 to-gold-700 border-gold-600"
            }`}
          >
            <div className={`absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 ${
              isDarkMode ? "bg-gold-500/10" : "bg-white/10"
            }`}></div>
            <h2 className={`text-4xl font-serif font-bold mb-12 text-center relative z-10 ${isDarkMode ? "text-white" : "text-white"}`}>Estrategia de Comercialización</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="text-center space-y-4">
                <div className={`text-5xl font-serif italic ${isDarkMode ? "text-white/20" : "text-white/30"}`}>01</div>
                <h4 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-white"}`}>Preparación (Staging)</h4>
                <p className={`font-light ${isDarkMode ? "text-gray-300" : "text-gray-100"}`}>Asesoramos en la adecuación de tu inmueble para hacerlo irresistible.</p>
              </div>
              <div className="text-center space-y-4">
                <div className={`text-5xl font-serif italic ${isDarkMode ? "text-white/20" : "text-white/30"}`}>02</div>
                <h4 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-white"}`}>Exposición Máxima</h4>
                <p className={`font-light ${isDarkMode ? "text-gray-300" : "text-gray-100"}`}>Lanzamiento en canales premium y base de datos de compradores VIP.</p>
              </div>
              <div className="text-center space-y-4">
                <div className={`text-5xl font-serif italic ${isDarkMode ? "text-white/20" : "text-white/30"}`}>03</div>
                <h4 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-white"}`}>Venta Exitosa</h4>
                <p className={`font-light ${isDarkMode ? "text-gray-300" : "text-gray-100"}`}>Negociación experta para cerrar la venta en las mejores condiciones.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
    </PageWrapper>
  );
}

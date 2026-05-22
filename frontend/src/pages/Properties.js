import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const properties = [
  {
    id: 1,
    title: "Casa Moderna con Piscina",
    location: "Bogotá, Colombia",
    price: "$850,000,000",
    beds: 4,
    baths: 3,
    area: "320 m²",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    type: "Venta"
  },
  {
    id: 2,
    title: "Apartamento en el Centro",
    location: "Medellín, Colombia",
    price: "$420,000,000",
    beds: 3,
    baths: 2,
    area: "180 m²",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    type: "Alquiler"
  },
  {
    id: 3,
    title: "Villa de Lujo Frente al Mar",
    location: "Cartagena, Colombia",
    price: "$1,500,000,000",
    beds: 5,
    baths: 4,
    area: "450 m²",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    type: "Venta"
  },
  {
    id: 4,
    title: "Penthouse Exclusivo",
    location: "Barranquilla, Colombia",
    price: "$980,000,000",
    beds: 4,
    baths: 4,
    area: "280 m²",
    image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80",
    type: "Venta"
  }
];

export default function Properties() {
  const { isDarkMode } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDarkMode ? "bg-primary-dark" : "bg-light-100"
    }`}>
      <Navbar />
      
      {/* Hero Section for Properties */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80" 
            alt="Properties Background" 
            className="w-full h-full object-cover"
            style={{
              opacity: isDarkMode ? 0.15 : 0.25,
              transition: "opacity 500ms"
            }}
          />
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? "bg-gradient-to-b from-primary-dark/80 via-primary-dark/95 to-primary-dark" 
              : "bg-gradient-to-b from-blue-900/15 via-white/70 to-light-100"
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
              Propiedades <span className="text-blue-600 italic font-light">Exclusivas</span>
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>
            <p className={`text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-dark-700"
            }`}>
              Descubre nuestra selección curada de residencias de lujo diseñadas para elevar tu estilo de vida en los sectores más prestigiosos.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-grow py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14"
          >
            {properties.map((prop) => (
              <motion.div 
                key={prop.id} 
                variants={itemVariants}
                whileHover={{ y: -15 }}
                className={`rounded-[2.5rem] overflow-hidden transition-all duration-500 border group ${
                  isDarkMode 
                    ? "bg-midnight-DEFAULT border-white/5 shadow-2xl shadow-black/40 hover:border-blue-500/30" 
                    : "bg-white border-light-200 shadow-xl shadow-blue-900/5 hover:border-blue-600/30"
                }`}
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-8 left-8 flex gap-3">
                    <span className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">
                      {prop.type}
                    </span>
                    <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">
                      Premium
                    </span>
                  </div>
                </div>

                <div className="p-10">
                  <h3 className={`text-2xl font-serif font-bold mb-3 leading-tight transition-colors ${
                    isDarkMode ? "text-white group-hover:text-blue-400" : "text-dark-950 group-hover:text-blue-600"
                  }`}>
                    {prop.title}
                  </h3>
                  
                  <p className={`flex items-center gap-2 mb-8 font-light italic text-sm ${
                    isDarkMode ? "text-gray-400" : "text-dark-600"
                  }`}>
                    <HiOutlineLocationMarker className="text-blue-600 text-xl" />
                    {prop.location}
                  </p>

                  <div className={`p-6 rounded-2xl border mb-8 transition-colors ${
                    isDarkMode ? "bg-white/5 border-white/5" : "bg-light-50 border-light-200"
                  }`}>
                    <div className="flex flex-col">
                      <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${
                        isDarkMode ? "text-gray-500" : "text-dark-400"
                      }`}>Inversión</span>
                      <span className={`text-2xl font-bold ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}>{prop.price}</span>
                    </div>
                  </div>

                  <div className={`grid grid-cols-3 gap-4 py-6 border-y mb-8 ${
                    isDarkMode ? "border-white/5" : "border-light-200"
                  }`}>
                    <div className="flex flex-col items-center gap-2">
                      <BiBed className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-dark-400"}`} />
                      <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark-900"}`}>{prop.beds}</span>
                      <span className={`text-[9px] uppercase font-bold tracking-tighter ${isDarkMode ? "text-gray-500" : "text-dark-500"}`}>Habitaciones</span>
                    </div>
                    <div className={`flex flex-col items-center gap-2 border-x ${isDarkMode ? "border-white/5" : "border-light-200"}`}>
                      <BiBath className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-dark-400"}`} />
                      <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark-900"}`}>{prop.baths}</span>
                      <span className={`text-[9px] uppercase font-bold tracking-tighter ${isDarkMode ? "text-gray-500" : "text-dark-500"}`}>Baños</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <BiArea className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-dark-400"}`} />
                      <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-dark-900"} whitespace-nowrap`}>{prop.area}</span>
                      <span className={`text-[9px] uppercase font-bold tracking-tighter ${isDarkMode ? "text-gray-500" : "text-dark-500"}`}>Área Total</span>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-xl ${
                      isDarkMode
                        ? "bg-white text-dark-900 hover:bg-gray-100"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                    }`}
                  >
                    Explorar Detalles
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

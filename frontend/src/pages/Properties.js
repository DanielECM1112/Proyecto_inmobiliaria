import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Properties() {
  const { isDarkMode } = useTheme();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/inmuebles/');
        const activeProps = response.data; // El backend ya filtra por activos si no es admin
        
        if (activeProps.length > 0) {
          // Mapear los datos de la DB al formato visual de LUXHABITAT
          const mappedProps = activeProps.map(p => ({
            id: p.id,
            titulo: p.titulo,
            precio: p.precio,
            ciudad: p.ciudad,
            tipo: p.tipo,
            estado: p.estado,
            image: p.thumbnail || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            direccion: p.direccion || 'Dirección no disponible',
            whatsapp_contacto: p.whatsapp_contacto || '573223147352',
            habitaciones: p.habitaciones || 3,
            banos: p.banos || p.baños || 2,
            area: p.area || 150,
          }));
          setProperties(mappedProps);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);
  
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
              : "bg-gradient-to-b from-slate-950/15 via-white/70 to-light-100"
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
            } text-gilded`}>
              Propiedades <span className="text-gilded italic font-light">Exclusivas</span>
            </h1>
            <div className="w-24 h-1 bg-gold-500 mx-auto mb-8 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.35)]"></div>
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
            {properties.length === 0 && !loading ? (
              <div className="col-span-full text-center py-20">
                <p className={`text-2xl font-light ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>
                  No hay propiedades disponibles en este momento.
                </p>
              </div>
            ) : (
              properties.map((prop) => (
                <motion.div 
                  key={prop.id} 
                  variants={itemVariants}
                  whileHover={{ y: -15 }}
                  className={`rounded-[2.5rem] overflow-hidden transition-all duration-500 border group ${
                    isDarkMode 
                      ? "bg-midnight-DEFAULT border-white/5 shadow-2xl shadow-black/40 hover:border-slate-300/20" 
                      : "bg-white border-light-200 shadow-xl shadow-slate-900/10 hover:border-gold-500/30"
                  }`}
                >
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={prop.image} 
                      alt={prop.titulo} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                    
                    <div className="absolute top-8 left-8 flex gap-3">
                      <span className="bg-gold-600 text-slate-950 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gold-600/20">
                        {prop.tipo === 'venta' ? 'Venta' : prop.tipo === 'alquiler' ? 'Alquiler' : 'Inmueble'}
                      </span>
                      <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">
                        {prop.estado}
                      </span>
                    </div>
                  </div>

                  <div className="p-10">
                    <h3 className={`text-2xl font-serif font-bold mb-3 leading-tight transition-colors ${
                      isDarkMode ? "text-white group-hover:text-gold-300" : "text-dark-950 group-hover:text-gold-600"
                    }`}>
                      {prop.titulo}
                    </h3>
                    
                    <p className={`flex items-center gap-2 mb-8 font-light italic text-sm ${
                      isDarkMode ? "text-gray-400" : "text-dark-600"
                    }`}>
                      <HiOutlineLocationMarker className="text-gold-600 text-xl" />
                      {prop.ciudad}, {prop.direccion}
                    </p>

                    <div className={`p-6 rounded-2xl border mb-8 transition-colors ${
                      isDarkMode ? "bg-white/5 border-white/5" : "bg-light-50 border-light-200"
                    }`}>
                      <div className="flex flex-col">
                        <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${
                          isDarkMode ? "text-gray-500" : "text-dark-400"
                        }`}>Inversión</span>
                        <span className={`text-2xl font-bold ${
                          isDarkMode ? "text-gold-300" : "text-gold-600"
                        }`}>${parseFloat(prop.precio).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={`grid grid-cols-3 gap-4 py-6 border-y mb-8 ${
                      isDarkMode ? "border-white/5" : "border-light-200"
                    }`}>
                      <div className="flex flex-col items-center gap-2">
                        <BiBed className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-dark-400"}`} />
                        <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark-900"}`}>{prop.habitaciones}</span>
                        <span className={`text-[9px] uppercase font-bold tracking-tighter ${isDarkMode ? "text-gray-500" : "text-dark-500"}`}>Habitaciones</span>
                      </div>
                      <div className={`flex flex-col items-center gap-2 border-x ${isDarkMode ? "border-white/5" : "border-light-200"}`}>
                        <BiBath className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-dark-400"}`} />
                        <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark-900"}`}>{prop.banos}</span>
                        <span className={`text-[9px] uppercase font-bold tracking-tighter ${isDarkMode ? "text-gray-500" : "text-dark-500"}`}>Baños</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <BiArea className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-dark-400"}`} />
                        <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark-900"}`}>{prop.area}</span>
                        <span className={`text-[9px] uppercase font-bold tracking-tighter ${isDarkMode ? "text-gray-500" : "text-dark-500"}`}>m² Área</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/properties/${prop.id}`)}
                      className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest transition-all ${
                        isDarkMode 
                          ? "bg-white text-dark-950 hover:bg-gray-100 shadow-xl shadow-white/5" 
                          : "bg-slate-950 text-white hover:bg-slate-800 shadow-xl shadow-slate-950/20"
                      }`}
                    >
                      Explorar Detalles
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

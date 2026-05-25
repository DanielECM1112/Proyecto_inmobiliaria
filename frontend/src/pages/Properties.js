import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiBed, BiBath, BiArea, BiX } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const originalProperties = [
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
  const [properties, setProperties] = useState(originalProperties);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/properties/admin-properties/');
        const activeProps = response.data.filter(p => p.status === 'activo');
        if (activeProps.length > 0) {
          // Mapear los datos de la DB al formato visual de LUXHABITAT
          const mappedProps = activeProps.map(p => ({
            id: p.id,
            title: p.title,
            location: `${p.city}, ${p.address}`,
            price: `$${parseFloat(p.price).toLocaleString()}`,
            beds: p.bedrooms,
            baths: p.bathrooms,
            area: `${p.area} m²`,
            image: p.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            type: p.property_type === 'venta' ? 'Venta' : 'Alquiler'
          }));
          setProperties(mappedProps);
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
                      ? "bg-midnight-DEFAULT border-white/5 shadow-2xl shadow-black/40 hover:border-blue-500/30" 
                      : "bg-white border-light-200 shadow-xl shadow-blue-900/5 hover:border-blue-600/30"
                  }`}
                >
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={prop.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                    
                    <div className="absolute top-8 left-8 flex gap-3">
                      <span className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">
                        {prop.property_type || "Inmueble"}
                      </span>
                      <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">
                        {prop.status}
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
                      {prop.city}, {prop.address}
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
                        }`}>${parseFloat(prop.price).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={`grid grid-cols-3 gap-4 py-6 border-y mb-8 ${
                      isDarkMode ? "border-white/5" : "border-light-200"
                    }`}>
                      <div className="flex flex-col items-center gap-2">
                        <BiBed className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-dark-400"}`} />
                        <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark-900"}`}>{prop.bedrooms}</span>
                        <span className={`text-[9px] uppercase font-bold tracking-tighter ${isDarkMode ? "text-gray-500" : "text-dark-500"}`}>Habitaciones</span>
                      </div>
                      <div className={`flex flex-col items-center gap-2 border-x ${isDarkMode ? "border-white/5" : "border-light-200"}`}>
                        <BiBath className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-dark-400"}`} />
                        <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark-900"}`}>{prop.bathrooms}</span>
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
                      onClick={() => setSelectedProperty(prop)}
                      className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest transition-all ${
                        isDarkMode 
                          ? "bg-white text-dark-950 hover:bg-gray-100 shadow-xl shadow-white/5" 
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20"
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

      {/* Property Details Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl border transition-all duration-500 ${
                isDarkMode 
                  ? "bg-midnight-DEFAULT border-white/10" 
                  : "bg-white border-light-200"
              }`}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProperty(null)}
                className={`absolute top-8 right-8 z-10 p-3 rounded-full backdrop-blur-md transition-all ${
                  isDarkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-dark-950 hover:bg-black/10"
                }`}
              >
                <BiX className="text-3xl" />
              </button>

              <div className="flex flex-col lg:flex-row">
                {/* Modal Image Area */}
                <div className="lg:w-1/2 h-[400px] lg:h-auto relative">
                  <img 
                    src={selectedProperty.image} 
                    alt={selectedProperty.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-2xl">
                      {selectedProperty.type}
                    </span>
                  </div>
                </div>

                {/* Modal Content Area */}
                <div className="lg:w-1/2 p-10 lg:p-16 space-y-10">
                  <div className="space-y-4">
                    <h2 className={`text-4xl lg:text-5xl font-serif font-bold leading-tight ${
                      isDarkMode ? "text-white" : "text-dark-950"
                    }`}>
                      {selectedProperty.title}
                    </h2>
                    <p className={`flex items-center gap-3 text-lg italic font-light ${
                      isDarkMode ? "text-gray-400" : "text-dark-700"
                    }`}>
                      <HiOutlineLocationMarker className="text-blue-600 text-2xl" />
                      {selectedProperty.location}
                    </p>
                  </div>

                  <div className={`p-8 rounded-3xl border transition-colors ${
                    isDarkMode ? "bg-white/5 border-white/5" : "bg-light-100 border-light-200"
                  }`}>
                    <div className="flex flex-col">
                      <span className={`text-xs uppercase tracking-[0.3em] font-bold mb-2 ${
                        isDarkMode ? "text-gray-500" : "text-dark-400"
                      }`}>Inversión Exclusiva</span>
                      <span className={`text-4xl font-bold ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}>{selectedProperty.price}</span>
                    </div>
                  </div>

                  <div className={`grid grid-cols-3 gap-6 py-10 border-y ${
                    isDarkMode ? "border-white/5" : "border-light-200"
                  }`}>
                    <div className="flex flex-col items-center gap-3">
                      <BiBed className={`text-3xl ${isDarkMode ? "text-gray-400" : "text-dark-500"}`} />
                      <div className="text-center">
                        <p className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-dark-950"}`}>{selectedProperty.beds}</p>
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? "text-gray-500" : "text-dark-400"}`}>Cuartos</p>
                      </div>
                    </div>
                    <div className={`flex flex-col items-center gap-3 border-x ${isDarkMode ? "border-white/5" : "border-light-200"}`}>
                      <BiBath className={`text-3xl ${isDarkMode ? "text-gray-400" : "text-dark-500"}`} />
                      <div className="text-center">
                        <p className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-dark-950"}`}>{selectedProperty.baths}</p>
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? "text-gray-500" : "text-dark-400"}`}>Baños</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <BiArea className={`text-3xl ${isDarkMode ? "text-gray-400" : "text-dark-500"}`} />
                      <div className="text-center">
                        <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-dark-950"}`}>{selectedProperty.area}</p>
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? "text-gray-500" : "text-dark-400"}`}>Área</p>
                      </div>
                    </div>
                  </div>

                  <p className={`text-lg leading-relaxed font-light ${
                    isDarkMode ? "text-gray-400" : "text-dark-700"
                  }`}>
                    Esta propiedad representa la cúspide del diseño y la comodidad. Ubicada en una de las zonas más privilegiadas, ofrece acabados de lujo y espacios amplios pensados para la vida moderna y sofisticada.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 pt-6">
                    <motion.a 
                      href={`https://wa.me/573223147352?text=Hola,%20estoy%20interesado%20en%20la%20propiedad:%20${selectedProperty.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, backgroundColor: "#16a34a" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-grow bg-green-600 text-white py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-600/20"
                    >
                      <FaWhatsapp className="text-2xl" /> Contactar Asesor
                    </motion.a>
                    <motion.button 
                      onClick={() => setSelectedProperty(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-10 py-5 rounded-2xl font-bold uppercase tracking-widest border transition-all ${
                        isDarkMode ? "border-white/10 text-white hover:bg-white/5" : "border-light-300 text-dark-950 hover:bg-light-50"
                      }`}
                    >
                      Cerrar
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

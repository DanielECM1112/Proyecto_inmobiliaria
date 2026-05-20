import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section for Properties */}
      <div className="pt-40 pb-20 bg-primary text-white text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Propiedades <span className="text-gray-400 italic font-light">Exclusivas</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Descubre nuestra selección curada de residencias de lujo diseñadas para elevar tu estilo de vida.
          </motion.p>
        </div>
      </div>

      <main className="flex-grow py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {properties.map((prop) => (
              <motion.div 
                key={prop.id} 
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 border border-gray-100 group"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                      {prop.type}
                    </span>
                    <span className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                      Premium
                    </span>
                  </div>
                </div>

                <div className="p-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif font-bold text-primary leading-tight group-hover:text-primary-light transition-colors">
                      {prop.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-500 flex items-center gap-2 mb-8 font-light italic">
                    <HiOutlineLocationMarker className="text-primary text-xl" />
                    {prop.location}
                  </p>

                  <div className="flex justify-between items-center mb-8 bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Precio</span>
                      <span className="text-2xl font-bold text-primary">{prop.price}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 mb-8">
                    <div className="flex flex-col items-center gap-1">
                      <BiBed className="text-2xl text-primary/60" />
                      <span className="text-lg font-bold text-primary">{prop.beds}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Habitaciones</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-gray-100">
                      <BiBath className="text-2xl text-primary/60" />
                      <span className="text-lg font-bold text-primary">{prop.baths}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Baños</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <BiArea className="text-2xl text-primary/60" />
                      <span className="text-sm font-bold text-primary whitespace-nowrap">{prop.area}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Área</span>
                    </div>
                  </div>

                  <button className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/10 hover:shadow-primary/20 transform active:scale-95">
                    Explorar Propiedad
                  </button>
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

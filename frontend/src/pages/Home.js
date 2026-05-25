import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineLocationMarker, HiOutlineArrowRight } from "react-icons/hi";
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";
import video4 from "../assets/video4.mp4";
import video5 from "../assets/video5.mp4";

const videos = [video1, video2, video3, video4, video5];

// Featured properties data
const featuredProperties = [
  {
    id: 1,
    title: "Penthouse El Vergel",
    location: "Sector El Vergel, Ibagué",
    price: "$1.250.000.000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    beds: 4,
    baths: 5,
    area: "320m²"
  },
  {
    id: 2,
    title: "Villa Campestre",
    location: "Vía Aeropuerto, Ibagué",
    price: "$2.100.000.000",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    beds: 5,
    baths: 6,
    area: "1200m²"
  },
  {
    id: 3,
    title: "Apartamento de Lujo",
    location: "Piedrapintada, Ibagué",
    price: "$850.000.000",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    beds: 3,
    baths: 3,
    area: "185m²"
  }
];

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 font-sans ${
      isDarkMode ? "bg-primary-dark" : "bg-light-100"
    }`}>
      <Navbar />
      
      {/* Hero Section with Video */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {/* Background Video Slider */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.video
              key={currentVideo}
              src={videos[currentVideo]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </AnimatePresence>
          
          {/* Overlays */}
          <div className={`absolute inset-0 z-[1] transition-all duration-500 ${
            isDarkMode 
              ? "bg-gradient-to-b from-black/70 via-black/40 to-primary-dark" 
              : "bg-gradient-to-b from-black/60 via-black/30 to-light-100"
          }`}></div>
          <div className="absolute inset-0 z-[1] bg-blue-900/10 mix-blend-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-8 w-full h-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-6xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-bold mb-6 uppercase tracking-tighter text-white leading-none">
              LUX<span className="text-gray-300 font-light italic">HABITAT</span>
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
            <p className="text-xl md:text-3xl mb-12 max-w-4xl mx-auto font-sans font-light leading-relaxed text-gray-100 tracking-wide">
              Redefiniendo el Lujo Inmobiliario en Ibagué <br /> 
              <span className="text-blue-400 font-medium tracking-[0.2em] uppercase text-sm md:text-base mt-4 block">Exclusividad • Distinción • Inversión</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button 
                onClick={() => navigate('/properties')}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                  background: "linear-gradient(to right, #2563EB, #3B82F6)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 text-white px-12 py-6 rounded-2xl text-lg font-bold transition-all duration-300 shadow-2xl uppercase tracking-widest min-w-[240px]"
              >
                Explorar Propiedades
              </motion.button>
              <motion.button 
                onClick={() => navigate('/publish')}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                whileTap={{ scale: 0.98 }}
                className="backdrop-blur-xl bg-white/10 border-2 border-white/40 text-white px-12 py-6 rounded-2xl text-lg font-bold transition-all duration-300 uppercase tracking-widest min-w-[240px]"
              >
                Publicar Ahora
              </motion.button>
            </div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-white rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className={`py-32 px-6 md:px-8 transition-colors duration-500 ${
        isDarkMode ? "bg-primary-dark" : "bg-light-100"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className={`text-5xl md:text-6xl font-serif font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-dark-950"
              }`}>
                Propiedades <span className="text-blue-600 italic font-light">Destacadas</span>
              </h2>
              <p className={`text-xl font-light leading-relaxed ${
                isDarkMode ? "text-gray-400" : "text-dark-700"
              }`}>
                Una selección exclusiva de las mejores residencias disponibles en Ibagué.
              </p>
            </div>
            <Link 
              to="/properties" 
              className="group flex items-center gap-3 text-blue-600 font-bold uppercase tracking-widest text-sm"
            >
              Ver Todas <HiOutlineArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProperties.map((prop) => (
              <motion.div 
                key={prop.id}
                whileHover={{ y: -15 }}
                className={`rounded-[2.5rem] overflow-hidden transition-all duration-500 border group ${
                  isDarkMode 
                    ? "bg-midnight-DEFAULT border-white/5 shadow-2xl" 
                    : "bg-white border-light-200 shadow-xl shadow-blue-900/5"
                }`}
              >
                <div className="relative h-72 overflow-hidden">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">Premium</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className={`text-2xl font-serif font-bold mb-2 ${isDarkMode ? "text-white" : "text-dark-950"}`}>{prop.title}</h3>
                  <p className="flex items-center gap-2 text-gray-500 text-sm mb-6 italic"><HiOutlineLocationMarker /> {prop.location}</p>
                  <div className="flex justify-between items-center py-6 border-t border-light-200 dark:border-white/5">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-xs font-bold dark:text-gray-400 text-dark-700"><BiBed /> {prop.beds}</span>
                      <span className="flex items-center gap-1 text-xs font-bold dark:text-gray-400 text-dark-700"><BiBath /> {prop.baths}</span>
                      <span className="flex items-center gap-1 text-xs font-bold dark:text-gray-400 text-dark-700"><BiArea /> {prop.area}</span>
                    </div>
                    <span className="text-blue-600 font-bold">{prop.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

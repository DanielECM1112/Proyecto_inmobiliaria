import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";
import video4 from "../assets/video4.mp4";
import video5 from "../assets/video5.mp4";

const videos = [video1, video2, video3, video4, video5];

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
          <div className="absolute inset-0 z-[1] bg-gold-900/10 mix-blend-overlay"></div>
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
            <div className="w-24 h-1 bg-gold-500 mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"></div>
            <p className="text-xl md:text-3xl mb-12 max-w-4xl mx-auto font-sans font-light leading-relaxed text-gray-100 tracking-wide">
              Redefiniendo el Lujo Inmobiliario en Ibagué <br /> 
              <span className="text-gold-300 font-medium tracking-[0.2em] uppercase text-sm md:text-base mt-4 block">Exclusividad • Distinción • Inversión</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button 
                onClick={() => navigate('/properties')}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(212, 175, 55, 0.4)",
                  background: "linear-gradient(to right, #D4AF37, #E5C158)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-gold-600 text-white px-12 py-6 rounded-2xl text-lg font-bold transition-all duration-300 shadow-2xl uppercase tracking-widest min-w-[240px]"
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

      <Footer />
    </div>
  );
}

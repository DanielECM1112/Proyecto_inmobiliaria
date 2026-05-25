import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Location() {
  const { isDarkMode } = useTheme();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDarkMode ? "bg-primary-dark" : "bg-light-100"
    }`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1449156001437-3a144f007e35?auto=format&fit=crop&w=1920&q=80" 
            alt="Location Background" 
            className="w-full h-full object-cover"
            style={{
              opacity: isDarkMode ? 0.15 : 0.20,
              transition: "opacity 500ms"
            }}
          />
          <div className={`absolute inset-0 transition-colors duration-500 ${
            isDarkMode 
              ? "bg-gradient-to-br from-slate-900/85 via-slate-800/70 to-slate-900/85" 
              : "bg-gradient-to-br from-white/80 via-blue-50/60 to-white/80"
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
              Ubicación <span className="text-blue-600 italic font-light">Estratégica</span>
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>
            <p className={`text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-slate-700"
            }`}>
              Nuestras oficinas se encuentran en el corazón del desarrollo de Ibagué, listos para atender tus necesidades inmobiliarias con exclusividad.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-grow py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div>
                <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-12 ${
                  isDarkMode ? "text-white" : "text-dark-950"
                }`}>Información de Contacto</h2>
                <div className="space-y-10">
                  <div className="flex items-start gap-6 group">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlineLocationMarker className="text-3xl" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-dark-950"}`}>Sede Principal Ibagué</h3>
                      <p className={`font-light leading-relaxed text-lg ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>
                        Av. Ambalá #45-12, Sector El Vergel<br />
                        Ibagué, Tolima, Colombia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlinePhone className="text-3xl" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-dark-950"}`}>Atención Telefónica</h3>
                      <p className={`font-light text-lg ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>+57 (608) 277 0000</p>
                      <p className={`font-bold text-lg ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>+57 322 314 7352</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlineMail className="text-3xl" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-dark-950"}`}>Correo Electrónico</h3>
                      <p className={`font-light text-lg ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>info@luxhabitatibague.com</p>
                      <p className={`font-light text-lg ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>ventas@luxhabitatibague.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-10 rounded-[2.5rem] border transition-colors duration-500 ${
                isDarkMode ? "bg-midnight-DEFAULT border-white/5" : "bg-white border-light-200 shadow-xl shadow-blue-900/5"
              }`}>
                <div className="flex items-center gap-4 mb-8">
                  <HiOutlineClock className="text-3xl text-blue-600" />
                  <h3 className={`text-2xl font-serif font-bold ${isDarkMode ? "text-white" : "text-dark-950"}`}>Horario de Atención</h3>
                </div>
                <ul className="space-y-4">
                  <li className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? "border-white/5" : "border-light-200"}`}>
                    <span className={`${isDarkMode ? "text-gray-400" : "text-dark-700"} font-medium`}>Lunes - Viernes</span>
                    <span className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>8:00 AM - 6:30 PM</span>
                  </li>
                  <li className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? "border-white/5" : "border-light-200"}`}>
                    <span className={`${isDarkMode ? "text-gray-400" : "text-dark-700"} font-medium`}>Sábados</span>
                    <span className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>9:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center pt-2">
                    <span className={`${isDarkMode ? "text-gray-400" : "text-dark-700"} font-medium`}>Domingos y Festivos</span>
                    <span className="text-gray-500 italic font-light">Cerrado</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`relative rounded-[3rem] overflow-hidden shadow-2xl min-h-[600px] border-8 group transition-colors duration-500 ${
                isDarkMode ? "border-white/5" : "border-white"
              }`}
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31835.617154212354!2d-75.2285!3d4.4389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38c4c7003c051d%3A0x892a4e237376043d!2sIbagu%C3%A9%2C%20Tolima!5e0!3m2!1ses!2sco!4v1715424000000!5m2!1ses!2sco" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Ubicación Ibagué"
                className={`absolute inset-0 transition-all duration-1000 ${isDarkMode ? "grayscale invert opacity-80 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100" : "grayscale group-hover:grayscale-0"}`}
              ></iframe>
              <div className={`absolute bottom-8 left-8 right-8 p-6 rounded-2xl shadow-2xl border backdrop-blur-md transition-colors duration-500 ${
                isDarkMode ? "bg-midnight-DEFAULT/90 border-white/10 text-white" : "bg-white/90 border-white text-dark-950"
              }`}>
                <p className="font-bold text-center">Visítanos en nuestra oficina boutique en El Vergel</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

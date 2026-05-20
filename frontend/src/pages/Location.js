import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Location() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-primary text-white text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449156001437-3a144f007e35?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Ubicación <span className="text-gray-400 italic font-light">Estratégica</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Nuestras oficinas se encuentran en el corazón del desarrollo de Ibagué, listos para atender tus necesidades inmobiliarias.
          </motion.p>
        </div>
      </div>

      <main className="flex-grow py-24 px-8">
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
                <h2 className="text-4xl font-serif font-bold text-primary mb-10">Información de Contacto</h2>
                <div className="space-y-10">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlineLocationMarker className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">Sede Principal Ibagué</h3>
                      <p className="text-gray-500 font-light leading-relaxed">
                        Av. Ambalá #45-12, Sector El Vergel<br />
                        Ibagué, Tolima, Colombia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlinePhone className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">Teléfono Directo</h3>
                      <p className="text-gray-500 font-light">+57 (608) 277 0000</p>
                      <p className="text-gray-500 font-light">+57 300 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlineMail className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">Correo Electrónico</h3>
                      <p className="text-gray-500 font-light">info@luxhabitatibague.com</p>
                      <p className="text-gray-500 font-light">ventas@luxhabitatibague.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                  <HiOutlineClock className="text-3xl text-primary" />
                  <h3 className="text-2xl font-serif font-bold text-primary">Horario de Atención</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600 font-medium">Lunes - Viernes</span>
                    <span className="text-primary font-bold">8:00 AM - 6:30 PM</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600 font-medium">Sábados</span>
                    <span className="text-primary font-bold">9:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Domingos y Festivos</span>
                    <span className="text-gray-400 italic">Cerrado</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] min-h-[600px] border-8 border-white group"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31835.617154212354!2d-75.2285!3d4.4389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38c4c7003c051d%3A0x892a4e237376043d!2sIbagu%C3%A9%2C%20Tolima!5e0!3m2!1ses!2sco!4v1715424000000!5m2!1ses!2sco" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Ubicación Ibagué"
                className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50">
                <p className="text-primary font-bold text-center">Visítanos en nuestra oficina boutique en El Vergel</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

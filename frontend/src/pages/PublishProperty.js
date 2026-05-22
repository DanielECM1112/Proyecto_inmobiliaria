import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRocket, FaGem, FaBriefcase, FaStar, FaCheck, FaLock } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function PublishProperty() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // TEMPORALMENTE DESACTIVADO: Validación de autenticación
    setIsAuthenticated(true); // Permitir acceso directo temporalmente
  }, [navigate]);

  const plans = [
    {
      name: "Plan Básico",
      price: "$79.900",
      duration: "1 mes",
      icon: <FaRocket className={`text-4xl ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />,
      features: [
        "Publicación por 30 días",
        "Hasta 10 fotos HD",
        "Soporte por email",
        "Visible en resultados básicos"
      ],
      color: isDarkMode ? "from-gray-800 to-gray-900" : "from-gray-100 to-gray-200",
      shadow: isDarkMode ? "shadow-gray-500/10" : "shadow-gray-900/5"
    },
    {
      name: "Plan Profesional",
      price: "$199.900",
      duration: "3 meses",
      icon: <FaBriefcase className={`text-4xl ${isDarkMode ? "text-blue-500" : "text-blue-700"}`} />,
      features: [
        "Publicación por 90 días",
        "Fotos ilimitadas",
        "Video recorrido básico",
        "Soporte prioritario",
        "Etiqueta 'Recomendado'"
      ],
      color: isDarkMode ? "from-blue-900/40 to-black" : "from-blue-100 to-blue-200",
      shadow: isDarkMode ? "shadow-blue-500/20" : "shadow-blue-600/10",
      recommended: true
    },
    {
      name: "Plan Premium",
      price: "$349.900",
      duration: "6 meses",
      icon: <FaGem className={`text-4xl ${isDarkMode ? "text-blue-300" : "text-blue-500"}`} />,
      features: [
        "Publicación por 180 días",
        "Fotografía profesional",
        "Video con Drone",
        "Destacado en Home",
        "Marketing en redes sociales"
      ],
      color: isDarkMode ? "from-blue-900/60 to-black" : "from-blue-200 to-blue-300",
      shadow: isDarkMode ? "shadow-blue-400/20" : "shadow-blue-500/15"
    },
    {
      name: "Plan Empresarial",
      price: "$599.900",
      duration: "12 meses",
      icon: <FaStar className={`text-4xl ${isDarkMode ? "text-yellow-500" : "text-yellow-600"}`} />,
      features: [
        "Publicación por 1 año",
        "Todo lo del Plan Premium",
        "Asesoría legal incluida",
        "Gestión de interesados",
        "Reportes mensuales VIP"
      ],
      color: isDarkMode ? "from-yellow-900/20 to-black" : "from-yellow-100 to-yellow-200",
      shadow: isDarkMode ? "shadow-yellow-500/10" : "shadow-yellow-600/5"
    }
  ];

  if (showAuthModal && !isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
        isDarkMode ? "bg-primary-dark" : "bg-light-100"
      }`}>
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-8 relative overflow-hidden">
          <div className={`absolute inset-0 ${isDarkMode ? "bg-blue-900/10" : "bg-blue-600/5"}`}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-md w-full border p-12 rounded-[3rem] text-center relative z-10 shadow-2xl ${
              isDarkMode ? "bg-midnight-DEFAULT border-white/10" : "bg-white border-light-200"
            }`}
          >
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <FaLock className="text-3xl text-blue-500" />
            </div>
            <h2 className={`text-3xl font-serif font-bold mb-4 ${isDarkMode ? "text-white" : "text-dark-950"}`}>Acceso Restringido</h2>
            <p className={`font-light mb-10 leading-relaxed ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>
              Debes iniciar sesión para publicar tu propiedad y acceder a nuestros planes exclusivos.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => navigate("/login")}
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg ${
                  isDarkMode ? "bg-white text-dark-950 hover:bg-gray-100" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                }`}
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => navigate("/register")}
                className={`w-full border py-5 rounded-2xl font-bold uppercase tracking-widest transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-light-300 text-dark-800 hover:bg-light-50"
                }`}
              >
                Crear Cuenta
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-500 ${
      isDarkMode ? "bg-primary-dark" : "bg-light-100"
    }`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1460317442991-0ec239f636a7?auto=format&fit=crop&w=1920&q=80" 
            alt="Publish Background" 
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
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
          >
            Eleva tu inmueble al siguiente nivel
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tight leading-tight ${
              isDarkMode ? "text-white" : "text-dark-950"
            }`}
          >
            Vende con <span className="text-blue-600 italic font-light">Distinción</span>
          </motion.h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-dark-700"
            }`}
          >
            Nuestra plataforma premium garantiza que tu propiedad destaque ante los compradores más selectos del mercado.
          </motion.p>
        </div>
      </section>

      <main className="flex-grow py-24 px-6 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-4 ${isDarkMode ? "text-white" : "text-dark-950"}`}>Planes de Publicación</h2>
            <p className={`font-light max-w-2xl mx-auto text-lg ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>
              Explora nuestras opciones diseñadas para maximizar el potencial de tu propiedad y atraer inversores calificados.
            </p>
          </div>

          {/* Carrusel de Planes */}
          <div className="pb-20">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 5,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              modules={[Autoplay, Pagination, EffectCoverflow]}
              className="publish-swiper !pb-24"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 }
              }}
            >
              {plans.map((plan, i) => (
                <SwiperSlide key={i} className="!h-auto">
                  <motion.div 
                    whileHover={{ y: -15 }}
                    className={`relative p-[1px] rounded-[3rem] h-full transition-all duration-500 ${
                      isDarkMode ? `bg-gradient-to-b ${plan.color}` : "bg-light-200"
                    }`}
                  >
                    <div className={`h-full rounded-[2.95rem] p-12 flex flex-col items-center text-center border transition-all duration-500 group ${
                      isDarkMode 
                        ? "bg-midnight-DEFAULT/90 backdrop-blur-xl border-white/5 shadow-2xl" 
                        : "bg-white border-light-200 shadow-xl shadow-blue-900/5"
                    } ${plan.shadow}`}>
                      {plan.recommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] z-20 shadow-lg shadow-blue-600/30">
                          Recomendado
                        </div>
                      )}
                      
                      <div className={`mb-10 p-10 rounded-[2.5rem] transition-all duration-500 transform group-hover:scale-110 ${
                        isDarkMode ? "bg-white/5 group-hover:bg-blue-600/10" : "bg-blue-600/5 group-hover:bg-blue-600/10"
                      }`}>
                        {plan.icon}
                      </div>
                      
                      <h3 className={`text-2xl font-bold mb-3 tracking-tight ${isDarkMode ? "text-white" : "text-dark-950"}`}>{plan.name}</h3>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-5xl font-bold ${isDarkMode ? "text-white" : "text-blue-600"}`}>{plan.price}</span>
                        <span className={`text-xs font-bold tracking-widest italic ${isDarkMode ? "text-blue-400/60" : "text-blue-600/40"}`}>COP</span>
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-12 ${isDarkMode ? "text-gray-500" : "text-dark-400"}`}>{plan.duration}</p>
                      
                      <ul className="w-full space-y-6 mb-16 text-left">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-4 group/item">
                            <div className={`mt-1 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-125 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                              <FaCheck />
                            </div>
                            <span className={`text-sm font-light transition-colors duration-300 ${
                              isDarkMode ? "text-gray-400 group-hover/item:text-white" : "text-dark-700 group-hover/item:text-dark-950"
                            }`}>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full mt-auto py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-500 shadow-xl ${
                          isDarkMode
                            ? "bg-white text-dark-950 hover:bg-gray-100"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                        }`}
                      >
                        Seleccionar Plan
                      </motion.button>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Features Grid */}
          <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className={`text-5xl md:text-6xl font-serif font-bold leading-tight ${isDarkMode ? "text-white" : "text-dark-950"}`}>
                La Diferencia de <span className="text-blue-600 italic font-light">LuxHabitat</span>
              </h2>
              <div className="space-y-12">
                <motion.div whileHover={{ x: 10 }} className="flex gap-8 group">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isDarkMode ? "bg-white/5 text-blue-400 group-hover:bg-blue-600 group-hover:text-white" : "bg-blue-600/5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                  }`}>
                    <FaStar className="text-3xl" />
                  </div>
                  <div>
                    <h4 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-dark-950"}`}>Audiencia Exclusiva</h4>
                    <p className={`font-light leading-relaxed text-lg ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>
                      Tu propiedad será presentada ante un círculo cerrado de inversionistas y compradores de alto perfil.
                    </p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 10 }} className="flex gap-8 group">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isDarkMode ? "bg-white/5 text-blue-400 group-hover:bg-blue-600 group-hover:text-white" : "bg-blue-600/5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                  }`}>
                    <FaRocket className="text-3xl" />
                  </div>
                  <div>
                    <h4 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-dark-950"}`}>Exposición Máxima</h4>
                    <p className={`font-light leading-relaxed text-lg ${isDarkMode ? "text-gray-400" : "text-dark-700"}`}>
                      Utilizamos estrategias de marketing digital de vanguardia para conectar con el comprador ideal.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-10 bg-blue-600/10 rounded-[5rem] blur-[100px] group-hover:bg-blue-600/20 transition-all duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" 
                alt="Propiedad de Lujo" 
                className={`relative rounded-[4rem] shadow-2xl border transition-all duration-700 group-hover:scale-[1.02] ${
                  isDarkMode ? "border-white/5" : "border-white shadow-blue-900/10"
                }`}
              />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


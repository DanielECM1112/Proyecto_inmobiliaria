import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedinIn,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaPhoneAlt
} from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const { isDarkMode } = useTheme();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const services = [
    { name: "Compra de Propiedades", path: "/services/buying" },
    { name: "Venta de Inmuebles", path: "/services/selling" },
    { name: "Publica Tu Propiedad", path: "/publish" }
  ];

  const quickLinks = [
    { name: "Inicio", path: "/" },
    { name: "Propiedades", path: "/properties" },
    { name: "Nosotros", path: "/about" },
    { name: "Ubicación", path: "/location" }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://facebook.com" },
    { icon: <FaInstagram />, url: "https://instagram.com" },
    { icon: <FaTwitter />, url: "https://twitter.com" },
    { icon: <FaLinkedinIn />, url: "https://linkedin.com" }
  ];

  return (
    <footer className={`transition-colors duration-500 pt-28 pb-12 px-6 md:px-8 relative overflow-hidden ${
      isDarkMode
        ? "bg-midnight-DEFAULT text-white border-t border-white/10"
        : "bg-white text-dark-900 border-t border-light-300 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]"
    }`}>
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] blur-[120px] rounded-full transition-colors duration-500 ${
          isDarkMode ? "bg-blue-500/10" : "bg-blue-400/10"
        }`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Section */}
          <div className="space-y-10">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-500 ${
                isDarkMode
                  ? "bg-white/10 border border-white/20"
                  : "bg-blue-600 border border-blue-700"
              }`}>
                <svg className={`w-8 h-8 transition-colors duration-500 ${isDarkMode ? "text-white" : "text-white"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className={`text-3xl md:text-4xl font-serif font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-dark-950"
              }`}>
                LUX<span className={`font-light transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}>HABITAT</span>
              </h2>
            </Link>
            
            <p className={`text-base font-sans font-light leading-relaxed max-w-xs transition-colors duration-500 ${
              isDarkMode ? "text-gray-300" : "text-dark-800"
            }`}>
              Redefiniendo el estándar del lujo inmobiliario en Ibagué. Tu aliado estratégico para inversiones exclusivas y hogares excepcionales.
            </p>

            <div className="flex gap-5">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    y: -8, 
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.1)',
                    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)'
                  }}
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                    isDarkMode
                      ? "border-white/10 text-gray-400 hover:border-blue-500/50"
                      : "border-dark-300 text-dark-700 hover:border-blue-600/50"
                  }`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-[12px] font-sans font-bold mb-12 uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">Servicios</h3>
            <ul className="space-y-6">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.path}
                    className="text-dark-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:translate-x-3 flex items-center gap-4 transition-all duration-500 font-sans font-medium text-[15px] group"
                  >
                    <span className="w-1.5 h-[1px] bg-blue-400/50 dark:bg-blue-500/30 group-hover:w-6 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-all duration-500"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[12px] font-sans font-bold mb-12 uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">Navegación</h3>
            <ul className="space-y-6">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-dark-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:translate-x-3 flex items-center gap-4 transition-all duration-500 font-sans font-medium text-[15px] group"
                  >
                    <span className="w-1.5 h-[1px] bg-blue-400/50 dark:bg-blue-500/30 group-hover:w-6 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-all duration-500"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-14 space-y-6 pt-10 border-t border-light-200 dark:border-white/5">
              <a 
                href="https://www.google.com/maps/place/Ibagu%C3%A9,+Tolima,+Colombia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-dark-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-sans font-semibold text-sm group transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isDarkMode ? "bg-blue-500/10 text-blue-500" : "bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                }`}>
                  <HiOutlineLocationMarker className="text-xl" />
                </div>
                <span className="group-hover:translate-x-1 transition-all">Ibagué, Tolima - Colombia</span>
              </a>
              <a 
                href="https://wa.me/573223147352" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-dark-800 dark:text-gray-300 font-sans font-light text-sm group"
              >
                <div className="w-10 h-10 bg-green-500/10 text-green-600 dark:text-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 dark:group-hover:bg-green-500 group-hover:text-white transition-all duration-500">
                  <FaPhoneAlt className="text-lg" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>WhatsApp Directo</span>
                  <span className={`transition-colors font-bold text-base ${isDarkMode ? "group-hover:text-white" : "group-hover:text-green-600"}`}>+57 322 314 7352</span>
                </div>
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-10">
            <h3 className="text-[12px] font-sans font-bold mb-12 uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">Newsletter</h3>
            <p className="text-dark-800 dark:text-gray-300 text-[15px] font-sans font-light leading-relaxed">
              Recibe las últimas ofertas exclusivas y novedades del mercado inmobiliario en tu bandeja de entrada.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-5">
              <div className="relative group">
                <HiOutlineMail className={`absolute left-5 top-1/2 -translate-y-1/2 text-2xl group-focus-within:text-blue-500 transition-all duration-500 ${isDarkMode ? 'text-gray-500' : 'text-dark-400'}`} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico" 
                  className={`${isDarkMode ? 'bg-white/5 border-white/10 placeholder:text-gray-600 text-white' : 'bg-white border-dark-200 placeholder:text-dark-400 text-dark-950 shadow-sm'} border rounded-[1.2rem] pl-14 pr-5 py-5 w-full focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all duration-500 text-sm font-sans font-medium`}
                  required
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-5 rounded-[1.2rem] font-sans font-bold text-sm uppercase tracking-widest transition-all duration-500 shadow-xl flex items-center justify-center gap-3 ${
                  isDarkMode
                    ? "bg-white text-dark-900 hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Suscribirme <FaArrowRight />
              </motion.button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="flex flex-col items-center gap-3 text-blue-400 text-sm font-sans font-medium bg-blue-500/10 p-8 rounded-[2.5rem] border border-blue-500/20 text-center shadow-2xl shadow-blue-500/10"
                  >
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-1">
                      <FaCheckCircle className="text-2xl" />
                    </div>
                    <span className="text-white font-bold">¡Bienvenido a la élite!</span>
                    <span className="text-xs text-blue-300/80">Tu suscripción a LuxHabitat ha sido confirmada.</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 text-red-400 text-sm font-sans font-medium bg-red-500/10 p-5 rounded-2xl border border-red-500/20"
                  >
                    <FaExclamationCircle className="text-xl" />
                    <span>Ingresa un email válido.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className={`border-t pt-14 flex flex-col md:flex-row justify-between items-center gap-10 transition-colors duration-500 ${
          isDarkMode ? "border-white/5" : "border-light-200"
        }`}>
          <p className={`text-xs tracking-wider uppercase text-center md:text-left transition-colors duration-500 font-semibold ${
            isDarkMode ? "text-gray-500" : "text-dark-600"
          }`}>
            © 2026 LUXHABITAT Inmobiliaria Premium. Ibagué, Colombia.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            <Link to="/terms" className={`text-xs tracking-wider uppercase transition-colors duration-300 font-semibold hover:text-blue-500 ${
              isDarkMode ? "text-gray-500 hover:text-white" : "text-dark-600 hover:text-dark-900"
            }`}>Términos</Link>
            <Link to="/privacy" className={`text-xs tracking-wider uppercase transition-colors duration-300 font-semibold hover:text-blue-500 ${
              isDarkMode ? "text-gray-500 hover:text-white" : "text-dark-600 hover:text-dark-900"
            }`}>Privacidad</Link>
            <Link to="/cookies" className={`text-xs tracking-wider uppercase transition-colors duration-300 font-semibold hover:text-blue-500 ${
              isDarkMode ? "text-gray-500 hover:text-white" : "text-dark-600 hover:text-dark-900"
            }`}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

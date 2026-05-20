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
  FaExclamationCircle
} from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, success, error

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
    { name: "Alquileres", path: "/services/rentals" },
    { name: "Asesoría Inmobiliaria", path: "/services/consulting" },
    { name: "Tasaciones", path: "/services/appraisals" },
    { name: "Gestión Documental", path: "/services/legal" }
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
    <footer className="bg-[#0a0f14] text-white pt-24 pb-12 px-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Section */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                <svg className="w-7 h-7 text-[#0a0f14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold tracking-tighter">
                LUX<span className="text-gray-500 font-light">HABITAT</span>
              </h2>
            </Link>
            
            <p className="text-gray-400 text-[15px] font-sans font-light leading-relaxed max-w-xs">
              Líderes en el mercado inmobiliario premium de Ibagué. Brindamos asesoría exclusiva y soluciones de vivienda de alto nivel con integridad y elegancia.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    y: -5, 
                    backgroundColor: '#fff', 
                    color: '#0a0f14',
                    boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
                  }}
                  className="w-10 h-10 rounded-xl border border-gray-800 flex items-center justify-center text-gray-400 transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-[11px] font-sans font-bold mb-10 uppercase tracking-[0.3em] text-gray-500">Servicios</h3>
            <ul className="space-y-5">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.path}
                    className="text-gray-400 hover:text-white hover:translate-x-2 flex items-center gap-3 transition-all duration-300 font-sans font-light text-[14px] group"
                  >
                    <span className="w-1 h-1 bg-gray-800 rounded-full group-hover:bg-white transition-colors"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-sans font-bold mb-10 uppercase tracking-[0.3em] text-gray-500">Enlaces</h3>
            <ul className="space-y-5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white hover:translate-x-2 flex items-center gap-3 transition-all duration-300 font-sans font-light text-[14px] group"
                  >
                    <span className="w-1 h-1 bg-gray-800 rounded-full group-hover:bg-white transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-12 space-y-5 pt-8 border-t border-gray-900/50">
              <div className="flex items-center gap-3 text-gray-500 font-sans font-light text-sm">
                <HiOutlineLocationMarker className="text-lg text-gray-700" />
                <span>Ibagué, Tolima - Colombia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-sans font-light text-sm">
                <HiOutlinePhone className="text-lg text-gray-700" />
                <span>+57 (608) 277 0000</span>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-8">
            <h3 className="text-[11px] font-sans font-bold mb-10 uppercase tracking-[0.3em] text-gray-500">Newsletter</h3>
            <p className="text-gray-400 text-[14px] font-sans font-light leading-relaxed">
              Recibe las últimas ofertas y lanzamientos de proyectos exclusivos directamente en tu correo.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xl group-focus-within:text-white transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico" 
                  className="bg-gray-900/30 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 w-full focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all text-sm font-sans font-light placeholder:text-gray-700"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-white text-[#0a0f14] py-4 rounded-2xl font-sans font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl shadow-white/5"
              >
                Suscribirme
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-2 text-green-500 text-xs font-sans font-medium bg-green-500/5 p-4 rounded-2xl border border-green-500/10 text-center"
                  >
                    <FaCheckCircle className="text-2xl mb-1" />
                    <span>¡Gracias por suscribirte a LuxHabitat!</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-red-500 text-xs font-sans font-medium bg-red-500/5 p-4 rounded-2xl border border-red-500/10"
                  >
                    <FaExclamationCircle className="text-lg" />
                    <span>Por favor ingresa un email válido.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-700 font-sans text-[10px] tracking-[0.3em] uppercase text-center md:text-left">
            © 2026 LUXHABITAT Inmobiliaria Premium. Todos los derechos reservados.
          </p>
          <div className="flex gap-10">
            <a href="#" className="text-gray-700 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors font-sans font-bold">Términos</a>
            <a href="#" className="text-gray-700 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors font-sans font-bold">Privacidad</a>
            <a href="#" className="text-gray-700 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors font-sans font-bold">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

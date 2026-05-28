import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineMapPin, HiOutlineHome, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineHeart, HiOutlineLocationMarker } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Location() {
  const { isDarkMode } = useTheme();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    neighborhood: 'todos',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'todos',
    bathrooms: 'todos',
    propertyType: 'todos'
  });

  // Datos de ejemplo de propiedades en Ibagué
  const properties = [
    {
      id: 1,
      title: 'Apartamento Moderno en El Vergel',
      neighborhood: 'El Vergel',
      price: 580000000,
      bedrooms: 3,
      bathrooms: 2,
      area: 85,
      type: 'apartamento',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      mapPosition: { x: 68, y: 45 }
    },
    {
      id: 2,
      title: 'Casa Familiar en Picaleña',
      neighborhood: 'Picaleña',
      price: 720000000,
      bedrooms: 4,
      bathrooms: 3,
      area: 120,
      type: 'casa',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
      mapPosition: { x: 52, y: 65 }
    },
    {
      id: 3,
      title: 'Penthouse con Vista Panorámica',
      neighborhood: 'Centro',
      price: 1200000000,
      bedrooms: 3,
      bathrooms: 3,
      area: 150,
      type: 'penthouse',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      mapPosition: { x: 45, y: 40 }
    },
    {
      id: 4,
      title: 'Apartamento Acogedor en Belén',
      neighborhood: 'Belén',
      price: 450000000,
      bedrooms: 2,
      bathrooms: 2,
      area: 70,
      type: 'apartamento',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      mapPosition: { x: 30, y: 35 }
    },
    {
      id: 5,
      title: 'Casa Campestre en la Florida',
      neighborhood: 'La Florida',
      price: 950000000,
      bedrooms: 5,
      bathrooms: 4,
      area: 200,
      type: 'casa',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      mapPosition: { x: 75, y: 75 }
    }
  ];

  const neighborhoods = ['todos', 'El Vergel', 'Picaleña', 'Centro', 'Belén', 'La Florida', 'Ambalá'];
  const propertyTypes = ['todos', 'apartamento', 'casa', 'penthouse'];

  const filteredProperties = properties.filter(prop => {
    if (filters.neighborhood !== 'todos' && prop.neighborhood !== filters.neighborhood) return false;
    if (filters.propertyType !== 'todos' && prop.type !== filters.propertyType) return false;
    if (filters.minPrice && prop.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && prop.price > parseInt(filters.maxPrice)) return false;
    if (filters.bedrooms !== 'todos' && prop.bedrooms !== parseInt(filters.bedrooms)) return false;
    return true;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDarkMode ? "bg-[#0a0e1a]" : "bg-[#FAFBFC]"
    }`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1920&q=80" 
            alt="Ibagué" 
            className="w-full h-full object-cover"
            style={{ opacity: isDarkMode ? 0.15 : 0.20, transition: "opacity 500ms" }}
          />
          <div className={`absolute inset-0 transition-colors duration-500 ${
            isDarkMode 
              ? "bg-gradient-to-br from-[#0a0e1a]/95 via-[#0a0e1a]/85 to-[#0a0e1a]/95" 
              : "bg-gradient-to-br from-white/90 via-white/80 to-white/90"
          }`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className={`text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight ${
              isDarkMode ? "text-white" : "text-[#0A0E1F]"
            }`}>
              Encuentra tu <span className="text-[#D4AF37] italic font-light">Hogar Perfecto</span> en Ibagué
            </h1>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8 rounded-full"></div>
            <p className={`text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-[#5A6B7D]"
            }`}>
              Explora los barrios más exclusivos y encuentra la propiedad que se adapte a tu estilo de vida.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-grow py-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Filtros */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className={`p-6 rounded-3xl sticky top-28 transition-colors duration-500 ${
                  isDarkMode 
                    ? "bg-[#121829] border border-white/10 shadow-2xl" 
                    : "bg-white border border-[rgba(10,14,31,0.08)] shadow-xl"
                }`}
              >
                <div className="flex items-center gap-3 mb-8">
                  <HiOutlineSearch className="text-2xl text-[#D4AF37]" />
                  <h2 className={`text-2xl font-serif font-bold ${isDarkMode ? "text-white" : "text-[#0A0E1F]"}`}>
                    Filtros de Búsqueda
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Barrio */}
                  <div>
                    <label className={`text-sm font-bold uppercase tracking-wider mb-2 block ${
                      isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"
                    }`}>
                      Barrio
                    </label>
                    <select
                      value={filters.neighborhood}
                      onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                        isDarkMode 
                          ? "bg-white/5 border border-white/10 text-white" 
                          : "bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]"
                      }`}
                    >
                      {neighborhoods.map(n => (
                        <option key={n} value={n} className={isDarkMode ? "bg-[#121829]" : "bg-white"}>
                          {n === 'todos' ? 'Todos los barrios' : n}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de propiedad */}
                  <div>
                    <label className={`text-sm font-bold uppercase tracking-wider mb-2 block ${
                      isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"
                    }`}>
                      Tipo de Propiedad
                    </label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                        isDarkMode 
                          ? "bg-white/5 border border-white/10 text-white" 
                          : "bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]"
                      }`}
                    >
                      {propertyTypes.map(t => (
                        <option key={t} value={t} className={isDarkMode ? "bg-[#121829]" : "bg-white"}>
                          {t === 'todos' ? 'Todos los tipos' : t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Precio */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-bold uppercase tracking-wider mb-2 block ${
                        isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"
                      }`}>
                        Precio Mínimo
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                          isDarkMode 
                            ? "bg-white/5 border border-white/10 text-white" 
                            : "bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm font-bold uppercase tracking-wider mb-2 block ${
                        isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"
                      }`}>
                        Precio Máximo
                      </label>
                      <input
                        type="number"
                        placeholder="2000000000"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                          isDarkMode 
                            ? "bg-white/5 border border-white/10 text-white" 
                            : "bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Habitaciones y Baños */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-bold uppercase tracking-wider mb-2 block ${
                        isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"
                      }`}>
                        Habitaciones
                      </label>
                      <select
                        value={filters.bedrooms}
                        onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                          isDarkMode 
                            ? "bg-white/5 border border-white/10 text-white" 
                            : "bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]"
                        }`}
                      >
                        <option value="todos" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>Cualquiera</option>
                        <option value="1" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>1+</option>
                        <option value="2" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>2+</option>
                        <option value="3" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>3+</option>
                        <option value="4" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>4+</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-sm font-bold uppercase tracking-wider mb-2 block ${
                        isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"
                      }`}>
                        Baños
                      </label>
                      <select
                        value={filters.bathrooms}
                        onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                          isDarkMode 
                            ? "bg-white/5 border border-white/10 text-white" 
                            : "bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]"
                        }`}
                      >
                        <option value="todos" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>Cualquiera</option>
                        <option value="1" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>1+</option>
                        <option value="2" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>2+</option>
                        <option value="3" className={isDarkMode ? "bg-[#121829]" : "bg-white"}>3+</option>
                      </select>
                    </div>
                  </div>

                  {/* Botón Limpiar */}
                  <button
                    onClick={() => setFilters({
                      neighborhood: 'todos',
                      minPrice: '',
                      maxPrice: '',
                      bedrooms: 'todos',
                      bathrooms: 'todos',
                      propertyType: 'todos'
                    })}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isDarkMode 
                        ? "bg-white/10 text-white hover:bg-white/20" 
                        : "bg-[#F0F3F7] text-[#0A0E1F] hover:bg-[#E4EAF2]"
                    }`}
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Mapa y Lista de Propiedades */}
            <div className="xl:col-span-2 space-y-8">
              {/* Mapa Creativo de Ibagué */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`relative rounded-3xl overflow-hidden transition-colors duration-500 ${
                  isDarkMode ? "bg-[#121829] border border-white/10" : "bg-white border border-[rgba(10,14,31,0.08)]"
                }`}
                style={{ minHeight: '500px' }}
              >
                <div className="p-6 border-b border-white/10">
                  <h3 className={`text-2xl font-serif font-bold ${isDarkMode ? "text-white" : "text-[#0A0E1F]"}`}>
                    Mapa de Ibagué
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"}`}>
                    Haz clic en los marcadores para ver más detalles
                  </p>
                </div>

                {/* Mapa SVG Creativo */}
                <div className="relative w-full" style={{ height: '400px' }}>
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    style={{ background: isDarkMode ? 'linear-gradient(135deg, #0a0e1a 0%, #121829 100%)' : 'linear-gradient(135deg, #FAFBFC 0%, #F0F3F7 100%)' }}
                  >
                    {/* Círculos decorativos */}
                    <circle cx="20" cy="20" r="30" fill="url(#gold-gradient)" opacity="0.05" />
                    <circle cx="80" cy="80" r="25" fill="url(#gold-gradient)" opacity="0.05" />
                    
                    {/* Líneas de calles */}
                    <path
                      d="M10 50 L90 50"
                      stroke={isDarkMode ? "rgba(212, 175, 55, 0.2)" : "rgba(212, 175, 55, 0.3)"}
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M50 10 L50 90"
                      stroke={isDarkMode ? "rgba(212, 175, 55, 0.2)" : "rgba(212, 175, 55, 0.3)"}
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M20 20 L80 80"
                      stroke={isDarkMode ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.2)"}
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M80 20 L20 80"
                      stroke={isDarkMode ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.2)"}
                      strokeWidth="1"
                      fill="none"
                    />

                    {/* Zonas/Barrios */}
                    <ellipse cx="68" cy="45" rx="8" ry="6" fill={isDarkMode ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.2)"} />
                    <text x="68" y="45" textAnchor="middle" dominantBaseline="middle" fontSize="4" fill={isDarkMode ? "#D4AF37" : "#B8941B"}>El Vergel</text>
                    
                    <ellipse cx="52" cy="65" rx="7" ry="5" fill={isDarkMode ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.2)"} />
                    <text x="52" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="4" fill={isDarkMode ? "#D4AF37" : "#B8941B"}>Picaleña</text>
                    
                    <ellipse cx="45" cy="40" rx="6" ry="5" fill={isDarkMode ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.2)"} />
                    <text x="45" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="4" fill={isDarkMode ? "#D4AF37" : "#B8941B"}>Centro</text>
                    
                    <ellipse cx="30" cy="35" rx="6" ry="5" fill={isDarkMode ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.2)"} />
                    <text x="30" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="4" fill={isDarkMode ? "#D4AF37" : "#B8941B"}>Belén</text>
                    
                    <ellipse cx="75" cy="75" rx="7" ry="6" fill={isDarkMode ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.2)"} />
                    <text x="75" y="75" textAnchor="middle" dominantBaseline="middle" fontSize="4" fill={isDarkMode ? "#D4AF37" : "#B8941B"}>La Florida</text>

                    {/* Gradientes */}
                    <defs>
                      <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#E5C158" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Marcadores de Propiedades */}
                  {filteredProperties.map((prop) => (
                    <motion.div
                      key={prop.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedProperty(prop)}
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
                      style={{
                        left: `${prop.mapPosition.x}%`,
                        top: `${prop.mapPosition.y}%`
                      }}
                    >
                      <div className={`relative p-2 rounded-full transition-all duration-300 ${
                        selectedProperty?.id === prop.id 
                          ? "bg-[#D4AF37] scale-125 shadow-lg shadow-[#D4AF37]/30" 
                          : "bg-[#D4AF37]/90 hover:bg-[#D4AF37]"
                      }`}>
                        <HiOutlineHome className="text-white text-lg" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#D4AF37]" />
                    </motion.div>
                  ))}

                  {/* Tooltip de propiedad seleccionada */}
                  {selectedProperty && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute z-20 p-4 rounded-2xl shadow-2xl max-w-xs ${
                        isDarkMode 
                          ? "bg-[#121829] border border-white/10" 
                          : "bg-white border border-[rgba(10,14,31,0.08)]"
                      }`}
                      style={{
                        left: `${selectedProperty.mapPosition.x}%`,
                        top: `${selectedProperty.mapPosition.y - 15}%`,
                        transform: 'translate(-50%, -100%)'
                      }}
                    >
                      <img
                        src={selectedProperty.image}
                        alt={selectedProperty.title}
                        className="w-full h-32 object-cover rounded-xl mb-3"
                      />
                      <h4 className={`font-bold mb-1 ${isDarkMode ? "text-white" : "text-[#0A0E1F]"}`}>
                        {selectedProperty.title}
                      </h4>
                      <p className="text-[#D4AF37] font-bold text-lg mb-2">
                        {formatPrice(selectedProperty.price)}
                      </p>
                      <div className={`flex gap-4 text-sm ${isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"}`}>
                        <span className="flex items-center gap-1">
                          <HiOutlineHome /> {selectedProperty.bedrooms} hab
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineUsers /> {selectedProperty.bathrooms} baños
                        </span>
                        <span>{selectedProperty.area}m²</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Lista de Propiedades */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-2xl font-serif font-bold ${isDarkMode ? "text-white" : "text-[#0A0E1F]"}`}>
                    Propiedades Disponibles ({filteredProperties.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.map((prop) => (
                    <motion.div
                      key={prop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      className={`rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
                        isDarkMode 
                          ? "bg-[#121829] border border-white/10 hover:border-[#D4AF37]/30" 
                          : "bg-white border border-[rgba(10,14,31,0.08)] hover:border-[#D4AF37]/30"
                      }`}
                      onClick={() => setSelectedProperty(prop)}
                    >
                      <div className="relative">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <button className={`p-2 rounded-full transition-all duration-300 ${
                            isDarkMode ? "bg-black/50 text-white hover:bg-black/70" : "bg-white/80 text-[#0A0E1F] hover:bg-white"
                          }`}>
                            <HiOutlineHeart className="text-xl" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isDarkMode ? "bg-[#D4AF37] text-[#0A0E1F]" : "bg-[#D4AF37] text-[#0A0E1F]"
                          }`}>
                            {prop.type.charAt(0).toUpperCase() + prop.type.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <HiOutlineMapPin className="text-[#D4AF37]" />
                          <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"}`}>
                            {prop.neighborhood}
                          </span>
                        </div>

                        <h4 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-[#0A0E1F]"}`}>
                          {prop.title}
                        </h4>

                        <p className="text-[#D4AF37] font-bold text-2xl mb-4">
                          {formatPrice(prop.price)}
                        </p>

                        <div className={`flex gap-6 pt-4 border-t ${isDarkMode ? "border-white/10" : "border-[rgba(10,14,31,0.08)]"}`}>
                          <div className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"}`}>
                            <HiOutlineHome className="text-[#D4AF37]" />
                            <span>{prop.bedrooms} Habitaciones</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"}`}>
                            <HiOutlineUsers className="text-[#D4AF37]" />
                            <span>{prop.bathrooms} Baños</span>
                          </div>
                        </div>
                        <div className={`mt-2 flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"}`}>
                          <HiOutlineLocationMarker className="text-[#D4AF37]" />
                          <span>{prop.area} m²</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredProperties.length === 0 && (
                  <div className={`text-center py-20 ${isDarkMode ? "text-gray-400" : "text-[#5A6B7D]"}`}>
                    <HiOutlineSearch className="text-6xl mx-auto mb-4 text-[#D4AF37]/50" />
                    <p className="text-lg">No se encontraron propiedades con esos filtros</p>
                    <p className="text-sm">Intenta cambiar los parámetros de búsqueda</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

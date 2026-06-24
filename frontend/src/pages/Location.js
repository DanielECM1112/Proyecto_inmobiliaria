import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineHome, HiOutlineUsers, HiOutlineHeart, HiOutlineLocationMarker, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import PropertyCard from '../components/PropertyCard';
import { useTheme } from '../context/ThemeContext';

const FILTERS_INIT = {
  neighborhood: 'todos',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'todos',
  bathrooms: 'todos',
  propertyType: 'todos',
};

export default function Location() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState(FILTERS_INIT);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties/')
      .then(r => setProperties(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const neighborhoods = useMemo(
    () => ['todos', ...Array.from(new Set(properties.map(p => p.ubicacion).filter(Boolean))).sort()],
    [properties]
  );

  const propertyTypes = useMemo(
    () => ['todos', ...Array.from(new Set(properties.map(p => p.tipo).filter(Boolean))).sort()],
    [properties]
  );

  const openInGoogleMaps = (lat, lng) => {
    if (!lat || !lng) return;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const openInWaze = (lat, lng) => {
    if (!lat || !lng) return;
    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
  };

  const filteredProperties = properties.filter(prop => {
    if (filters.neighborhood !== 'todos' && prop.ubicacion !== filters.neighborhood) return false;
    if (filters.propertyType !== 'todos' && prop.tipo !== filters.propertyType) return false;
    if (filters.minPrice && parseFloat(prop.precio) < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && parseFloat(prop.precio) > parseInt(filters.maxPrice)) return false;
    if (filters.bedrooms !== 'todos' && (prop.habitaciones ?? 0) < parseInt(filters.bedrooms)) return false;
    if (filters.bathrooms !== 'todos' && (prop.banos ?? 0) < parseInt(filters.bathrooms)) return false;
    return true;
  });

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

  const getTooltipImg = (prop) => {
    if (!prop) return '';
    if (prop.imagenes?.length) {
      const img = prop.imagenes[0].imagen;
      if (img) return img.startsWith('http') ? img : `http://localhost:8000${img}`;
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80';
  };

  return (
    <PageWrapper>
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0e1a]' : 'bg-[#FAFBFC]'
      }`}>
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1920&q=80"
              alt="Ibagué"
              className="w-full h-full object-cover"
              style={{ opacity: isDarkMode ? 0.15 : 0.20, transition: 'opacity 500ms' }}
            />
            <div className={`absolute inset-0 transition-colors duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-[#0a0e1a]/95 via-[#0a0e1a]/85 to-[#0a0e1a]/95'
                : 'bg-gradient-to-br from-white/90 via-white/80 to-white/90'
            }`} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <h1 className={`text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight ${
                isDarkMode ? 'text-white' : 'text-[#0A0E1F]'
              }`}>
                Encuentra tu <span className="text-[#D4AF37]" style={{ fontStyle: 'italic', fontWeight: 300 }}>Hogar Perfecto</span> en Ibagué
              </h1>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8 rounded-full" />
              <p className={`text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-[#5A6B7D]'
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
                      ? 'bg-[#121829] border border-white/10 shadow-2xl'
                      : 'bg-white border border-[rgba(10,14,31,0.08)] shadow-xl'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <HiOutlineSearch className="text-2xl text-[#D4AF37]" />
                    <h2 className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                      Filtros de Búsqueda
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Barrio */}
                    <div>
                      <label className={`text-sm font-bold uppercase tracking-widest mb-2 block ${
                        isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'
                      }`}>Barrio</label>
                      <select
                        value={filters.neighborhood}
                        onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-white/5 border border-white/10 text-white'
                            : 'bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]'
                        }`}
                      >
                        {neighborhoods.map(n => (
                          <option key={n} value={n} className={isDarkMode ? 'bg-[#121829]' : 'bg-white'}>
                            {n === 'todos' ? 'Todos los barrios' : n}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tipo */}
                    <div>
                      <label className={`text-sm font-bold uppercase tracking-widest mb-2 block ${
                        isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'
                      }`}>Tipo de Propiedad</label>
                      <select
                        value={filters.propertyType}
                        onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-white/5 border border-white/10 text-white'
                            : 'bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]'
                        }`}
                      >
                        {propertyTypes.map(t => (
                          <option key={t} value={t} className={isDarkMode ? 'bg-[#121829]' : 'bg-white'}>
                            {t === 'todos' ? 'Todos los tipos' : t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Precio */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-sm font-bold uppercase tracking-widest mb-2 block ${
                          isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'
                        }`}>Precio Mín.</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/5 border border-white/10 text-white'
                              : 'bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`text-sm font-bold uppercase tracking-widest mb-2 block ${
                          isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'
                        }`}>Precio Máx.</label>
                        <input
                          type="number"
                          placeholder="2000000000"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/5 border border-white/10 text-white'
                              : 'bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Habitaciones y Baños */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-sm font-bold uppercase tracking-widest mb-2 block ${
                          isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'
                        }`}>Habitaciones</label>
                        <select
                          value={filters.bedrooms}
                          onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/5 border border-white/10 text-white'
                              : 'bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]'
                          }`}
                        >
                          <option value="todos" className={isDarkMode ? 'bg-[#121829]' : 'bg-white'}>Cualquiera</option>
                          {['1', '2', '3', '4'].map(v => (
                            <option key={v} value={v} className={isDarkMode ? 'bg-[#121829]' : 'bg-white'}>{v}+</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`text-sm font-bold uppercase tracking-widest mb-2 block ${
                          isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'
                        }`}>Baños</label>
                        <select
                          value={filters.bathrooms}
                          onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/5 border border-white/10 text-white'
                              : 'bg-[#F0F3F7] border border-[rgba(10,14,31,0.08)] text-[#0A0E1F]'
                          }`}
                        >
                          <option value="todos" className={isDarkMode ? 'bg-[#121829]' : 'bg-white'}>Cualquiera</option>
                          {['1', '2', '3'].map(v => (
                            <option key={v} value={v} className={isDarkMode ? 'bg-[#121829]' : 'bg-white'}>{v}+</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Limpiar */}
                    <button
                      onClick={() => setFilters(FILTERS_INIT)}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-[#F0F3F7] text-[#0A0E1F] hover:bg-[#E4EAF2]'
                      }`}
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Mapa y Lista */}
              <div className="xl:col-span-2 space-y-8">

                {/* Mapa Decorativo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`relative rounded-3xl overflow-hidden transition-colors duration-500 ${
                    isDarkMode ? 'bg-[#121829] border border-white/10' : 'bg-white border border-[rgba(10,14,31,0.08)]'
                  }`}
                  style={{ minHeight: '550px' }}
                >
                  <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                        Mapa de Ibagué
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                        Haz clic en los marcadores para ver más detalles
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 flex items-center justify-center transition-all">
                        <span className="text-[#D4AF37] font-bold text-lg">+</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 flex items-center justify-center transition-all">
                        <span className="text-[#D4AF37] font-bold text-lg">−</span>
                      </button>
                    </div>
                  </div>

                  {/* SVG Mapa */}
                  <div className="relative w-full" style={{ height: '450px' }}>
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      style={{
                        background: isDarkMode
                          ? 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)'
                          : 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)',
                      }}
                    >
                      <defs>
                        <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                          <path d="M 8 0 L 0 0 0 8" fill="none" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth="0.5" />
                        </pattern>
                        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#E5C158" />
                        </linearGradient>
                        <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#34D399" />
                          <stop offset="100%" stopColor="#60A5FA" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      <rect width="100" height="100" fill="url(#grid)" />

                      <path d="M 10 50 Q 30 45, 50 50 T 90 50" stroke="url(#route-gradient)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                      <path d="M 50 10 Q 45 30, 50 50 T 50 90" stroke="url(#route-gradient)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                      <path d="M 25 25 Q 40 35, 50 50 T 75 75" stroke="url(#route-gradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" strokeDasharray="3 2" />
                      <path d="M 75 25 Q 60 35, 50 50 T 25 75" stroke="url(#route-gradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" strokeDasharray="3 2" />

                      <ellipse cx="75" cy="25" rx="12" ry="10" fill={isDarkMode ? 'rgba(212,175,55,0.12)' : 'rgba(212,175,55,0.15)'} />
                      <text x="75" y="25" textAnchor="middle" dominantBaseline="middle" fontSize="3.5" fontWeight="600" fill={isDarkMode ? '#D4D9E3' : '#374151'}>El Vergel</text>

                      <ellipse cx="50" cy="30" rx="10" ry="8" fill={isDarkMode ? 'rgba(96,165,250,0.12)' : 'rgba(96,165,250,0.15)'} />
                      <text x="50" y="30" textAnchor="middle" dominantBaseline="middle" fontSize="3.5" fontWeight="600" fill={isDarkMode ? '#D4D9E3' : '#374151'}>Centro</text>

                      <ellipse cx="25" cy="40" rx="9" ry="7" fill={isDarkMode ? 'rgba(52,211,153,0.12)' : 'rgba(52,211,153,0.15)'} />
                      <text x="25" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="3.5" fontWeight="600" fill={isDarkMode ? '#D4D9E3' : '#374151'}>Belén</text>

                      <ellipse cx="45" cy="55" rx="11" ry="9" fill={isDarkMode ? 'rgba(244,114,182,0.12)' : 'rgba(244,114,182,0.15)'} />
                      <text x="45" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="3.5" fontWeight="600" fill={isDarkMode ? '#D4D9E3' : '#374151'}>Picaleña</text>

                      <ellipse cx="70" cy="70" rx="10" ry="8" fill={isDarkMode ? 'rgba(167,139,250,0.12)' : 'rgba(167,139,250,0.15)'} />
                      <text x="70" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="3.5" fontWeight="600" fill={isDarkMode ? '#D4D9E3' : '#374151'}>La Florida</text>
                    </svg>

                    {/* Marcadores: sólo para props que tengan mapPosition */}
                    {filteredProperties.filter(p => p.mapPosition).map((prop, index) => (
                      <motion.div
                        key={prop.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        onClick={() => setSelectedProperty(prop)}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
                        style={{
                          left: `${prop.mapPosition.x}%`,
                          top: `${prop.mapPosition.y}%`,
                          zIndex: selectedProperty?.id === prop.id ? 20 : 10,
                        }}
                      >
                        <div className={`relative p-2 rounded-full shadow-xl transition-all duration-300 ${
                          selectedProperty?.id === prop.id
                            ? 'bg-[#D4AF37] shadow-[#D4AF37]/50'
                            : 'bg-white/90 hover:bg-white border-2 border-[#D4AF37]'
                        }`}>
                          <HiOutlineHome className={`text-lg ${selectedProperty?.id === prop.id ? 'text-[#0A0E1F]' : 'text-[#D4AF37]'}`} />
                        </div>
                        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] ${
                          selectedProperty?.id === prop.id ? 'border-t-[#D4AF37]' : 'border-t-white'
                        }`} />
                      </motion.div>
                    ))}

                    {/* Tooltip: sólo cuando el prop seleccionado tiene mapPosition */}
                    {selectedProperty && selectedProperty.mapPosition && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`absolute z-30 p-5 rounded-2xl shadow-2xl max-w-xs ${
                          isDarkMode ? 'bg-[#121829] border border-white/20' : 'bg-white border border-[rgba(10,14,31,0.1)]'
                        }`}
                        style={{
                          left: `${selectedProperty.mapPosition.x}%`,
                          top: `${selectedProperty.mapPosition.y - 18}%`,
                          transform: 'translate(-50%, -100%)',
                        }}
                      >
                        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] ${
                          isDarkMode ? 'border-t-white/20' : 'border-t-white'
                        }`} />
                        <div className="relative">
                          <img
                            src={getTooltipImg(selectedProperty)}
                            alt={selectedProperty.titulo}
                            className="w-full h-36 object-cover rounded-xl mb-4"
                          />
                          <button className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all">
                            <HiOutlineHeart className="text-lg" />
                          </button>
                        </div>
                        <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                          {selectedProperty.titulo}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                          <HiOutlineLocationMarker className="text-[#D4AF37]" />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                            {selectedProperty.ubicacion}
                          </span>
                        </div>
                        <p className="text-[#D4AF37] font-bold text-xl mb-4">
                          {formatPrice(selectedProperty.precio)}
                        </p>
                        <div className={`grid grid-cols-3 gap-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                          <div className="flex items-center gap-1.5">
                            <HiOutlineHome className="text-[#D4AF37]" />
                            <span>{selectedProperty.habitaciones} hab</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HiOutlineUsers className="text-[#D4AF37]" />
                            <span>{selectedProperty.banos} baños</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HiOutlineLocationMarker className="text-[#D4AF37]" />
                            <span>{selectedProperty.area}m²</span>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <button
                            onClick={() => openInGoogleMaps(selectedProperty.lat, selectedProperty.lng)}
                            className="py-2 rounded-xl text-xs font-semibold bg-[#4285F4] text-white hover:bg-[#3367D6] transition-all"
                          >
                            Google Maps
                          </button>
                          <button
                            onClick={() => openInWaze(selectedProperty.lat, selectedProperty.lng)}
                            className="py-2 rounded-xl text-xs font-semibold bg-[#31CEB4] text-white hover:bg-[#28B09A] transition-all"
                          >
                            Waze
                          </button>
                          <button
                            onClick={() => navigate(`/properties/${selectedProperty.id}`)}
                            className="py-2 rounded-xl text-xs font-semibold bg-[#D4AF37] text-[#0A0E1F] hover:bg-[#E5C158] transition-all flex items-center justify-center gap-1"
                          >
                            Ver <HiOutlineArrowNarrowRight className="text-xs" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Lista de Propiedades */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                      {loading
                        ? 'Cargando propiedades...'
                        : `Propiedades Disponibles (${filteredProperties.length})`}
                    </h3>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]" />
                    </div>
                  ) : filteredProperties.length === 0 ? (
                    <div className={`text-center py-20 ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                      <HiOutlineSearch className="text-6xl mx-auto mb-4 text-[#D4AF37]/50" />
                      <p className="text-lg mb-2">
                        {properties.length === 0
                          ? 'Aún no hay propiedades publicadas'
                          : 'No se encontraron propiedades con esos filtros'}
                      </p>
                      {properties.length === 0 && (
                        <button
                          onClick={() => navigate('/planes')}
                          className="mt-4 px-6 py-3 rounded-xl border border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37] hover:text-[#0A0E1F] transition-all text-sm"
                        >
                          Publicar una propiedad
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredProperties.map((prop, index) => (
                        <motion.div
                          key={prop.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.08, 0.4) }}
                        >
                          <PropertyCard prop={prop} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}

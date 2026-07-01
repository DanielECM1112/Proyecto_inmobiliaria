import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineHome, HiOutlineUsers, HiOutlineHeart, HiOutlineLocationMarker, HiOutlineArrowNarrowRight, HiOutlineX, HiOutlineCheck } from 'react-icons/hi';
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
  const [compareSelected, setCompareSelected] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

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

  const toggleCompare = (prop) => {
    if (compareSelected.find(p => p.id === prop.id)) {
      setCompareSelected(compareSelected.filter(p => p.id !== prop.id));
    } else {
      if (compareSelected.length < 2) {
        setCompareSelected([...compareSelected, prop]);
      }
    }
  };

  const clearCompare = () => setCompareSelected([]);

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

        {/* Compare Bar */}
        <AnimatePresence>
          {compareSelected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`sticky top-20 z-30 py-4 px-6 shadow-xl transition-colors duration-500 ${
                isDarkMode ? 'bg-[#121829] border-b border-white/10' : 'bg-white border-b border-[rgba(10,14,31,0.1)]'
              }`}
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <HiOutlineCheck className="text-xl text-[#D4AF37]" />
                  <div>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                      {compareSelected.length} {compareSelected.length === 1 ? 'propiedad seleccionada' : 'propiedades seleccionadas'} para comparar
                    </p>
                    {compareSelected.length < 2 && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                        Selecciona 2 propiedades para compararlas
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearCompare}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                        : 'bg-[#F0F3F7] text-[#5A6B7D] hover:bg-[#E4EAF2]'
                    }`}
                  >
                    Limpiar
                  </button>

                  {compareSelected.length === 2 && (
                    <button
                      onClick={() => setShowCompareModal(true)}
                      className="px-6 py-2 rounded-xl bg-[#D4AF37] text-[#0A0E1F] font-bold text-sm hover:bg-[#E5C158] transition-all duration-300 shadow-lg"
                    >
                      Comparar Ahora
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

              {/* Propiedades */}
              <div className="xl:col-span-2">

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
                      {filteredProperties.map((prop, index) => {
                        const isSelected = compareSelected.find(p => p.id === prop.id);
                        return (
                          <motion.div
                            key={prop.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.08, 0.4) }}
                            className="relative"
                          >
                            <PropertyCard prop={prop} />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompare(prop);
                              }}
                              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                                isSelected
                                  ? 'bg-[#D4AF37] text-[#0A0E1F] scale-110'
                                  : 'bg-white/90 text-[#D4AF37] hover:bg-white hover:scale-105 border border-[#D4AF37]/30'
                              }`}
                            >
                              {isSelected ? <HiOutlineCheck className="text-lg" /> : <HiOutlineCheck className="text-lg" />}
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Compare Modal */}
        <AnimatePresence>
          {showCompareModal && compareSelected.length === 2 && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCompareModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl ${
                  isDarkMode ? 'bg-[#121829] border border-white/10' : 'bg-white border border-[rgba(10,14,31,0.1)]'
                }`}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowCompareModal(false)}
                  className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isDarkMode
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-[#F0F3F7] text-[#5A6B7D] hover:bg-[#E4EAF2]'
                  }`}
                >
                  <HiOutlineX className="text-xl" />
                </button>

                {/* Modal Header */}
                <div className="p-8 border-b border-white/10">
                  <h2 className={`text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                    Comparar Propiedades
                  </h2>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {compareSelected.map((prop, idx) => (
                      <div
                        key={prop.id}
                        className={`rounded-2xl overflow-hidden border ${
                          isDarkMode ? 'border-white/10' : 'border-[rgba(10,14,31,0.1)]'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={getTooltipImg(prop)}
                            alt={prop.titulo}
                            className="w-full h-64 object-cover"
                          />
                          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            prop.estado === 'vendido' ? 'bg-red-500/90 text-white' :
                            prop.estado === 'negociacion' ? 'bg-yellow-500/90 text-white' :
                            'bg-green-500/90 text-white'
                          }`}>
                            {prop.estado === 'vendido' ? 'Vendido' :
                             prop.estado === 'negociacion' ? 'En Negociación' :
                             'Disponible'}
                          </span>
                        </div>

                        <div className={`p-6 ${isDarkMode ? 'bg-[#0a0e1a]' : 'bg-[#FAFBFC]'}`}>
                          <h3 className={`text-xl font-serif font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                            {prop.titulo}
                          </h3>

                          <div className="flex items-center gap-2 mb-4">
                            <HiOutlineLocationMarker className="text-[#D4AF37]" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                              {prop.ubicacion}
                            </span>
                          </div>

                          <p className="text-2xl font-bold text-[#D4AF37] mb-6">
                            {formatPrice(prop.precio)}
                          </p>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="flex flex-col items-center text-center">
                              <HiOutlineHome className="text-[#D4AF37] mb-1" />
                              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                                {prop.habitaciones}
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-[#7A8C9E]'}`}>
                                Habitaciones
                              </span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                              <HiOutlineUsers className="text-[#D4AF37] mb-1" />
                              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                                {prop.banos}
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-[#7A8C9E]'}`}>
                                Baños
                              </span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                              <HiOutlineLocationMarker className="text-[#D4AF37] mb-1" />
                              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                                {prop.area} m²
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-[#7A8C9E]'}`}>
                                Área
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className={`flex items-center justify-between p-3 rounded-xl ${
                              isDarkMode ? 'bg-white/5' : 'bg-[#F0F3F7]'
                            }`}>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                                Tipo
                              </span>
                              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                                {prop.tipo}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between p-3 rounded-xl ${
                              isDarkMode ? 'bg-white/5' : 'bg-[#F0F3F7]'
                            }`}>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                                Estrato
                              </span>
                              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0A0E1F]'}`}>
                                {prop.estrato || 'N/A'}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between p-3 rounded-xl ${
                              isDarkMode ? 'bg-white/5' : 'bg-[#F0F3F7]'
                            }`}>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                                Garaje
                              </span>
                              <span className={`text-sm font-semibold ${
                                prop.garaje
                                  ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                                  : (isDarkMode ? 'text-gray-500' : 'text-gray-500')
                              }`}>
                                {prop.garaje ? 'Sí' : 'No'}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between p-3 rounded-xl ${
                              isDarkMode ? 'bg-white/5' : 'bg-[#F0F3F7]'
                            }`}>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                                Piscina
                              </span>
                              <span className={`text-sm font-semibold ${
                                prop.piscina
                                  ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                                  : (isDarkMode ? 'text-gray-500' : 'text-gray-500')
                              }`}>
                                {prop.piscina ? 'Sí' : 'No'}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between p-3 rounded-xl ${
                              isDarkMode ? 'bg-white/5' : 'bg-[#F0F3F7]'
                            }`}>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#5A6B7D]'}`}>
                                Amoblado
                              </span>
                              <span className={`text-sm font-semibold ${
                                prop.amoblado
                                  ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                                  : (isDarkMode ? 'text-gray-500' : 'text-gray-500')
                              }`}>
                                {prop.amoblado ? 'Sí' : 'No'}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              navigate(`/properties/${prop.id}`);
                            }}
                            className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#0A0E1F] font-bold text-sm hover:bg-[#E5C158] transition-all"
                          >
                            Ver Propiedad
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </PageWrapper>
  );
}

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const PROPERTY_TYPES = ['Todos', 'Casa', 'Apartamento', 'Penthouse', 'Lote', 'Local', 'Finca'];
const PRICE_RANGES = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: 'Menor a $500M', min: 0, max: 500000000 },
  { label: '$500M - $1.000M', min: 500000000, max: 1000000000 },
  { label: 'Mayor a $1.000M', min: 1000000000, max: Infinity }
];
const BEDROOM_RANGES = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: '1-2', min: 1, max: 2 },
  { label: '3-4', min: 3, max: 4 },
  { label: '5+', min: 5, max: Infinity }
];

export default function Properties() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useState(user?.user?.is_staff === true);

  // Filtros
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedPrice, setSelectedPrice] = useState('Todos');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Todos');

  // Cargar usuario y propiedades
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties/');
        setAllProperties(response.data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Verificar si es admin
  useEffect(() => {
    if (user) {
      const isAdminUser = user?.user?.is_staff === true;
      // Actualizar isAdmin si es necesario
    }
  }, [user]);

  // Aplicar filtros
  const filteredProperties = useMemo(() => {
    let filtered = allProperties;

    // Filtro por tipo
    if (selectedType !== 'Todos') {
      filtered = filtered.filter(p =>
        p.tipo?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Filtro por precio
    const priceRange = PRICE_RANGES.find(r => r.label === selectedPrice);
    if (priceRange) {
      filtered = filtered.filter(p =>
        Number(p.precio) >= priceRange.min && Number(p.precio) <= priceRange.max
      );
    }

    // Filtro por habitaciones
    const bedroomRange = BEDROOM_RANGES.find(r => r.label === selectedBedrooms);
    if (bedroomRange) {
      filtered = filtered.filter(p =>
        (p.habitaciones || 0) >= bedroomRange.min && (p.habitaciones || 0) <= bedroomRange.max
      );
    }

    return filtered;
  }, [allProperties, selectedType, selectedPrice, selectedBedrooms]);

  const formatPrice = (price) => {
    if (!price || isNaN(Number(price))) return 'Precio a consultar';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadgeColor = (estado) => {
    const statusMap = {
      'disponible': { bg: 'bg-emerald-500', text: 'text-white', label: 'Disponible' },
      'activo': { bg: 'bg-emerald-500', text: 'text-white', label: 'Disponible' },
      'negociacion': { bg: 'bg-amber-500', text: 'text-white', label: 'En Negociación' },
      'pendiente': { bg: 'bg-amber-500', text: 'text-white', label: 'Pendiente' },
      'vendido': { bg: 'bg-rose-500', text: 'text-white', label: 'Vendido' }
    };
    return statusMap[estado?.toLowerCase()] || { bg: 'bg-slate-500', text: 'text-white', label: 'Información' };
  };

  // Skeleton Loader
  const SkeletonCard = () => (
    <motion.div
      className={`rounded-2xl overflow-hidden animate-pulse ${
        isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'
      }`}
    >
      <div className={`h-64 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
      <div className="p-6 space-y-3">
        <div className={`h-4 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'} w-3/4`} />
        <div className={`h-6 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'} w-1/2`} />
        <div className={`h-3 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'} w-4/5`} />
      </div>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      {/* HERO SECTION CON IMAGEN DE FONDO */}
      <section
        className="relative min-h-[450px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay adaptado al tema */}
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--overlay-hero)',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Contenido Hero */}
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-[#b38b1d] font-bold mb-4">
            Catálogo Premium
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 tracking-tight">
            Propiedades <em className="not-italic text-[#f9d85b] font-light">Exclusivas</em>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#b38b1d] to-transparent mx-auto mb-6" />
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light">
            Descubre las residencias más lujosas en los sectores más prestigiosos. Cada propiedad ha sido seleccionada cuidadosamente.
          </p>
        </motion.div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* FILTROS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12 p-8 rounded-2xl border border-[#d4af37]/20 bg-[#000000] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          >
            <h2 className="text-xl font-bold mb-6 text-white">
              Refina tu búsqueda
            </h2>

            {/* Filtro por Tipo */}
            <div className="mb-6">
              <p className="text-xs font-bold mb-3 uppercase tracking-[2px] text-[#d4af37]">
                Tipo de Propiedad
              </p>
              <div className="flex flex-wrap gap-3">
                {PROPERTY_TYPES.map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedType(type)}
                    className={`px-5 py-2.5 rounded-lg font-bold transition-all text-xs uppercase tracking-wider ${
                      selectedType === type
                        ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30'
                        : 'bg-[#111111] text-white border border-[#2b2b2b] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Filtro por Precio y Habitaciones */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold mb-3 uppercase tracking-[2px] block text-[#d4af37]">
                  Rango de Precio
                </label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#2b2b2b] bg-[#111111] text-white focus:border-[#d4af37] focus:outline-none font-semibold"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold mb-3 uppercase tracking-[2px] block text-[#d4af37]">
                  Habitaciones
                </label>
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#2b2b2b] bg-[#111111] text-white focus:border-[#d4af37] focus:outline-none font-semibold"
                >
                  {BEDROOM_RANGES.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* GRID DE PROPIEDADES */}
          {loading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-24"
            >
              <div className={`text-6xl mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>
                🔍
              </div>
              <p className={`text-2xl font-light ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                No encontramos propiedades con esos filtros.
              </p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Intenta ajustar tu búsqueda
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProperties.map((prop) => {
                const statusColor = getStatusBadgeColor(prop.estado);
                const isAdminUser = user?.user?.is_staff === true;

                return (
                  <motion.div
                    key={prop.id}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className={`rounded-3xl overflow-hidden border transition-all duration-500 group cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#0a0a0a] border-white/5 hover:border-[#d4af37]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                        : 'bg-white border-slate-100 hover:border-[#d4af37]/50 hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)]'
                    }`}
                  >
                    {/* IMAGEN CON OVERLAY */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={prop.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
                        alt={prop.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                      {/* BADGES */}
                      <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] ${statusColor.bg} ${statusColor.text} shadow-lg backdrop-blur-md`}>
                          {statusColor.label}
                        </span>
                        <span className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] shadow-lg">
                          {prop.tipo?.toUpperCase() || 'INMUEBLE'}
                        </span>
                      </div>

                      {/* BOTÓN EDITAR PARA ADMINS */}
                      {isAdminUser && (
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: '#f9d85b' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/properties/${prop.id}/edit`);
                          }}
                          className="absolute top-6 right-6 bg-[#d4af37] text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-[2px] shadow-2xl transition-all"
                        >
                          Editar
                        </motion.button>
                      )}

                      {/* PRECIO OVERLAY (SOLO SI QUEREMOS QUE SE VEA EN LA IMAGEN) */}
                      <div className="absolute bottom-6 left-6">
                         <p className="text-3xl font-black text-[#d4af37] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                           {formatPrice(prop.precio)}
                         </p>
                      </div>
                    </div>

                    {/* CONTENIDO */}
                    <div className="p-8">
                      {/* TÍTULO Y UBICACIÓN */}
                      <h3 className={`text-2xl font-serif font-black mb-3 line-clamp-1 transition-colors group-hover:text-[#d4af37] ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {prop.titulo}
                      </h3>

                      <div className={`flex items-center gap-2 mb-6 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <HiOutlineLocationMarker className="text-[#d4af37] text-xl flex-shrink-0" />
                        <span className="line-clamp-1 italic">
                          {prop.ciudad}
                          {prop.direccion && ` • ${prop.direccion}`}
                        </span>
                      </div>

                      {/* SPECS: Habitaciones, Baños, Área */}
                      <div className={`grid grid-cols-3 gap-4 py-6 border-y mb-8 ${
                        isDarkMode ? 'border-white/10' : 'border-slate-100'
                      }`}>
                        <div className="flex flex-col items-center gap-1">
                          <BiBed className={`text-2xl mb-1 ${isDarkMode ? 'text-[#d4af37]' : 'text-[#b38b1d]'}`} />
                          <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {prop.habitaciones || 0}
                          </span>
                          <span className={`text-[9px] uppercase font-black tracking-[2px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Hab.
                          </span>
                        </div>

                        <div className={`flex flex-col items-center gap-1 border-x ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
                          <BiBath className={`text-2xl mb-1 ${isDarkMode ? 'text-[#d4af37]' : 'text-[#b38b1d]'}`} />
                          <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {prop.banos || 0}
                          </span>
                          <span className={`text-[9px] uppercase font-black tracking-[2px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Baños
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <BiArea className={`text-2xl mb-1 ${isDarkMode ? 'text-[#d4af37]' : 'text-[#b38b1d]'}`} />
                          <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {prop.area || 0}
                          </span>
                          <span className={`text-[9px] uppercase font-black tracking-[2px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            m²
                          </span>
                        </div>
                      </div>

                      {/* BOTONES ACCIÓN */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02, letterSpacing: '2px' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/properties/${prop.id}`)}
                          className={`flex-grow py-4 rounded-2xl font-black uppercase tracking-[1px] text-[10px] transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-[#d4af37] text-black hover:bg-[#f9d85b] shadow-[0_10px_30px_rgba(212,175,55,0.3)]'
                              : 'bg-slate-950 text-white hover:bg-[#b38b1d] shadow-[0_10px_30px_rgba(0,0,0,0.2)]'
                          }`}
                        >
                          Explorar
                        </motion.button>
                        
                        {prop.whatsapp_contacto && (
                          <motion.a
                            href={`https://wa.me/${prop.whatsapp_contacto.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ESTADÍSTICAS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '0px 0px -100px 0px' }}
            className="mt-24 grid md:grid-cols-3 gap-8"
          >
            <div className={`p-8 rounded-2xl border text-center ${
              isDarkMode
                ? 'bg-[#090909] border-white/5'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-4xl font-black text-[#b38b1d] mb-2">
                {allProperties.length}
              </div>
              <p className={`text-sm uppercase tracking-wider font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Propiedades Activas
              </p>
            </div>

            <div className={`p-8 rounded-2xl border text-center ${
              isDarkMode
                ? 'bg-[#090909] border-white/5'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-4xl font-black text-emerald-500 mb-2">
                {Math.floor(Math.random() * 50) + 50}
              </div>
              <p className={`text-sm uppercase tracking-wider font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Clientes Satisfechos
              </p>
            </div>

            <div className={`p-8 rounded-2xl border text-center ${
              isDarkMode
                ? 'bg-[#090909] border-white/5'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-4xl font-black text-yellow-500 mb-2">
                15+
              </div>
              <p className={`text-sm uppercase tracking-wider font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Años de Experiencia
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

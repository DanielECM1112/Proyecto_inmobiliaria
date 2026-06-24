import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import PropertyCard from '../components/PropertyCard';

const PRICE_RANGES = [
  { label: 'Cualquiera',      min: 0,           max: Infinity },
  { label: 'Hasta $200M',     min: 0,           max: 200000000 },
  { label: '$200M – $500M',   min: 200000000,   max: 500000000 },
  { label: '$500M – $1.000M', min: 500000000,   max: 1000000000 },
  { label: 'Más de $1.000M',  min: 1000000000,  max: Infinity },
];

const TIPOS    = ['Todos', 'casa', 'apartamento', 'penthouse', 'local', 'finca', 'lote'];
const HAB_OPS  = ['Cualquiera', '1', '2', '3', '4'];
const BANO_OPS = ['Cualquiera', '1', '2', '3'];

const FILTERS_INIT = { tipo: 'Todos', precio: 'Cualquiera', habitaciones: 'Cualquiera', banos: 'Cualquiera', texto: '' };

function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden animate-pulse"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
    >
      <div className="w-full bg-gray-400/10" style={{ paddingBottom: '62.5%' }} />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 rounded bg-gray-400/10" />
        <div className="h-5 w-3/4 rounded bg-gray-400/10" />
        <div className="h-4 w-1/2 rounded bg-gray-400/10" />
        <div className="h-6 w-2/3 rounded bg-gray-400/10 mt-1" />
        <div className="h-10 w-full rounded bg-gray-400/10 mt-4" />
      </div>
    </div>
  );
}

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(FILTERS_INIT);

  useEffect(() => {
    api.get('/properties/')
      .then(r => setProperties(r.data || []))
      .catch(() => setError('No se pudo conectar con el servidor'))
      .finally(() => setLoading(false));
  }, []);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const limpiar = () => setFilters(FILTERS_INIT);

  const priceRange = PRICE_RANGES.find(r => r.label === filters.precio) || PRICE_RANGES[0];

  const filtradas = properties.filter(p => {
    if (filters.tipo !== 'Todos' && p.tipo !== filters.tipo) return false;
    const price = parseFloat(p.precio) || 0;
    if (price < priceRange.min || price > priceRange.max) return false;
    if (filters.habitaciones !== 'Cualquiera' && (p.habitaciones ?? 0) < parseInt(filters.habitaciones)) return false;
    if (filters.banos !== 'Cualquiera' && (p.banos ?? 0) < parseInt(filters.banos)) return false;
    if (filters.texto) {
      const txt = filters.texto.toLowerCase();
      if (!p.titulo?.toLowerCase().includes(txt) && !p.ubicacion?.toLowerCase().includes(txt)) return false;
    }
    return true;
  });

  const inputCls = `w-full border px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C9A84C] transition-colors`;

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-[350px] flex items-center justify-center py-20 px-6 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
              alt="Luxury Properties"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[5px] text-[#C9A84C] mb-4">
                NUESTRO PORTAFOLIO
              </p>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 text-white">
                Propiedades Exclusivas
              </h1>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto font-light">
                Encuentra tu hogar ideal entre nuestra selección de inmuebles de alto nivel.
              </p>
              <div className="w-24 h-[2px] bg-[#C9A84C] mx-auto" />
            </motion.div>
          </div>
        </section>

        <main className="flex-grow py-16 px-6">
          <div className="max-w-7xl mx-auto">

            {/* Filter bar */}
            <div
              className="mb-10 p-5 rounded-2xl border flex flex-wrap gap-3 items-end shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              {/* Búsqueda */}
              <div className="flex-1 min-w-[180px]">
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Título o ubicación..."
                  value={filters.texto}
                  onChange={e => setFilter('texto', e.target.value)}
                  className={inputCls}
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Tipo */}
              <div className="min-w-[130px]">
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Tipo
                </label>
                <select
                  value={filters.tipo}
                  onChange={e => setFilter('tipo', e.target.value)}
                  className={inputCls}
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                >
                  {TIPOS.map(t => (
                    <option key={t} value={t}>
                      {t === 'Todos' ? 'Todos los tipos' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio */}
              <div className="min-w-[175px]">
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Precio
                </label>
                <select
                  value={filters.precio}
                  onChange={e => setFilter('precio', e.target.value)}
                  className={inputCls}
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                >
                  {PRICE_RANGES.map(r => (
                    <option key={r.label} value={r.label}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Habitaciones */}
              <div className="min-w-[120px]">
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Hab.
                </label>
                <select
                  value={filters.habitaciones}
                  onChange={e => setFilter('habitaciones', e.target.value)}
                  className={inputCls}
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                >
                  {HAB_OPS.map(h => (
                    <option key={h} value={h}>{h === 'Cualquiera' ? 'Cualquiera' : `${h}+`}</option>
                  ))}
                </select>
              </div>

              {/* Baños */}
              <div className="min-w-[110px]">
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Baños
                </label>
                <select
                  value={filters.banos}
                  onChange={e => setFilter('banos', e.target.value)}
                  className={inputCls}
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                >
                  {BANO_OPS.map(b => (
                    <option key={b} value={b}>{b === 'Cualquiera' ? 'Cualquiera' : `${b}+`}</option>
                  ))}
                </select>
              </div>

              {/* Limpiar */}
              <button
                onClick={limpiar}
                className="px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all hover:border-[#C9A84C] hover:text-[#C9A84C]"
                style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
              >
                Limpiar
              </button>
            </div>

            {/* Contenido */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : error ? (
              <div
                className="text-center py-20 rounded-xl border"
                style={{ borderColor: 'var(--card-border)' }}
              >
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-[#C9A84C] font-bold hover:underline"
                >
                  Reintentar
                </button>
              </div>
            ) : filtradas.length === 0 ? (
              <div
                className="text-center py-24 rounded-xl border"
                style={{ borderColor: 'var(--card-border)' }}
              >
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {properties.length === 0
                    ? 'Aún no hay propiedades publicadas'
                    : 'No encontramos propiedades con esos criterios'}
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {properties.length > 0 && 'Prueba ajustando o limpiando los filtros'}
                </p>
                {properties.length > 0 && (
                  <button
                    onClick={limpiar}
                    className="px-6 py-3 rounded-lg border border-[#C9A84C] text-[#C9A84C] font-bold hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all text-sm"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filtradas.map((prop, i) => (
                  <motion.div
                    key={prop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
                  >
                    <PropertyCard prop={prop} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}

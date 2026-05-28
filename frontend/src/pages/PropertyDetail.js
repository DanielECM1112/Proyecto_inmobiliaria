import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/inmuebles/${id}/`);
        setProperty(response.data);
      } catch (fetchError) {
        console.error('Error fetching property detail:', fetchError);
        setError('No se encontró el inmueble o hubo un error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `$${parseFloat(value).toLocaleString()}`;
  };

  const renderType = (tipo) => {
    if (tipo === 'venta') return 'Venta';
    if (tipo === 'alquiler') return 'Alquiler';
    return 'Inmueble';
  };

  const imageUrl = property?.imagenes?.length > 0
    ? property.imagenes[0].url
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-grow">
        <section className="relative pt-28 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <button
              onClick={() => navigate('/properties')}
              className={`mb-8 inline-flex items-center rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition ${
                isDarkMode ? 'border-white/20 bg-white/5 text-white hover:bg-white/10' : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              Volver a Propiedades
            </button>

            {loading ? (
              <div className="rounded-[2.5rem] bg-white/80 p-16 shadow-xl shadow-slate-900/10 text-center">
                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Cargando detalle del inmueble...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-[2.5rem] bg-red-50 p-16 shadow-xl shadow-red-200 text-center">
                <p className="text-2xl font-semibold text-red-700">{error}</p>
              </div>
            ) : property ? (
              <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="rounded-[2.5rem] overflow-hidden shadow-2xl border transition-colors duration-500"
                >
                  <img
                    src={imageUrl}
                    alt={property.titulo}
                    className="h-[500px] w-full object-cover"
                  />
                  <div className={`p-10 ${isDarkMode ? 'bg-midnight-DEFAULT text-white' : 'bg-white text-dark-950'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <span className="inline-flex rounded-full bg-gold-600 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950">
                        {renderType(property.tipo)}
                      </span>
                      <span className="inline-flex rounded-full bg-slate-900/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">
                        {property.estado || 'Estado desconocido'}
                      </span>
                    </div>

                    <h1 className="text-5xl font-serif font-bold tracking-tight mb-6">
                      {property.titulo}
                    </h1>

                    <p className="flex items-center gap-3 text-lg font-light italic mb-8 text-dark-600">
                      <HiOutlineLocationMarker className="text-gold-600 text-2xl" />
                      {property.ciudad}, {property.direccion}
                    </p>

                    <div className={`rounded-3xl border p-8 mb-8 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-light-50 border-light-200'}`}>
                      <span className="block text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-2">Precio</span>
                      <p className="text-5xl font-bold text-gold-600">{formatPrice(property.precio)}</p>
                    </div>

                    <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-dark-700'}`}>
                      {property.descripcion || 'Descripción no disponible para este inmueble.'}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className={`rounded-[2.5rem] border p-10 shadow-2xl transition-colors duration-500 ${
                    isDarkMode ? 'bg-midnight-DEFAULT border-white/10 text-white' : 'bg-white border-light-200 text-dark-950'
                  }`}
                >
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">Características</h2>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="rounded-3xl bg-white/10 p-6 text-center">
                          <BiBed className="mx-auto mb-4 text-3xl text-gold-500" />
                          <p className="text-3xl font-bold">{property.habitaciones || '—'}</p>
                          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Habitaciones</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-6 text-center">
                          <BiBath className="mx-auto mb-4 text-3xl text-gold-500" />
                          <p className="text-3xl font-bold">{property.banos || '—'}</p>
                          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Baños</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-6 text-center">
                          <BiArea className="mx-auto mb-4 text-3xl text-gold-500" />
                          <p className="text-3xl font-bold">{property.area ? `${property.area} m²` : '—'}</p>
                          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Área</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
                      <a
                        href={`https://wa.me/${property.whatsapp_contacto}?text=Hola,%20estoy%20interesado%20en%20el%20inmueble%20${encodeURIComponent(property.titulo)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-3xl bg-green-600 px-6 py-4 text-white font-bold shadow-lg shadow-green-600/20"
                      >
                        <FaWhatsapp className="mr-3 text-xl" /> Contactar vía WhatsApp
                      </a>
                    </div>

                    {property.url_video_youtube && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Video</h3>
                        <a
                          href={property.url_video_youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-600 hover:underline"
                        >
                          Ver recorrido en YouTube
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="rounded-[2.5rem] bg-white/80 p-16 shadow-xl shadow-slate-900/10 text-center">
                <p className="text-2xl font-semibold text-slate-900">No hay información disponible para este inmueble.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

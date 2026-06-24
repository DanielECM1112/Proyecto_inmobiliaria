import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import { FaWhatsapp, FaChevronLeft, FaChevronRight, FaEnvelope } from 'react-icons/fa';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';
import './PropertyDetail.css';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}/`);
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

  // Manejo de flechas del teclado
  useEffect(() => {
    if (!property?.imagenes || property.imagenes.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNextImage();
      if (e.key === 'ArrowLeft') goToPreviousImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex, property]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') goToNextImage();
      if (e.key === 'ArrowLeft') goToPreviousImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, currentImageIndex]);

  const goToNextImage = () => {
    if (property?.imagenes?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % property.imagenes.length);
    }
  };

  const goToPreviousImage = () => {
    if (property?.imagenes?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + property.imagenes.length) % property.imagenes.length);
    }
  };

  const goToImageIndex = (index) => {
    setCurrentImageIndex(index);
  };

  const formatPrice = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `$${parseFloat(value).toLocaleString()}`;
  };

  const renderType = (tipo) => {
    if (tipo === 'venta') return 'Venta';
    if (tipo === 'alquiler') return 'Alquiler';
    return 'Inmueble';
  };

  const usuarioLogueado = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  })();

  const esDueno = property && usuarioLogueado && property.propietario &&
    (String(usuarioLogueado.id) === String(property.propietario) ||
     String(usuarioLogueado.id) === String(property.propietario?.id));

  // Obtener imagen actual del carrusel
  const currentImage = property?.imagenes?.[currentImageIndex];
  const imageUrl = currentImage?.imagen
    ? (currentImage.imagen.startsWith('http')
        ? currentImage.imagen
        : `http://localhost:8000${currentImage.imagen}`)
    : (property?.imagenes?.length > 0
        ? (property.imagenes[0].imagen?.startsWith('http')
            ? property.imagenes[0].imagen
            : `http://localhost:8000${property.imagenes[0].imagen}`)
        : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80');

  const totalImages = property?.imagenes?.length || 0;

  return (
    <PageWrapper>
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
                  {/* Carrusel de imágenes */}
                  <div className="relative w-full bg-black/5">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={imageUrl}
                        alt={`${property.titulo} - imagen ${currentImageIndex + 1}`}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => setLightboxOpen(true)}
                        className="h-[500px] w-full object-cover cursor-zoom-in"
                        title="Ver en pantalla completa"
                      />
                    </AnimatePresence>
                    {/* Indicador expand */}
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute bottom-4 left-4 z-10 bg-black/60 text-white px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-2 hover:bg-black/80 transition-colors"
                    >
                      ⤢ Ver HD
                    </button>

                    {/* Botones de navegación */}
                    {totalImages > 1 && (
                      <>
                        {/* Flecha izquierda */}
                        <button
                          onClick={goToPreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#0D0D0D] p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                          aria-label="Imagen anterior"
                        >
                          <FaChevronLeft size={20} />
                        </button>

                        {/* Flecha derecha */}
                        <button
                          onClick={goToNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#0D0D0D] p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                          aria-label="Siguiente imagen"
                        >
                          <FaChevronRight size={20} />
                        </button>

                        {/* Indicador de posición */}
                        <div className="absolute top-4 right-4 z-10 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md">
                          {currentImageIndex + 1} / {totalImages}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Miniaturas de imágenes */}
                  {totalImages > 1 && (
                    <div className="bg-white/5 backdrop-blur-sm p-4 flex gap-2 overflow-x-auto">
                      {property.imagenes.map((img, idx) => {
                        const thumbUrl = img.imagen?.startsWith('http')
                          ? img.imagen
                          : `http://localhost:8000${img.imagen}`;
                        return (
                          <button
                            key={idx}
                            onClick={() => goToImageIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                              currentImageIndex === idx
                                ? 'border-[#C9A84C] shadow-lg'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={thumbUrl}
                              alt={`Miniatura ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}

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
                      {property.ubicacion || 'Ubicación no disponible'}
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
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center text-center p-4">
                          <BiBed className="mb-2 text-3xl text-[#C9A84C]" />
                          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{property.habitaciones || '—'}</p>
                          <p className="text-[9px] uppercase tracking-[1px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>HAB.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4">
                          <BiBath className="mb-2 text-3xl text-[#C9A84C]" />
                          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{property.banos || '—'}</p>
                          <p className="text-[9px] uppercase tracking-[1px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>BAÑOS</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4">
                          <BiArea className="mb-2 text-3xl text-[#C9A84C]" />
                          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{property.area ? `${property.area} m²` : '—'}</p>
                          <p className="text-[9px] uppercase tracking-[1px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>ÁREA</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-6">Contacto del propietario</h2>
                      {property.contacto_nombre && (
                        <p className={`text-base font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {property.contacto_nombre}
                        </p>
                      )}
                      <div className="space-y-3">
                        {property.contacto_telefono ? (
                          <>
                            <a
                              href={`https://wa.me/57${property.contacto_telefono.replace(/\D/g, '')}?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(property.titulo)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full items-center justify-center rounded-3xl bg-green-600 px-6 py-4 text-white font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors"
                            >
                              <FaWhatsapp className="mr-3 text-xl" /> WhatsApp: {property.contacto_telefono}
                            </a>
                            <a
                              href={`tel:${property.contacto_telefono}`}
                              className={`inline-flex w-full items-center justify-center rounded-3xl px-6 py-4 font-bold border transition-colors ${
                                isDarkMode
                                  ? 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                                  : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              Llamar: {property.contacto_telefono}
                            </a>
                          </>
                        ) : (
                          <a
                            href={`https://wa.me/573223147352?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(property.titulo)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-3xl bg-green-600 px-6 py-4 text-white font-bold shadow-lg shadow-green-600/20"
                          >
                            <FaWhatsapp className="mr-3 text-xl" /> Contactar vía WhatsApp
                          </a>
                        )}
                        {(() => {
                          const emailFinal = property.email_contacto_final || property.contacto_email;
                          return emailFinal ? (
                            <a
                              href={`mailto:${emailFinal}?subject=Interesado en: ${encodeURIComponent(property.titulo)} - LuxHabitat&body=${encodeURIComponent(`Hola ${property.contacto_nombre || ''}, vi tu propiedad "${property.titulo}" en LuxHabitat y me gustaría más información.\n\nSaludos.`)}`}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-4 font-bold text-[#C9A84C] border border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 transition-colors"
                            >
                              ✉ Enviar correo
                            </a>
                          ) : null;
                        })()}
                      </div>
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

                    {esDueno && (
                      <div
                        className="rounded-2xl p-6 mt-2"
                        style={{
                          border: '1px solid rgba(201,168,76,0.35)',
                          background: 'rgba(201,168,76,0.06)',
                        }}
                      >
                        <p className="text-xs font-bold uppercase tracking-[2px] text-[#C9A84C] mb-1">
                          ¿Eres el propietario?
                        </p>
                        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                          Si necesitas corregir o actualizar la información de esta propiedad, contacta al administrador — él gestiona los cambios.
                        </p>
                        <div className="flex flex-col gap-2">
                          <a
                            href={`mailto:manuelestiven2006@gmail.com?subject=${encodeURIComponent(`Solicitud de cambio - Propiedad #${property.id}: ${property.titulo}`)}&body=${encodeURIComponent(`Hola admin,\n\nSoy ${usuarioLogueado.nombre} y quiero solicitar un cambio en mi propiedad "${property.titulo}" (ID: ${property.id}).\n\nDetalle del cambio:\n\nGracias.`)}`}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-[1.5px] text-[#C9A84C] border border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 transition-colors"
                          >
                            <FaEnvelope /> Escribir al admin
                          </a>
                          <a
                            href={`https://wa.me/573223147352?text=${encodeURIComponent(`Hola admin, quiero solicitar un cambio en mi propiedad "${property.titulo}" (ID ${property.id})`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-[1.5px] bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            <FaWhatsapp /> WhatsApp al admin
                          </a>
                        </div>
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

      {/* LIGHTBOX HD */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(6px)' }}
          >
            {/* Imagen HD */}
            <motion.img
              key={currentImageIndex}
              src={imageUrl}
              alt={`${property?.titulo} - HD ${currentImageIndex + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            />

            {/* Cerrar */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-6 text-white/80 hover:text-white text-4xl font-light leading-none transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Contador */}
            <div className="absolute top-5 left-6 bg-black/50 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
              {currentImageIndex + 1} / {totalImages}
            </div>

            {/* Flechas */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-4 rounded-full transition-colors text-xl"
                  aria-label="Anterior"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-4 rounded-full transition-colors text-xl"
                  aria-label="Siguiente"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Miniaturas en lightbox */}
            {totalImages > 1 && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-2xl"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
              >
                {property.imagenes.map((img, idx) => {
                  const u = img.imagen?.startsWith('http') ? img.imagen : `http://localhost:8000${img.imagen}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => goToImageIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        currentImageIndex === idx ? 'border-[#C9A84C]' : 'border-transparent opacity-50 hover:opacity-90'
                      }`}
                    >
                      <img src={u} alt="" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </PageWrapper>
  );
}

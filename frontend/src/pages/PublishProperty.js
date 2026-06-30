import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';
import { FaTrash, FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle, FaCrown, FaPlus, FaCreditCard } from 'react-icons/fa';
import { getUserPlanStatus } from '../admin/adminService';

export default function PublishProperty() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { isDarkMode } = useTheme();
  
  const queryParams = new URLSearchParams(search);
  const planNombre = queryParams.get('planNombre') || 'Plan Gratuito';
  const maxFotos = parseInt(queryParams.get('maxFotos')) || 3;
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'casa',
    precio: '',
    area: '',
    habitaciones: '1',
    banos: '1',
    ubicacion: '',
    descripcion: '',
    estado: 'disponible',
    estrato: '',
    garaje: false,
    piscina: false,
    amoblado: false,
    contacto_nombre: '',
    contacto_telefono: '',
    contacto_email: '',
  });

  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [planStatus, setPlanStatus] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  // Cargar datos básicos al inicio
  useEffect(() => {
    const loadData = async () => {
      // Primero verificar token
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/publish');
        return;
      }
      
      // Cargar estado del plan
      try {
        const status = await getUserPlanStatus();
        setPlanStatus(status);
        // Mostrar mensaje si no puede publicar más
        if (status.propiedades_disponibles <= 0 && !status.es_admin) {
          setShowLimitMessage(true);
        }
      } catch (error) {
        console.error('Error al cargar estado del plan:', error);
      } finally {
        setPlanLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const procesarArchivos = (files) => {
    const storedUserStr = localStorage.getItem('user');
    let isAdmin = false;
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        isAdmin = storedUser.is_staff === true || storedUser.rol === 'admin';
      } catch {}
    }
    
    const limiteReal = isAdmin ? 999 : maxFotos;
    const availableSlots = limiteReal - imagenes.length;

    if (files.length > availableSlots) {
      setGeneralError(`Solo puedes subir hasta ${limiteReal} fotos en este plan.`);
      return;
    }

    const newFiles = files.slice(0, availableSlots);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setImagenes(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setGeneralError('');
  };

  const handleImageChange = (e) => {
    procesarArchivos(Array.from(e.target.files));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.precio || formData.precio <= 0) newErrors.precio = 'Precio válido requerido';
    if (!formData.area || formData.area <= 0) newErrors.area = 'Área válida requerida';
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es requerida';

    const storedUserStr = localStorage.getItem('user');
    let isAdmin = false;
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        isAdmin = storedUser.is_staff === true || storedUser.rol === 'admin';
      } catch {}
    }
    
    const limiteReal = isAdmin ? 999 : maxFotos;

    if (imagenes.length === 0) newErrors.imagenes = 'Debes subir al menos una imagen';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError('');

    const data = new FormData();
    
    data.append('titulo', formData.titulo);
    data.append('tipo', formData.tipo);
    data.append('ubicacion', formData.ubicacion);
    data.append('estado', formData.estado);
    data.append('plan_nombre', planNombre);
    
    data.append('precio', parseFloat(formData.precio) || 0);
    data.append('area', parseFloat(formData.area) || 0);
    data.append('habitaciones', parseInt(formData.habitaciones) || 1);
    data.append('banos', parseInt(formData.banos) || 1);
    
    if (formData.descripcion.trim()) data.append('descripcion', formData.descripcion);
    if (formData.estrato) data.append('estrato', parseInt(formData.estrato) || null);
    if (formData.contacto_nombre.trim()) data.append('contacto_nombre', formData.contacto_nombre);
    if (formData.contacto_telefono.trim()) data.append('contacto_telefono', formData.contacto_telefono);
    if (formData.contacto_email.trim()) data.append('contacto_email', formData.contacto_email);
    
    data.append('garaje', formData.garaje ? 'true' : 'false');
    data.append('piscina', formData.piscina ? 'true' : 'false');
    data.append('amoblado', formData.amoblado ? 'true' : 'false');
    
    imagenes.forEach(img => {
      data.append('imagenes', img);
    });

    try {
      const token = localStorage.getItem('token');
      await api.post('/properties/create/', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess(true);
      setTimeout(() => navigate('/properties'), 2000);
    } catch (err) {
      console.error('Error al publicar:', err);
      if (err.response?.status === 401) {
        navigate('/login?redirect=/publish');
      } else {
        const errorMsg = err.response?.data?.detail 
          || (typeof err.response?.data === 'object' 
            ? JSON.stringify(err.response.data) 
            : 'Error al publicar la propiedad. Intenta de nuevo.');
        setGeneralError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        
        <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-md">
              {planNombre === 'Premium' && <FaCrown className="text-yellow-200" />}
              {planNombre}
              {planNombre === 'Premium' && <FaCrown className="text-yellow-200" />}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
              Publicar Propiedad
            </h1>
            {planNombre === 'Premium' && (
              <p className="mt-2 text-[#C9A84C] text-sm font-semibold">
                ¡Disfruta de todos los beneficios Premium! 🎉
              </p>
            )}
            {planNombre === 'Estándar' && (
              <p className="mt-2 text-[#C9A84C] text-sm font-semibold">
                ¡Disfruta de los beneficios del plan Estándar! 📸
              </p>
            )}
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500 text-green-500 p-8 rounded-3xl text-center shadow-xl"
            >
              <FaCheckCircle className="text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Propiedad publicada exitosamente! 🎉</h2>
              <p>Redirigiendo al catálogo de propiedades...</p>
            </motion.div>
          ) : showLimitMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl border border-red-500/30 bg-red-500/10 text-center"
            >
              <FaExclamationTriangle size={56} className="mx-auto mb-6" style={{ color: "#f87171" }} />
              <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: "#f87171" }}>
                ¡Has alcanzado el límite de propiedades!
              </h2>
              <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
                Ya has usado todas las propiedades disponibles de tu plan. Para seguir publicando, actualiza tu plan a uno con más capacidad.
              </p>
              <button
                onClick={() => navigate("/planes")}
                className="px-10 py-4 text-[12px] font-bold uppercase tracking-[3px] transition-all hover:opacity-90"
                style={{ background: "#C9A84C", color: "#0D0D0D" }}
              >
                Ver Planes
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {generalError && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl flex items-center gap-3">
                  <FaExclamationTriangle />
                  {generalError}
                </div>
              )}

              <div className="bg-[var(--card-bg)] border border-[rgba(201,168,76,0.1)] rounded-[2rem] p-8 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Título */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Título de la propiedad *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ej: Hermoso Apartamento en el Vergel"
                      className={`w-full px-5 py-4 bg-white/5 border ${errors.titulo ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all`}
                      style={{ color: 'var(--text-primary)' }}
                    />
                    {errors.titulo && <p className="text-red-500 text-xs">{errors.titulo}</p>}
                  </div>

                  {/* Tipo */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Tipo de inmueble *
                    </label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white/5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <option value="casa">Casa</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="local">Local Comercial</option>
                      <option value="finca">Finca</option>
                      <option value="lote">Lote</option>
                    </select>
                  </div>

                  {/* Precio */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Precio en COP *
                    </label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      placeholder="250000000"
                      className={`w-full px-5 py-4 bg-white/5 border ${errors.precio ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all`}
                      style={{ color: 'var(--text-primary)' }}
                    />
                    {errors.precio && <p className="text-red-500 text-xs">{errors.precio}</p>}
                  </div>

                  {/* Área */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Área en m² *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="120"
                      className={`w-full px-5 py-4 bg-white/5 border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all`}
                      style={{ color: 'var(--text-primary)' }}
                    />
                    {errors.area && <p className="text-red-500 text-xs">{errors.area}</p>}
                  </div>

                  {/* Habitaciones */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Habitaciones *
                    </label>
                    <select
                      name="habitaciones"
                      value={formData.habitaciones}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white/5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </select>
                  </div>

                  {/* Baños */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Baños *
                    </label>
                    <select
                      name="banos"
                      value={formData.banos}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white/5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ubicación */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Barrio / Ubicación *
                    </label>
                    <input
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                      placeholder="El Vergel, Armenia"
                      className={`w-full px-5 py-4 bg-white/5 border ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all`}
                      style={{ color: 'var(--text-primary)' }}
                    />
                    {errors.ubicacion && <p className="text-red-500 text-xs">{errors.ubicacion}</p>}
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Estado *
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white/5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <option value="disponible">Disponible</option>
                      <option value="negociacion">En Negociación</option>
                      <option value="vendido">Vendido</option>
                    </select>
                  </div>

                  {/* Estrato (Opcional) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      Estrato
                    </label>
                    <select
                      name="estrato"
                      value={formData.estrato}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white/5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C9A84C] transition-all"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <option value="">Seleccionar...</option>
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4 md:col-span-2 pt-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="garaje" 
                        checked={formData.garaje} 
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                      />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>¿Incluye garaje?</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="piscina" 
                        checked={formData.piscina} 
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                      />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>¿Incluye piscina?</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="amoblado" 
                        checked={formData.amoblado} 
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                      />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>¿Es amoblado?</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Imágenes */}
              <div className="bg-[var(--card-bg)] border border-[rgba(201,168,76,0.1)] rounded-[2rem] p-8 shadow-2xl space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                    Imágenes de la propiedad *
                  </label>
                  <span className="text-xs font-bold text-[#C9A84C]">
                    {imagenes.length} de {maxFotos} fotos seleccionadas
                  </span>
                </div>

                <div
                  className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                    errors.imagenes ? 'border-red-500 bg-white/5' :
                    isDragging ? 'border-[#C9A84C] bg-[#C9A84C]/5' :
                    'border-gray-300 hover:border-[#C9A84C] bg-white/5'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                    procesarArchivos(files);
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={(() => {
                      const storedUserStr = localStorage.getItem('user');
                      let isAdmin = false;
                      if (storedUserStr) {
                        try {
                          const storedUser = JSON.parse(storedUserStr);
                          isAdmin = storedUser.is_staff === true || storedUser.rol === 'admin';
                        } catch {}
                      }
                      return !isAdmin && imagenes.length >= maxFotos;
                    })()}
                  />
                  <label htmlFor="image-upload" className={`cursor-pointer flex flex-col items-center gap-4 ${(() => {
                      const storedUserStr = localStorage.getItem('user');
                      let isAdmin = false;
                      if (storedUserStr) {
                        try {
                          const storedUser = JSON.parse(storedUserStr);
                          isAdmin = storedUser.is_staff === true || storedUser.rol === 'admin';
                        } catch {}
                      }
                      return !isAdmin && imagenes.length >= maxFotos;
                    })() ? 'opacity-50' : ''}`}>
                    <FaCloudUploadAlt className={`text-5xl ${isDragging ? 'text-[#C9A84C]' : 'text-gray-400'}`} />
                    <div className="space-y-1">
                      <p className="font-bold" style={{ color: isDragging ? '#C9A84C' : 'var(--text-primary)' }}>
                        {isDragging ? 'Suelta las fotos aquí' : 'Haz clic o arrastra fotos aquí'}
                      </p>
                      <p className="text-xs text-gray-500">Formatos: JPG, PNG, WEBP. Máx 5MB por foto.</p>
                    </div>
                  </label>
                </div>
                {errors.imagenes && <p className="text-red-500 text-xs">{errors.imagenes}</p>}

                {/* Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {previews.map((url, index) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square rounded-2xl overflow-hidden group"
                      >
                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash size={12} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-[#C9A84C]/80 text-white text-[10px] font-bold text-center py-1">
                            PRINCIPAL
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-[#C9A84C] text-white font-bold uppercase tracking-widest shadow-xl shadow-[#C9A84C]/20 hover:bg-[#b38b1d] transition-all disabled:opacity-50"
              >
                {loading ? "Publicando..." : "Publicar Propiedad"}
              </motion.button>
            </form>
          )}
        </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}

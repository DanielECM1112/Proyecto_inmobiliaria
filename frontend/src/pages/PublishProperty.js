import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function PublishProperty() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Para modo edición
  const isEditMode = !!id;

  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]); // Array de objetos { file, preview, id }
  const [existingProperty, setExistingProperty] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '', // Valor formateado para mostrar
    precioLimpio: 0, // Valor numérico para enviar
    ciudad: '',
    direccion: '',
    tipo: 'casa',
    habitaciones: '1',
    banos: '1',
    area: '',
    estado: 'disponible',
    whatsapp_contacto: '',
    amenidades: '',
    detalles_extra: '',
    observaciones: ''
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  // Formateador de precio
  const formatPrice = (value) => {
    if (!value) return '';
    const number = String(value).replace(/\D/g, '');
    return new Intl.NumberFormat('es-CO').format(number);
  };

  const cleanPrice = (value) => {
    if (!value) return 0;
    return parseInt(String(value).replace(/\D/g, ''), 10);
  };

  useEffect(() => {
    // Scroll al primer error cuando cambian los fieldErrors
    if (Object.keys(fieldErrors).length > 0) {
      const firstErrorKey = Object.keys(fieldErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [fieldErrors]);

  useEffect(() => {
    // Verificar autenticación
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    const fetchPlans = async () => {
      try {
        const res = await api.get('/planes/');
        setPlans(res.data || []);
      } catch (err) {
        console.error('Error fetching plans', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();

    // Si es modo edición, cargar la propiedad
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await api.get(`/inmuebles/${id}/`);
          const prop = res.data;
          setExistingProperty(prop);
          
          // Pre-llenar el formulario
          setFormData({
            titulo: prop.titulo || '',
            descripcion: prop.descripcion || '',
            precio: formatPrice(String(prop.precio || '')),
            precioLimpio: prop.precio || 0,
            ciudad: prop.ciudad || '',
            direccion: prop.direccion || '',
            tipo: prop.tipo || 'casa',
            habitaciones: String(prop.habitaciones || '0'),
            banos: String(prop.banos || '0'),
            area: String(prop.area || '0'),
            estado: prop.estado || 'disponible',
            whatsapp_contacto: prop.whatsapp_contacto || '',
            amenidades: prop.amenidades || '',
            detalles_extra: prop.detalles_extra || '',
            observaciones: prop.observaciones || ''
          });

          // Cargar imágenes existentes
          if (prop.imagenes && Array.isArray(prop.imagenes)) {
            const imgs = prop.imagenes.map((img) => ({
              id: img.id,
              name: 'imagen_existente',
              preview: img.url,
              isExisting: true
            }));
            setUploadedImages(imgs);
          }
        } catch (err) {
          console.error('Error fetching property:', err);
          setSubmitError('No se pudo cargar la propiedad para editar.');
        }
      };
      fetchProperty();
    }
  }, [isEditMode, id]);

  // Sincronizar plan después de cargar planes o location.state
  useEffect(() => {
    if (plans.length > 0) {
      if (existingProperty && existingProperty.plan) {
        const planId = existingProperty.plan.id || existingProperty.plan;
        const plan = plans.find(p => p.id === planId);
        if (plan) setSelectedPlan(plan);
      } else if (location.state?.selectedPlan) {
        setSelectedPlan(location.state.selectedPlan);
      } else if (location.state?.planId) {
        const plan = plans.find(p => String(p.id) === String(location.state.planId));
        if (plan) setSelectedPlan(plan);
      } else {
        const storedPlan = localStorage.getItem('selectedPlan');
        if (storedPlan) {
          try {
            setSelectedPlan(JSON.parse(storedPlan));
          } catch (ignore) {}
        }
      }
    }
  }, [plans, existingProperty, location.state]);

  const getMaxImages = () => {
    return selectedPlan?.max_photos || 5;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[name];
      setFieldErrors(newErrors);
    }

    if (name === 'precio') {
      const cleaned = cleanPrice(value);
      setFormData({ 
        ...formData, 
        precio: formatPrice(value),
        precioLimpio: cleaned
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddImages(files);
  };

  const validateAndAddImages = (files) => {
    const maxImages = getMaxImages();
    const maxWeight = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    let newErrors = [];
    let validFiles = [];

    if (uploadedImages.length + files.length > maxImages) {
      setSubmitError(`Límite superado. Tu plan permite máximo ${maxImages} fotos.`);
      return;
    }

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        newErrors.push(`${file.name}: Formato no permitido (solo JPG, PNG, WEBP)`);
      } else if (file.size > maxWeight) {
        newErrors.push(`${file.name}: Pesa demasiado (máx 5MB)`);
      } else {
        validFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file: file,
          preview: URL.createObjectURL(file),
          isExisting: false
        });
      }
    });

    if (newErrors.length > 0) {
      setSubmitError(newErrors.join(' | '));
    } else {
      setSubmitError('');
      // Limpiar error de imágenes si había uno
      if (fieldErrors.imagenes) {
        const newFieldErrors = { ...fieldErrors };
        delete newFieldErrors.imagenes;
        setFieldErrors(newFieldErrors);
      }
    }

    setUploadedImages(prev => [...prev, ...validFiles]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    validateAndAddImages(files);
  };

  const removeImage = async (imgId) => {
    const img = uploadedImages.find(i => i.id === imgId);
    
    if (img.isExisting && isEditMode) {
      try {
        await api.delete(`/inmuebles/${id}/imagenes/${imgId}/`);
      } catch (err) {
        console.error("Error al eliminar imagen del servidor", err);
      }
    }
    
    setUploadedImages(uploadedImages.filter((img) => img.id !== imgId));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.titulo.trim()) errors.titulo = 'Debes ingresar un título para la propiedad.';
    if (!formData.descripcion.trim()) errors.descripcion = 'La descripción es obligatoria.';
    if (!formData.precioLimpio || formData.precioLimpio <= 0) errors.precio = 'El precio debe ser un valor mayor a cero.';
    if (!formData.ciudad.trim()) errors.ciudad = 'Debes indicar la ciudad.';
    if (!formData.direccion.trim()) errors.direccion = 'La dirección o barrio es obligatoria.';
    if (!formData.whatsapp_contacto.trim()) {
        errors.whatsapp_contacto = 'El número de WhatsApp es obligatorio.';
    } else {
        const cleanWhatsapp = formData.whatsapp_contacto.replace(/\D/g, '');
        if (cleanWhatsapp.length < 10) {
            errors.whatsapp_contacto = 'El número de WhatsApp debe tener al menos 10 dígitos.';
        }
    }
    
    if (uploadedImages.length === 0) {
        errors.imagenes = 'Debes subir al menos una imagen de la propiedad.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setFieldErrors({});

    if (!user) {
      navigate('/login', { state: { redirect: '/publish' } });
      return;
    }

    if (!selectedPlan) {
      setSubmitError('Por favor selecciona un plan antes de publicar.');
      return;
    }

    if (!validateForm()) {
      setSubmitError('Faltan campos obligatorios por completar.');
      return;
    }

    setSubmitLoading(true);

    // Crear FormData para envío unificado (multipart/form-data)
    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('descripcion', formData.descripcion);
    data.append('precio', formData.precioLimpio);
    data.append('ciudad', formData.ciudad);
    data.append('direccion', formData.direccion);
    data.append('tipo', formData.tipo);
    data.append('habitaciones', formData.habitaciones || 0);
    data.append('banos', formData.banos || 0);
    data.append('area', formData.area || 0);
    data.append('estado', formData.estado);
    data.append('whatsapp_contacto', formData.whatsapp_contacto.replace(/\D/g, ''));
    data.append('amenidades', formData.amenidades || '');
    data.append('detalles_extra', formData.detalles_extra || '');
    data.append('observaciones', formData.observaciones || '');
    data.append('plan_id', selectedPlan.id);

    // Agregar imágenes nuevas
    const newImages = uploadedImages.filter(img => !img.isExisting);
    newImages.forEach(img => {
      data.append('imagenes', img.file);
    });

    console.log("DATOS ENVIADOS (FormData):");
    for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
    }

    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/properties/${id}/edit/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/properties/', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        });
      }
      
      console.log("RESPUESTA EXITOSA:", response.data);

      setSubmitSuccess(isEditMode ? '¡Propiedad actualizada exitosamente!' : '¡Propiedad publicada exitosamente!');
      
      setTimeout(() => {
        localStorage.removeItem('selectedPlan');
        navigate('/properties');
      }, 2000);

    } catch (err) {
      console.error("ERROR CRÍTICO AL PUBLICAR:", err);
      if (err.response) {
        console.log("DATOS DE ERROR DEL BACKEND:", err.response.data);
        const serverErrors = err.response.data;
        if (typeof serverErrors === 'object') {
          setFieldErrors(serverErrors);
          setSubmitError(serverErrors.error || 'Error de validación. Revisa los campos marcados.');
        } else {
          setSubmitError(String(serverErrors));
        }
      } else {
        setSubmitError('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
    } finally {
      setSubmitLoading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050505]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#b38b1d]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.4em] text-[var(--accent-gold)] font-semibold">
              {isEditMode ? 'Editar Propiedad' : 'Publicar Propiedad'}
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-serif font-black tracking-tight text-[var(--text-primary)]">
              {isEditMode ? 'Actualiza tu Inmueble' : 'Comparte tu Inmueble'}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
              {isEditMode ? 'Modifica los detalles de tu propiedad.' : 'Completa el formulario y publica tu propiedad en LUXHABITAT.'}
            </p>
          </div>

          {/* Plan Selection */}
          {!selectedPlan ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-8 rounded-[24px] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-lg)]"
            >
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6">1. Elige tu Plan</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <motion.button
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPlan(plan)}
                    disabled={isEditMode}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      isEditMode ? 'opacity-50 cursor-not-allowed' : ''
                    } border-[var(--accent-gold)]/20 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]`}
                  >
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{plan.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      Máx. {plan.max_photos || 5} imágenes
                    </p>
                    <p className="text-2xl font-black text-[var(--accent-gold)]">
                      ${parseFloat(plan.price).toLocaleString('es-CO')}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 rounded-xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30"
            >
              <p className="text-sm text-[var(--accent-gold)]">
                ✓ Plan seleccionado: <span className="font-bold">{selectedPlan.name}</span>
                {!isEditMode && (
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="ml-4 text-xs underline hover:opacity-70"
                  >
                    Cambiar
                  </button>
                )}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[24px] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-xl)]"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="p-4 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm">
                  {submitSuccess}
                </div>
              )}

              {/* Título */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Apartamento moderno en Chapinero"
                  className={`w-full px-5 py-4 bg-[var(--bg-secondary)] border ${fieldErrors.titulo ? 'border-red-500' : 'border-[var(--border-primary)]'} rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all`}
                  required
                />
                {fieldErrors.titulo && <p className="text-red-500 text-xs font-bold mt-1">{Array.isArray(fieldErrors.titulo) ? fieldErrors.titulo[0] : fieldErrors.titulo}</p>}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe las características principales de tu propiedad..."
                  rows="5"
                  className={`w-full px-5 py-4 bg-[var(--bg-secondary)] border ${fieldErrors.descripcion ? 'border-red-500' : 'border-[var(--border-primary)]'} rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all`}
                  required
                />
                {fieldErrors.descripcion && <p className="text-red-500 text-xs font-bold mt-1">{Array.isArray(fieldErrors.descripcion) ? fieldErrors.descripcion[0] : fieldErrors.descripcion}</p>}
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Precio (COP) *</label>
                <input
                  type="text"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Ej: 150.000.000"
                  className={`w-full px-5 py-4 bg-[var(--bg-secondary)] border ${fieldErrors.precio ? 'border-red-500' : 'border-[var(--border-primary)]'} rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all font-mono`}
                  required
                />
                {fieldErrors.precio && <p className="text-red-500 text-xs font-bold mt-1">{Array.isArray(fieldErrors.precio) ? fieldErrors.precio[0] : fieldErrors.precio}</p>}
              </div>

              {/* Tipo, Habitaciones, Baños */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Tipo *</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                  >
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="local">Local</option>
                    <option value="lote">Lote</option>
                    <option value="finca">Finca</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Habitaciones (Opcional)</label>
                  <select
                    name="habitaciones"
                    value={formData.habitaciones}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                  >
                    <option value="0">0 (N/A)</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Baños (Opcional)</label>
                  <select
                    name="banos"
                    value={formData.banos}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                  >
                    <option value="0">0 (N/A)</option>
                    {[...Array(6)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Área (m²) (Opcional)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Ej: 150"
                    className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                  />
                </div>
              </div>

              {/* Ciudad y Dirección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Ciudad *</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Bogotá"
                    className={`w-full px-5 py-4 bg-[var(--bg-secondary)] border ${fieldErrors.ciudad ? 'border-red-500' : 'border-[var(--border-primary)]'} rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all`}
                    required
                  />
                  {fieldErrors.ciudad && <p className="text-red-500 text-xs font-bold mt-1">{Array.isArray(fieldErrors.ciudad) ? fieldErrors.ciudad[0] : fieldErrors.ciudad}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Dirección / Barrio *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Chapinero, Cra 7 #45-20"
                    className={`w-full px-5 py-4 bg-[var(--bg-secondary)] border ${fieldErrors.direccion ? 'border-red-500' : 'border-[var(--border-primary)]'} rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all`}
                    required
                  />
                  {fieldErrors.direccion && <p className="text-red-500 text-xs font-bold mt-1">{Array.isArray(fieldErrors.direccion) ? fieldErrors.direccion[0] : fieldErrors.direccion}</p>}
                </div>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Estado *</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                >
                  <option value="disponible">Disponible</option>
                  <option value="negociacion">En negociación</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>

              {/* Amenidades y Detalles Extra (Opcionales) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Amenidades (Opcional)</label>
                  <textarea
                    name="amenidades"
                    value={formData.amenidades}
                    onChange={handleChange}
                    placeholder="Ej: Piscina, Gimnasio, Vigilancia 24/7..."
                    rows="3"
                    className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Detalles Extra (Opcional)</label>
                  <textarea
                    name="detalles_extra"
                    value={formData.detalles_extra}
                    onChange={handleChange}
                    placeholder="Ej: Remodelado hace 2 años, excelente iluminación..."
                    rows="3"
                    className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                  />
                </div>
              </div>

              {/* Observaciones (Opcional) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">Observaciones Internas (Opcional)</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Notas adicionales sobre la propiedad..."
                  rows="2"
                  className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                />
              </div>

              {/* Fotos */}
              <div className="space-y-2" name="imagenes">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">
                    Fotos de la Propiedad *
                  </label>
                  <span className={`text-xs font-bold ${uploadedImages.length >= getMaxImages() ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>
                    {uploadedImages.length} / {getMaxImages()} imágenes
                  </span>
                </div>
                
                <div 
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    uploadedImages.length >= getMaxImages() 
                    ? 'border-red-500/20 bg-red-500/5 opacity-50 cursor-not-allowed' 
                    : 'border-[var(--accent-gold)]/30 bg-[var(--bg-secondary)] hover:border-[var(--accent-gold)] hover:bg-[var(--bg-tertiary)] cursor-pointer'
                  } ${fieldErrors.imagenes ? 'border-red-500 bg-red-500/5' : ''}`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploadedImages.length >= getMaxImages()}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    id="imageInput"
                  />
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <svg className={`w-12 h-12 ${fieldErrors.imagenes ? 'text-red-500/50' : 'text-[var(--accent-gold)]/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-bold">
                        Arrastra tus fotos aquí *
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        o haz clic para seleccionar archivos
                      </p>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      JPG, PNG o WEBP • Máximo 5MB por imagen
                    </p>
                  </div>
                </div>
                {fieldErrors.imagenes && <p className="text-red-500 text-xs font-bold mt-1 text-center">{fieldErrors.imagenes}</p>}

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {uploadedImages.map((img) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={img.id} 
                        className="relative aspect-square group rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)]"
                      >
                        <img 
                          src={img.preview} 
                          alt="Vista previa" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {!img.isExisting && (
                          <div className="absolute top-2 left-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Nuevo
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {submitLoading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[var(--accent-gold)]">
                    <span>Subiendo imágenes... {uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-[var(--accent-gold)]"
                    />
                  </div>
                </div>
              )}

              {/* Contacto Adicional */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[2px] text-[var(--accent-gold)]">WhatsApp de Contacto *</label>
                <input
                  type="tel"
                  name="whatsapp_contacto"
                  value={formData.whatsapp_contacto}
                  onChange={handleChange}
                  placeholder="Ej: +57 300 123 4567"
                  className={`w-full px-5 py-4 bg-[var(--bg-secondary)] border ${fieldErrors.whatsapp_contacto ? 'border-red-500' : 'border-[var(--border-primary)]'} rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-gold)] transition-all`}
                  required
                />
                {fieldErrors.whatsapp_contacto && <p className="text-red-500 text-xs font-bold mt-1">{Array.isArray(fieldErrors.whatsapp_contacto) ? fieldErrors.whatsapp_contacto[0] : fieldErrors.whatsapp_contacto}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitLoading || !selectedPlan}
                style={{
                  background: 'linear-gradient(90deg, var(--accent-gold-dark), var(--accent-gold))',
                  boxShadow: 'var(--shadow-gold)'
                }}
                className="w-full py-4 text-white font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? (isEditMode ? 'Actualizando...' : 'Publicando...') : (isEditMode ? 'Actualizar Propiedad' : 'Publicar Propiedad')}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

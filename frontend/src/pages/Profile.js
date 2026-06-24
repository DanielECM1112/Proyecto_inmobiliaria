import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Power, Camera,
  Calendar, Save, X, Check, Home, TrendingUp,
  Headphones, Shield, Settings, ChevronRight,
  MessageSquare
} from 'lucide-react';
import { FaCrown } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const ADMIN_EMAIL = 'manuelestiven2006@gmail.com';
const ADMIN_WHATSAPP = '573223147352';

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('http') || avatarPath.startsWith('data:') || avatarPath.startsWith('blob:'))
    return avatarPath;
  return `http://localhost:8000${avatarPath}`;
};

const TABS = [
  { id: 'personal', label: 'Datos Personales', icon: User },
  { id: 'plan', label: 'Mi Plan', icon: TrendingUp },
  { id: 'properties', label: 'Mis Propiedades', icon: Home },
  { id: 'support', label: 'Soporte', icon: Headphones },
];

export default function Profile() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ nombre: '', telefono: '', ciudad: '' });
  const [misProps, setMisProps] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchMisProps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMisProps = async () => {
    try {
      const res = await api.get('/properties/mis-propiedades/');
      setMisProps(res.data || []);
    } catch {
      setMisProps([]);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/perfil/');
      setUser(res.data);
      if (res.data.avatar) setAvatarPreview(getAvatarUrl(res.data.avatar));
      setFormData({ nombre: res.data.nombre || '', telefono: res.data.telefono || '', ciudad: res.data.ciudad || '' });
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.patch('/perfil/', formData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: res.data }));
      setSuccess('¡Perfil actualizado con éxito!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await api.patch('/perfil/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(res.data);
      setAvatarPreview(getAvatarUrl(res.data.avatar));
      localStorage.setItem('user', JSON.stringify(res.data));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: res.data }));
      setSuccess('Foto de perfil actualizada ✓');
      setTimeout(() => setSuccess(''), 2500);
    } catch {
      setError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  /* ── Loading ── */
  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0D0D0D]' : 'bg-[#F2F2EF]'}`}>
      <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const userInitials = (user?.nombre || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }) : 'Jun 2026';

  /* Rol visible: solo el admin tiene insignia especial.
     Un usuario recién registrado, sin compras, es simplemente "Usuario". */
  const esAdmin = !!user?.is_staff || user?.rol === 'admin';
  const rolLabel = esAdmin ? 'Administrador' : 'Usuario';

  /* Colores base según modo */
  const bg      = isDarkMode ? '#0D0D0D' : '#F0F0ED';
  const card    = isDarkMode ? '#141414' : '#FFFFFF';
  const cardBd  = isDarkMode ? '#242424' : '#E6E6E2';
  const txt     = isDarkMode ? '#F0F0F0' : '#141414';
  const sub     = isDarkMode ? '#8E8E8E' : '#6B6B6B';
  const input   = isDarkMode ? '#1A1A1A' : '#F7F7F5';
  const inputBd = isDarkMode ? '#2C2C2C' : '#DEDEDA';
  const hairline = isDarkMode ? 'rgba(201,168,76,0.28)' : 'rgba(201,168,76,0.45)';

  /* Card editorial: borde fino + filo dorado superior de 1px (sin glows) */
  const cardStyle = {
    background: card,
    border: `1px solid ${cardBd}`,
    borderTop: `1px solid ${hairline}`,
  };

  return (
    <PageWrapper>
      <div style={{ background: bg, color: txt, minHeight: '100vh' }} className="flex flex-col transition-colors duration-500">
        <Navbar />

        {/* ── HERO editorial ── */}
        <div className="relative pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: isDarkMode ? 'brightness(0.4) saturate(0.7)' : 'brightness(0.5) saturate(0.75)' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(to bottom, rgba(13,13,13,0.35) 0%, rgba(13,13,13,0.55) 55%, #0D0D0D 100%)'
                  : 'linear-gradient(to bottom, rgba(13,13,13,0.35) 0%, rgba(13,13,13,0.45) 55%, #F0F0ED 100%)',
              }}
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-16">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-7">
              {/* Avatar — círculo clásico, borde fino, sin resplandor */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-32 h-32 rounded-full overflow-hidden"
                  style={{
                    border: `2px solid ${user?.plan_activo?.name === 'Premium' ? '#FFD700' : (isDarkMode ? 'rgba(201,168,76,0.85)' : '#C9A84C')}`,
                    boxShadow: user?.plan_activo?.name === 'Premium' 
                      ? '0 8px 28px rgba(255,215,0,0.4)' 
                      : '0 8px 28px rgba(0,0,0,0.35)',
                  }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-3xl font-serif font-bold"
                      style={{ background: '#181818', color: '#C9A84C', letterSpacing: '1px' }}
                    >
                      {userInitials}
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                      <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {/* Corona Premium */}
                  {user?.plan_activo?.name === 'Premium' && (
                    <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
                      <FaCrown style={{ color: '#FFD700', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                  style={{ background: '#C9A84C', color: '#0D0D0D', border: `2px solid ${isDarkMode ? '#0D0D0D' : '#F0F0ED'}` }}
                  title="Cambiar foto"
                >
                  <Camera size={14} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>

              {/* Nombre + rol */}
              <div className="text-center sm:text-left pb-1 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[5px] mb-2" style={{ color: '#C9A84C' }}>
                  Mi cuenta
                </p>
                <h1
                  className="text-3xl md:text-[2.6rem] font-serif font-bold text-white leading-tight flex items-center justify-center sm:justify-start gap-3"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}
                >
                  {user?.nombre || 'Usuario'}
                  {user?.plan_activo?.name === 'Premium' && <FaCrown style={{ color: '#FFD700', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 flex-wrap">
                  {/* Insignia de rol */}
                  <span
                    className="text-[10px] font-bold uppercase tracking-[3px] px-3 py-1.5"
                    style={{
                      color: '#C9A84C',
                      border: '1px solid rgba(201,168,76,0.55)',
                      background: 'rgba(13,13,13,0.35)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {rolLabel}
                  </span>
                  {/* Insignia de plan */}
                  {user?.plan_activo && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-[3px] px-3 py-1.5"
                      style={{
                        color: user.plan_activo.name === 'Premium' ? '#0D0D0D' : '#C9A84C',
                        background: user.plan_activo.name === 'Premium' ? '#FFD700' : 'rgba(13,13,13,0.35)',
                        border: `1px solid ${user.plan_activo.name === 'Premium' ? '#FFD700' : 'rgba(201,168,76,0.55)'}`,
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {user.plan_activo.name}
                    </span>
                  )}
                  <span
                    className="text-sm flex items-center gap-1.5"
                    style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                  >
                    <Calendar size={13} /> Miembro desde {memberSince}
                  </span>
                </div>
              </div>

              {/* Cerrar sesión — ghost, discreto */}
              <div className="sm:ml-auto pb-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    color: '#f1b6b6',
                    border: '1px solid rgba(239,68,68,0.45)',
                    background: 'rgba(13,13,13,0.3)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Power size={15} /> Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── CUERPO ── */}
        <div className="flex-1 max-w-5xl mx-auto w-full px-6 pb-24">

          {/* Mensajes flotantes */}
          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 p-3 flex items-center gap-3 text-sm font-medium"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', color: isDarkMode ? '#4ade80' : '#15803d' }}>
                <Check size={16} /> {success}
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 p-3 flex items-center gap-3 text-sm font-medium"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: isDarkMode ? '#f87171' : '#b91c1c' }}>
                <X size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TABS editoriales (subrayado, sin píldoras) ── */}
          <div className="flex gap-8 mb-10" style={{ borderBottom: `1px solid ${cardBd}` }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 pb-3 -mb-px text-[12px] font-bold uppercase tracking-[2px] transition-colors duration-200"
                  style={{
                    color: active ? '#C9A84C' : sub,
                    borderBottom: active ? '2px solid #C9A84C' : '2px solid transparent',
                  }}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── CONTENIDO TABS ── */}
          <AnimatePresence mode="wait">

            {/* TAB: DATOS PERSONALES */}
            {activeTab === 'personal' && (
              <motion.div key="personal"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Tarjeta lateral: cuenta + actividad */}
                  <div className="space-y-6">
                    <div className="p-6" style={cardStyle}>
                      <p className="text-[10px] font-bold uppercase tracking-[3px] mb-5" style={{ color: '#C9A84C' }}>
                        Tu cuenta
                      </p>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                          style={{ border: '1px solid rgba(201,168,76,0.5)' }}>
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-serif font-bold"
                              style={{ background: '#181818', color: '#C9A84C' }}>
                              {userInitials}
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-sm truncate" style={{ color: txt }}>{user?.nombre}</p>
                          <p className="text-xs truncate" style={{ color: sub }}>{user?.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2.5 text-sm" style={{ color: sub }}>
                        {formData.ciudad && (
                          <div className="flex items-center gap-2">
                            <MapPin size={13} style={{ color: '#C9A84C' }} />
                            {formData.ciudad}
                          </div>
                        )}
                        {formData.telefono && (
                          <div className="flex items-center gap-2">
                            <Phone size={13} style={{ color: '#C9A84C' }} />
                            {formData.telefono}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={13} style={{ color: '#C9A84C' }} />
                          {memberSince}
                        </div>
                      </div>
                    </div>

                    {/* Actividad */}
                    <div className="p-6" style={cardStyle}>
                      <p className="text-[10px] font-bold uppercase tracking-[3px] mb-4" style={{ color: '#C9A84C' }}>
                        Actividad
                      </p>
                      {[{ label: 'Propiedades', val: misProps.length, icon: Home }, { label: 'Intereses', val: 0, icon: TrendingUp }].map((s, i, arr) => (
                        <div key={s.label} className="flex items-center justify-between py-3"
                          style={{ borderBottom: i < arr.length - 1 ? `1px solid ${cardBd}` : 'none' }}>
                          <div className="flex items-center gap-3">
                            <s.icon size={15} style={{ color: '#C9A84C' }} />
                            <span className="text-sm" style={{ color: sub }}>{s.label}</span>
                          </div>
                          <span className="font-serif font-bold text-xl" style={{ color: txt }}>{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formulario principal */}
                  <div className="md:col-span-2">
                    <div className="p-6 md:p-8" style={cardStyle}>
                      <div className="flex items-center justify-between mb-7">
                        <div>
                          <h2 className="text-xl font-serif font-bold" style={{ color: txt }}>Datos Personales</h2>
                          <p className="text-sm mt-1" style={{ color: sub }}>
                            Asegúrate de brindar la información correcta.
                          </p>
                        </div>
                        {!isEditing && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[2px] transition-all hover:opacity-80"
                            style={{ color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)' }}>
                            <Settings size={13} /> Editar
                          </button>
                        )}
                      </div>

                      {/* Vista: solo lectura */}
                      {!isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                          {[
                            { label: 'Nombre Completo', value: formData.nombre, icon: User },
                            { label: 'Correo Electrónico', value: user?.email, icon: Mail },
                            { label: 'Número de Celular', value: formData.telefono || '—', icon: Phone },
                            { label: 'Ciudad de Residencia', value: formData.ciudad || '—', icon: MapPin },
                          ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="pb-4" style={{ borderBottom: `1px solid ${cardBd}` }}>
                              <p className="text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: sub }}>{label}</p>
                              <div className="flex items-center gap-2.5">
                                <Icon size={14} style={{ color: '#C9A84C' }} />
                                <p className="text-[15px] font-medium" style={{ color: txt }}>{value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <form onSubmit={e => { handleSubmit(e); setIsEditing(false); }}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2"
                                style={{ color: '#C9A84C' }}>Nombre Completo</label>
                              <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: sub }} />
                                <input type="text" name="nombre" value={formData.nombre}
                                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                  placeholder="Tu nombre completo"
                                  className="w-full pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-[#C9A84C]"
                                  style={{ background: input, border: `1px solid ${inputBd}`, color: txt }} />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2"
                                style={{ color: sub }}>Correo Electrónico</label>
                              <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: sub }} />
                                <input type="email" value={user?.email || ''} disabled
                                  className="w-full pl-10 pr-4 py-3 text-sm cursor-not-allowed opacity-50"
                                  style={{ background: input, border: `1px solid ${inputBd}`, color: txt }} />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2"
                                style={{ color: '#C9A84C' }}>Número de Celular</label>
                              <div className="relative">
                                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: sub }} />
                                <input type="tel" name="telefono" value={formData.telefono}
                                  onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                  placeholder="+57 300 000 0000"
                                  className="w-full pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-[#C9A84C]"
                                  style={{ background: input, border: `1px solid ${inputBd}`, color: txt }} />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2"
                                style={{ color: '#C9A84C' }}>Ciudad de Residencia</label>
                              <div className="relative">
                                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: sub }} />
                                <input type="text" name="ciudad" value={formData.ciudad}
                                  onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
                                  placeholder="Ej: Ibagué, Tolima"
                                  className="w-full pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-[#C9A84C]"
                                  style={{ background: input, border: `1px solid ${inputBd}`, color: txt }} />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={saving}
                              className="flex items-center gap-2 px-7 py-3 font-bold text-[12px] uppercase tracking-[2px] transition-all hover:opacity-90 disabled:opacity-50"
                              style={{ background: '#C9A84C', color: '#0D0D0D' }}>
                              {saving ? (
                                <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Guardando...</>
                              ) : (
                                <><Save size={15} /> Guardar</>
                              )}
                            </button>
                            <button type="button"
                              onClick={() => { setIsEditing(false); fetchProfile(); }}
                              className="flex items-center gap-2 px-7 py-3 font-bold text-[12px] uppercase tracking-[2px] transition-all hover:opacity-80"
                              style={{ background: 'transparent', border: `1px solid ${inputBd}`, color: sub }}>
                              <X size={15} /> Cancelar
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: MI PLAN */}
            {activeTab === 'plan' && (
              <motion.div key="plan"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}>
                <div className="p-6 md:p-8" style={cardStyle}>
                  <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: txt }}>Mi Plan</h2>
                  
                  {user?.plan_activo ? (
                    <div className="space-y-6">
                      {/* Plan Name and Status */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-serif font-bold" style={{ color: txt }}>
                            {user.plan_activo.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span 
                              className="text-[9px] font-bold uppercase tracking-[2px] px-3 py-1.5"
                              style={{ 
                                background: 'rgba(34, 197, 94, 0.1)', 
                                color: '#4ade80', 
                                border: '1px solid rgba(34, 197, 94, 0.3)' 
                              }}
                            >
                              Activo
                            </span>
                          </div>
                        </div>
                        <div 
                          className="text-right"
                          style={{ 
                            color: user.plan_activo.name === 'Premium' ? '#C9A84C' : txt 
                          }}
                        >
                          <p className="text-3xl font-serif font-bold">
                            ${parseFloat(user.plan_activo.price).toLocaleString('es-CO')}
                          </p>
                          <p className="text-xs" style={{ color: sub }}>
                            Por {user.plan_activo.duration_days} días
                          </p>
                        </div>
                      </div>
                      
                      {/* Dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6" style={{ borderTop: `1px solid ${cardBd}` }}>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: sub }}>
                            Fecha de activación
                          </p>
                          <p className="text-sm font-medium" style={{ color: txt }}>
                            {new Date(user.plan_activado_at).toLocaleDateString('es-CO', { 
                              year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: sub }}>
                            Fecha de vencimiento
                          </p>
                          <p className="text-sm font-medium" style={{ color: txt }}>
                            {new Date(user.plan_expira_at).toLocaleDateString('es-CO', { 
                              year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="pt-6" style={{ borderTop: `1px solid ${cardBd}` }}>
                        <p className="text-[10px] font-bold uppercase tracking-[2px] mb-4" style={{ color: '#C9A84C' }}>
                          Incluye
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Check size={14} style={{ color: '#C9A84C' }} />
                            <span className="text-sm" style={{ color: sub }}>
                              Hasta {user.plan_activo.max_properties} propiedad{user.plan_activo.max_properties !== 1 ? 'es' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check size={14} style={{ color: '#C9A84C' }} />
                            <span className="text-sm" style={{ color: sub }}>
                              Hasta {user.plan_activo.max_photos} foto{user.plan_activo.max_photos !== 1 ? 's' : ''} por propiedad
                            </span>
                          </div>
                          {user.plan_activo.features?.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Check size={14} style={{ color: '#C9A84C' }} />
                              <span className="text-sm" style={{ color: sub }}>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Change Plan Button */}
                      <div className="pt-6" style={{ borderTop: `1px solid ${cardBd}` }}>
                        <button
                          onClick={() => navigate('/planes')}
                          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 font-bold text-[12px] uppercase tracking-[2px] transition-all hover:opacity-90"
                          style={{ color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)' }}
                        >
                          Cambiar Plan <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <TrendingUp size={34} className="mx-auto mb-5" style={{ color: sub }} />
                      <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: txt }}>
                        No tienes un plan activo
                      </h3>
                      <p className="text-sm mb-7 max-w-sm mx-auto" style={{ color: sub }}>
                        Elige un plan y empieza a publicar tus propiedades hoy mismo.
                      </p>
                      <button
                        onClick={() => navigate('/planes')}
                        className="inline-flex items-center gap-2 px-8 py-3 font-bold text-[12px] uppercase tracking-[2px] transition-all hover:opacity-90"
                        style={{ background: '#C9A84C', color: '#0D0D0D' }}
                      >
                        Ver Planes <ChevronRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: MIS PROPIEDADES */}
            {activeTab === 'properties' && (
              <motion.div key="properties"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}>

                {misProps.length === 0 ? (
                  <div className="p-12 text-center" style={cardStyle}>
                    <Home size={34} className="mx-auto mb-5" style={{ color: '#C9A84C' }} />
                    <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: txt }}>Aún no tienes propiedades</h3>
                    <p className="text-sm mb-7 max-w-sm mx-auto" style={{ color: sub }}>
                      Publica tu primera propiedad y llega a miles de compradores e inversores.
                    </p>
                    <button
                      onClick={() => navigate('/planes')}
                      className="inline-flex items-center gap-2 px-8 py-3 font-bold text-[12px] uppercase tracking-[2px] transition-all hover:opacity-90"
                      style={{ background: '#C9A84C', color: '#0D0D0D' }}>
                      Publicar Propiedad <ChevronRight size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif font-bold text-2xl" style={{ color: txt }}>
                        Mis propiedades <span className="text-base font-sans font-normal" style={{ color: sub }}>({misProps.length})</span>
                      </h3>
                      <button
                        onClick={() => navigate('/planes')}
                        className="flex items-center gap-2 px-5 py-2.5 font-bold text-[11px] uppercase tracking-[2px] transition-all hover:opacity-90"
                        style={{ background: '#C9A84C', color: '#0D0D0D' }}>
                        + Publicar
                      </button>
                    </div>
                    {misProps.map(prop => {
                      const img = prop.imagenes?.[0]?.imagen;
                      const imgUrl = img ? (img.startsWith('http') ? img : `http://localhost:8000${img}`) : null;
                      const statusColors = { disponible: '#4ade80', negociacion: '#fbbf24', vendido: '#f87171' };
                      const statusLabel = { disponible: 'Disponible', negociacion: 'En Negociación', vendido: 'Vendido' };
                      return (
                        <div key={prop.id}
                          className="overflow-hidden flex gap-5 p-5 cursor-pointer transition-all hover:translate-x-1"
                          style={cardStyle}
                          onClick={() => navigate(`/properties/${prop.id}`)}>
                          <div className="w-24 h-20 overflow-hidden flex-shrink-0"
                            style={{ background: 'rgba(201,168,76,0.06)' }}>
                            {imgUrl ? (
                              <img src={imgUrl} alt={prop.titulo} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home size={22} style={{ color: '#C9A84C' }} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif font-bold text-[15px] truncate" style={{ color: txt }}>{prop.titulo}</p>
                            <p className="text-xs mt-1 truncate" style={{ color: sub }}>{prop.ubicacion || '—'}</p>
                            <p className="text-sm font-bold mt-1.5" style={{ color: '#C9A84C' }}>
                              ${parseFloat(prop.precio || 0).toLocaleString('es-CO')}
                            </p>
                          </div>
                          <div className="flex-shrink-0 self-start">
                            <span className="text-[9px] font-bold uppercase tracking-[2px] px-3 py-1.5"
                              style={{
                                color: statusColors[prop.estado] || '#888',
                                border: `1px solid ${statusColors[prop.estado] || '#888'}55`,
                              }}>
                              {statusLabel[prop.estado] || prop.estado}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: SOPORTE (para todos los usuarios) */}
            {activeTab === 'support' && (
              <motion.div key="support"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}>

                {/* Card principal: contactar al administrador */}
                <div className="p-8 mb-6" style={cardStyle}>
                  <p className="text-[10px] font-bold uppercase tracking-[3px] mb-3" style={{ color: '#C9A84C' }}>
                    Centro de ayuda
                  </p>
                  <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: txt }}>¿Necesitas ayuda?</h3>
                  <p className="text-sm mb-7 max-w-2xl leading-relaxed" style={{ color: sub }}>
                    Si deseas modificar o eliminar una propiedad, o tienes alguna duda o petición,
                    escríbenos. El administrador gestiona la información de las propiedades y te
                    responderá a la brevedad.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('Solicitud de ayuda - LuxHabitat')}&body=${encodeURIComponent(`Hola administrador,\n\nSoy ${user?.nombre || ''} (${user?.email || ''}) y necesito ayuda con:\n\n`)}`}
                      className="flex items-center justify-center gap-2 flex-1 py-3.5 font-bold text-[12px] uppercase tracking-[2px] transition-all hover:opacity-90"
                      style={{ background: '#C9A84C', color: '#0D0D0D' }}>
                      <Mail size={15} /> Contactar administrador
                    </a>
                    <a
                      href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(`Hola admin, soy ${user?.nombre || ''} y necesito ayuda con LuxHabitat`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 flex-1 py-3.5 font-bold text-[12px] uppercase tracking-[2px] transition-all hover:opacity-80"
                      style={{ color: '#25D366', border: '1px solid rgba(37,211,102,0.45)' }}>
                      <MessageSquare size={15} /> WhatsApp
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Asesoría */}
                  <div className="p-8" style={cardStyle}>
                    <Headphones size={24} className="mb-4" style={{ color: '#C9A84C' }} />
                    <h3 className="text-lg font-serif font-bold mb-2" style={{ color: txt }}>Asesoría Inmobiliaria</h3>
                    <p className="text-sm mb-6 leading-relaxed" style={{ color: sub }}>
                      ¿Tienes preguntas sobre comprar, vender o publicar? Nuestro equipo te orienta
                      sin costo en cada paso del proceso.
                    </p>
                    <a
                      href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 font-bold text-[12px] uppercase tracking-[2px] transition-all hover:opacity-90"
                      style={{ background: '#25D366', color: '#fff' }}>
                      <MessageSquare size={15} /> Hablar con un asesor
                    </a>
                  </div>

                  {/* Por qué LuxHabitat */}
                  <div className="p-8" style={cardStyle}>
                    <Shield size={24} className="mb-4" style={{ color: '#C9A84C' }} />
                    <h3 className="text-lg font-serif font-bold mb-3" style={{ color: txt }}>¿Por qué LuxHabitat?</h3>
                    <ul className="space-y-3.5 text-sm" style={{ color: sub }}>
                      {[
                        'Publicación sencilla en minutos',
                        'Contacto directo con interesados',
                        'Atención personalizada del equipo',
                        'Planes a la medida de tu propiedad',
                      ].map(b => (
                        <li key={b} className="flex items-start gap-2.5">
                          <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#C9A84C' }} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Footer />
      </div>
    </PageWrapper>
  );
}
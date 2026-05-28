import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Plans() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/plans/');
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    // Si el usuario NO tiene sesión
    if (!user) {
      setPendingPlan(plan);
      setShowLoginModal(true);
      return;
    }

    // Verificar si es admin
    const isAdmin = user?.user?.is_staff === true;

    setSelectedPlanId(plan.id);
    localStorage.setItem('selectedPlan', JSON.stringify(plan));

    // Admin va directo a /publish sin pago
    if (isAdmin) {
      navigate(`/publish?plan=${plan.slug}`, { state: { selectedPlan: plan } });
    }
    // Plan gratuito (price == 0) va directo a /publish
    else if (parseFloat(plan.price) === 0) {
      navigate(`/publish?plan=${plan.slug}`, { state: { selectedPlan: plan } });
    }
    // Plan de pago va a checkout
    else {
      navigate(`/checkout?plan=${plan.slug}`, { state: { selectedPlan: plan } });
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { redirect: '/planes' } });
  };

  return (
    <div 
      className="min-h-screen flex flex-col" 
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-6 md:px-8 relative">
        {/* Fondo con imagen */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: isDarkMode ? 0.05 : 0.1
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'var(--section-overlay)' }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.4em]" 
              style={{ color: 'var(--accent-gold)' }}
            >
              Planes LUXHABITAT
            </p>
            <h1 
              className="mt-6 text-5xl md:text-6xl font-serif font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Elige el plan perfecto para tu propiedad
            </h1>
            <p 
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Publica con elegancia, muestra tu inmueble al público correcto y aprovecha funciones premium.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#b38b1d] mx-auto" style={{ borderColor: 'var(--accent-gold)' }}></div>
              <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando planes...</p>
            </div>
          ) : plans.length === 0 ? (
            <div 
              className="rounded-[2rem] border p-14 text-center text-lg shadow-2xl"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-secondary)'
              }}
            >
              Próximamente nuevos planes disponibles
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const isRecommended = plan.is_featured === true;
                const isSelected = selectedPlanId === plan.id;
                const isFreePrice = parseFloat(plan.price) === 0;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 * index }}
                    whileHover={{ y: -6 }}
                    className="rounded-[2.5rem] border p-8 shadow-xl transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: isRecommended ? 'var(--accent-gold)' : 'var(--card-border)',
                      borderWidth: isRecommended ? '2px' : '1px',
                    }}
                  >
                    {isRecommended && (
                      <div 
                        className="mb-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em]"
                        style={{ 
                          backgroundColor: `${isDarkMode ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.1)'}`,
                          color: 'var(--accent-gold)'
                        }}
                      >
                        ★ Más Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <h2 
                        className="text-3xl font-black tracking-tight mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {plan.name}
                      </h2>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {plan.duration_days} días
                      </p>
                    </div>

                    <div className="mb-8">
                      {isFreePrice ? (
                        <p className="text-4xl font-black" style={{ color: '#22C55E' }}>
                          GRATIS
                        </p>
                      ) : (
                        <p className="text-4xl font-black" style={{ color: 'var(--accent-gold)' }}>
                          ${parseFloat(plan.price).toLocaleString('es-CO')}
                        </p>
                      )}
                    </div>

                    {plan.description && (
                      <p 
                        className="text-sm mb-6"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {plan.description}
                      </p>
                    )}

                    <ul className="space-y-3 mb-10 text-sm">
                      {Array.isArray(plan.features) && plan.features.length > 0 ? (
                        plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span 
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-sm font-bold"
                              style={{ 
                                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                color: 'var(--accent-gold)'
                              }}
                            >
                              ✓
                            </span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {feature}
                            </span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex items-start gap-3">
                            <span 
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-sm font-bold"
                              style={{ 
                                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                color: 'var(--accent-gold)'
                              }}
                            >
                              ✓
                            </span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              Máximo {plan.max_properties} propiedades
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span 
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-sm font-bold"
                              style={{ 
                                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                color: 'var(--accent-gold)'
                              }}
                            >
                              ✓
                            </span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              Hasta {plan.max_photos} fotos
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span 
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-sm font-bold"
                              style={{ 
                                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                color: 'var(--accent-gold)'
                              }}
                            >
                              ✓
                            </span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              Visible por {plan.duration_days} días
                            </span>
                          </li>
                        </>
                      )}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full rounded-3xl px-6 py-4 text-sm font-black uppercase tracking-[0.25em] transition-all duration-300 hover:shadow-xl"
                      style={{
                        backgroundColor: 'var(--accent-gold)',
                        color: '#000',
                        transform: 'translateY(0)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Seleccionar Plan →
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div 
            className="w-full max-w-xl rounded-[2rem] border p-8 shadow-2xl"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              borderWidth: '1px'
            }}
          >
            <div className="mb-6 text-center">
              <p className="text-sm uppercase tracking-[0.35em]" style={{ color: 'var(--accent-gold)' }}>
                Acceso requerido
              </p>
              <h2 
                className="mt-4 text-3xl font-black"
                style={{ color: 'var(--text-primary)' }}
              >
                Inicia sesión para continuar
              </h2>
              <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Debes ingresar a tu cuenta para seleccionar este plan y avanzar con la publicación.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={handleLoginRedirect}
                className="rounded-3xl px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] transition hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--accent-gold)',
                  color: '#000'
                }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="rounded-3xl border px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] transition"
                style={{
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)',
                  backgroundColor: `${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}`
                }}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

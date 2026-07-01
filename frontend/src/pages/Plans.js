import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import './Plans.css';

function SpotlightCard({ children, isFeatured }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--spotlight-x', `${x}px`);
    el.style.setProperty('--spotlight-y', `${y}px`);
    el.style.setProperty('--spotlight-opacity', '1');
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (el) el.style.setProperty('--spotlight-opacity', '0');
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card${isFeatured ? ' spotlight-card--featured' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="spotlight-card__glow" />
      {children}
    </div>
  );
}

export default function Plans() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Helper to determine plan level
  const getPlanLevel = (planName) => {
    if (!planName) return 0;
    const name = planName.toLowerCase();
    if (name.includes('premium')) return 3;
    if (name.includes('est') || name.includes('stand')) return 2;
    if (name.includes('grati') || name.includes('free')) return 1;
    return 0;
  };

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }

    // Listen for user updated event
    const handleUserUpdated = (event) => {
      if (event.detail) {
        setUser(event.detail);
        localStorage.setItem('user', JSON.stringify(event.detail));
      }
    };
    window.addEventListener('userUpdated', handleUserUpdated);

    // Load plans
    api.get('/plans/')
      .then(r => setPlanes(r.data || []))
      .catch(() => setError('No se pudieron cargar los planes'))
      .finally(() => setLoading(false));

    return () => window.removeEventListener('userUpdated', handleUserUpdated);
  }, []);

  const handleSelectPlan = (plan) => {
    const storedUser  = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      localStorage.setItem('planSeleccionado', JSON.stringify(plan));
      navigate('/login?redirect=/planes');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const isAdmin = parsedUser.is_staff === true || parsedUser.rol === 'admin';
    
    if (isAdmin) {
      navigate(`/publish?planId=${plan.id}&planNombre=Plan+Admin&maxFotos=999`);
      return;
    }
    
    // Get active plan level
    const activePlan = parsedUser.plan_activo;
    const activePlanLevel = activePlan ? getPlanLevel(activePlan.name) : 0;
    const selectedPlanLevel = getPlanLevel(plan.name);

    if (activePlan) {
      // Case 1: Same plan - cannot buy again
      if (activePlan.name === plan.name) {
        return;
      }
      // Case 2: If it's Gratis - cannot downgrade
      if (selectedPlanLevel === 1) { // Gratis is level 1
        return;
      }
    }

    if (parseFloat(plan.price) === 0) {
      navigate(`/publish?planId=${plan.id}&planNombre=${encodeURIComponent(plan.name)}&maxFotos=${plan.max_photos}`);
      return;
    }

    navigate('/checkout', { state: { selectedPlan: plan } });
  };

  const getFeatures = (plan) => {
    const features = [];
    if (plan.max_properties) {
      features.push(
        plan.max_properties === 999
          ? 'Publicaciones ilimitadas'
          : `${plan.max_properties} publicación${plan.max_properties > 1 ? 'es' : ''} activa${plan.max_properties > 1 ? 's' : ''}`
      );
    }
    if (plan.max_photos) features.push(`Hasta ${plan.max_photos} foto${plan.max_photos > 1 ? 's' : ''}`);
    if (plan.duration_days) features.push(`Visible ${plan.duration_days} días`);
    return features.length > 0 ? features : ['Beneficios incluidos'];
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>Cargando planes...</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-[350px] flex items-center justify-center py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
              alt="Luxury Business"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[5px] text-[#C9A84C] mb-4">
                MEMBRESÍAS LUXHABITAT
              </p>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 text-white">
                Planes de Publicación
              </h1>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto font-light">
                Elige el plan que mejor se adapte a tus objetivos y comienza a destacar hoy.
              </p>
              <div className="w-24 h-[2px] bg-[#C9A84C] mx-auto" />
            </motion.div>
          </div>
        </section>

        <main className="flex-grow py-20 px-6">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <div className="text-center py-12 rounded-2xl border" style={{ borderColor: 'var(--card-border)' }}>
                <p className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>{error}</p>
              </div>
            ) : planes.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border" style={{ borderColor: 'var(--card-border)' }}>
                <p className="text-lg" style={{ color: 'var(--text-primary)' }}>Estamos preparando nuestros planes</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${Math.min(planes.length, 4)} gap-8 items-stretch`}>
                {planes.map((plan, i) => {
                  // Get active plan info
                  const activePlan = user?.plan_activo;
                  const activePlanLevel = activePlan ? getPlanLevel(activePlan.name) : 0;
                  const selectedPlanLevel = getPlanLevel(plan.name);
                  
                  const isSamePlan = activePlan?.name === plan.name;
                  const isGratis = selectedPlanLevel === 1;
                  const isLowerPlan = activePlan && selectedPlanLevel < activePlanLevel && !isGratis;
                  const isHigherPlan = activePlan && selectedPlanLevel > activePlanLevel;
                  // Solo deshabilitar si es el mismo plan o es Gratis (y no es Gratis activo)
                  const isButtonDisabled = isSamePlan || (activePlan && isGratis);

                  let buttonText = "Seleccionar plan";
                  let warningMessage = null;

                  if (isSamePlan) {
                    buttonText = "Ya tienes este plan";
                    warningMessage = "Tu plan actual ya está activo";
                  } else if (activePlan && isGratis) {
                    buttonText = "No disponible";
                    warningMessage = "No puedes volver a un plan gratuito";
                  } else if (activePlan && activePlanLevel === 3 && selectedPlanLevel === 2) {
                    // Premium -> Estándar
                    buttonText = "Continuar de todos modos";
                    warningMessage = "Actualmente cuentas con Premium, que ofrece más beneficios que este plan.";
                  } else if (activePlan && activePlanLevel === 2 && selectedPlanLevel === 3) {
                    // Estándar -> Premium
                    buttonText = "Upgrade a Premium";
                    warningMessage = "Premium incluye más publicaciones, más beneficios y mayor visibilidad.";
                  }

                  return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.09 }}
                    className="relative"
                  >
                    {plan.is_featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0D0D0D] text-[9px] font-bold uppercase tracking-[2px] px-4 py-1.5 rounded-full z-10 whitespace-nowrap">
                        MÁS POPULAR
                      </div>
                    )}

                    <SpotlightCard isFeatured={plan.is_featured}>
                      <div className="flex flex-col flex-1">
                        {/* Nombre */}
                        <h2 className="text-xl font-serif font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                          {plan.name}
                        </h2>

                        {/* Precio */}
                        <div className="mb-6">
                          {parseFloat(plan.price) === 0 ? (
                            <span className="text-4xl font-serif font-bold text-[#C9A84C]">GRATIS</span>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
                                ${parseFloat(plan.price).toLocaleString('es-CO')}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                COP / {plan.duration_days || 30} días
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Divisor */}
                        <div className="w-full h-px mb-6" style={{ backgroundColor: 'var(--card-border)' }} />

                        {/* Features */}
                        <ul className="space-y-3 flex-1 mb-6">
                          {getFeatures(plan).map((f, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <FaCheck className="text-[#C9A84C] text-sm mt-[2px] flex-shrink-0" />
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Warning Message */}
                        {warningMessage && (
                          <div className="mb-4 p-3 rounded-lg text-xs text-center" style={{ 
                            backgroundColor: isSamePlan ? 'rgba(201,168,76,0.1)' : 'rgba(239,68,68,0.1)',
                            color: isSamePlan ? '#C9A84C' : '#ef4444',
                            border: `1px solid ${isSamePlan ? 'rgba(201,168,76,0.3)' : 'rgba(239,68,68,0.3)'}`
                          }}>
                            {warningMessage}
                          </div>
                        )}

                        {/* Botón */}
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          disabled={isButtonDisabled}
                          className={`plan-cta-btn${plan.is_featured ? ' plan-cta-btn--featured' : ''}`}
                          style={{
                            opacity: isButtonDisabled ? 0.5 : 1,
                            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                            ...(isHigherPlan ? {
                              background: 'linear-gradient(90deg, #C9A84C, #D4A853)',
                              border: '2px solid #C9A84C',
                              color: '#0D0D0D',
                              boxShadow: '0 4px 20px rgba(201,168,76,0.35)'
                            } : {})
                          }}>
                          {buttonText}
                        </button>

                        {/* Botón publicar — solo visible cuando el usuario ya tiene este plan */}
                        {isSamePlan && (
                          <button
                            onClick={() => navigate(`/publish?planId=${plan.id}&planNombre=${encodeURIComponent(plan.name)}&maxFotos=${plan.max_photos}`)}
                            className="mt-3 w-full py-3 rounded-xl text-sm font-bold uppercase tracking-[2px] transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
                            style={{
                              background: 'linear-gradient(90deg, #C9A84C, #f9d85b)',
                              color: '#0D0D0D',
                              boxShadow: '0 4px 20px rgba(201,168,76,0.25)'
                            }}
                          >
                            Publicar Propiedad →
                          </button>
                        )}
                      </div>
                    </SpotlightCard>
                  </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}

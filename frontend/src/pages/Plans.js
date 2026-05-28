import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Plans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [friendlyMessage, setFriendlyMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    const fetchPlans = async () => {
      try {
        const response = await api.get('/planes/');
        setPlans(response.data);
        if (!response.data || response.data.length === 0) {
          setFriendlyMessage('Próximamente nuevos planes disponibles');
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setFriendlyMessage('Próximamente nuevos planes disponibles');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!user) {
      setPendingPlan(plan);
      setShowLoginModal(true);
      return;
    }

    setSelectedPlanId(plan.id);
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    navigate('/publish', { state: { selectedPlan: plan } });
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    if (pendingPlan) {
      navigate('/login', { state: { redirect: '/publish', planId: pendingPlan.id } });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.4em] text-[#b38b1d]">Planes LUXHABITAT</p>
            <h1 className="mt-6 text-5xl md:text-6xl font-serif font-black tracking-tight text-white">Elige el plan perfecto para tu propiedad</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              Publica con elegancia, muestra tu inmueble al público correcto y aprovecha funciones premium.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#b38b1d] border-white/10 mx-auto"></div>
              <p className="mt-4 text-slate-400">Cargando planes...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-[2rem] border border-[#b38b1d]/20 bg-white/5 p-14 text-center text-lg text-slate-200 shadow-2xl shadow-black/40">
              {friendlyMessage || 'Próximamente nuevos planes disponibles'}
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const isRecommended = plans.length === 3 && index === 1;
                const isSelected = selectedPlanId === plan.id;
                const cardClasses = `rounded-[2.5rem] border p-8 shadow-2xl transition-all duration-500 ${isSelected ? 'border-[#b38b1d] bg-gradient-to-br from-[#111111] via-[#111111] to-[#1f1b0b]' : 'border-white/10 bg-[#090909] hover:border-[#b38b1d]/80 hover:bg-[#111111]'}`;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 * index }}
                    whileHover={{ y: -10 }}
                    className={cardClasses}
                  >
                    {isRecommended && (
                      <div className="mb-4 inline-flex items-center rounded-full bg-[#b38b1d]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#f6e18b]">
                        Recomendado
                      </div>
                    )}

                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h2 className="text-4xl font-black tracking-tight text-white">{plan.nombre}</h2>
                      <span className="text-sm uppercase tracking-[0.35em] text-slate-400">{plan.duracion_dias} días</span>
                    </div>

                    <p className="text-5xl font-black text-[#b38b1d] mb-8">${parseFloat(plan.precio).toLocaleString('es-CO')}</p>

                    <ul className="space-y-5 mb-10 text-sm text-slate-300">
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#b38b1d]/15 text-[#b38b1d]">✓</span>
                        Máximo {plan.max_inmuebles} inmuebles
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#b38b1d]/15 text-[#b38b1d]">✓</span>
                        Máximo {plan.max_imagenes} imágenes
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#b38b1d]/15 text-[#b38b1d]">✓</span>
                        Publicaciones por {plan.duracion_dias} días
                      </li>
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full rounded-3xl bg-gradient-to-r from-[#b38b1d] to-[#f9d85b] px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-black transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_60px_rgba(179,139,29,0.28)]"
                    >
                      Seleccionar Plan
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6">
          <div className="w-full max-w-xl rounded-[2rem] border border-[#b38b1d]/20 bg-[#080808]/95 p-8 shadow-2xl shadow-black/60">
            <div className="mb-6 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-[#b38b1d]">Acceso requerido</p>
              <h2 className="mt-4 text-3xl font-black text-white">Inicia sesión para continuar</h2>
              <p className="mt-3 text-sm text-slate-400">Debes ingresar a tu cuenta para seleccionar este plan y avanzar con la publicación.</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={handleLoginRedirect}
                className="rounded-3xl bg-[#b38b1d] px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black transition hover:bg-[#f9d85b]"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="rounded-3xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:bg-white/10"
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

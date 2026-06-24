import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const selectedPlan = location.state?.selectedPlan;
  const planName = searchParams.get('plan');
  const [user, setUser] = useState(null);

  const getPlanLevel = (planName) => {
    if (!planName) return 0;
    const name = planName.toLowerCase();
    if (name.includes('premium')) return 3;
    if (name.includes('est') || name.includes('stand')) return 2;
    if (name.includes('grati') || name.includes('free')) return 1;
    return 0;
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  }, []);

  useEffect(() => {
    if (!selectedPlan && !planName) {
      navigate('/planes');
    }
  }, [selectedPlan, planName, navigate]);

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/payments/pagos/process/', {
        plan_id: selectedPlan?.id
      });

      console.log("RESPUESTA COMPLETA:", response.data);
      console.log("payment_link existe?", !!response.data.payment_link);
      console.log("response.data:", response.data);
      
      if (response.data.payment_link) {
        console.log("Redirigiendo a Wompi:", response.data.payment_link);
        window.location.href = response.data.payment_link;
      } else {
        console.log("No hay payment_link, redirigiendo a publish");
        navigate(
          `/publish?planId=${selectedPlan.id}&planNombre=${encodeURIComponent(selectedPlan.name)}&maxFotos=${selectedPlan.max_photos}`
        );
      }
    } catch (err) {
      console.error("ERROR EN EL PAGO:", err);
      console.error("ERROR RESPONSE:", err.response);
      setError(err.response?.data?.error || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div
        className="min-h-screen flex flex-col transition-colors duration-500"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <Navbar />
        <main className="flex-grow pt-24 pb-20 px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.4em] text-[#b38b1d]">Checkout</p>
              <h1 className="mt-4 text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
                Confirma tu Pago
              </h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Plan Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`rounded-[2rem] border p-8 shadow-2xl ${
                  isDarkMode
                    ? 'border-[#b38b1d]/20 bg-[#090909]'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <h2 className="text-2xl font-black text-white mb-6">Resumen del Plan</h2>

                {selectedPlan ? (
                  <>
                    {/* Warning Message */}
                    {user?.plan_activo && (
                      getPlanLevel(selectedPlan.name) < getPlanLevel(user.plan_activo.name) && (
                        <div className="mb-6 p-4 rounded-lg text-sm text-center" style={{ 
                          backgroundColor: 'rgba(239,68,68,0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.3)'
                        }}>
                          ⚠️ Estás seleccionando un plan con menos beneficios que tu plan actual ({user.plan_activo.name}).
                        </div>
                      )
                    )}
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          Plan
                        </span>
                        <span className="text-white font-bold">{selectedPlan.name}</span>
                      </div>

                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          Duración
                        </span>
                        <span className="text-white font-bold">{selectedPlan.duration_days} días</span>
                      </div>

                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          Inmuebles
                        </span>
                        <span className="text-white font-bold">Máx. {selectedPlan.max_properties}</span>
                      </div>

                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          Imágenes
                        </span>
                        <span className="text-white font-bold">Máx. {selectedPlan.max_photos}</span>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t-2 border-[#b38b1d]/30">
                        <span className="text-lg font-bold text-white">Total a Pagar</span>
                        <span className="text-3xl font-black text-[#b38b1d]">
                          ${parseFloat(selectedPlan.price).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-[#b38b1d] mt-1">✓</span>
                        <span>Acceso completo a todas las funciones del plan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#b38b1d] mt-1">✓</span>
                        <span>Publicación por {selectedPlan.duration_days} días</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#b38b1d] mt-1">✓</span>
                        <span>Soporte prioritario incluido</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-400">Cargando información del plan...</div>
                )}
              </motion.div>

              {/* Payment Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`rounded-[2rem] border p-8 shadow-2xl ${
                  isDarkMode
                    ? 'border-[#b38b1d]/20 bg-[#090909]'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <h2 className="text-2xl font-black text-white mb-8">Información de Pago</h2>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                        💳
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Wompi</h3>
                        <p className="text-sm text-gray-400">Pago seguro</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Serás redirigido a Wompi para completar tu pago de forma segura.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(90deg, #b38b1d, #f9d85b)',
                      boxShadow: '0 25px 60px rgba(179, 139, 29, 0.28)'
                    }}
                    className="w-full py-4 text-black font-bold uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? 'Redirigiendo a Wompi...' : 'Pagar con Wompi'}
                  </motion.button>

                  <p className="text-xs text-center text-gray-500 mt-6">
                    Este es un pago seguro y encriptado.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
}

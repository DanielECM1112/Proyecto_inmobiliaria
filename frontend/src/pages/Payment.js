import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

const PAYMENT_METHODS = [
  { id: 'tarjeta', label: 'Tarjeta' },
  { id: 'pse', label: 'PSE' },
  { id: 'nequi', label: 'Nequi' }
];

export default function Payment() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const property = state.property;
  const plan = state.plan;
  const [method, setMethod] = useState('tarjeta');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!property || !plan) {
      navigate('/publish');
    }
  }, [navigate, property, plan]);

  const getAuthHeader = () => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.access ? `Bearer ${parsed.access}` : null;
  };

  const handlePayment = async (selectedMethod) => {
    setError('');
    setMessage('');
    setMethod(selectedMethod);

    const token = getAuthHeader();
    if (!token) {
      navigate('/login', { state: { redirect: '/publish', planId: plan?.id } });
      return;
    }

    setPaymentStatus('processing');

    try {
      const iniciarResponse = await api.post('/pagos/iniciar/', {
        inmueble_id: property.id,
        plan_id: plan.id,
        metodo: selectedMethod
      });

      const referencia = iniciarResponse.data?.referencia;
      if (!referencia) {
        throw new Error('No se recibió referencia de pago.');
      }

      const confirmarResponse = await api.post('/pagos/confirmar/', { referencia });

      if (confirmarResponse.data?.estado === 'aprobado') {
        setMessage('¡Inmueble publicado! Pago confirmado con éxito.');
        setPaymentStatus('success');
        setTimeout(() => {
          navigate('/properties');
        }, 1800);
        return;
      }

      setError('No se pudo confirmar el pago.');
      setPaymentStatus('failed');
    } catch (err) {
      console.error('Payment flow error:', err);
      setError(err.response?.data?.error || err.message || 'Error al procesar el pago.');
      setPaymentStatus('failed');
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="flex-grow pt-24 pb-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className={`text-5xl md:text-6xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-dark-950'}`}>
              Pago de Publicación
            </h1>
            <p className={`mt-4 max-w-2xl mx-auto text-lg leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-dark-700'}`}>
              Completa el paso final para activar tu inmueble en la plataforma.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[2.5rem] border p-10 ${isDarkMode ? 'bg-midnight-DEFAULT border-white/10 text-white' : 'bg-white border-light-200 text-dark-950'}`}>
              <h2 className="text-3xl font-bold mb-8">Resumen del Inmueble</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Título</p>
                  <p className="mt-2 text-2xl font-semibold">{property?.titulo}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Ciudad</p>
                  <p className="mt-2 text-lg">{property?.ciudad}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Dirección</p>
                  <p className="mt-2 text-lg">{property?.direccion}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Precio</p>
                  <p className="mt-2 text-2xl font-bold text-gold-600">{`$${parseFloat(property?.precio || 0).toLocaleString()}`}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[2.5rem] border p-10 ${isDarkMode ? 'bg-midnight-DEFAULT border-white/10 text-white' : 'bg-white border-light-200 text-dark-950'}`}>
              <h2 className="text-3xl font-bold mb-8">Plan Seleccionado</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Nombre</p>
                  <p className="mt-2 text-2xl font-semibold">{plan?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Duración</p>
                  <p className="mt-2 text-lg">{plan?.duracion_dias} días</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Máximo inmuebles</p>
                  <p className="mt-2 text-lg">{plan?.max_inmuebles}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Máximo imágenes</p>
                  <p className="mt-2 text-lg">{plan?.max_imagenes}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Precio del plan</p>
                  <p className="mt-2 text-2xl font-bold text-gold-600">{`$${parseFloat(plan?.precio || 0).toLocaleString()}`}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className={`mt-16 rounded-[2.5rem] border p-10 ${isDarkMode ? 'bg-midnight-DEFAULT border-white/10 text-white' : 'bg-white border-light-200 text-dark-950'}`}>
            <div className="mb-10">
              <h2 className="text-3xl font-bold">Selecciona un método de pago</h2>
              <p className="mt-3 text-gray-400">Elige la forma de pago que prefieras y confirma tu publicación.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-10">
              {PAYMENT_METHODS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePayment(item.id)}
                  className={`rounded-3xl border px-6 py-5 text-center transition-all duration-300 ${
                    method === item.id
                      ? 'border-blue-600 bg-blue-600/10 text-blue-700'
                      : isDarkMode
                        ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                        : 'border-light-200 bg-light-50 text-dark-950 hover:bg-light-100'
                  }`}
                >
                  <p className="text-xl font-semibold">{item.label}</p>
                </button>
              ))}
            </div>

            {paymentStatus === 'success' && (
              <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-6 text-emerald-700 mb-8">
                <p className="font-semibold">{message}</p>
                <p className="text-sm mt-2">Redirigiendo a propiedades...</p>
              </div>
            )}

            {paymentStatus === 'failed' && error && (
              <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-6 text-red-700 mb-8">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <button
              onClick={() => handlePayment(method)}
              disabled={paymentStatus === 'processing'}
              className="w-full rounded-3xl bg-gold-600 px-8 py-5 text-lg font-bold uppercase tracking-widest text-white transition hover:bg-gold-700 disabled:opacity-60"
            >
              {paymentStatus === 'processing' ? 'Procesando pago...' : 'Pagar ahora'}
            </button>
          </div>
        </div>
        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
}

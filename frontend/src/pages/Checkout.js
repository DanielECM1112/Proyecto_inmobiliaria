import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const selectedPlan = location.state?.selectedPlan;
  const planName = searchParams.get('plan');

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Si no hay plan seleccionado, redirigir a /planes
    if (!selectedPlan && !planName) {
      navigate('/planes');
    }
  }, [selectedPlan, planName, navigate]);

  const validateForm = () => {
    // Validar número de tarjeta (16 dígitos)
    const cardDigits = formData.cardNumber.replace(/\s/g, '');
    if (cardDigits.length !== 16 || !/^\d+$/.test(cardDigits)) {
      setError('Número de tarjeta debe tener 16 dígitos');
      return false;
    }

    // Validar nombre
    if (!formData.cardName.trim() || formData.cardName.trim().length < 3) {
      setError('Nombre debe tener al menos 3 caracteres');
      return false;
    }

    // Validar fecha de vencimiento
    if (!formData.expiryMonth || !formData.expiryYear) {
      setError('Fecha de vencimiento incompleta');
      return false;
    }

    const month = parseInt(formData.expiryMonth);
    if (month < 1 || month > 12) {
      setError('Mes debe estar entre 01 y 12');
      return false;
    }

    // Validar año (debe ser actual o futuro)
    const currentYear = new Date().getFullYear();
    const expiryYear = parseInt(`20${formData.expiryYear}`);
    if (expiryYear < currentYear) {
      setError('Tarjeta expirada');
      return false;
    }

    // Validar CVV (3 dígitos)
    if (!/^\d{3}$/.test(formData.cvv)) {
      setError('CVV debe tener 3 dígitos');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      // Solo dígitos, formato XX XX XX XX XX XX XX XX
      const digits = value.replace(/\D/g, '').slice(0, 16);
      const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData({ ...formData, [name]: formatted });
    } else if (name === 'cvv') {
      // Solo 3 dígitos
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 3) });
    } else if (name === 'expiryMonth') {
      // Solo 2 dígitos
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 2) });
    } else if (name === 'expiryYear') {
      // Solo 2 dígitos
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 2) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        card_number: formData.cardNumber.replace(/\s/g, ''),
        card_name: formData.cardName,
        expiry: `${formData.expiryMonth}/${formData.expiryYear}`,
        cvv: formData.cvv
      };

      const response = await api.post('/pagos/process/', {
        plan_id: selectedPlan?.id,
        payment_data: paymentData
      });

      if (response.data.success) {
        setSuccess('¡Pago procesado exitosamente! Redirigiendo...');
        setTimeout(() => {
          navigate(`/publish?plan=${selectedPlan?.nombre || planName}`, {
            state: { selectedPlan }
          });
        }, 2000);
      } else {
        setError(response.data.error || 'Error al procesar el pago');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                        Plan
                      </span>
                      <span className="text-white font-bold">{selectedPlan.nombre}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                        Duración
                      </span>
                      <span className="text-white font-bold">{selectedPlan.duracion_dias} días</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                        Inmuebles
                      </span>
                      <span className="text-white font-bold">Máx. {selectedPlan.max_inmuebles}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                        Imágenes
                      </span>
                      <span className="text-white font-bold">Máx. {selectedPlan.max_imagenes}</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t-2 border-[#b38b1d]/30">
                      <span className="text-lg font-bold text-white">Total a Pagar</span>
                      <span className="text-3xl font-black text-[#b38b1d]">
                        ${parseFloat(selectedPlan.precio).toLocaleString('es-CO')}
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
                      <span>Publicación por {selectedPlan.duracion_dias} días</span>
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

            {/* Payment Form */}
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

              {success && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Number */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                    className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 focus:outline-none ${
                      isDarkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#b38b1d] focus:bg-white/8'
                        : 'bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#b38b1d] focus:bg-gray-100'
                    }`}
                  />
                </div>

                {/* Card Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                    Nombre en la Tarjeta
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="JUAN PEREZ"
                    required
                    className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 focus:outline-none ${
                      isDarkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#b38b1d] focus:bg-white/8'
                        : 'bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#b38b1d] focus:bg-gray-100'
                    }`}
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      Mes
                    </label>
                    <input
                      type="text"
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleChange}
                      placeholder="MM"
                      maxLength="2"
                      required
                      className={`w-full px-3 py-4 rounded-xl border transition-all duration-300 focus:outline-none ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#b38b1d] focus:bg-white/8'
                          : 'bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#b38b1d] focus:bg-gray-100'
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      Año
                    </label>
                    <input
                      type="text"
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleChange}
                      placeholder="YY"
                      maxLength="2"
                      required
                      className={`w-full px-3 py-4 rounded-xl border transition-all duration-300 focus:outline-none ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#b38b1d] focus:bg-white/8'
                          : 'bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#b38b1d] focus:bg-gray-100'
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="3"
                      required
                      className={`w-full px-3 py-4 rounded-xl border transition-all duration-300 focus:outline-none ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#b38b1d] focus:bg-white/8'
                          : 'bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#b38b1d] focus:bg-gray-100'
                      }`}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(90deg, #b38b1d, #f9d85b)',
                    boxShadow: '0 25px 60px rgba(179, 139, 29, 0.28)'
                  }}
                  className="w-full py-4 text-black font-bold uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  {loading ? 'Procesando Pago...' : 'Confirmar Pago'}
                </motion.button>

                <p className="text-xs text-center text-gray-500 mt-6">
                  Este es un pago simulado. No se cargarán fondos reales.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

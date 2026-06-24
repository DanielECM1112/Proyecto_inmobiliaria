import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Home, Crown, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function PaymentSuccess() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);

  // Colors
  const bg = isDarkMode ? '#0D0D0D' : '#F0F0ED';
  const card = isDarkMode ? '#141414' : '#FFFFFF';
  const cardBd = isDarkMode ? '#242424' : '#E6E6E2';
  const txt = isDarkMode ? '#F0F0F0' : '#141414';
  const sub = isDarkMode ? '#8E8E8E' : '#6B6B6B';

  useEffect(() => {
    // Fetch latest user data to check if plan is active
    const fetchUser = async () => {
      try {
        const res = await api.get('/perfil/');
        const user = res.data;
        localStorage.setItem('user', JSON.stringify(user));
        if (user.plan_activo) {
          setPlan(user.plan_activo);
        }
        // Dispatch event so other components (like Navbar) refresh
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <PageWrapper>
      <div style={{ background: bg, minHeight: '100vh' }} className="flex flex-col transition-colors duration-500">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-20 px-6 md:px-8 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 md:p-12 rounded-[2rem]"
              style={{ 
                background: card, 
                border: `1px solid ${cardBd}`,
                borderTop: '1px solid rgba(201,168,76,0.28)',
              }}
            >
              {/* Success Icon */}
              <div className="flex justify-center mb-8">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ 
                    background: 'rgba(34, 197, 94, 0.1)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)' 
                  }}
                >
                  <Check size={40} style={{ color: '#4ade80' }} />
                </div>
              </div>
              
              {/* Title */}
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4" style={{ color: txt }}>
                  ¡Plan activado exitosamente!
                </h1>
                <p className="text-lg" style={{ color: sub }}>
                  Tu suscripción ha sido actualizada y ya puedes empezar a usar tus beneficios.
                </p>
              </div>
              
              {/* Plan Info */}
              {plan && (
                <div className="p-6 rounded-2xl mb-10" style={{ background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {plan.name === 'Premium' && (
                        <Crown size={20} style={{ color: '#C9A84C' }} />
                      )}
                      <h2 className="text-2xl font-serif font-bold" style={{ color: txt }}>
                        {plan.name}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-serif font-bold" style={{ color: '#C9A84C' }}>
                        ${parseFloat(plan.price).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" style={{ borderTop: `1px solid ${cardBd}` }}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] mb-1" style={{ color: sub }}>
                        Propiedades
                      </p>
                      <p className="font-medium" style={{ color: txt }}>
                        Hasta {plan.max_properties}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] mb-1" style={{ color: sub }}>
                        Fotos por propiedad
                      </p>
                      <p className="font-medium" style={{ color: txt }}>
                        Hasta {plan.max_photos}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/publish')}
                  className="flex-1 py-4 text-center font-bold uppercase tracking-[2px] rounded-xl transition-all duration-300"
                  style={{ 
                    background: 'linear-gradient(90deg, #C9A84C, #f9d85b)',
                    color: '#0D0D0D',
                    boxShadow: '0 15px 40px rgba(201, 168, 76, 0.3)'
                  }}
                >
                  Publicar Propiedad
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 py-4 px-6 font-bold uppercase tracking-[2px] rounded-xl transition-all duration-300"
                  style={{ 
                    border: `1px solid ${cardBd}`,
                    color: txt
                  }}
                >
                  <Home size={16} />
                  Ir al Inicio
                </motion.button>
              </div>
              
              {/* Profile Link */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-80"
                  style={{ color: '#C9A84C' }}
                >
                  Ver mi perfil y plan
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
}

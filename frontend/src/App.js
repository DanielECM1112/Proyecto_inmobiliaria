import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Plans from './pages/Plans';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import About from './pages/About';
import Location from './pages/Location';
import ScrollToTop from './components/ScrollToTop';
import PublishProperty from './pages/PublishProperty';
import EditProperty from './pages/EditProperty';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Profile from './pages/Profile';
import PaymentSuccess from './pages/PaymentSuccess';
import './styles/lux-animations.css';

// ← FASE 1: Base Premium
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import './styles/lux-base-premium.css';
import './styles/lux-typography.css';
import './styles/lux-scroll-reveal.css';
// lux-cursor.css se importa dentro de CustomCursor.js automáticamente

// SERVICIOS
import Buying from './pages/services/Buying';
import Selling from './pages/services/Selling';

// IMPORTACIÓN DE PANEL ADMINISTRATIVO
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminRoute from './admin/AdminRoute';

function App() {
  useEffect(() => {
    function onMessage(e) {
      const allowed = ['http://localhost:8000', 'http://127.0.0.1:8000'];
      if (!allowed.includes(e.origin)) return;
      const data = e.data;
      if (data && data.type === 'social_login' && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || {}));
        
        // Verificar si es login de admin y redirigir apropiadamente
        const isAdminLogin = sessionStorage.getItem('isAdminLogin') === 'true';
        if (isAdminLogin) {
          const user = data.user || {};
          const rol = user.rol?.toString().toLowerCase();
          const isAdmin = rol === 'admin' || rol === 'administrador' || user.is_staff;
          if (isAdmin) {
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
          sessionStorage.removeItem('isAdminLogin');
        } else {
          window.location.href = '/';
        }
      }
    }

    window.addEventListener('message', onMessage);

    // Fallback: si el backend redirige con fragmento '#token=...'
    if (window.location.hash) {
      const hash = new URLSearchParams(window.location.hash.replace('#',''));
      const token = hash.get('token');
      const userStr = hash.get('user');
      if (token) {
        localStorage.setItem('token', token);
        let user = {};
        try { 
          user = JSON.parse(decodeURIComponent(userStr));
          localStorage.setItem('user', JSON.stringify(user)); 
        } catch(e){}
        
        window.location.hash = '';
        
        // Verificar si es login de admin y redirigir apropiadamente
        const isAdminLogin = sessionStorage.getItem('isAdminLogin') === 'true';
        if (isAdminLogin) {
          const rol = user.rol?.toString().toLowerCase();
          const isAdmin = rol === 'admin' || rol === 'administrador' || user.is_staff;
          if (isAdmin) {
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
          sessionStorage.removeItem('isAdminLogin');
        } else {
          window.location.href = '/';
        }
      }
    }

    return () => window.removeEventListener('message', onMessage);
  }, []);
  return (
    <SmoothScroll>
      <Router>
        {/* <CustomCursor /> */}
        <ScrollToTop />
        <div className="App min-h-screen">
          <Routes>
            {/* Rutas del cliente (creadas por Manuel) */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/properties/:id/edit" element={<EditProperty />} />
            <Route path="/planes" element={<Plans />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/publish" element={<PublishProperty />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/about" element={<About />} />
            <Route path="/location" element={<Location />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Rutas Legales */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />

            {/* Rutas de Servicios */}
            <Route path="/services/buying" element={<Buying />} />
            <Route path="/services/selling" element={<Selling />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
          </Routes>
        </div>

        {/* Botón WhatsApp Flotante */}
        <a
          href="https://wa.me/573223147352"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-2xl transition-all hover:scale-110"
          aria-label="WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.114 1.534 5.836L.054 23.25a.75.75 0 00.916.916l5.414-1.48A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.947-1.35l-.354-.21-3.668 1.002 1.002-3.668-.21-.354A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
          </svg>
        </a>
      </Router>
    </SmoothScroll>
  );
}

export default App;

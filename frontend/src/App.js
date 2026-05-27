import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Properties from './pages/Properties';
import About from './pages/About';
import Location from './pages/Location';
import ScrollToTop from './components/ScrollToTop';
import PublishProperty from './pages/PublishProperty';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';

// SERVICIOS
import Buying from './pages/services/Buying';
import Selling from './pages/services/Selling';

// IMPORTACIÓN DE PANEL ADMINISTRATIVO
import AdminLayout from './admin/AdminLayout';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App min-h-screen">
        <Routes>
          {/* Rutas del cliente (creadas por Manuel) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />
          <Route path="/publish" element={<PublishProperty />} />
          
          {/* Rutas Legales */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* Rutas de Servicios */}
          <Route path="/services/buying" element={<Buying />} />
          <Route path="/services/selling" element={<Selling />} />

          {/* NUEVA RUTA EXCLUSIVA DE ADMINISTRACIÓN */}
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

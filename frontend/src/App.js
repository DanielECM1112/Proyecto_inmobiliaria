import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import About from './pages/About';
import Location from './pages/Location';
import ScrollToTop from './components/ScrollToTop';

// SERVICIOS
import Buying from './pages/services/Buying';
import Selling from './pages/services/Selling';
import Rentals from './pages/services/Rentals';
import Consulting from './pages/services/Consulting';
import Appraisals from './pages/services/Appraisals';
import Legal from './pages/services/Legal';

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
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />

          {/* Rutas de Servicios */}
          <Route path="/services/buying" element={<Buying />} />
          <Route path="/services/selling" element={<Selling />} />
          <Route path="/services/rentals" element={<Rentals />} />
          <Route path="/services/consulting" element={<Consulting />} />
          <Route path="/services/appraisals" element={<Appraisals />} />
          <Route path="/services/legal" element={<Legal />} />

          {/* NUEVA RUTA EXCLUSIVA DE ADMINISTRACIÓN */}
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import About from './pages/About';
import Location from './pages/Location';

// IMPORTACIÓN DE  PANEL ADMINISTRATIVO
import AdminLayout from './admin/AdminLayout';

function App() {
  return (
    <Router>
      <div className="App min-h-screen">
        <Routes>
          {/* Rutas del cliente (creadas por Manuel) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />

          {/* NUEVA RUTA EXCLUSIVA DE ADMINISTRACIÓN */}
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

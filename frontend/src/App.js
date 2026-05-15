import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Properties from './pages/Properties';
import About from './pages/About';
import Location from './pages/Location';

function App() {
  return (
    <Router>
      <div className="App min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

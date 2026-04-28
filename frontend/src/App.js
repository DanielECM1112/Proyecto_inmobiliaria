import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Componentes temporales para Login y Register
const Login = () => <div className="p-10 text-center text-2xl">Página de Login (En construcción)</div>;
const Register = () => <div className="p-10 text-center text-2xl">Página de Registro (En construcción)</div>;

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

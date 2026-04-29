import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">Inmobiliaria</Link>
        </div>
        <div className="space-x-4">
          <Link 
            to="/" 
            className="text-white hover:text-blue-200 transition-colors"
          >
            Inicio
          </Link>
          <Link 
            to="/login" 
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
          >
            Registro
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

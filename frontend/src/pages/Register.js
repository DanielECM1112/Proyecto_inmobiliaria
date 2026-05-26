import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/users/register/", formData);
      setSuccess("¡Registro exitoso! Redirigiendo...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      isDarkMode ? "bg-primary-dark" : "bg-light-100"
    }`}>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-8 pt-32">
        <div className={`max-w-3xl w-full rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500 border ${
          isDarkMode 
            ? "bg-midnight-DEFAULT border-white/5" 
            : "bg-white border-light-200"
        }`}>
          <div className="p-12 md:p-16">
            <div className="text-center mb-12">
              <h2 className={`text-5xl font-serif font-bold mb-4 tracking-tight transition-colors duration-500 ${
                isDarkMode ? "text-white" : "text-dark-950"
              }`}>Crear Cuenta</h2>
              <p className={`text-xl font-light transition-colors duration-500 ${
                isDarkMode ? "text-gray-400" : "text-dark-700"
              }`}>Únete a nuestra comunidad exclusiva de inversión</p>
              <div className="w-16 h-1 bg-gold-600 mx-auto mt-6 rounded-full"></div>
            </div>

            {error && (
              <div className={`border-l-4 p-6 rounded-2xl mb-8 flex items-center gap-4 transition-all duration-300 ${
                isDarkMode 
                  ? "bg-red-500/10 border-red-500/50 text-red-400" 
                  : "bg-red-50 border-red-500 text-red-700"
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">{typeof error === 'object' ? JSON.stringify(error) : error}</span>
              </div>
            )}

            {success && (
              <div className={`border-l-4 p-6 rounded-2xl mb-8 flex items-center gap-4 transition-all duration-300 ${
                isDarkMode 
                  ? "bg-green-500/10 border-green-500/50 text-green-400" 
                  : "bg-green-50 border-green-500 text-green-700"
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors duration-500 ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}>Nombre</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-8 py-5 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg font-medium ${
                      isDarkMode
                        ? "bg-white/8 border-white/15 text-white placeholder:text-slate-500 focus:border-gold-500/50 focus:bg-white/12"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-gold-600 focus:ring-2 focus:ring-gold-600/10"
                    }`}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors duration-500 ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}>Apellido</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-8 py-5 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg font-medium ${
                      isDarkMode
                        ? "bg-white/8 border-white/15 text-white placeholder:text-slate-500 focus:border-gold-500/50 focus:bg-white/12"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-gold-600 focus:ring-2 focus:ring-gold-600/10"
                    }`}
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-500" : "text-dark-400"
                }`}>Usuario</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-8 py-5 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg font-medium ${
                    isDarkMode
                      ? "bg-white/5 border-white/5 text-white placeholder:text-gray-600 focus:border-gold-500/50"
                      : "bg-light-50 border-light-200 text-dark-950 placeholder:text-dark-400 focus:bg-white focus:border-gold-600"
                  }`}
                  placeholder="Elige un usuario"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-500" : "text-dark-400"
                }`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-8 py-5 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg font-medium ${
                    isDarkMode
                      ? "bg-white/5 border-white/5 text-white placeholder:text-gray-600 focus:border-gold-500/50"
                      : "bg-light-50 border-light-200 text-dark-950 placeholder:text-dark-400 focus:bg-white focus:border-gold-600"
                  }`}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-500" : "text-dark-400"
                }`}>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-8 py-5 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg font-medium ${
                    isDarkMode
                      ? "bg-white/5 border-white/5 text-white placeholder:text-gray-600 focus:border-gold-500/50"
                      : "bg-light-50 border-light-200 text-dark-950 placeholder:text-dark-400 focus:bg-white focus:border-gold-600"
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className={`w-full px-8 py-6 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest ${
                  isDarkMode
                    ? "bg-white text-dark-950 hover:bg-gray-100"
                    : "bg-gold-600 text-white hover:bg-gold-700 shadow-gold-600/20"
                }`}
              >
                {loading ? "Creando cuenta..." : "Registrarme"}
              </motion.button>
            </form>

            <div className="mt-12 text-center space-y-6">
              <p className={`text-lg font-light transition-colors duration-500 ${
                isDarkMode ? "text-gray-400" : "text-dark-700"
              }`}>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className={`font-bold transition-colors duration-500 ${
                  isDarkMode ? "text-gold-400 hover:text-gold-300" : "text-gold-600 hover:text-gold-700"
                }`}>
                  Inicia sesión aquí
                </Link>
              </p>
              <Link to="/" className={`inline-block font-medium transition-colors duration-500 ${
                isDarkMode ? "text-gray-500 hover:text-gray-400" : "text-dark-400 hover:text-dark-950"
              }`}>
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

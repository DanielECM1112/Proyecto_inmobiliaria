import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [showPassword, setShowPassword] = useState(false);
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
      isDarkMode ? "bg-[#0a0e1a]" : "bg-light-100"
    }`}>
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="min-h-[calc(100vh-80px)] flex">
          {/* Left side - Image/Branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative overflow-hidden" style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=1500&fit=crop)' 
          }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
            <div className="relative z-10 flex flex-col justify-end p-12 w-full">
              <div className="mb-12">
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-8">
                  <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h1 className="text-5xl font-serif font-bold text-white mb-4">
                  LUX<span className="text-gray-300 font-light">HABITAT</span>
                </h1>
                <p className="text-xl text-gray-300 font-light">
                  Con LUXHABITAT, tu hogar de ensueño está a un click de distancia
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Encuentra la propiedad perfecta para ti y tu familia
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0e1a] overflow-y-auto">
            <div className="w-full max-w-md py-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-white mb-3">
                  Comienza tu viaje hacia tu hogar ideal
                </h2>
              </div>

              {error && (
                <div className="border border-red-500/30 bg-red-500/10 p-4 rounded-xl mb-8 text-red-400 text-sm">
                  {typeof error === 'object' ? JSON.stringify(error) : error}
                </div>
              )}

              {success && (
                <div className="border border-green-500/30 bg-green-500/10 p-4 rounded-xl mb-8 text-green-400 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8B5CF6] focus:bg-white/8 transition-all duration-300"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8B5CF6] focus:bg-white/8 transition-all duration-300"
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8B5CF6] focus:bg-white/8 transition-all duration-300"
                      placeholder="tucorreo@ejemplo.com"
                      required
                    />
                    <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8B5CF6] focus:bg-white/8 transition-all duration-300"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div className="h-full w-1/4 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] rounded-full" />
                  </div>
                </div>

                <div className="flex justify-center gap-4 py-2">
                  <button type="button" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all" aria-label="Registrarse con Google">
                    <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M43.6 20.4H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-7 0-12.7-5.7-12.7-12.7S17 10.7 24 10.7c3.2 0 6 1.2 8.2 3.2l5.7-5.7C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.6z" fill="#EA4335"/>
                      <path d="M6.3 14.1l6.6 4.8C14.9 15.5 19 12 24 12c3.2 0 6 1.2 8.2 3.2l5.7-5.7C34.6 5.1 29.6 3 24 3 16 3 9.1 7.6 6.3 14.1z" fill="#FBBC05"/>
                      <path d="M24 44c5.3 0 10-1.8 13.7-4.9l-6.3-5.1C28.7 33.9 26.5 34.7 24 34.7c-5.3 0-9.8-3.1-11.6-7.6l-6.8 5.2C8.2 39.9 15.6 44 24 44z" fill="#34A853"/>
                      <path d="M43.6 20.4H42V20H24v8h11.3c-1 2.9-3 5.3-5.7 7.1-1.3.9-2.8 1.6-4.3 2.1 5.4 0 10-1.8 13.7-4.9 0 0 0 0 0 0 2-1.6 3.6-3.8 4.6-6.3.1-.3.2-.7.3-1.1z" fill="#1877F2" opacity="0"/>
                    </svg>
                  </button>
                  <button type="button" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all" aria-label="Registrarse con Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="4" fill="#1877F2"/>
                      <path d="M15 8.5h-1.3c-.3 0-.8.2-.8.9V10h2.1l-.3 2h-1.8v6h-2.1v-6H9.7v-2h1.2v-1.2c0-1.2.7-2.1 2-2.1H15v2z" fill="#fff"/>
                    </svg>
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  style={{background: 'linear-gradient(90deg, var(--accent-gold-dark), var(--accent-gold))', boxShadow: 'var(--shadow-gold)'}}
                  className="w-full py-4 text-white font-bold uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/login" className="text-white font-semibold hover:text-[#8B5CF6]">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

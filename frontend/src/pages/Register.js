import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api, { BACKEND_ORIGIN } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageWrapper from "../components/PageWrapper";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();



  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const social = params.get('social');
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
    if (social === 'google') {
      setInfoMessage('No tienes cuenta registrada con Google. Por favor completa el registro.');
    } else if (social) {
      setInfoMessage('No tienes cuenta registrada con este proveedor social. Completa el registro para continuar.');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = {
        nombre: `${formData.first_name} ${formData.last_name}`.trim(),
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm
      };
      const res = await api.post('/auth/register/', payload);
      // Si el backend devuelve token (registro normal o social), guardarlo y redirigir como usuario logueado
      const data = res.data || {};
      if (data.access || data.token) {
        const token = data.access || data.token;
        localStorage.setItem('token', token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('¡Registro exitoso! Iniciando sesión...');
        setTimeout(() => navigate('/'), 800);
        return;
      }

      setSuccess("¡Registro exitoso! Redirigiendo a iniciar sesión...");
      setTimeout(() => navigate('/login?redirect=/publish'), 1200);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        if (typeof data === 'string') setError(data);
        else if (data.email) setError(data.email[0]);
        else if (data.password) setError(data.password[0]);
        else if (data.non_field_errors) setError(data.non_field_errors[0]);
        else if (data.detail) setError(data.detail);
        else {
          const firstKey = Object.keys(data)[0];
          const firstVal = data[firstKey];
          setError(Array.isArray(firstVal) ? firstVal[0] : firstVal);
        }
      } else {
        setError("Error al registrarse. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Estilos reutilizables para inputs según el tema
  const inputStyle = {
    backgroundColor: isDarkMode ? '#111111' : '#F5F5F0',
    borderColor: isDarkMode ? '#2b2b2b' : '#D5D5D0',
    color: isDarkMode ? '#ffffff' : '#0D0D0D',
  };

  const inputClass = `w-full px-5 py-4 rounded-xl border focus:outline-none focus:border-[#C9A84C] transition-all duration-300`;

  return (
    <PageWrapper>
      <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#0D0D0D]' : 'bg-[#FAFAF7]'}`}>
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="min-h-[calc(100vh-80px)] flex">

            {/* Left side - Image/Branding */}
            <div
              className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative overflow-hidden"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=1500&fit=crop)' }}
            >
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
              </div>
            </div>

            {/* Right side - Form */}
            <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto transition-colors duration-500 ${
              isDarkMode ? 'bg-[#050816]' : 'bg-white'
            }`}>
              <div className="w-full max-w-md py-8">

                <div className="text-center mb-8">
                  <h2 className={`text-3xl font-serif font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-[#0D0D0D]'}`}>
                    Crea tu cuenta
                  </h2>
                  <p className={isDarkMode ? 'text-[#cfcfcf]' : 'text-[#555555]'}>
                    Únete a la plataforma inmobiliaria más exclusiva
                  </p>
                  {infoMessage && (
                    <p className="mt-3 text-sm text-yellow-300">{infoMessage}</p>
                  )}
                </div>

                {error && (
                  <div className="border border-red-500/30 bg-red-500/10 p-4 rounded-xl mb-6 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="border border-green-500/30 bg-green-500/10 p-4 rounded-xl mb-6 text-green-400 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[2px] text-[#C9A84C]">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[2px] text-[#C9A84C]">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-[#C9A84C]">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="tucorreo@ejemplo.com"
                        required
                      />
                      <FaEnvelope className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#8f8f8f]' : 'text-[#AAAAAA]'}`} />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-[#C9A84C]">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#8f8f8f] hover:text-gray-400' : 'text-[#AAAAAA] hover:text-[#555555]'}`}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-[#C9A84C]">
                      Confirmar contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleChange}
                      className={inputClass}
                      style={inputStyle}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {/* Botón */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(90deg, #C9A84C, #D4A853)',
                      boxShadow: '0 4px 20px rgba(201,168,76,0.35)'
                    }}
                    className="w-full py-4 text-white font-bold uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50 btn-shimmer"
                  >
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                  </motion.button>
                </form>

                {/* Separador */}
                <div className="flex items-center gap-4 mt-6">
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                  <span className={`text-[11px] uppercase tracking-widest font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    o regístrate con
                  </span>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                </div>

                {/* Botones sociales */}
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => window.location.href = `${BACKEND_ORIGIN}/accounts/google/login/?process=signup`}
                    className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border font-semibold text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'border-white/15 bg-white/5 text-white hover:bg-white/10'
                        : 'border-gray-200 bg-white text-slate-800 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    <FcGoogle size={20} />
                    Continuar con Google
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-[#777777]'}`}>
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      to="/login"
                      className={`font-semibold hover:text-[#C9A84C] transition-colors ${isDarkMode ? 'text-white' : 'text-[#0D0D0D]'}`}
                    >
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
    </PageWrapper>
  );
}
import { useState, useEffect } from "react"; // 👈 Añadimos useEffect
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import api, { BACKEND_ORIGIN } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageWrapper from "../components/PageWrapper";
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isDarkMode } = useTheme();

  const redirectPath = searchParams.get('redirect') || location.state?.redirect || '/';



  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post('/auth/login/', formData);
      const data = response.data;
      if (data.access) localStorage.setItem('token', data.access);
      else if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('storage'));

      const planGuardado = localStorage.getItem('planSeleccionado');
      if (planGuardado && redirectPath === '/planes') {
        localStorage.removeItem('planSeleccionado');
        const plan = JSON.parse(planGuardado);
        const loggedUser = data.user || {};
        const isAdmin = loggedUser.is_staff === true || loggedUser.rol === 'admin';
        if (isAdmin) {
          navigate(`/publish?planId=${plan.id}&planNombre=Plan+Admin&maxFotos=999`);
        } else if (parseFloat(plan.price) === 0) {
          navigate(`/publish?planId=${plan.id}&planNombre=${encodeURIComponent(plan.name)}&maxFotos=${plan.max_photos}`);
        } else {
          navigate(`/checkout?planId=${plan.id}&planNombre=${encodeURIComponent(plan.name)}&precio=${plan.price}&maxFotos=${plan.max_photos}`);
        }
        return;
      }

      navigate(redirectPath);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        if (data.detail) setError(data.detail);
        else if (data.non_field_errors) setError(data.non_field_errors[0]);
        else if (data.error) setError(data.error);
        else if (data.email) setError(data.email[0]);
        else setError("Credenciales inválidas. Verifica tu correo y contraseña.");
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

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
            <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 transition-colors duration-500 ${
              isDarkMode ? 'bg-[#050816]' : 'bg-white'
            }`}>
              <div className="w-full max-w-md">

                <div className="text-center mb-12">
                  <h2 className={`text-3xl font-serif font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-[#0D0D0D]'}`}>
                    Bienvenido de nuevo
                  </h2>
                  <p className={isDarkMode ? 'text-[#cfcfcf]' : 'text-[#555555]'}>
                    Ingresa tus credenciales para continuar
                  </p>
                </div>

                {error && (
                  <div className="border border-red-500/30 bg-red-500/10 p-4 rounded-xl mb-8 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
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
                    {loading ? "Verificando..." : "Iniciar Sesión"}
                  </motion.button>
                </form>

                <div className="mt-8">
                  <p className={`text-sm mb-4 text-center ${isDarkMode ? 'text-gray-500' : 'text-[#777777]'}`}>
                    O inicia sesión con
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      type="button"
                      onClick={() => window.location.href = `${BACKEND_ORIGIN}/accounts/google/login/?process=login`}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 border rounded-xl transition-colors duration-300 hover:border-[#C9A84C]"
                    >
                      <FaGoogle className="text-red-500" />
                      <span className="text-sm font-semibold">Google</span>
                    </button>
                    
                    {/* 👇 BOTÓN DE FACEBOOK ACTUALIZADO */}
                    <button
                      type="button"
                      onClick={() => window.location.href = `${BACKEND_ORIGIN}/accounts/facebook/login/?process=login`}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 border rounded-xl transition-colors duration-300 hover:border-[#C9A84C]"
                    >
                      <FaFacebookF className="text-blue-600" />
                      <span className="text-sm font-semibold">Facebook</span>
                    </button>
                  </div>
                </div>

                <div className="mt-10 text-center">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-[#777777]'}`}>
                    ¿No tienes una cuenta?{" "}
                    <Link
                      to="/register"
                      className={`font-semibold hover:text-[#C9A84C] transition-colors ${isDarkMode ? 'text-white' : 'text-[#0D0D0D]'}`}
                    >
                      Registrarse
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
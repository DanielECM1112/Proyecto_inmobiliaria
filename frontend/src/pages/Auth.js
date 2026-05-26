import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post("http://localhost:8000/api/login/", {
          username: formData.email,
          password: formData.password
        });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        const response = await axios.post("http://localhost:8000/api/register/", {
          ...formData,
          username: formData.email
        });
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
      }
    } catch (err) {
      let errorMsg = "Error al procesar la solicitud";
      
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (typeof err.response.data === 'object') {
          const errors = Object.entries(err.response.data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val[0] : val}`)
            .join(", ");
          errorMsg = errors;
        } else {
          errorMsg = "Datos inválidos. Por favor verifica tu información.";
        }
      } else if (err.message === "Network Error") {
        errorMsg = "Error de conexión. Asegúrate de que el servidor esté corriendo.";
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    const urls = {
      google: "http://localhost:8000/accounts/google/login/",
      facebook: "http://localhost:8000/accounts/facebook/login/"
    };

    const url = urls[provider] || "/";
    const win = window.open(url, "_blank", "width=600,height=700");

    const timer = setInterval(() => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed) {
            clearInterval(timer);
            if (win) win.close();
            navigate("/");
          }
        } catch (e) {
          // ignore parse errors
        }
      }
      if (win && win.closed) clearInterval(timer);
    }, 1000);
  };

  const handlePasswordReset = async (e) => {
    e && e.preventDefault();
    setResetError("");
    setResetSuccess("");
    setResetLoading(true);
    try {
      await axios.post("http://localhost:8000/api/password_reset/", { email: resetEmail });
      setResetSuccess("Se envió un correo con instrucciones para restablecer la contraseña.");
      setResetEmail("");
    } catch (err) {
      let m = "Error al solicitar restablecimiento.";
      if (err.response?.data?.email) m = `Correo: ${err.response.data.email}`;
      else if (err.response?.data?.detail) m = err.response.data.detail;
      else if (err.message === "Network Error") m = "Error de conexión. Asegúrate de que el servidor esté corriendo.";
      setResetError(m);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-stretch pt-24">
      {/* Imagen de Fondo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-950/70 to-black/95" />
        <div className="relative z-20 flex flex-col justify-end p-16 w-full">
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-9 h-9 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter">
                LUX<span className="text-gray-400">HABITAT</span>
              </h1>
            </div>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Con LUXHABITAT, tu hogar de ensueño está a un click de distancia
            </h2>
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-12">
              Encuentra la propiedad perfecta para ti y tu familia
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex flex-col bg-gray-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 pt-32">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
              </h2>
              <p className="text-lg text-gray-400 font-medium">
                {isLogin ? "Ingresa tus credenciales para continuar" : "Comienza tu viaje hacia tu hogar ideal"}
              </p>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-500/30 text-red-300 p-6 rounded-2xl mb-8 flex items-center gap-4">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                      placeholder="Tu nombre"
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                      placeholder="Tu apellido"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 pr-14 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="tucorreo@ejemplo.com"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-6 py-4 pr-14 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPass ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <div className="flex gap-2 mt-3">
                    <div className="h-1 flex-1 rounded-full bg-gray-800">
                      <div className="h-1 w-1/2 rounded-full bg-violet-500" />
                    </div>
                    <div className="h-1 flex-1 rounded-full bg-gray-800" />
                    <div className="h-1 flex-1 rounded-full bg-gray-800" />
                    <div className="h-1 flex-1 rounded-full bg-gray-800" />
                  </div>
                )}
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-violet-500 focus:ring-violet-500/20" />
                    <span>Recordarme</span>
                  </label>
                  <button type="button" onClick={() => setShowResetModal(true)} className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  aria-label="Iniciar sesión con Google"
                  className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 533.5 544.3" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                    <path d="M533.5 278.4c0-17.5-1.4-34.3-4.1-50.6H272v95.7h146.9c-6.3 34-25.1 62.9-53.6 82.1v68.1h86.8c50.9-46.9 80.5-116 80.5-195.3z" fill="#4285f4"/>
                    <path d="M272 544.3c72.6 0 133.6-24.1 178.2-65.5l-86.8-68.1c-24.1 16.2-55 25.9-91.4 25.9-70.3 0-129.8-47.5-151.2-111.4H28.8v69.8c44.9 88.3 137.3 149.3 243.2 149.3z" fill="#34a853"/>
                    <path d="M120.8 324.9c-10.6-31.2-10.6-64.8 0-96H28.8v-69.8C-17.5 209.8-17.5 334.5 28.8 428.9l92-69.8z" fill="#fbbc04"/>
                    <path d="M272 107.7c39.5-.6 77.6 13.9 106.6 39.3l79.9-79.9C404.6 24.4 343 0 272 0 166.1 0 73.7 60.9 28.8 149.3l92 69.8C142.2 155.1 201.7 107.7 272 107.7z" fill="#ea4335"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth('facebook')}
                  aria-label="Iniciar sesión con Facebook"
                  className="w-14 h-14 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.49v-9.294H9.692V11.01h3.122V8.412c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.312h3.587l-.467 3.696h-3.12V24h6.116C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z"/>
                  </svg>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white py-5 rounded-xl font-black text-lg uppercase tracking-widest transition-all transform hover:scale-[1.02] shadow-xl shadow-violet-900/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (isLogin ? "Verificando..." : "Creando cuenta...") : (isLogin ? "Iniciar sesión" : "Crear cuenta")}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-400">
              <span className="text-sm">
                {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors"
              >
                {isLogin ? "Registrarse" : "Iniciar sesión"}
              </button>
            </div>

            {showResetModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60" onClick={() => setShowResetModal(false)} />
                <div className="relative w-full max-w-md bg-gray-900 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Restablecer contraseña</h3>
                  {resetError && <p className="text-sm text-red-400 mb-2">{resetError}</p>}
                  {resetSuccess && <p className="text-sm text-green-400 mb-2">{resetSuccess}</p>}
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Ingresa tu correo"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white"
                      required
                    />
                    <div className="flex gap-3 justify-end">
                      <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 rounded-xl bg-gray-700 text-white">Cerrar</button>
                      <button type="submit" disabled={resetLoading} className="px-4 py-2 rounded-xl bg-violet-600 text-white">{resetLoading ? 'Enviando...' : 'Enviar correo'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                Al continuar, aceptas nuestros <a href="#" className="text-violet-400 hover:text-violet-300">Términos de servicio</a> y <a href="#" className="text-violet-400 hover:text-violet-300">Política de privacidad</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

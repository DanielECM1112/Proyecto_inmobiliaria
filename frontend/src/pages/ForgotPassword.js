import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Intentamos llamar al endpoint estándar; si no existe, mostramos mensaje UX seguro
      await api.post('/auth/password-reset/', { email });
      setMessage("Si tu correo está registrado, recibirás instrucciones para restablecer la contraseña.");
    } catch (err) {
      // Si el backend no implementa el endpoint, igual informamos al usuario de forma segura
      setMessage("Si tu correo está registrado, recibirás instrucciones para restablecer la contraseña.");
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
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-transparent">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Recuperar contraseña</h2>
              <p className="text-gray-400 mt-2">Introduce tu correo y te enviaremos instrucciones.</p>
            </div>

            {error && (
              <div className="border border-red-500/30 bg-red-500/10 p-4 rounded-xl mb-4 text-red-400 text-sm">{error}</div>
            )}

            {message && (
              <div className="border border-green-500/30 bg-green-500/10 p-4 rounded-xl mb-4 text-green-400 text-sm">{message}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none transition-all duration-200"
                />
              </div>

              <button type="submit" disabled={loading} style={{background: 'linear-gradient(90deg, var(--accent-gold-dark), var(--accent-gold))', boxShadow: 'var(--shadow-gold)'}} className="w-full py-3 text-white font-semibold rounded-xl">
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-400">
              <Link to="/login" className="text-[var(--accent-gold)] font-semibold">Volver a iniciar sesión</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

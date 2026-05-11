import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      await axios.post("http://localhost:8000/api/register/", formData);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-8 pt-32">
        <div className="max-w-3xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="p-12 md:p-16">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Crear Cuenta</h2>
              <p className="text-xl text-gray-500 font-medium">Únete a nuestra comunidad exclusiva</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl mb-8 flex items-center gap-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">{typeof error === 'object' ? JSON.stringify(error) : error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-6 rounded-2xl mb-8 flex items-center gap-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-300 text-lg font-bold"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Apellido</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-300 text-lg font-bold"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Usuario</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-300 text-lg font-bold"
                  placeholder="Elige un usuario"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-300 text-lg font-bold"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-300 text-lg font-bold"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white px-8 py-6 rounded-2xl text-xl font-black hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.01] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                {loading ? "Creando cuenta..." : "Registrarme"}
              </button>
            </form>

            <div className="mt-12 text-center space-y-4">
              <p className="text-lg text-gray-500 font-medium">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-gray-900 font-black hover:underline decoration-4">
                  Inicia sesión aquí
                </Link>
              </p>
              <Link to="/" className="inline-block text-gray-400 font-bold hover:text-gray-900 transition-colors">
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

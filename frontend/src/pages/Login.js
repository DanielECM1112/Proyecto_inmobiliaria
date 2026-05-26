import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username: formData.email,
        password: formData.password
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      let errorMsg = "Error al iniciar sesi\u00f3n";
      
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.message === "Network Error") {
        errorMsg = "Error de conexi\u00f3n. Aseg\u00farate de que el servidor est\u00e9 corriendo.";
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-8 pt-32">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="hidden md:flex md:w-1/2 items-center justify-center">
            <img
              src="https://i.pinimg.com/736x/e7/9e/9d/e79e9d1beb8a38f5fdab5d7574e5050f.jpg"
              alt="Bienvenida"
              className="w-full h-full object-cover rounded-l-[3rem]"
            />
          </div>
          <div className="w-full md:w-1/2 p-12 md:p-16">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Iniciar Sesión</h2>
              <p className="text-xl text-gray-500 font-medium">Bienvenido de nuevo a tu portal inmobiliario</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl mb-8 flex items-center gap-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-300 text-lg font-bold"
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
                  Contraseña
                </label>
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
                className="w-full bg-gray-900 text-white px-8 py-6 rounded-2xl text-xl font-black hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                {loading ? "Verificando..." : "Ingresar"}
              </button>
            </form>

            <div className="mt-12 text-center space-y-4">
              <p className="text-lg text-gray-500 font-medium">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-gray-900 font-black hover:underline decoration-4">
                  Regístrate ahora
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

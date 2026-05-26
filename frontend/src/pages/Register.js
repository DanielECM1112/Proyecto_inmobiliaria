import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const [formData, setFormData] = useState({
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
      const payload = { ...formData, username: formData.email };
      await axios.post("http://localhost:8000/api/register/", payload);
      setSuccess("¡Registro exitoso! Redirigiendo...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      let errorMsg = "Error al registrarse";
      
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.username) {
          errorMsg = `Correo: ${err.response.data.username}`;
        } else if (err.response.data.email) {
          errorMsg = `Correo: ${err.response.data.email}`;
        } else if (err.response.data.password) {
          errorMsg = `Contraseña: ${err.response.data.password}`;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else {
          errorMsg = "Datos inv\u00e1lidos. Por favor verifica tu informaci\u00f3n.";
        }
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
        <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="hidden md:flex md:w-1/2 items-center justify-center">
            <img
              src="https://i.pinimg.com/736x/e7/9e/9d/e79e9d1beb8a38f5fdab5d7574e5050f.jpg"
              alt="Registro"
              className="w-full h-full object-cover rounded-l-[3rem]"
            />
          </div>
          <div className="w-full md:w-1/2 p-12 md:p-16">
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

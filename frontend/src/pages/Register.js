import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

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
      setSuccess("Registro exitoso! Redirigiendo a inicio de sesión...");
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <Navbar />
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-10 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Crear Cuenta</h2>
          <p className="text-lg text-gray-600">Únete a nuestra comunidad inmobiliaria</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 text-lg">
            {typeof error === 'object' ? JSON.stringify(error) : error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 text-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition"
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition"
              placeholder="Elige un usuario"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition"
              placeholder="Crea una contraseña"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition"
              placeholder="+57 300 123 4567"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Dirección (opcional)
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition resize-none"
              placeholder="Tu dirección"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white px-8 py-5 rounded-lg text-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-lg text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-gray-900 font-bold hover:text-gray-700 text-xl">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-lg text-gray-600 hover:text-gray-900 transition">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

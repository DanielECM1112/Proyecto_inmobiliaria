import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
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
      const response = await axios.post("http://localhost:8000/api/login/", formData);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <Navbar />
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-10 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Iniciar Sesión</h2>
          <p className="text-lg text-gray-600">Ingresa a tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 text-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Ingresa tu usuario"
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
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white px-8 py-5 rounded-lg text-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-lg text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-gray-900 font-bold hover:text-gray-700 text-xl">
              Regístrate aquí
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

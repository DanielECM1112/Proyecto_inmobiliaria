import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { BACKEND_ORIGIN } from '../services/api';
import { FaGoogle } from 'react-icons/fa';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Guardamos en sessionStorage que estamos en login de admin para redirigir correctamente después de social login
  useEffect(() => {
    sessionStorage.setItem('isAdminLogin', 'true');
    return () => sessionStorage.removeItem('isAdminLogin');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login/', formData);
      const userData = response.data;
      const rol = userData.user?.rol?.toString().toLowerCase();

      if (rol !== 'admin' && rol !== 'administrador' && !userData.user?.is_staff) {
        setError('Acceso restringido a administradores');
        setLoading(false);
        return;
      }

      // Guardar token y usuario correctamente (igual que Login.js)
      if (userData.access) localStorage.setItem('token', userData.access);
      else if (userData.token) localStorage.setItem('token', userData.token);
      if (userData.user) localStorage.setItem('user', JSON.stringify(userData.user));
      
      window.dispatchEvent(new Event('storage'));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#0f1116]/95 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.7fr]">
          <div className="hidden lg:flex flex-col justify-center gap-6 bg-gradient-to-br from-[#12131a] via-[#111318] to-[#0f1116] p-14">
            <div>
              <div className="inline-flex rounded-3xl bg-[#b38b1d]/10 px-4 py-2 text-sm uppercase tracking-[0.35em] text-[#f4e1a3] font-semibold">
                LUXHABITAT
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-white">Panel Administrativo</h1>
              <p className="mt-4 max-w-sm text-slate-400 leading-relaxed">
                Accede al panel de control, administra planes, usuarios, pagos e inmuebles con seguridad profesional.
              </p>
            </div>
            <div className="rounded-3xl border border-[#b38b1d]/20 bg-[#0b0c10]/80 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[#b38b1d]">Consejo de seguridad</p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">Solo usuarios con rol administrativo pueden ingresar por esta ruta.</p>
            </div>
          </div>

          <div className="p-10 lg:p-14">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.35em] text-[#b38b1d]">Acceso Admin</span>
              <h2 className="mt-4 text-4xl font-serif font-bold text-white">Inicia sesión</h2>
              <p className="mt-3 text-sm text-slate-400">Ingresa tus credenciales administrativas para entrar al dashboard.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-white/10 bg-[#111217] px-5 py-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#b38b1d] focus:ring-2 focus:ring-[#b38b1d]/20"
                  placeholder="admin@luxhabitat.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-white/10 bg-[#111217] px-5 py-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#b38b1d] focus:ring-2 focus:ring-[#b38b1d]/20"
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-gradient-to-r from-[#b38b1d] to-[#f9d85b] px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:shadow-[0_25px_60px_rgba(179,139,29,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Acceder al panel'}
              </button>
            </form>

            <div className="mt-8">
              <p className="text-sm mb-4 text-center text-slate-500">
                O inicia sesión con
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => window.location.href = `${BACKEND_ORIGIN}/accounts/google/login/?process=login`}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 border rounded-3xl transition-all duration-300 hover:border-[#C9A84C] bg-white/5"
                >
                  <FaGoogle className="text-red-500" />
                  <span className="text-sm font-semibold text-white/80">Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

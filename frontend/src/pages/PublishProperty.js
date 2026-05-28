import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function PublishProperty() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    ciudad: '',
    direccion: '',
    tipo: 'venta',
    url_video_youtube: '',
    whatsapp_contacto: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/planes/');
        setPlans(res.data || []);
      } catch (err) {
        console.error('Error fetching plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (location.state?.planId && plans.length > 0) {
      const plan = plans.find((p) => String(p.id) === String(location.state.planId));
      if (plan) setSelectedPlan(plan);
    }

    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }

    if (!location.state?.selectedPlan && !location.state?.planId) {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        try {
          setSelectedPlan(JSON.parse(storedPlan));
        } catch (ignore) {
          localStorage.removeItem('selectedPlan');
        }
      }
    }
  }, [location.state, plans]);

  const getToken = () => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try { return JSON.parse(raw).access || null; } catch { return null; }
  };

  const handleSelectPlan = (plan) => {
    const token = getToken();
    if (!token) return navigate('/login', { state: { redirect: '/publish', planId: plan.id } });
    setSelectedPlan(plan);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!selectedPlan) return setSubmitError('Selecciona un plan antes de publicar.');
    const token = getToken();
    if (!token) return navigate('/login', { state: { redirect: '/publish', planId: selectedPlan.id } });

    setSubmitLoading(true);
    try {
      const payload = { ...formData, precio: parseFloat(formData.precio || 0), plan_id: selectedPlan.id };
      const res = await api.post('/inmuebles/', payload);
      if (res.status === 201 || res.status === 200) {
        navigate('/payment', { state: { property: res.data, plan: selectedPlan } });
      } else {
        setSubmitError('No se pudo crear el inmueble.');
      }
    } catch (err) {
      console.error('publish error', err);
      setSubmitError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Error al crear el inmueble.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-primary-dark' : 'bg-light-100'}`}>
      <Navbar />
      <main className="flex-grow py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-6">Publicar Inmueble</h1>

          {loading ? (
            <p>Cargando planes...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {plans.map((p) => (
                <div key={p.id} className={`p-6 border rounded-xl ${selectedPlan?.id === p.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <h3 className="text-lg font-semibold">{p.nombre}</h3>
                  <p className="text-sm text-gray-500">{p.duracion_dias} días · COP {parseFloat(p.precio).toLocaleString()}</p>
                  <button className="mt-4 btn btn-primary" onClick={() => handleSelectPlan(p)}>Seleccionar</button>
                </div>
              ))}
            </div>
          )}

          {selectedPlan ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && <div className="p-3 bg-red-100 text-red-800 rounded">{submitError}</div>}
              <div>
                <label className="block text-sm">Título</label>
                <input name="titulo" value={formData.titulo} onChange={handleChange} className="w-full p-3 border rounded" required />
              </div>
              <div>
                <label className="block text-sm">Ciudad</label>
                <input name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full p-3 border rounded" required />
              </div>
              <div>
                <label className="block text-sm">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full p-3 border rounded" rows={4} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="precio" value={formData.precio} onChange={handleChange} className="p-3 border rounded" placeholder="Precio" required />
                <input name="direccion" value={formData.direccion} onChange={handleChange} className="p-3 border rounded" placeholder="Dirección" />
                <select name="tipo" value={formData.tipo} onChange={handleChange} className="p-3 border rounded">
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={submitLoading} className="btn btn-primary">{submitLoading ? 'Publicando...' : 'Publicar y pagar'}</button>
                <button type="button" onClick={() => setSelectedPlan(null)} className="btn">Cambiar plan</button>
              </div>
            </form>
          ) : (
            <div className="p-6 border rounded-md text-gray-600">Selecciona un plan para mostrar el formulario de publicación.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

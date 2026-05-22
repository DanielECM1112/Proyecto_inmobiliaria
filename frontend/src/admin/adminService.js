import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configurar instancia de axios con interceptor para el token
const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Token ${user.token}`;
  }
  return config;
});

export const adminService = {
  // === MÓDULO DE INMUEBLES ===
  getInmuebles: async () => {
    try {
      const response = await api.get('/properties/admin-properties/');
      return response.data.map(i => ({
        id: i.id,
        titulo: i.title,
        precio: `$${parseFloat(i.price).toLocaleString()}`,
        estado: i.status.charAt(0).toUpperCase() + i.status.slice(1)
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  },
  
  aprobarInmueble: async (id) => {
    await api.patch(`/properties/admin-properties/${id}/`, { status: 'activo' });
  },
  
  desaprobarInmueble: async (id) => {
    await api.patch(`/properties/admin-properties/${id}/`, { status: 'pendiente' });
  },
  
  eliminarInmueble: async (id) => {
    await api.delete(`/properties/admin-properties/${id}/`);
  },

  // === MÓDULO DE USUARIOS ===
  getUsuarios: async () => {
    try {
      const response = await api.get('/users/admin-users/');
      return response.data.map(u => ({
        id: u.id,
        nombre: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username,
        correo: u.email,
        rol: (u.is_superuser || u.is_staff) ? "Administrador" : "Usuario"
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
  
  editarRolUsuario: async (id, nuevoRol) => {
    const isStaff = nuevoRol === "Administrador";
    await api.patch(`/users/admin-users/${id}/`, { is_staff: isStaff, is_superuser: isStaff });
  },
  
  eliminarUsuario: async (id) => {
    await api.delete(`/users/admin-users/${id}/`);
  },

  // === MÓDULO DE PLANES ===
  getPlanes: async () => {
    try {
      const response = await api.get('/plans/admin-plans/');
      return response.data.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        duracion: p.duration_days,
        inmuebles: p.max_properties,
        imagenes: p.max_images
      }));
    } catch (error) {
      console.error("Error fetching plans:", error);
      return [];
    }
  },
  
  eliminarPlan: async (id) => {
    await api.delete(`/plans/admin-plans/${id}/`);
  },
  
  actualizarPlan: async (id, planActualizado) => {
    try {
      const cleanNumber = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseInt(val.toString().replace(/[^0-9]/g, '')) || 0;
      };

      const data = {
        nombre: planActualizado.nombre,
        name: planActualizado.nombre,
        precio: cleanNumber(planActualizado.precio),
        price: cleanNumber(planActualizado.precio),
        duration_days: cleanNumber(planActualizado.duracion),
        max_properties: cleanNumber(planActualizado.inmuebles),
        max_images: cleanNumber(planActualizado.imagenes),
        active: true
      };
      await api.put(`/plans/admin-plans/${id}/`, data);
    } catch (error) {
      console.error("Error updating plan:", error.response?.data || error.message);
      throw error;
    }
  },
  
  crearPlan: async (nuevoPlan) => {
    try {
      const cleanNumber = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseInt(val.toString().replace(/[^0-9]/g, '')) || 0;
      };

      const data = {
        nombre: nuevoPlan.nombre,
        name: nuevoPlan.nombre,
        precio: cleanNumber(nuevoPlan.precio),
        price: cleanNumber(nuevoPlan.precio),
        duration_days: cleanNumber(nuevoPlan.duracion),
        max_properties: cleanNumber(nuevoPlan.inmuebles),
        max_images: cleanNumber(nuevoPlan.imagenes),
        active: true
      };
      await api.post('/plans/admin-plans/', data);
    } catch (error) {
      console.error("Error creating plan:", error.response?.data || error.message);
      throw error;
    }
  },

  // === MÓDULO DE PAGOS ===
  getPagos: async () => {
    try {
      const response = await api.get('/payments/admin-payments/');
      return response.data.map(p => ({
        id: `TX-${p.id}`,
        usuario: p.user_name || "Usuario Desconocido",
        plan: p.plan_name || "Plan Estándar",
        monto: parseFloat(p.amount),
        fecha: new Date(p.created_at).toLocaleDateString(),
        estado: (p.status || p.payment_status || 'pendiente').charAt(0).toUpperCase() + (p.status || p.payment_status || 'pendiente').slice(1)
      }));
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  },
  
  cambiarEstadoPago: async (id, nuevoEstado) => {
    const numericId = id.replace('TX-', '');
    await api.patch(`/payments/admin-payments/${numericId}/`, { payment_status: nuevoEstado.toLowerCase() });
  },

  // === ESTADÍSTICAS EN TIEMPO REAL PARA EL DASHBOARD ===
  getMetrics: async () => {
    try {
      const [props, users, payments] = await Promise.all([
        api.get('/properties/admin-properties/'),
        api.get('/users/admin-users/'),
        api.get('/payments/admin-payments/')
      ]);

      const inmueblesActivos = props.data.filter(i => i.status === 'activo').length;
      const inmueblesPendientes = props.data.filter(i => i.status === 'pendiente').length;
      const usuariosRegistrados = users.data.length;
      
      const ingresos = Array.isArray(payments.data) 
        ? payments.data
          .filter(p => (p.status === 'aprobado' || p.payment_status === 'aprobado'))
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
        : 0;

      return {
        inmueblesActivos,
        inmueblesPendientes,
        usuariosRegistrados,
        ingresos: `$${ingresos.toLocaleString()}`
      };
    } catch (error) {
      console.error("Error fetching metrics:", error);
      return {
        inmueblesActivos: 0,
        usuariosRegistrados: 0,
        ingresos: '$0'
      };
    }
  }
};

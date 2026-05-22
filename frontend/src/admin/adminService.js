import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const adminService = {
  // === MÓDULO DE INMUEBLES ===
  getInmuebles: async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/admin-properties/`);
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
    await axios.patch(`${API_URL}/properties/admin-properties/${id}/`, { status: 'activo' });
  },
  
  desaprobarInmueble: async (id) => {
    await axios.patch(`${API_URL}/properties/admin-properties/${id}/`, { status: 'pendiente' });
  },
  
  eliminarInmueble: async (id) => {
    await axios.delete(`${API_URL}/properties/admin-properties/${id}/`);
  },

  // === MÓDULO DE USUARIOS ===
  getUsuarios: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/users/`);
      return response.data.map(u => ({
        id: u.id,
        nombre: `${u.first_name} ${u.last_name}`.trim() || u.username,
        correo: u.email,
        rol: u.is_staff ? "Administrador" : "Usuario"
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
  
  editarRolUsuario: async (id, nuevoRol) => {
    const isStaff = nuevoRol === "Administrador";
    await axios.patch(`${API_URL}/users/users/${id}/`, { is_staff: isStaff });
  },
  
  eliminarUsuario: async (id) => {
    await axios.delete(`${API_URL}/users/users/${id}/`);
  },

  // === MÓDULO DE PLANES ===
  getPlanes: async () => {
    try {
      const response = await axios.get(`${API_URL}/plans/admin-plans/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching plans:", error);
      return [];
    }
  },
  
  eliminarPlan: async (id) => {
    await axios.delete(`${API_URL}/plans/admin-plans/${id}/`);
  },
  
  actualizarPlan: async (id, planActualizado) => {
    await axios.put(`${API_URL}/plans/admin-plans/${id}/`, planActualizado);
  },
  
  crearPlan: async (nuevoPlan) => {
    await axios.post(`${API_URL}/plans/admin-plans/`, nuevoPlan);
  },

  // === MÓDULO DE PAGOS ===
  getPagos: async () => {
    try {
      const response = await axios.get(`${API_URL}/payments/admin-payments/`);
      return response.data.map(p => ({
        id: `TX-${p.id}`,
        usuario: p.user_name || "Usuario Desconocido",
        plan: p.plan_name || "Plan Estándar",
        monto: parseFloat(p.amount),
        fecha: new Date(p.created_at).toLocaleDateString(),
        estado: p.status.charAt(0).toUpperCase() + p.status.slice(1)
      }));
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  },
  
  cambiarEstadoPago: async (id, nuevoEstado) => {
    const numericId = id.replace('TX-', '');
    await axios.patch(`${API_URL}/payments/admin-payments/${numericId}/`, { status: nuevoEstado.toLowerCase() });
  },

  // === ESTADÍSTICAS EN TIEMPO REAL PARA EL DASHBOARD ===
  getMetrics: async () => {
    try {
      const [props, users, payments] = await Promise.all([
        axios.get(`${API_URL}/properties/admin-properties/`),
        axios.get(`${API_URL}/users/users/`),
        axios.get(`${API_URL}/payments/admin-payments/`)
      ]);

      const inmueblesActivos = props.data.filter(i => i.status === 'activo').length;
      const usuariosRegistrados = users.data.length;
      
      const ingresos = payments.data
        .filter(p => p.status === 'aprobado')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

      return {
        inmueblesActivos,
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

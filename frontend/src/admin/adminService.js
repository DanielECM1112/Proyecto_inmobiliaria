import api from '../services/api';

export const adminService = {
  // === MÓDULO DE INMUEBLES ===
  getInmuebles: async () => {
    try {
      const response = await api.get('/inmuebles/');
      return response.data.map(i => ({
        id: i.id,
        titulo: i.titulo,
        precio: `$${parseFloat(i.precio).toLocaleString()}`,
        estado: i.estado ? i.estado.charAt(0).toUpperCase() + i.estado.slice(1) : 'Desconocido'
      }));
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  aprobarInmueble: async (id) => {
    await api.patch(`/inmuebles/admin/${id}/`, { estado: 'activo' });
  },

  finalizarInmueble: async (id) => {
    await api.patch(`/inmuebles/admin/${id}/`, { estado: 'finalizado' });
  },

  eliminarInmueble: async (id) => {
    await api.delete(`/inmuebles/admin/${id}/`);
  },

  // === MÓDULO DE USUARIOS ===
  getUsuarios: async () => {
    try {
      const response = await api.get('/admin/usuarios/');
      return response.data.map(u => ({
        id: u.id,
        nombre: u.nombre,
        correo: u.email,
        rol: u.rol === 'admin' ? 'Administrador' : 'Usuario',
        activo: u.is_active ?? false
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  toggleUsuarioActivo: async (id, activo) => {
    await api.patch(`/admin/usuarios/${id}/`, { is_active: activo });
  },

  editarRolUsuario: async (id, nuevoRol) => {
    const rol = nuevoRol === 'Administrador' ? 'admin' : 'usuario';
    await api.patch(`/admin/usuarios/${id}/`, { rol });
  },

  // === MÓDULO DE PLANES ===
  getPlanes: async () => {
    try {
      const response = await api.get('/admin/planes/');
      return response.data.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio: `$${parseFloat(p.precio).toLocaleString()}`,
        duracion: p.duracion_dias,
        inmuebles: p.max_inmuebles,
        imagenes: p.max_imagenes,
        activo: p.activo ?? true
      }));
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  },

  desactivarPlan: async (id) => {
    await api.patch(`/admin/planes/${id}/`, { activo: false });
  },

  actualizarPlan: async (id, planActualizado) => {
    try {
      const cleanNumber = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseInt(val.toString().replace(/[^0-9]/g, ''), 10) || 0;
      };

      const data = {
        nombre: planActualizado.nombre,
        precio: cleanNumber(planActualizado.precio),
        duracion_dias: cleanNumber(planActualizado.duracion),
        max_inmuebles: cleanNumber(planActualizado.inmuebles),
        max_imagenes: cleanNumber(planActualizado.imagenes),
        activo: true
      };
      await api.patch(`/admin/planes/${id}/`, data);
    } catch (error) {
      console.error('Error updating plan:', error.response?.data || error.message);
      throw error;
    }
  },

  crearPlan: async (nuevoPlan) => {
    try {
      const cleanNumber = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseInt(val.toString().replace(/[^0-9]/g, ''), 10) || 0;
      };

      const data = {
        nombre: nuevoPlan.nombre,
        precio: cleanNumber(nuevoPlan.precio),
        duracion_dias: cleanNumber(nuevoPlan.duracion),
        max_inmuebles: cleanNumber(nuevoPlan.inmuebles),
        max_imagenes: cleanNumber(nuevoPlan.imagenes),
        activo: true
      };
      await api.post('/admin/planes/', data);
    } catch (error) {
      console.error('Error creating plan:', error.response?.data || error.message);
      throw error;
    }
  },

  // === MÓDULO DE PAGOS ===
  getPagos: async () => {
    try {
      const response = await api.get('/admin/pagos/');
      return response.data.map(p => ({
        id: p.id,
        referencia: `TX-${String(p.id).substring(0, 8)}`,
        usuario: p.usuario_nombre || 'Usuario Desconocido',
        plan: p.plan_nombre || 'Plan Estándar',
        monto: `$${parseFloat(p.monto).toLocaleString()}`,
        fecha: new Date(p.created_at).toLocaleDateString(),
        estado: (p.estado || 'pendiente').charAt(0).toUpperCase() + (p.estado || 'pendiente').slice(1)
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  },

  cambiarEstadoPago: async (id, nuevoEstado) => {
    await api.patch(`/admin/pagos/${id}/`, { estado: nuevoEstado.toLowerCase() });
  },

  // === ESTADÍSTICAS EN TIEMPO REAL PARA EL DASHBOARD ===
  getMetrics: async () => {
    try {
      const response = await api.get('/admin/stats/');
      const data = response.data;

      return {
        inmueblesActivos: data.inmuebles?.activos ?? 0,
        inmueblesPendientes: data.inmuebles?.pendientes ?? 0,
        usuariosRegistrados: data.usuarios?.total ?? 0,
        ingresos: `$${parseFloat(data.pagos?.ingresos_este_mes || 0).toLocaleString()}`
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return {
        inmueblesActivos: 0,
        inmueblesPendientes: 0,
        usuariosRegistrados: 0,
        ingresos: '$0'
      };
    }
  }
};

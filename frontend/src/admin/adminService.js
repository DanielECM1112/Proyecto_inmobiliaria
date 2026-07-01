import api from '../services/api';

// Convierte textarea (una línea por feature) → JSON array string
const convertFeatures = (features) => {
    if (!features) return '[]';
    if (Array.isArray(features)) return JSON.stringify(features);
    try {
        JSON.parse(features);
        return features; // ya es JSON válido
    } catch {
        const arr = features.split('\n').map(f => f.trim()).filter(f => f.length > 0);
        return JSON.stringify(arr);
    }
};

// Limpia strings con $ y comas → número entero
const cleanNumber = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return parseInt(val.toString().replace(/[^0-9]/g, ''), 10) || 0;
};

// Obtiene el estado del plan del usuario
export const getUserPlanStatus = async () => {
    try {
        const response = await api.get('/properties/plan-status/');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo estado del plan:', error);
        throw error;
    }
};

export const adminService = {

  // ═══════════════════════════════════════
  // MÓDULO DE INMUEBLES
  // ═══════════════════════════════════════
  getInmuebles: async () => {
    try {
      const response = await api.get('/properties/');
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  editarInmueble: async (id, datos) => {
    const payload = { ...datos };
    if (payload.estrato === '' || payload.estrato === null) payload.estrato = null;
    payload.precio = parseFloat(payload.precio) || 0;
    payload.area = parseFloat(payload.area) || 0;
    payload.habitaciones = parseInt(payload.habitaciones) || 1;
    payload.banos = parseInt(payload.banos) || 1;
    await api.patch(`/admin/properties/${id}/`, payload);
  },

  aprobarInmueble: async (id) => {
    await api.patch(`/admin/properties/${id}/`, { estado: 'disponible' });
  },

  finalizarInmueble: async (id) => {
    await api.patch(`/admin/properties/${id}/`, { estado: 'vendido' });
  },

  eliminarInmueble: async (id) => {
    await api.delete(`/properties/${id}/`);
  },

  // ═══════════════════════════════════════
  // MÓDULO DE USUARIOS
  // ═══════════════════════════════════════
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

  eliminarUsuario: async (id) => {
    await api.delete(`/admin/usuarios/${id}/`);
  },

  editarRolUsuario: async (id, nuevoRol) => {
    const rol = nuevoRol === 'Administrador' ? 'admin' : 'usuario';
    await api.patch(`/admin/usuarios/${id}/`, { rol, is_staff: rol === 'admin' });
  },

  // ═══════════════════════════════════════
  // MÓDULO DE PLANES ← CORREGIDO ✅
  // ═══════════════════════════════════════
  getPlanes: async () => {
    try {
      const response = await api.get('/admin/plans/');
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  },

  desactivarPlan: async (id) => {
    await api.patch(`/admin/plans/${id}/`, { is_active: false });
  },

  eliminarPlan: async (id) => {
    await api.delete(`/admin/plans/${id}/`);
  },

  actualizarPlan: async (id, payload) => {
    try {
      await api.patch(`/admin/plans/${id}/`, payload);
    } catch (error) {
      console.error('Error updating plan:', error.response?.data || error.message);
      throw error;
    }
  },

  crearPlan: async (payload) => {
    try {
      await api.post('/admin/plans/', payload);
    } catch (error) {
      console.error('Error creating plan:', error.response?.data || error.message);
      throw error;
    }
  },

  // ═══════════════════════════════════════
  // MÓDULO DE PAGOS
  // ═══════════════════════════════════════
  getPagos: async () => {
    try {
      const response = await api.get('/payments/admin/pagos/');
      return response.data.map(p => ({
        id:         p.id,
        referencia: `TX-${String(p.id).substring(0, 8)}`,
        usuario:    p.usuario_nombre || 'Usuario Desconocido',
        plan:       p.plan_name || 'Plan Estándar',
        monto:      `$${parseFloat(p.monto).toLocaleString()}`,
        fecha:      new Date(p.created_at).toLocaleDateString(),
        estado:     (p.estado || 'pendiente').charAt(0).toUpperCase() +
                    (p.estado || 'pendiente').slice(1)
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  },

  cambiarEstadoPago: async (id, nuevoEstado) => {
    await api.patch(`/payments/admin/pagos/${id}/`, { estado: nuevoEstado.toLowerCase() });
  },

  // ═══════════════════════════════════════
  // ESTADÍSTICAS DASHBOARD
  // ═══════════════════════════════════════
  getMetrics: async () => {
        try {
            const response = await api.get('/payments/admin/stats/');
            const data = response.data;
            return {
                inmueblesActivos:     data.propiedades?.activos ?? 0,
                inmueblesPendientes:  data.propiedades?.pendientes ?? 0,
                usuariosRegistrados:  data.usuarios?.total ?? 0,
                ingresos:             `$${parseFloat(data.pagos?.ingresos_este_mes || 0).toLocaleString()}`
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

// adminService.js - Capa de comunicación independiente para simular el Backend

let inmueblesDB = [
  { id: 1, titulo: "Apartamento Amoblado para enanos", precio: "$1.800.000", estado: "Pendiente" },
  { id: 2, titulo: "Casa Campestre Santa Helena", precio: "$450.000.000", estado: "Activo" },
  { id: 3, titulo: "Penthouse El Poblado", precio: "$1.200.000.000", estado: "Pendiente" }
];

let usuariosDB = [
  { id: 1, nombre: "Carlos Mendoza", correo: "carlos@luxhabitat.com", rol: "Usuario" },
  { id: 2, nombre: "Alban Admin", correo: "alban@luxhabitat.com", rol: "Administrador" },
  { id: 3, nombre: "Diana Gómez", correo: "diana@luxhabitat.com", rol: "Usuario" }
];

let planesDB = [
  { id: 1, nombre: "Plan Básico", precio: "$50.00", duracion: "30 Días", inmuebles: "1 Inmueble", imagenes: "5 Fotos" },
  { id: 2, nombre: "Plan Premium", precio: "$150.00", duracion: "90 Días", inmuebles: "Ilimitados", imagenes: "20 Fotos" }
];

let pagosDB = [
  { id: "TX-9821", usuario: "Carlos Mendoza", plan: "Plan Premium", monto: 150.00, fecha: "12/05/2026", estado: "Aprobado" },
  { id: "TX-9822", usuario: "Diana Gómez", plan: "Plan Básico", monto: 50.00, fecha: "14/05/2026", estado: "Pendiente" }
];

export const adminService = {
  // === MÓDULO DE INMUEBLES ===
  getInmuebles: async () => [...inmueblesDB],
  aprobarInmueble: async (id) => { inmueblesDB = inmueblesDB.map(i => i.id === id ? { ...i, estado: 'Activo' } : i); },
  desaprobarInmueble: async (id) => { inmueblesDB = inmueblesDB.map(i => i.id === id ? { ...i, estado: 'Pendiente' } : i); },
  eliminarInmueble: async (id) => { inmueblesDB = inmueblesDB.filter(i => i.id !== id); },

  // === MÓDULO DE USUARIOS ===
  getUsuarios: async () => [...usuariosDB],
  editarRolUsuario: async (id, nuevoRol) => { usuariosDB = usuariosDB.map(u => u.id === id ? { ...u, rol: nuevoRol } : u); },
  eliminarUsuario: async (id) => { usuariosDB = usuariosDB.filter(u => u.id !== id); },

  // === MÓDULO DE PLANES ===
  getPlanes: async () => [...planesDB],
  eliminarPlan: async (id) => { planesDB = planesDB.filter(p => p.id !== id); },
  actualizarPlan: async (id, planActualizado) => { planesDB = planesDB.map(p => p.id === id ? { ...p, ...planActualizado } : p); },
  crearPlan: async (nuevoPlan) => {
    const id = planesDB.length ? planesDB[planesDB.length - 1].id + 1 : 1;
    planesDB.push({ id, ...nuevoPlan });
  },

  // === MÓDULO DE PAGOS ===
  getPagos: async () => [...pagosDB],
  cambiarEstadoPago: async (id, nuevoEstado) => {
    pagosDB = pagosDB.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p);
  },

  // === ESTADÍSTICAS EN TIEMPO REAL PARA EL DASHBOARD ===
  getMetrics: async () => {
    const inmueblesActivos = inmueblesDB.filter(i => i.estado === 'Activo').length;
    const usuariosRegistrados = usuariosDB.length;
    
    // Suma dinámicamente solo los pagos con estado 'Aprobado'
    const ingresos = pagosDB
      .filter(p => p.estado === 'Aprobado')
      .reduce((sum, p) => sum + p.monto, 0);

    return {
      inmueblesActivos,
      usuariosRegistrados,
      ingresos: `$${ingresos.toFixed(2)}`
    };
  }
};

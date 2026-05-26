# API - Backend Proyecto Inmobiliaria

Documentación de los endpoints públicos y administrativos del backend.

---
## POST /api/auth/register/
**Requiere token:** No  
**Body:**
{
  "nombre": "string",
  "email": "string",
  "password": "string",
  "password_confirm": "string"
}
**Respuesta 201:**
{
  "id": "uuid",
  "nombre": "string",
  "email": "string",
  "rol": "usuario",
  "is_active": true,
  "created_at": "datetime"
}
**Errores:** 400 si email duplicado o contraseñas no coinciden

---
## POST /api/auth/login/
**Requiere token:** No  
**Body:**
{
  "email": "string",
  "password": "string"
}
**Respuesta 200:**
{
  "refresh": "string",
  "access": "string",
  "user": {
    "id": "uuid",
    "nombre": "string",
    "email": "string",
    "rol": "usuario"
  }
}
**Errores:** 401 credenciales inválidas, 403 cuenta desactivada

---
## POST /api/auth/token/refresh/
**Requiere token:** No  
**Body:**
{
  "refresh": "string"
}
**Respuesta 200:**
{
  "access": "string"
}
**Errores:** 401 refresh inválido/expirado

---
## GET /api/admin/usuarios/
**Requiere token:** Sí (admin)  
**Body:** No
**Respuesta 200:**
[
  {
    "id": "uuid",
    "nombre": "string",
    "email": "string",
    "rol": "admin|usuario",
    "is_active": true,
    "created_at": "datetime"
  }
]
**Errores:** 403 si no es admin

---
## PATCH /api/admin/usuarios/<uuid:pk>/
**Requiere token:** Sí (admin)  
**Body:** (parcial) ejemplo:
{
  "nombre": "string",
  "email": "string",
  "rol": "admin|usuario",
  "is_active": true,
  "is_staff": false
}
**Respuesta 200:**
{
  "id": "uuid",
  "nombre": "string",
  "email": "string",
  "rol": "admin|usuario",
  "is_active": true,
  "created_at": "datetime"
}
**Errores:** 400 validación, 404 usuario no encontrado, 403 si no es admin

---
# Planes

## GET /api/planes/
**Requiere token:** No  
**Query params (opcional):** pueden incluir filtros según implementación (buscar por nombre, precio, etc.)
**Respuesta 200:**
[
  {
    "id": "uuid",
    "nombre": "string",
    "duracion_dias": integer,
    "max_inmuebles": integer,
    "max_imagenes": integer,
    "precio": "decimal"
  }
]

---
## GET /api/admin/planes/
**Requiere token:** Sí (admin)  
**Body:** No
**Respuesta 200:** lista completa de planes (todos los campos)

---
## POST /api/admin/planes/
**Requiere token:** Sí (admin)  
**Body:** (ejemplo)
{
  "nombre": "string",
  "descripcion": "string",
  "duracion_dias": integer,
  "max_inmuebles": integer,
  "max_imagenes": integer,
  "precio": "decimal",
  "activo": true
}
**Respuesta 201:** plan creado (todos los campos)
**Errores:** 400 validación

---
## PATCH /api/admin/planes/<uuid:pk>/
**Requiere token:** Sí (admin)  
**Body:** (parcial) campos a actualizar
**Respuesta 200:** plan actualizado
**Errores:** 400 validación, 404 no encontrado

---
## DELETE /api/admin/planes/<uuid:pk>/
**Requiere token:** Sí (admin)  
**Body:** No
**Respuesta 200:** { "message": "Plan desactivado correctamente." }
**Errores:** 404 no encontrado

---
# Inmuebles

## GET /api/inmuebles/
**Requiere token:** No  
**Query params (filtros):** El endpoint acepta filtros vía query params (ej: ciudad, tipo, precio_min, precio_max, estado, etc.)
**Respuesta 200:**
[
  {
    "id": "uuid",
    "titulo": "string",
    "precio": "decimal",
    "ciudad": "string",
    "tipo": "string",
    "estado": "string",
    "thumbnail": "url|null",
    "usuario_nombre": "string",
    "created_at": "datetime"
  }
]

---
## GET /api/inmuebles/<uuid:pk>/
**Requiere token:** No  
**Body:** No
**Respuesta 200:** Inmueble con detalle completo e imágenes anidadas
{
  "id": "uuid",
  "titulo": "string",
  "descripcion": "string",
  "precio": "decimal",
  "ciudad": "string",
  "direccion": "string",
  "tipo": "string",
  "estado": "string",
  "url_video_youtube": "string|null",
  "usuario": "uuid",
  "plan": "uuid",
  "imagenes": [ { "id": "uuid", "imagen": "url", "orden": integer } ],
  "created_at": "datetime",
  "updated_at": "datetime"
}
**Errores:** 404 si no existe

---
## POST /api/inmuebles/crear/
**Requiere token:** Sí  
**Body:**
{
  "titulo": "string",
  "descripcion": "string",
  "precio": "decimal",
  "ciudad": "string",
  "direccion": "string",
  "tipo": "casa|apartamento|local|lote|finca",
  "url_video_youtube": "string|null",
  "plan": "uuid"
}
**Respuesta 201:** inmueble creado (detalle completo)
**Errores:** 400 validación, 401 si no autenticado

---
## PATCH /api/inmuebles/admin/<uuid:pk>/
**Requiere token:** Sí (dueño o admin)  
**Body:** (parcial) campos a actualizar
**Respuesta 200:** inmueble actualizado (detalle completo)
**Errores:** 400 validación, 403 si no propietario ni admin, 404 no encontrado

---
## DELETE /api/inmuebles/admin/<uuid:pk>/
**Requiere token:** Sí (dueño o admin)  
**Body:** No
**Respuesta 200:** { "message": "Inmueble marcado como finalizado." }
**Errores:** 404 no encontrado, 403 permisos

---
## POST /api/inmuebles/<uuid:pk>/imagenes/
**Requiere token:** Sí (dueño o admin)  
**Body:** Multipart form-data con campo `imagen` (file)
**Respuesta 201:**
{
  "id": "uuid",
  "imagen": "url",
  "orden": integer
}
**Errores:** 400 si no se envía archivo, 404 inmueble no encontrado, 403 permisos

---
## DELETE /api/inmuebles/<uuid:pk>/imagenes/<uuid:img_id>/
**Requiere token:** Sí (dueño o admin)  
**Body:** No
**Respuesta 200:** { "message": "Imagen eliminada." }
**Errores:** 404 imagen no encontrada, 403 permisos

---
# Favoritos

## GET /api/favoritos/
**Requiere token:** Sí  
**Body:** No
**Respuesta 200:**
[
  {
    "id": "uuid",
    "inmueble": "uuid",
    "inmueble_detalle": { /* resumen del inmueble */ },
    "created_at": "datetime"
  }
]

---
## POST /api/favoritos/
**Requiere token:** Sí  
**Body:**
{
  "inmueble": "uuid"
}
**Respuesta 201 (si se agregó):** { "message": "Agregado a favoritos." }
**Respuesta 200 (si se eliminó):** { "message": "Eliminado de favoritos." }
**Errores:** 400 si falta `inmueble`, 400/403 en errores de negocio

---
# Contacto

## POST /api/contacto/
**Requiere token:** No  
**Body:**
{
  "inmueble": "uuid",
  "nombre": "string",
  "email": "string",
  "mensaje": "string"
}
**Respuesta 201:** { "message": "Mensaje enviado correctamente." }
**Errores:** 400 validación

---
# Pagos

## POST /api/pagos/iniciar/
**Requiere token:** Sí  
**Body:**
{
  "plan": "uuid",
  "inmueble": "uuid (opcional)",
  "metodo": "tarjeta|pse|nequi (opcional, default: tarjeta)"
}
**Respuesta 201:** Pago creado (ejemplo):
{
  "id": "uuid",
  "usuario": "uuid",
  "plan": "uuid",
  "inmueble": "uuid|null",
  "monto": "decimal",
  "metodo": "string",
  "estado": "pendiente",
  "referencia_externa": "string",
  "created_at": "datetime"
}
**Errores:** 404 plan no encontrado, 400 validación

---
## POST /api/pagos/confirmar/
**Requiere token:** No (webhook simulado)  
**Body:**
{
  "referencia": "string"
}
**Respuesta 200:** Pago confirmado (objeto Pago)
**Errores:** 404 pago no encontrado

---
## GET /api/admin/pagos/
**Requiere token:** Sí (admin)  
**Body:** No
**Respuesta 200:** lista de pagos (serializer PagoSerializer)

---
## PATCH /api/admin/pagos/<uuid:pk>/
**Requiere token:** Sí (admin)  
**Body:** (parcial) campos editables del pago
**Respuesta 200:** pago actualizado
**Errores:** 404 no encontrado, 400 validación

---
## GET /api/admin/stats/
**Requiere token:** Sí (admin)  
**Body:** No
**Respuesta 200:** objeto JSON con estadísticas agregadas (ventas, ingresos, etc.). Estructura dependiente de la implementación del servicio de pagos.

---
## Cómo usar el token
Después de `login`, copiar el campo `access` y enviarlo en cada petición protegida así:  
Header → `Authorization: Bearer <token aquí>`

---

Si quieres que incluya ejemplos reales de cuerpos/respuestas con valores concretos o que genere colecciones Postman/Insomnia, lo hago a continuación.

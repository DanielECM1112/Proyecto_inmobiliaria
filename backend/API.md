# API - Backend Proyecto Inmobiliaria

## Autenticación

### POST /api/auth/register/
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
  "rol": "usuario"
}
**Errores:** 400 email duplicado o contraseña débil

---
### POST /api/auth/login/
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
### POST /api/auth/token/refresh/
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
### POST /api/auth/password-reset/
**Requiere token:** No
**Body:**
{
  "email": "string"
}
**Respuesta 200:**
{
  "mensaje": "Si el email existe recibirás instrucciones"
}
**Errores:** 400 email obligatorio, 400 email no registrado

---
### POST /api/auth/password-reset/confirmar/
**Requiere token:** No
**Body:**
{
  "token": "uuid",
  "nueva_password": "string"
}
**Respuesta 200:**
{
  "mensaje": "Contraseña actualizada"
}
**Errores:** 400 token inválido o expirado, 400 contraseña débil

---
## Usuarios admin

### GET /api/admin/usuarios/
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
### PATCH /api/admin/usuarios/<uuid:pk>/
**Requiere token:** Sí (admin)
**Body:**
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
## Planes

### GET /api/planes/
**Requiere token:** No
**Body:** No
**Respuesta 200:**
[
  {
    "id": "uuid",
    "nombre": "string",
    "descripcion": "string",
    "duracion_dias": integer,
    "max_inmuebles": integer,
    "max_imagenes": integer,
    "precio": "decimal",
    "activo": true
  }
]

---
### GET /api/admin/planes/
**Requiere token:** Sí (admin)
**Body:** No
**Respuesta 200:** Lista de planes con todos los campos del modelo

---
### POST /api/admin/planes/
**Requiere token:** Sí (admin)
**Body:**
{
  "nombre": "string",
  "descripcion": "string",
  "duracion_dias": integer,
  "max_inmuebles": integer,
  "max_imagenes": integer,
  "precio": "decimal",
  "activo": true
}
**Respuesta 201:** plan creado
**Errores:** 400 validación

---
### PATCH /api/admin/planes/<uuid:pk>/
**Requiere token:** Sí (admin)
**Body:** campos a actualizar
**Respuesta 200:** plan actualizado
**Errores:** 400 validación, 404 no encontrado

---
## Inmuebles

### GET /api/inmuebles/
**Requiere token:** No
**Body:** No
**Query params:** filtros opcionales como ciudad, tipo, precio_min, precio_max, estado
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
### GET /api/inmuebles/<uuid:pk>/
**Requiere token:** No
**Body:** No
**Respuesta 200:**
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
  "whatsapp_contacto": "string",
  "usuario": {
    "id": "uuid",
    "nombre": "string"
  },
  "plan": {
    "id": "uuid",
    "nombre": "string"
  },
  "imagenes": [
    {
      "id": "uuid",
      "imagen": "url",
      "orden": integer
    }
  ],
  "created_at": "datetime"
}
**Errores:** 404 si no existe

---
### POST /api/inmuebles/
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
  "whatsapp_contacto": "string",
  "plan_id": "uuid"
}
**Respuesta 201:** inmueble creado
**Errores:** 400 validación, 401 no autenticado

---
### PATCH /api/inmuebles/admin/<uuid:pk>/
**Requiere token:** Sí (dueño o admin)
**Body:** campos a actualizar
**Respuesta 200:** inmueble actualizado
**Errores:** 400 validación, 403 permisos, 404 no encontrado

---
### GET /api/inmuebles/mis-inmuebles/
**Requiere token:** Sí
**Body:** No
**Respuesta 200:**
[
  {
    "id": "uuid",
    "titulo": "string",
    "precio": "decimal",
    "ciudad": "string",
    "direccion": "string",
    "tipo": "string",
    "estado": "string",
    "plan": {
      "id": "uuid",
      "nombre": "string"
    },
    "created_at": "datetime"
  }
]

---
## Imágenes

### POST /api/inmuebles/<uuid:pk>/imagenes/
**Requiere token:** Sí (dueño o admin)
**Body:** multipart/form-data con campo `imagen`
**Respuesta 201:**
{
  "id": "uuid",
  "imagen": "url",
  "orden": integer
}
**Errores:** 400 sin imagen, 404 inmueble no encontrado, 403 permisos

---
### DELETE /api/inmuebles/<uuid:pk>/imagenes/<uuid:img_id>/
**Requiere token:** Sí (dueño o admin)
**Body:** No
**Respuesta 200:**
{
  "message": "Imagen eliminada."
}
**Errores:** 404 imagen no encontrada, 403 permisos

---
## Favoritos

### GET /api/favoritos/
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
### POST /api/favoritos/
**Requiere token:** Sí
**Body:**
{
  "inmueble": "uuid"
}
**Respuesta 201:**
{
  "message": "Agregado a favoritos."
}
**Errores:** 400 validación

---
### DELETE /api/favoritos/<uuid:pk>/
**Requiere token:** Sí
**Body:** No
**Respuesta 200:**
{
  "message": "Eliminado de favoritos."
}
**Errores:** 404 favorito no encontrado, 403 permisos

---
## Contacto

### POST /api/contacto/
**Requiere token:** No
**Body:**
{
  "inmueble": "uuid",
  "nombre": "string",
  "email": "string",
  "mensaje": "string"
}
**Respuesta 201:**
{
  "message": "Mensaje enviado correctamente."
}
**Errores:** 400 validación

---
## Pagos

### POST /api/pagos/iniciar/
**Requiere token:** Sí
**Body:**
{
  "inmueble_id": "uuid",
  "plan_id": "uuid",
  "metodo": "tarjeta|pse|nequi"
}
**Respuesta 201:**
{
  "referencia": "string",
  "monto": "decimal",
  "estado": "pendiente"
}
**Errores:** 400 validación, 403 permisos

---
### POST /api/pagos/confirmar/
**Requiere token:** No
**Body:**
{
  "referencia": "string"
}
**Respuesta 200:**
{
  "referencia": "string",
  "monto": "decimal",
  "estado": "aprobado"
}
**Errores:** 400 referencia inválida, 404 pago no encontrado

---
### GET /api/admin/pagos/
**Requiere token:** Sí (admin)
**Body:** No
**Respuesta 200:** lista de pagos con todos los campos

---
### PATCH /api/admin/pagos/<uuid:pk>/
**Requiere token:** Sí (admin)
**Body:** campos a actualizar
**Respuesta 200:** pago actualizado
**Errores:** 404 no encontrado, 400 validación

---
## Estadísticas admin

### GET /api/admin/stats/
**Requiere token:** Sí (admin)
**Body:** No
**Respuesta 200:**
{
  "usuarios": {
    "total": integer,
    "activos": integer,
    "nuevos_este_mes": integer
  },
  "inmuebles": {
    "total": integer,
    "activos": integer,
    "pendientes": integer,
    "finalizados": integer
  },
  "pagos": {
    "total": integer,
    "aprobados": integer,
    "pendientes": integer,
    "rechazados": integer,
    "ingresos_este_mes": "decimal"
  }
}

---
## Flujo completo de publicación
Paso 1: POST /api/auth/login/ → guardar access token
Paso 2: GET /api/planes/ → elegir plan
Paso 3: POST /api/inmuebles/ → crear inmueble con plan_id
Paso 4: POST /api/pagos/iniciar/ → obtener referencia
Paso 5: POST /api/pagos/confirmar/ → activar inmueble
Paso 6: GET /api/inmuebles/{id}/ → verificar estado activo

## Cómo usar el token
Header en cada petición protegida:
Authorization: Bearer <access_token>

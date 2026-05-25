# Documentación API LUXHABITAT

## Autenticación (JWT)

| Método | Endpoint | Descripción | Requiere Token |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register/` | Registro de usuario (rol 'usuario' por defecto) | No |
| POST | `/api/auth/login/` | Login, retorna access y refresh token | No |
| POST | `/api/auth/token/refresh/` | Refresca el access token | No |

## Usuarios (Admin Only)

| Método | Endpoint | Descripción | Requiere Token |
|--------|----------|-------------|----------------|
| GET | `/api/admin/usuarios/` | Lista todos los usuarios | Sí (Admin) |
| PATCH | `/api/admin/usuarios/{id}/` | Edita información de usuario | Sí (Admin) |
| DELETE | `/api/admin/usuarios/{id}/` | Desactivación lógica (is_active=False) | Sí (Admin) |

## Inmuebles

| Método | Endpoint | Descripción | Requiere Token |
|--------|----------|-------------|----------------|
| GET | `/api/inmuebles/` | Lista pública con filtros (`?ciudad=`, `?tipo=`, etc.) | No |
| GET | `/api/inmuebles/{id}/` | Detalle de un inmueble | No |
| POST | `/api/inmuebles/` | Crear inmueble (estado 'pendiente') | Sí |
| PATCH | `/api/inmuebles/{id}/` | Editar inmueble | Sí (Owner/Admin) |
| DELETE | `/api/inmuebles/{id}/` | Eliminar inmueble | Sí (Owner/Admin) |
| POST | `/api/inmuebles/{id}/imagenes/` | Subir imágenes al inmueble | Sí (Owner/Admin) |

## Favoritos

| Método | Endpoint | Descripción | Requiere Token |
|--------|----------|-------------|----------------|
| GET | `/api/favoritos/` | Lista mis favoritos | Sí |
| POST | `/api/favoritos/` | Agregar/Quitar favorito (toggle) | Sí |

## Planes

| Método | Endpoint | Descripción | Requiere Token |
|--------|----------|-------------|----------------|
| GET | `/api/planes/` | Lista pública de planes activos | No |
| POST | `/api/admin/planes/` | Crear nuevo plan | Sí (Admin) |
| PATCH | `/api/admin/planes/{id}/` | Editar plan | Sí (Admin) |
| DELETE | `/api/admin/planes/{id}/` | Desactivar plan (lógico) | Sí (Admin) |

## Pagos

| Método | Endpoint | Descripción | Requiere Token |
|--------|----------|-------------|----------------|
| POST | `/api/pagos/iniciar/` | Crea pago pendiente | Sí |
| POST | `/api/pagos/confirmar/` | Confirma pago y activa inmueble (Simulado) | No |
| GET | `/api/admin/pagos/` | Lista todos los pagos | Sí (Admin) |
| GET | `/api/admin/stats/` | Estadísticas del dashboard | Sí (Admin) |

---

## Ejemplos de Respuesta

### Login Exitoso
```json
{
  "refresh": "...",
  "access": "...",
  "user": {
    "id": "uuid",
    "nombre": "Juan Perez",
    "email": "juan@example.com",
    "rol": "usuario"
  }
}
```

### Error de Validación
```json
{
  "error": "Mensaje descriptivo del error"
}
```

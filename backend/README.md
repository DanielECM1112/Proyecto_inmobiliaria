# Backend - Plataforma Inmobiliaria

## Stack
- Python 3.11.9
- Django 4.1.13
- Django REST Framework 3.14.0
- SQLite
- JWT con djangorestframework-simplejwt 5.3.0

## Instalación en Windows
1. git clone [repo]
2. cd backend
3. python -m venv venv
4. venv\Scripts\activate
5. pip install -r requirements.txt
6. copy .env.example .env
7. python manage.py migrate
8. python manage.py createsuperuser
9. python manage.py runserver

## Estructura
- `manage.py`: comando principal de Django.
- `backend/`: configuración global del proyecto.
- `apps/`: aplicaciones principales del sistema.
  - `users/`: autenticación, usuarios, recuperación de contraseña.
  - `plans/`: planes de publicación.
  - `properties/`: inmuebles, imágenes, favoritos y contacto.
  - `payments/`: pagos, confirmación y estadísticas.
- `db.sqlite3`: base de datos SQLite de desarrollo.
- `requirements.txt`: dependencias del backend.

## Requerimientos implementados
- RF01 ✅ Registro de usuarios
- RF02 ✅ Inicio de sesión JWT
- RF03 ✅ Recuperación de contraseña
- RF04 ✅ Gestión de roles (admin/usuario)
- RF05 ✅ Gestión de usuarios (admin)
- RF06 ✅ Publicación de inmuebles
- RF07 ✅ Gestión de inmuebles (admin)
- RF08 ✅ Visualización de inmuebles
- RF09 ✅ Filtros de búsqueda
- RF10 ✅ Galería de imágenes
- RF11 ✅ Videos YouTube
- RF12 ✅ Planes de publicación
- RF13 ✅ Métodos de pago
- RF14 ✅ Validación de pago
- RF15 ✅ Gestión de planes (admin)
- RF16 ✅ Panel administrativo
- RF17 ✅ Estados de publicación
- RF18 ⚠️ Responsive (frontend)
- RF19 ✅ Favoritos
- RF20 ✅ Contacto con WhatsApp

## Equipo
- Erik González (JORVAS70) - Backend/Admin
- Compañeros - Frontend

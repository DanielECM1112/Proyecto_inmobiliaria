# Proyecto Inmobiliaria LUXHABITAT

Plataforma inmobiliaria profesional desarrollada con Django REST Framework y React.

## Requisitos Previos

- Python 3.11.9
- Node.js & npm (para el frontend)

## Configuración del Backend (Windows)

Sigue estos pasos para levantar el servidor de desarrollo:

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Proyecto_inmobiliaria/backend
```

### 2. Crear entorno virtual
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
```bash
copy .env.example .env
```
*Nota: Puedes editar el archivo `.env` para cambiar la `SECRET_KEY` o los orígenes permitidos de CORS.*

### 5. Preparar la Base de Datos (SQLite)
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crear un administrador (opcional)
```bash
python manage.py createsuperuser
```

### 7. Iniciar el servidor
```bash
python manage.py runserver
```

El backend estará disponible en `http://127.0.0.1:8000/`.

## Documentación de la API
Consulta el archivo [API.md](backend/API.md) para ver todos los endpoints disponibles, parámetros y ejemplos de respuesta.

## Estructura del Proyecto
- `apps/`: Contiene las aplicaciones modulares (users, properties, plans, payments).
- `config/`: Configuración principal de Django (settings, urls).
- `media/`: Almacenamiento de imágenes de inmuebles.
- `staticfiles/`: Archivos estáticos recolectados.

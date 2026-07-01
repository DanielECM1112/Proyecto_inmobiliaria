#!/bin/bash
set -e

echo "Aplicando migraciones..."
python manage.py migrate --noinput

echo "Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo "Creando superusuario si no existe..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(
        email='admin@luxhabitat.com',
        nombre='Administrador',
        password='Admin2024!LuxH'
    )
    print('Superusuario creado: admin@luxhabitat.com')
else:
    print('Superusuario ya existe')
"

echo "Cargando planes iniciales si la BD está vacía..."
python manage.py shell -c "
from plans.models import Plan
if not Plan.objects.exists():
    from django.core.management import call_command
    call_command('loaddata', 'initial_plans')
    print('Planes cargados')
else:
    print(f'Ya existen {Plan.objects.count()} planes')
"

echo "Iniciando servidor gunicorn..."
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -

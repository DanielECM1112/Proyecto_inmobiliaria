import os
import sys
import django

# Ensure project package is importable
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
	sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Usuario

qs = Usuario.objects.filter(is_superuser=False)
count = qs.count()
qs.delete()
print('Eliminados:', count)

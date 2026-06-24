
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.sites.models import Site

site, created = Site.objects.get_or_create(id=1)
site.domain = 'localhost'
site.name = 'localhost'
site.save()

print(f'Sitio actualizado: ID={site.id}, Dominio={site.domain}, Nombre={site.name}')

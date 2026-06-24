
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp

site = Site.objects.get(id=1)
print(f'Sitio activo: {site.id} - {site.domain}')

print('\nAplicaciones sociales:')
for app in SocialApp.objects.all():
    sites = list(app.sites.values_list('id', 'domain'))
    print(f'  - {app.name} ({app.provider}): {sites}')
    if site not in app.sites.all():
        print(f'    => Asociando a {site.domain}...')
        app.sites.add(site)
        print('    => ¡Hecho!')

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Crea superusuario y planes iniciales si no existen'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        # Superusuario
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                email='admin@luxhabitat.com',
                nombre='Administrador',
                password='Admin2024!LuxH',
            )
            self.stdout.write(self.style.SUCCESS('Superusuario creado: admin@luxhabitat.com'))
        else:
            self.stdout.write('Superusuario ya existe')

        # Planes iniciales
        try:
            from plans.models import Plan
            if not Plan.objects.exists():
                from django.core.management import call_command
                call_command('loaddata', 'initial_plans')
                self.stdout.write(self.style.SUCCESS('Planes iniciales cargados'))
            else:
                self.stdout.write(f'Planes existentes: {Plan.objects.count()}')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'No se pudieron cargar planes: {e}'))

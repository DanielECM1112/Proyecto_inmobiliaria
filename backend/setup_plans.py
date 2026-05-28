import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from plans.models import Plan

def create_plans():
    plans_data = [
        {
            'name': 'Básico',
            'slug': 'basico',
            'max_photos': 3,
            'max_properties': 1,
            'price': 0.00,
            'description': 'Ideal para empezar'
        },
        {
            'name': 'Premium',
            'slug': 'premium',
            'max_photos': 10,
            'max_properties': 5,
            'price': 49000.00,
            'description': 'Para profesionales'
        },
        {
            'name': 'Empresarial',
            'slug': 'empresarial',
            'max_photos': 25,
            'max_properties': 20,
            'price': 99000.00,
            'description': 'Máxima visibilidad'
        }
    ]

    for data in plans_data:
        plan, created = Plan.objects.get_or_create(
            slug=data['slug'],
            defaults={
                'name': data['name'],
                'max_photos': data['max_photos'],
                'max_properties': data['max_properties'],
                'price': data['price'],
                'description': data['description'],
                'is_active': True
            }
        )
        if not created:
            plan.name = data['name']
            plan.max_photos = data['max_photos']
            plan.max_properties = data['max_properties']
            plan.price = data['price']
            plan.save()
        print(f"Plan {plan.name} {'creado' if created else 'actualizado'} con {plan.max_photos} fotos y {plan.max_properties} propiedades.")

if __name__ == '__main__':
    create_plans()

from django.db import migrations


def create_plans(apps, schema_editor):
    Plan = apps.get_model('plans', 'Plan')
    plans = [
        {
            'name': 'Básico',
            'description': 'Plan de inicio para publicar tu primera propiedad.',
            'duration_days': 30,
            'max_properties': 1,
            'max_photos': 5,
            'price': 0,
            'is_active': True,
            'slug': 'basico',
            'features': '["1 propiedad", "5 fotos por propiedad", "30 días de vigencia"]',
            'is_featured': False,
        },
        {
            'name': 'Estándar',
            'description': 'Plan ideal para agentes independientes.',
            'duration_days': 30,
            'max_properties': 3,
            'max_photos': 10,
            'price': 49000,
            'is_active': True,
            'slug': 'estandar',
            'features': '["3 propiedades", "10 fotos por propiedad", "30 días de vigencia", "Publicación destacada"]',
            'is_featured': False,
        },
        {
            'name': 'Premium',
            'description': 'Para inmobiliarias y agentes con alto volumen.',
            'duration_days': 30,
            'max_properties': 10,
            'max_photos': 20,
            'price': 99000,
            'is_active': True,
            'slug': 'premium',
            'features': '["10 propiedades", "20 fotos por propiedad", "30 días de vigencia", "Publicación destacada", "Soporte prioritario"]',
            'is_featured': True,
        },
    ]
    for data in plans:
        Plan.objects.get_or_create(slug=data['slug'], defaults=data)


def remove_plans(apps, schema_editor):
    Plan = apps.get_model('plans', 'Plan')
    Plan.objects.filter(slug__in=['basico', 'estandar', 'premium']).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('plans', '0004_alter_plan_options_alter_plan_features_and_more'),
    ]
    operations = [
        migrations.RunPython(create_plans, remove_plans),
    ]

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0002_alter_plan_options_plan_updated_at_alter_plan_activo_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='plan',
            old_name='nombre',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='plan',
            old_name='descripcion',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='plan',
            old_name='duracion_dias',
            new_name='duration_days',
        ),
        migrations.RenameField(
            model_name='plan',
            old_name='max_inmuebles',
            new_name='max_properties',
        ),
        migrations.RenameField(
            model_name='plan',
            old_name='max_imagenes',
            new_name='max_photos',
        ),
        migrations.RenameField(
            model_name='plan',
            old_name='precio',
            new_name='price',
        ),
        migrations.RenameField(
            model_name='plan',
            old_name='activo',
            new_name='is_active',
        ),
        migrations.AddField(
            model_name='plan',
            name='slug',
            field=models.SlugField(unique=True, default='temp-slug'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='plan',
            name='features',
            field=models.TextField(blank=True, default='[]'),
        ),
        migrations.AddField(
            model_name='plan',
            name='is_featured',
            field=models.BooleanField(default=False),
        ),
    ]

from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class Propiedad(models.Model):
    TIPOS = [
        ('casa', 'Casa'),
        ('apartamento', 'Apartamento'),
        ('penthouse', 'Penthouse'),
        ('local', 'Local Comercial'),
        ('finca', 'Finca'),
        ('lote', 'Lote'),
    ]
    ESTADOS = [
        ('disponible', 'Disponible'),
        ('negociacion', 'En Negociación'),
        ('vendido', 'Vendido'),
    ]
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPOS)
    precio = models.DecimalField(max_digits=15, decimal_places=2)
    area = models.FloatField()
    habitaciones = models.IntegerField()
    banos = models.IntegerField()
    ubicacion = models.CharField(max_length=300)
    descripcion = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, 
                              default='disponible')
    estrato = models.IntegerField(null=True, blank=True)      # OPCIONAL 
    garaje = models.BooleanField(default=False)               # OPCIONAL 
    piscina = models.BooleanField(default=False)              # OPCIONAL 
    amoblado = models.BooleanField(default=False)             # OPCIONAL 
    contacto_nombre = models.CharField(max_length=255, blank=True)
    contacto_telefono = models.CharField(max_length=20, blank=True)
    contacto_email = models.EmailField(blank=True)
    plan_nombre = models.CharField(max_length=50, default='gratuito')
    dias_duracion = models.PositiveIntegerField(default=30)
    prioridad_plan = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    fecha_expira = models.DateTimeField(null=True, blank=True)
    propietario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='propiedades' 
    ) 
    creado_en = models.DateTimeField(auto_now_add=True) 
    activo = models.BooleanField(default=True) 

    def __str__(self): 
        return self.titulo 

class ImagenPropiedad(models.Model): 
    propiedad = models.ForeignKey( 
        Propiedad, 
        on_delete=models.CASCADE, 
        related_name='imagenes' 
    ) 
    imagen = models.ImageField(upload_to='properties/') 
    es_principal = models.BooleanField(default=False) 
    subida_en = models.DateTimeField(auto_now_add=True) 

    def __str__(self): 
        return f"Imagen de {self.propiedad.titulo}" 

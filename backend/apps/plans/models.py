import uuid
from django.db import models

class Plan(models.Model):
    """
    Modelo que representa los planes de publicación de Propiedads.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Nombre del Plan")
    slug = models.SlugField(unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Descripción", default='', blank=True)
    duration_days = models.PositiveIntegerField(verbose_name="Duración (días)", default=30)
    max_properties = models.PositiveIntegerField(verbose_name="Máximo de Propiedades", default=10)
    max_photos = models.PositiveIntegerField(verbose_name="Máximo de Fotos por Propiedad", default=20)
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Precio", default=0.00)
    features = models.TextField(verbose_name="Características (JSON)", default='[]', blank=True)
    is_featured = models.BooleanField(default=False, verbose_name="¿Es plan destacado?")
    is_active = models.BooleanField(default=True, verbose_name="¿Está activo?")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    class Meta:
        verbose_name = "Plan"
        verbose_name_plural = "Planes"
        ordering = ['price']

    def __str__(self):
        return f"{self.name} - ${self.price}"

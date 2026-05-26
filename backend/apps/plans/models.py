import uuid
from django.db import models

class Plan(models.Model):
    """
    Modelo que representa los planes de publicación de inmuebles.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100, verbose_name="Nombre del Plan")
    descripcion = models.TextField(verbose_name="Descripción", default='', blank=True)
    duracion_dias = models.PositiveIntegerField(verbose_name="Duración (días)", default=30)
    max_inmuebles = models.PositiveIntegerField(verbose_name="Máximo de Inmuebles", default=10)
    max_imagenes = models.PositiveIntegerField(verbose_name="Máximo de Imágenes por Inmueble", default=20)
    precio = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Precio", default=0.00)
    activo = models.BooleanField(default=True, verbose_name="¿Está activo?")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    class Meta:
        verbose_name = "Plan"
        verbose_name_plural = "Planes"
        ordering = ['precio']

    def __str__(self):
        return f"{self.nombre} - ${self.precio}"

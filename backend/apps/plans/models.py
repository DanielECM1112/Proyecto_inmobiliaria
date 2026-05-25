import uuid
from django.db import models

class Plan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(default='', blank=True)
    duracion_dias = models.PositiveIntegerField(default=30)
    max_inmuebles = models.PositiveIntegerField(default=10)
    max_imagenes = models.PositiveIntegerField(default=20)
    precio = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Plan'
        verbose_name_plural = 'Planes'

    def __str__(self):
        return self.nombre


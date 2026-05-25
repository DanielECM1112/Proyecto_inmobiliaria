import uuid
from django.db import models
from django.conf import settings
from plans.models import Plan
from properties.models import Inmueble

class Pago(models.Model):
    METODO_CHOICES = (
        ('tarjeta', 'Tarjeta de Crédito'),
        ('pse', 'PSE'),
        ('nequi', 'Nequi'),
    )
    
    ESTADO_CHOICES = (
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pagos')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='pagos')
    inmueble = models.ForeignKey(Inmueble, on_delete=models.SET_NULL, null=True, blank=True, related_name='pagos')
    
    monto = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    metodo = models.CharField(max_length=20, choices=METODO_CHOICES, default='tarjeta')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    referencia_externa = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Pago'
        verbose_name_plural = 'Pagos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Pago {self.referencia_externa} - {self.usuario.email}"

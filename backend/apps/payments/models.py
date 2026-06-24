import uuid
from django.db import models
from django.conf import settings
from plans.models import Plan
from properties.models import Propiedad


class Pago(models.Model):
    METODO_CHOICES = (
        ('tarjeta', 'Tarjeta de Crédito'),
        ('pse', 'PSE'),
        ('nequi', 'Nequi'),
        ('wompi', 'Wompi'),
    )

    ESTADO_CHOICES = (
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),   
        ('rechazado', 'Rechazado'),
        ('en_proceso', 'En Proceso'),
        ('error', 'Error'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pagos')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='pagos')
    Propiedad = models.ForeignKey(Propiedad, on_delete=models.SET_NULL, null=True, blank=True, related_name='pagos')

    monto = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    metodo = models.CharField(max_length=20, choices=METODO_CHOICES, default='wompi')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    referencia_externa = models.CharField(max_length=255, unique=True, null=True, blank=True)

    # Wompi Specific
    wompi_payment_id = models.CharField(max_length=255, null=True, blank=True, verbose_name="ID de Transacción de Wompi")
    wompi_payment_status = models.CharField(max_length=100, null=True, blank=True, verbose_name="Estado del Pago en Wompi")
    wompi_transaction_id = models.CharField(max_length=255, null=True, blank=True, verbose_name="ID de Transacción de Wompi")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Pago'
        verbose_name_plural = 'Pagos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Pago {self.referencia_externa or self.id} - {self.usuario.email}"

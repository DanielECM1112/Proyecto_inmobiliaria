from django.db import models
from django.conf import settings

class Property(models.Model):
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('activo', 'Activo'),
        ('finalizado', 'Finalizado'),
    ]

    PROPERTY_TYPE_CHOICES = [
        ('casa', 'Casa'),
        ('apartamento', 'Apartamento'),
        ('lote', 'Lote'),
        ('oficina', 'Oficina'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    area = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='properties/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendiente')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Properties"

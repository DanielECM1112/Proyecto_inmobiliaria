import uuid
from django.db import models
from django.conf import settings
from plans.models import Plan

class Inmueble(models.Model):
    TIPO_CHOICES = (
        ('casa', 'Casa'),
        ('apartamento', 'Apartamento'),
        ('local', 'Local'),
        ('lote', 'Lote'),
        ('finca', 'Finca'),
    )
    
    ESTADO_CHOICES = (
        ('pendiente', 'Pendiente'),
        ('activo', 'Activo'),
        ('finalizado', 'Finalizado'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, default='')
    precio = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    ciudad = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='casa')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    url_video_youtube = models.URLField(max_length=255, blank=True, null=True)
    
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inmuebles')
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, related_name='inmuebles')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Inmueble'
        verbose_name_plural = 'Inmuebles'
        ordering = ['-created_at']

    def __str__(self):
        return self.titulo

class ImagenInmueble(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inmueble = models.ForeignKey(Inmueble, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='inmuebles/imagenes/')
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Imagen de Inmueble'
        verbose_name_plural = 'Imágenes de Inmuebles'
        ordering = ['orden']

class Favorito(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favoritos')
    inmueble = models.ForeignKey(Inmueble, on_delete=models.CASCADE, related_name='favoritos_por')
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'inmueble')
        verbose_name = 'Favorito'
        verbose_name_plural = 'Favoritos'

class Contacto(models.Model):
    inmueble = models.ForeignKey(Inmueble, on_delete=models.CASCADE, related_name='contactos')
    nombre = models.CharField(max_length=255)
    email = models.EmailField()
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Contacto'
        verbose_name_plural = 'Contactos'
        ordering = ['-fecha']

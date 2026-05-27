import uuid
from django.db import models
from django.conf import settings
from plans.models import Plan

class Inmueble(models.Model):
    """
    Modelo principal para los inmuebles de la plataforma.
    """
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
    titulo = models.CharField(max_length=255, verbose_name="Título")
    descripcion = models.TextField(verbose_name="Descripción")
    precio = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Precio")
    ciudad = models.CharField(max_length=100, verbose_name="Ciudad")
    direccion = models.CharField(max_length=255, verbose_name="Dirección")
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, verbose_name="Tipo de Inmueble")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente', verbose_name="Estado")
    whatsapp_contacto = models.CharField(max_length=20, blank=True, verbose_name="Whatsapp de contacto")
    url_video_youtube = models.URLField(max_length=255, blank=True, null=True, verbose_name="URL Video Youtube")
    
    # Relaciones
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, 
        related_name='inmuebles',
        verbose_name="Propietario"
    )
    plan = models.ForeignKey(
        Plan, 
        on_delete=models.PROTECT, 
        related_name='inmuebles',
        verbose_name="Plan de Publicación"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    class Meta:
        verbose_name = 'Inmueble'
        verbose_name_plural = 'Inmuebles'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.titulo} - {self.ciudad} (${self.precio})"

class ImagenInmueble(models.Model):
    """
    Modelo para manejar múltiples imágenes por inmueble.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inmueble = models.ForeignKey(
        Inmueble, 
        on_delete=models.CASCADE, 
        related_name='imagenes'
    )
    imagen = models.ImageField(upload_to='inmuebles/imagenes/')
    orden = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")

    class Meta:
        verbose_name = 'Imagen de Inmueble'
        verbose_name_plural = 'Imágenes de Inmuebles'
        ordering = ['orden']

class Favorito(models.Model):
    """
    Modelo para gestionar los inmuebles favoritos de los usuarios.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='favoritos'
    )
    inmueble = models.ForeignKey(
        Inmueble, 
        on_delete=models.CASCADE, 
        related_name='favoritos_por'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'inmueble')
        verbose_name = 'Favorito'
        verbose_name_plural = 'Favoritos'

class Contacto(models.Model):
    """
    Modelo para registrar los mensajes de contacto de interesados.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inmueble = models.ForeignKey(
        Inmueble, 
        on_delete=models.CASCADE, 
        related_name='contactos'
    )
    nombre = models.CharField(max_length=255, verbose_name="Nombre del interesado")
    email = models.EmailField(verbose_name="Email de contacto")
    mensaje = models.TextField(verbose_name="Mensaje")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de envío")

    class Meta:
        verbose_name = 'Contacto'
        verbose_name_plural = 'Contactos'
        ordering = ['-fecha']

    def __str__(self):
        return f"Mensaje de {self.nombre} para {self.inmueble.titulo}"

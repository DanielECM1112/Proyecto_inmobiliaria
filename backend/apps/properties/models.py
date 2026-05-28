from django.db import models
from django.conf import settings
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
import os
import uuid
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
    whatsapp_contacto = models.CharField(max_length=20, verbose_name="Whatsapp de contacto")
    
    # Campos opcionales solicitados
    amenidades = models.TextField(blank=True, null=True, verbose_name="Amenidades")
    detalles_extra = models.TextField(blank=True, null=True, verbose_name="Detalles extra")
    observaciones = models.TextField(blank=True, null=True, verbose_name="Observaciones")
    
    # Características del inmueble (AHORA OPCIONALES)
    habitaciones = models.IntegerField(default=0, blank=True, null=True, verbose_name="Habitaciones")
    banos = models.IntegerField(default=0, blank=True, null=True, verbose_name="Baños")
    area = models.FloatField(default=0, blank=True, null=True, verbose_name="Área en m²")
    
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

    def save(self, *args, **kwargs):
        # Aseguramos que el precio se guarde como número limpio
        if self.precio:
            self.precio = float(self.precio)
        super().save(*args, **kwargs)

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

    def save(self, *args, **kwargs):
        # Optimización de imagen antes de guardar
        if self.imagen:
            # Abrir la imagen
            img = Image.open(self.imagen)
            
            # Convertir a RGB si es necesario (para formatos como RGBA o P)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Redimensionar si es muy grande (max 1600px de ancho/alto para mejor calidad en pantallas grandes)
            max_size = (1600, 1600)
            if img.width > max_size[0] or img.height > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Guardar la imagen optimizada en un buffer
            temp_handle = BytesIO()
            # Guardamos como JPEG con alta calidad pero optimizado
            img.save(temp_handle, format='JPEG', quality=85, optimize=True)
            temp_handle.seek(0)
            
            # Crear un nuevo archivo de contenido
            # Mantenemos el nombre original pero con extensión .jpg para consistencia
            original_name = os.path.splitext(self.imagen.name)[0]
            file_name = f"{original_name}_{uuid.uuid4().hex[:8]}.jpg"
            self.imagen = ContentFile(temp_handle.read(), name=file_name)
            
        super().save(*args, **kwargs)

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

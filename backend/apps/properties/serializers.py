from urllib.parse import urlparse

from rest_framework import serializers
from .models import Inmueble, ImagenInmueble, Favorito, Contacto

class ImagenSerializer(serializers.ModelSerializer):
    """
    Serializer para las imágenes de los inmuebles.
    """
    url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenInmueble
        fields = ('id', 'url', 'orden')

    def get_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.imagen.url)
        return obj.imagen.url

class PlanBasicSerializer(serializers.ModelSerializer):
    """
    Serializer básico para el plan asociado al inmueble.
    """
    class Meta:
        model = Inmueble.plan.field.related_model
        fields = ('nombre', 'duracion_dias')

class UsuarioBasicSerializer(serializers.ModelSerializer):
    """
    Serializer básico para el usuario propietario del inmueble.
    """
    class Meta:
        model = Inmueble.usuario.field.related_model
        fields = ('nombre', 'email')

class InmuebleListSerializer(serializers.ModelSerializer):
    """
    Serializer resumido para el catálogo público de inmuebles.
    """
    thumbnail = serializers.SerializerMethodField()
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre')

    class Meta:
        model = Inmueble
        fields = (
            'id', 'titulo', 'precio', 'ciudad', 'tipo',
            'estado', 'thumbnail', 'usuario_nombre', 'created_at'
        )

    def get_thumbnail(self, obj):
        primera_img = obj.imagenes.first()
        if primera_img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primera_img.imagen.url)
            return primera_img.imagen.url
        return None

class InmuebleDetailSerializer(serializers.ModelSerializer):
    """
    Serializer detallado que retorna la estructura completa del inmueble.
    """
    imagenes = ImagenSerializer(many=True, read_only=True)
    plan = PlanBasicSerializer(read_only=True)
    usuario = UsuarioBasicSerializer(read_only=True)

    class Meta:
        model = Inmueble
        fields = (
            'id', 'titulo', 'descripcion', 'precio', 'ciudad',
            'direccion', 'tipo', 'estado', 'url_video_youtube',
            'whatsapp_contacto', 'imagenes', 'plan', 'usuario', 'created_at'
        )

class InmuebleCreateSerializer(serializers.Serializer):
    """
    Serializer para creación de inmuebles.
    """
    titulo = serializers.CharField(required=True, allow_blank=False)
    descripcion = serializers.CharField(required=True, allow_blank=False)
    precio = serializers.DecimalField(max_digits=15, decimal_places=2, required=True)
    ciudad = serializers.CharField(required=True, allow_blank=False)
    direccion = serializers.CharField(required=False, allow_blank=True, default='')
    tipo = serializers.ChoiceField(choices=Inmueble.TIPO_CHOICES, required=True)
    url_video_youtube = serializers.URLField(required=False, allow_blank=True, default='')
    whatsapp_contacto = serializers.CharField(required=False, allow_blank=True, default='')
    plan_id = serializers.UUIDField(required=True)

    def validate_titulo(self, value):
        if not value.strip():
            raise serializers.ValidationError('El título no puede estar vacío.')
        return value.strip()

    def validate_ciudad(self, value):
        if not value.strip():
            raise serializers.ValidationError('La ciudad no puede estar vacía.')
        return value.strip()

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a cero.')
        return value

    def validate_url_video_youtube(self, value):
        if not value:
            return value

        parsed = urlparse(value)
        hostname = parsed.hostname or ''
        if 'youtube.com' not in hostname and 'youtu.be' not in hostname:
            raise serializers.ValidationError('La URL de video debe ser de YouTube.')
        return value

class MisInmuebleSerializer(serializers.ModelSerializer):
    """
    Serializer para el endpoint de mis inmuebles con estado de pago.
    """
    plan = PlanBasicSerializer(read_only=True)
    estado_pago = serializers.SerializerMethodField()

    class Meta:
        model = Inmueble
        fields = (
            'id', 'titulo', 'precio', 'ciudad', 'direccion',
            'tipo', 'estado', 'plan', 'estado_pago', 'created_at'
        )

    def get_estado_pago(self, obj):
        pago = obj.pagos.order_by('-created_at').first()
        return pago.estado if pago else None

class FavoritoSerializer(serializers.ModelSerializer):
    """
    Serializer para los inmuebles favoritos de un usuario.
    """
    inmueble_detalle = InmuebleListSerializer(source='inmueble', read_only=True)

    class Meta:
        model = Favorito
        fields = ('id', 'inmueble', 'inmueble_detalle', 'created_at')
        read_only_fields = ('id', 'usuario', 'created_at')

class ContactoSerializer(serializers.ModelSerializer):
    """
    Serializer para los mensajes de contacto.
    """
    class Meta:
        model = Contacto
        fields = '__all__'
        read_only_fields = ('id', 'fecha')

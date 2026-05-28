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
            'id', 'titulo', 'precio', 'ciudad', 'direccion', 'tipo',
            'estado', 'thumbnail', 'usuario_nombre', 'created_at',
            'habitaciones', 'banos', 'area', 'whatsapp_contacto'
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
            'direccion', 'tipo', 'estado', 'amenidades', 'detalles_extra',
            'observaciones', 'whatsapp_contacto', 'imagenes', 'plan', 'usuario', 'created_at',
            'habitaciones', 'banos', 'area'
        )

class InmuebleCreateSerializer(serializers.Serializer):
    """
    Serializer para creación de inmuebles.
    """
    titulo = serializers.CharField(required=True, allow_blank=False)
    descripcion = serializers.CharField(required=True, allow_blank=False)
    precio = serializers.DecimalField(max_digits=15, decimal_places=2, required=True)
    ciudad = serializers.CharField(required=True, allow_blank=False)
    direccion = serializers.CharField(required=True, allow_blank=False) # Ahora es obligatorio
    tipo = serializers.ChoiceField(choices=Inmueble.TIPO_CHOICES, required=True)
    whatsapp_contacto = serializers.CharField(required=True, allow_blank=False) # Ahora es obligatorio
    
    # Campos opcionales (con default null/empty)
    habitaciones = serializers.IntegerField(required=False, min_value=0, max_value=20, allow_null=True)
    banos = serializers.IntegerField(required=False, min_value=0, max_value=20, allow_null=True)
    area = serializers.FloatField(required=False, min_value=0, allow_null=True)
    amenidades = serializers.CharField(required=False, allow_blank=True, default='')
    detalles_extra = serializers.CharField(required=False, allow_blank=True, default='')
    observaciones = serializers.CharField(required=False, allow_blank=True, default='')
    
    plan_id = serializers.UUIDField(required=True)

    def validate_titulo(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('El título es obligatorio para publicar.')
        return value.strip()

    def validate_ciudad(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Debes indicar la ciudad.')
        return value.strip()

    def validate_direccion(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('La dirección o barrio es obligatoria.')
        return value.strip()

    def validate_precio(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError('El precio debe ser un valor mayor a cero.')
        return value

    def validate_whatsapp_contacto(self, value):
        if not value:
            raise serializers.ValidationError('El WhatsApp de contacto es obligatorio.')
        # Limpiar caracteres no numéricos
        clean_number = ''.join(filter(str.isdigit, value))
        if len(clean_number) < 10:
            raise serializers.ValidationError('El número de WhatsApp debe tener al menos 10 dígitos.')
        return clean_number

class MisInmuebleSerializer(serializers.ModelSerializer):
    """
    Serializer para el endpoint de mis inmuebles con estado de pago.
    """
    plan = PlanBasicSerializer(read_only=True)
    pago_estado = serializers.SerializerMethodField()

    class Meta:
        model = Inmueble
        fields = (
            'id', 'titulo', 'precio', 'ciudad', 'direccion',
            'tipo', 'estado', 'plan', 'estado_pago', 'created_at',
            'habitaciones', 'banos', 'area'
        )

    def get_pago_estado(self, obj):
        pago = obj.pagos.order_by('-created_at').first()
        if not pago:
            return 'sin_pago'
        return pago.estado


class ImagenUploadSerializer(serializers.Serializer):
    """Serializer para la carga de imágenes."""
    imagen = serializers.ImageField(required=True)

    def validate_imagen(self, value):
        # Validar tamaño máximo 5MB
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('La imagen excede el tamaño máximo de 5MB.')

        # Validar extensión
        name = value.name.lower()
        if not any(name.endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']):
            raise serializers.ValidationError('Formato no permitido. Solo jpg, jpeg, png, webp.')

        return value

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

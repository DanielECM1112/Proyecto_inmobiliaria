from rest_framework import serializers
from .models import Inmueble, ImagenInmueble, Favorito, Contacto

class ImagenSerializer(serializers.ModelSerializer):
    """
    Serializer para las imágenes de los inmuebles.
    """
    class Meta:
        model = ImagenInmueble
        fields = ('id', 'imagen', 'orden')

class InmuebleListSerializer(serializers.ModelSerializer):
    """
    Serializer resumido para el catálogo público de inmuebles.
    """
    # Obtenemos la primera imagen como miniatura si existe
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
    Serializer detallado que incluye descripción e imágenes anidadas.
    """
    imagenes = ImagenSerializer(many=True, read_only=True)
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre')
    plan_nombre = serializers.ReadOnlyField(source='plan.nombre')

    class Meta:
        model = Inmueble
        fields = '__all__'

class InmuebleCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para creación y edición de inmuebles.
    """
    class Meta:
        model = Inmueble
        fields = (
            'titulo', 'descripcion', 'precio', 'ciudad', 
            'direccion', 'tipo', 'url_video_youtube', 'plan'
        )

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a cero.")
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

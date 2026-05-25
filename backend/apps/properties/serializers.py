from rest_framework import serializers
from properties.models import Inmueble, ImagenInmueble, Favorito, Contacto

class ImagenInmuebleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenInmueble
        fields = ('id', 'imagen', 'orden')

class InmuebleSerializer(serializers.ModelSerializer):
    imagenes = ImagenInmuebleSerializer(many=True, read_only=True)
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre')

    class Meta:
        model = Inmueble
        fields = '__all__'
        read_only_fields = ('id', 'usuario', 'estado', 'created_at', 'updated_at')

class FavoritoSerializer(serializers.ModelSerializer):
    inmueble_detalle = InmuebleSerializer(source='inmueble', read_only=True)

    class Meta:
        model = Favorito
        fields = ('id', 'inmueble', 'inmueble_detalle', 'fecha')

class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = '__all__'

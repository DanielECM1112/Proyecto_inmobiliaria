from rest_framework import serializers
from .models import Propiedad, ImagenPropiedad

class ImagenPropiedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenPropiedad
        fields = ['id', 'imagen', 'es_principal']

class PropiedadSerializer(serializers.ModelSerializer):
    imagenes = ImagenPropiedadSerializer(many=True, read_only=True)
    email_contacto_final = serializers.SerializerMethodField()

    def get_email_contacto_final(self, obj):
        return obj.contacto_email or (obj.propietario.email if obj.propietario else '')

    class Meta:
        model = Propiedad
        fields = '__all__'

class PropiedadCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear propiedades con validaciones robustas
    y conversión flexible de tipos de datos desde FormData.
    """
    precio = serializers.DecimalField(max_digits=15, decimal_places=2, required=True)
    area = serializers.FloatField(required=True)
    habitaciones = serializers.IntegerField(required=True, min_value=0)
    banos = serializers.IntegerField(required=True, min_value=0)
    estrato = serializers.IntegerField(required=False, allow_null=True)
    garaje = serializers.BooleanField(required=False, default=False)
    piscina = serializers.BooleanField(required=False, default=False)
    amoblado = serializers.BooleanField(required=False, default=False)
    
    class Meta:
        model = Propiedad
        exclude = ['propietario', 'creado_en', 'activo']
    
    def validate_precio(self, value):
        """Validar que el precio sea mayor a 0"""
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0")
        return value
    
    def validate_area(self, value):
        """Validar que el área sea mayor a 0"""
        if value <= 0:
            raise serializers.ValidationError("El área debe ser mayor a 0")
        return value
    
    def validate_habitaciones(self, value):
        """Validar que las habitaciones sean válidas"""
        if value < 0:
            raise serializers.ValidationError("Las habitaciones no pueden ser negativas")
        return value
    
    def validate_banos(self, value):
        """Validar que los baños sean válidos"""
        if value < 0:
            raise serializers.ValidationError("Los baños no pueden ser negativos")
        return value

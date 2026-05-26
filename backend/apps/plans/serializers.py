from rest_framework import serializers
from .models import Plan

class PlanPublicoSerializer(serializers.ModelSerializer):
    """
    Serializer para la vista pública de planes.
    Muestra solo la información relevante para el cliente.
    """
    class Meta:
        model = Plan
        fields = (
            'id', 
            'nombre', 
            'duracion_dias', 
            'max_inmuebles', 
            'max_imagenes', 
            'precio'
        )

class PlanAdminSerializer(serializers.ModelSerializer):
    """
    Serializer completo para la gestión administrativa de planes.
    """
    class Meta:
        model = Plan
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

from rest_framework import serializers
from .models import Plan
import json

class PlanPublicoSerializer(serializers.ModelSerializer):
    """
    Serializer para la vista pública de planes.
    Muestra solo la información relevante para el cliente.
    """
    features = serializers.SerializerMethodField()
    
    class Meta:
        model = Plan
        fields = (
            'id', 
            'name', 
            'slug',
            'description',
            'duration_days', 
            'max_properties', 
            'max_photos', 
            'price',
            'features',
            'is_featured',
            'is_active'
        )
    
    def get_features(self, obj):
        try:
            return json.loads(obj.features) if obj.features else []
        except json.JSONDecodeError:
            return []

class PlanAdminSerializer(serializers.ModelSerializer):
    """
    Serializer completo para la gestión administrativa de planes.
    """
    class Meta:
        model = Plan
        fields = '__all__'
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at')

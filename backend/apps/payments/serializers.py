from rest_framework import serializers
from payments.models import Pago

class PagoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre')
    plan_name = serializers.ReadOnlyField(source='plan.name')
    
    class Meta:
        model = Pago
        fields = '__all__'
        read_only_fields = ('id', 'usuario', 'estado', 'referencia_externa', 'created_at', 'updated_at')

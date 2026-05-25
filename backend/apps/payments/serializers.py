from rest_framework import serializers
from payments.models import Pago

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'
        read_only_fields = ('id', 'usuario', 'estado', 'referencia_externa', 'created_at', 'updated_at')

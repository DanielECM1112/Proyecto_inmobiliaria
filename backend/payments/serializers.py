from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    status = serializers.CharField(source='payment_status', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'user', 'user_name', 'plan', 'plan_name', 'amount', 'payment_method', 'payment_status', 'status', 'transaction_id', 'created_at']

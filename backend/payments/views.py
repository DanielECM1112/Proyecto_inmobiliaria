from rest_framework import viewsets, permissions
from .models import Payment
from .serializers import PaymentSerializer
from .permissions import IsAdminOrOwnerOnly

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_permissions(self):
        # Solo usuarios autenticados pueden interactuar con pagos
        return [permissions.IsAuthenticated(), IsAdminOrOwnerOnly()]

    def perform_create(self, serializer):
        # El pago se asigna al usuario actual
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # Admin ve todos los pagos, usuario solo los suyos
        if self.request.user and self.request.user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)

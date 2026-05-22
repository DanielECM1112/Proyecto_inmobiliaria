from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Payment
from .serializers import PaymentSerializer

class PaymentAdminViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # Si no se envía usuario (por ejemplo en un mock o desde el front sin ID)
        # usamos el usuario autenticado
        if 'user' not in self.request.data and self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

@api_view(['GET'])
@permission_classes([AllowAny])
def payment_mock_api(request):
    # Retorna un arreglo vacío limpio para que tu panel cargue sin errores
    return Response([])
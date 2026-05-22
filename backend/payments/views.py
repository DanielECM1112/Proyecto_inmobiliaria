from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def payment_mock_api(request):
    # Retorna un arreglo vacío limpio para que tu panel cargue sin errores
    return Response([])
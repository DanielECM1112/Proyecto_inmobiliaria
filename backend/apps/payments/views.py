from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from payments.serializers import PagoSerializer
from payments.services import PagoService
from users.permissions import IsAdminRole
from payments.models import Pago

class IniciarPagoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from plans.models import Plan
        plan_id = request.data.get('plan')
        inmueble_id = request.data.get('inmueble')
        metodo = request.data.get('metodo', 'tarjeta')
        
        try:
            plan = Plan.objects.get(id=plan_id)
            pago = PagoService.iniciar_pago(
                usuario=request.user,
                plan=plan,
                inmueble_id=inmueble_id,
                metodo=metodo
            )
            return Response(PagoSerializer(pago).data, status=status.HTTP_201_CREATED)
        except Plan.DoesNotExist:
            return Response({"error": "Plan no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class ConfirmarPagoView(APIView):
    permission_classes = [AllowAny] # Simulación de webhook de pasarela

    def post(self, request):
        referencia = request.data.get('referencia')
        pago = PagoService.confirmar_pago(referencia)
        if pago:
            return Response(PagoSerializer(pago).data)
        return Response({"error": "Pago no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class AdminPagoListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = PagoSerializer
    queryset = Pago.objects.all()

class AdminPagoDetailView(generics.UpdateAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = PagoSerializer
    queryset = Pago.objects.all()

class AdminStatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        stats = PagoService.obtener_estadisticas_admin()
        return Response(stats)

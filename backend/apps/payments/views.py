from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.exceptions import PermissionDenied
from payments.serializers import PagoSerializer
from payments.services import PagoService
from users.permissions import IsAdminRole
from payments.models import Pago

class IniciarPagoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        inmueble_id = request.data.get('inmueble_id')
        metodo = request.data.get('metodo', 'tarjeta')

        try:
            pago_data = PagoService.iniciar_pago(
                usuario=request.user,
                inmueble_id=inmueble_id,
                plan_id=plan_id,
                metodo=metodo
            )
            return Response(pago_data, status=status.HTTP_201_CREATED)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ConfirmarPagoView(APIView):
    permission_classes = [AllowAny]  # Simulación de webhook de pasarela

    def post(self, request):
        referencia = request.data.get('referencia')
        try:
            pago_data = PagoService.confirmar_pago(referencia)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if pago_data is None:
            return Response({"error": "Pago no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(pago_data, status=status.HTTP_200_OK)

class AdminPagoListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = PagoSerializer
    queryset = Pago.objects.all()

class AdminPagoDetailView(generics.UpdateAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = PagoSerializer
    queryset = Pago.objects.all()

class MisPagosView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PagoSerializer

    def get_queryset(self):
        return PagoService.obtener_mis_pagos(self.request.user)

class AdminStatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        stats = PagoService.obtener_estadisticas_completas()
        return Response(stats)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.exceptions import PermissionDenied
from payments.serializers import PagoSerializer
from payments.services import PagoService, WompiService
from users.permissions import IsAdminRole
from payments.models import Pago


class IniciarPagoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        Propiedad_id = request.data.get('Propiedad_id')

        try:
            pago_data = PagoService.iniciar_pago(
                usuario=request.user,
                Propiedad_id=Propiedad_id,
                plan_id=plan_id,
                metodo='wompi'
            )
            return Response(pago_data, status=status.HTTP_201_CREATED)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class WompiWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Recibe webhooks de Wompi para actualizar el estado de los pagos
        """
        try:
            WompiService.process_webhook(request.data)
            return Response({"success": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ConfirmarPagoView(APIView):
    permission_classes = [AllowAny]

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


class ProcesarPagoView(APIView):
    """
    Vista para procesar pagos de planes.
    Los admins saltan el pago, los usuarios regulares deben pagar.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')

        if not plan_id:
            return Response({"error": "plan_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        # Si es admin, salta el pago
        if request.user.is_staff:
            return Response({
                "success": True,
                "message": "Acceso administrativo - Pago no requerido"
            }, status=status.HTTP_200_OK)

        # Para usuarios regulares, procesar el pago via Wompi
        try:
            pago_data = PagoService.iniciar_pago(
                usuario=request.user,
                Propiedad_id=None,
                plan_id=plan_id
            )
            return Response(pago_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Error al procesar pago: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class SincronizarPlanView(APIView):
    """
    POST /pagos/sincronizar-plan/
    1. Verifica activamente en Wompi todos los pagos PENDIENTES del usuario.
    2. Si alguno está APPROVED en Wompi, lo procesa y activa el plan.
    3. Luego sincroniza el plan_activo desde los pagos aprobados en DB.
    Soluciona el problema de que en localhost/Docker el webhook de Wompi no llega.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        usuario = request.user

        # 1. Verificar activamente en Wompi todos los pagos pendientes
        pagos_pendientes = Pago.objects.filter(
            usuario=usuario,
            estado='pendiente',
            referencia_externa__isnull=False
        ).order_by('-created_at')

        verificaciones = []
        for pago in pagos_pendientes:
            estado_resultante = WompiService.verificar_pago_en_wompi(pago.referencia_externa)
            verificaciones.append({
                'referencia': pago.referencia_externa,
                'estado': estado_resultante,
                'plan': pago.plan.name
            })

        # 2. Sincronizar plan_activo desde pagos aprobados en DB
        sincronizado = PagoService.sincronizar_plan_usuario(usuario)

        # 3. Recargar el usuario desde la DB para tener datos frescos
        usuario.refresh_from_db()

        plan_activo = usuario.plan_activo
        plan_data = None
        if plan_activo:
            plan_data = {
                "id": str(plan_activo.id),
                "name": plan_activo.name,
                "max_properties": plan_activo.max_properties,
                "max_photos": plan_activo.max_photos,
                "price": str(plan_activo.price),
            }

        return Response({
            "sincronizado": sincronizado,
            "tiene_plan": plan_activo is not None,
            "plan": plan_data,
            "plan_expira": usuario.plan_expira_at.isoformat() if usuario.plan_expira_at else None,
            "verificaciones_wompi": verificaciones,
        }, status=status.HTTP_200_OK)


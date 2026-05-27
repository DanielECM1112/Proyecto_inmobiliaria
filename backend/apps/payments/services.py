import logging
import uuid
from django.db import transaction
from django.core.exceptions import PermissionDenied
from payments.models import Pago
from properties.models import Inmueble

logger = logging.getLogger('apps')

class PagoService:
    @staticmethod
    @transaction.atomic
    def iniciar_pago(usuario, inmueble_id, plan_id, metodo='tarjeta'):
        """
        Inicia un pago verificando que el inmueble y el plan sean válidos,
        que el inmueble pertenezca al usuario y que no exista un pago aprobado previo.
        """
        from plans.models import Plan

        if not inmueble_id:
            raise ValueError("El campo inmueble_id es obligatorio.")
        if not plan_id:
            raise ValueError("El campo plan_id es obligatorio.")

        try:
            inmueble = Inmueble.objects.get(id=inmueble_id)
        except Inmueble.DoesNotExist:
            raise ValueError("Inmueble no encontrado.")

        if inmueble.usuario_id != usuario.id:
            raise PermissionDenied("El inmueble no pertenece al usuario autenticado.")

        # Verificar que no exista un pago pendiente o aprobado para el mismo inmueble
        if Pago.objects.filter(inmueble=inmueble, estado__in=['pendiente', 'aprobado']).exists():
            raise ValueError("Ya existe un pago pendiente o aprobado para este inmueble.")

        # Validar método de pago
        metodo = (metodo or '').lower()
        if metodo not in ['tarjeta', 'pse', 'nequi']:
            raise ValueError("Método de pago inválido. Opciones válidas: tarjeta, pse, nequi.")

        try:
            plan = Plan.objects.get(id=plan_id)
        except Plan.DoesNotExist:
            raise ValueError("Plan no encontrado.")

        if not getattr(plan, 'activo', True):
            raise ValueError("El plan seleccionado no está activo.")

        referencia = f"{uuid.uuid4()}"
        monto = plan.precio

        pago = Pago.objects.create(
            usuario=usuario,
            plan=plan,
            inmueble=inmueble,
            monto=monto,
            metodo=metodo,
            estado='pendiente',
            referencia_externa=referencia
        )

        logger.info(f"Pago iniciado: {referencia} por {usuario.email}")

        return {
            "referencia": referencia,
            "monto": f"{monto:.2f}",
            "estado": pago.estado
        }

    @staticmethod
    @transaction.atomic
    def confirmar_pago(referencia):
        """
        Confirma el pago con la referencia enviada, aprueba el pago y activa el inmueble.
        """
        if not referencia:
            raise ValueError("El campo referencia es obligatorio.")

        try:
            pago = Pago.objects.select_for_update().get(referencia_externa=referencia)
        except Pago.DoesNotExist:
            return None

        if pago.estado == 'aprobado':
            logger.info(f"Pago ya estaba aprobado: {referencia}")
            return {
                "referencia": pago.referencia_externa,
                "monto": f"{pago.monto:.2f}",
                "estado": pago.estado
            }

        pago.estado = 'aprobado'
        pago.save()

        if pago.inmueble:
            pago.inmueble.estado = 'activo'
            pago.inmueble.save()
            logger.info(f"Inmueble activado por pago: {pago.inmueble.id}")

        logger.info(f"Pago confirmado: {referencia}")

        return {
            "referencia": pago.referencia_externa,
            "monto": f"{pago.monto:.2f}",
            "estado": pago.estado
        }

    @staticmethod
    def obtener_estadisticas_completas():
        """
        Calcula estadísticas completas para el dashboard administrativo usando agregaciones.
        """
        from users.models import Usuario
        from properties.models import Inmueble
        from plans.models import Plan
        from django.utils import timezone
        from django.db.models import Sum, Count, Q

        ahora = timezone.now()
        inicio_mes = ahora.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        usuarios_stats = Usuario.objects.aggregate(
            total=Count('id'),
            activos=Count('id', filter=Q(is_active=True)),
            nuevos_mes=Count('id', filter=Q(created_at__gte=inicio_mes))
        )

        inmuebles_stats = Inmueble.objects.aggregate(
            total=Count('id'),
            activos=Count('id', filter=Q(estado='activo')),
            pendientes=Count('id', filter=Q(estado='pendiente')),
            finalizados=Count('id', filter=Q(estado='finalizado'))
        )

        pagos_stats = Pago.objects.aggregate(
            total=Count('id'),
            aprobados=Count('id', filter=Q(estado='aprobado')),
            pendientes=Count('id', filter=Q(estado='pendiente')),
            rechazados=Count('id', filter=Q(estado='rechazado')),
            ingresos_mes=Sum('monto', filter=Q(estado='aprobado', created_at__gte=inicio_mes))
        )

        planes_populares = Plan.objects.annotate(
            total_ventas=Count('pagos', filter=Q(pagos__estado='aprobado'))
        ).order_by('-total_ventas')[:5]

        planes_populares_data = [
            {"nombre": plan.nombre, "total_ventas": plan.total_ventas}
            for plan in planes_populares
        ]

        if not planes_populares_data:
            planes_populares_data = [
                {"nombre": "Plan Básico", "total_ventas": 0}
            ]

        return {
            "usuarios": {
                "total": usuarios_stats['total'],
                "activos": usuarios_stats['activos'],
                "nuevos_este_mes": usuarios_stats['nuevos_mes']
            },
            "inmuebles": {
                "total": inmuebles_stats['total'],
                "activos": inmuebles_stats['activos'],
                "pendientes": inmuebles_stats['pendientes'],
                "finalizados": inmuebles_stats['finalizados']
            },
            "pagos": {
                "total": pagos_stats['total'],
                "aprobados": pagos_stats['aprobados'],
                "pendientes": pagos_stats['pendientes'],
                "rechazados": pagos_stats['rechazados'],
                "ingresos_este_mes": str(pagos_stats['ingresos_mes'] or "0.00")
            },
            "planes_populares": planes_populares_data
        }

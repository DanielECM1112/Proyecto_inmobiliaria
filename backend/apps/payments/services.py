import logging
from django.db import transaction
from payments.models import Pago
from properties.models import Inmueble

logger = logging.getLogger('apps')

class PagoService:
    @staticmethod
    def iniciar_pago(usuario, plan, inmueble=None, metodo='tarjeta', monto=None):
        """
        Crea un registro de pago en estado 'pendiente'.
        """
        referencia = f"LUX-{transaction.get_connection().connection.get_autocommit()}-{Pago.objects.count() + 1}"
        # En un sistema real usaríamos un generador de UUID o algo más robusto
        import uuid
        referencia = f"LUX-{str(uuid.uuid4())[:8].upper()}"
        
        pago = Pago.objects.create(
            usuario=usuario,
            plan=plan,
            inmueble=inmueble,
            monto=monto or plan.precio,
            metodo=metodo,
            estado='pendiente',
            referencia_externa=referencia
        )
        logger.info(f"Pago iniciado: {referencia} por {usuario.email}")
        return pago

    @staticmethod
    @transaction.atomic
    def confirmar_pago(referencia):
        """
        Simula la confirmación de una pasarela. Aprueba el pago y activa el inmueble.
        """
        try:
            pago = Pago.objects.get(referencia_externa=referencia)
            if pago.estado == 'aprobado':
                return pago
            
            pago.estado = 'aprobado'
            pago.save()
            
            # Regla de negocio: Activar inmueble asociado
            if pago.inmueble:
                pago.inmueble.estado = 'activo'
                pago.inmueble.save()
                logger.info(f"Inmueble activado por pago: {pago.inmueble.id}")
            
            logger.info(f"Pago confirmado: {referencia}")
            return pago
        except Pago.DoesNotExist:
            logger.error(f"Intento de confirmar pago inexistente: {referencia}")
            return None

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
        
        # Agregaciones de Usuarios
        usuarios_stats = Usuario.objects.aggregate(
            total=Count('id'),
            activos=Count('id', filter=Q(is_active=True)),
            nuevos_mes=Count('id', filter=Q(created_at__gte=inicio_mes))
        )
        
        # Agregaciones de Inmuebles
        inmuebles_stats = Inmueble.objects.aggregate(
            total=Count('id'),
            activos=Count('id', filter=Q(estado='activo')),
            pendientes=Count('id', filter=Q(estado='pendiente')),
            finalizados=Count('id', filter=Q(estado='finalizado'))
        )
        
        # Agregaciones de Pagos
        pagos_stats = Pago.objects.aggregate(
            total=Count('id'),
            aprobados=Count('id', filter=Q(estado='aprobado')),
            pendientes=Count('id', filter=Q(estado='pendiente')),
            rechazados=Count('id', filter=Q(estado='rechazado')),
            ingresos_mes=Sum('monto', filter=Q(estado='aprobado', created_at__gte=inicio_mes))
        )
        
        # Planes populares (ventas aprobadas)
        planes_populares = Plan.objects.annotate(
            total_ventas=Count('pagos', filter=Q(pagos__estado='aprobado'))
        ).order_by('-total_ventas')[:5]

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
            "planes_populares": [
                {"nombre": p.nombre, "total_ventas": p.total_ventas} 
                for p in planes_populares
            ]
        }

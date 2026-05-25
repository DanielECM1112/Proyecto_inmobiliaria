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
    def obtener_estadisticas_admin():
        """
        Calcula estadísticas para el panel admin.
        """
        from users.models import Usuario
        from django.utils import timezone
        from django.db.models import Sum
        
        ahora = timezone.now()
        inicio_mes = ahora.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        stats = {
            'total_usuarios': Usuario.objects.count(),
            'inmuebles_por_estado': {
                'activos': Inmueble.objects.filter(estado='activo').count(),
                'pendientes': Inmueble.objects.filter(estado='pendiente').count(),
                'finalizados': Inmueble.objects.filter(estado='finalizado').count(),
            },
            'ingresos_mes': Pago.objects.filter(
                estado='aprobado', 
                created_at__gte=inicio_mes
            ).aggregate(Sum('monto'))['monto__sum'] or 0
        }
        return stats

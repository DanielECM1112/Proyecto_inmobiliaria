import logging
import uuid
import requests
from django.db import transaction
from django.core.exceptions import PermissionDenied
from django.conf import settings
from payments.models import Pago

logger = logging.getLogger('apps')


class WompiService:
    """
    Servicio para integración con Wompi Sandbox
    """

    @staticmethod
    def get_base_url():
        if settings.WOMPI_ENV == 'sandbox':
            return 'https://sandbox.wompi.co/v1'
        return 'https://production.wompi.co/v1'

    @staticmethod
    def get_headers():
        return {
            'Authorization': f'Bearer {settings.WOMPI_PRIVATE_KEY}',
            'Content-Type': 'application/json',
        }

    @staticmethod
    def create_payment_link(usuario, plan, propiedad=None):
        """
        Crea un link de pago en Wompi para el usuario y plan seleccionado
        """
        referencia = str(uuid.uuid4())

        with transaction.atomic():
            # 1. Crear registro de pago en la base de datos
            pago = Pago.objects.create(
                usuario=usuario,
                plan=plan,
                Propiedad=propiedad,
                monto=plan.price,
                metodo='wompi',
                estado='pendiente',
                referencia_externa=referencia
            )

            # 2. Preparar datos para Wompi
            payment_data = {
                "name": plan.name,
                "description": f"Pago del plan {plan.name}",
                "single_use": True,
                "collect_shipping": False,
                "amount_in_cents": int(float(plan.price) * 100),
                "currency": "COP",
                "customer_email": usuario.email,
                "reference": referencia,
                "redirect_url": "http://localhost:3000/payment-success"
            }

            try:
                # 3. Enviar solicitud a Wompi para crear link de pago
                logger.error("========== DATOS ENVIADOS A WOMPI ==========")
                logger.error(payment_data)
                response = requests.post(
                    f'{WompiService.get_base_url()}/payment_links',
                    json=payment_data,
                    headers=WompiService.get_headers()
                )
                logger.error("RESPUESTA WOMPI:")
                logger.error(response.text)
                response.raise_for_status()
                wompi_data = response.json()
                
                logger.error("========== RESPUESTA EXITOSA DE WOMPI ==========")
                logger.error(wompi_data)
                
                logger.info(f"Link de pago creado exitosamente: {referencia}")

                # 4. Guardar datos de Wompi en el pago
                if 'data' in wompi_data:
                    pago.wompi_payment_id = wompi_data['data'].get('id')
                    pago.save()

                    # Construir la URL del link de pago usando el ID que devuelve Wompi
                    payment_link_id = wompi_data['data'].get('id')
                    payment_link = f"https://checkout.wompi.co/l/{payment_link_id}"
                    
                    return {
                            "success": True,
                            "payment_id": str(pago.id),
                            "payment_link": payment_link,
                            "reference": referencia,
                            "wompi_data": wompi_data
                        }
                else:
                    raise Exception(f"Respuesta inesperada de Wompi: {wompi_data}")

            except requests.exceptions.RequestException as e:
                logger.error("========== ERROR COMPLETO WOMPI ==========")
                logger.error(f"Status Code: {e.response.status_code if e.response else 'Sin respuesta'}")

                if e.response:
                    logger.error(f"Response Text: {e.response.text}")
                    try:
                        logger.error(f"Response JSON: {e.response.json()}")
                    except Exception as json_error:
                        logger.error(f"No se pudo convertir a JSON: {json_error}")

                logger.error(f"Excepción completa: {str(e)}")

                pago.estado = 'error'
                pago.save()

                raise Exception(
                    f"Error Wompi ({e.response.status_code if e.response else 'desconocido'}): "
                    f"{e.response.text if e.response else str(e)}"
                )

    @staticmethod
    def process_webhook(data):
        """
        Procesa un webhook entrante de Wompi para actualizar el estado del pago
        """
        logger.info(f"Webhook de Wompi recibido: {data}")

        try:
            # Obtener datos del evento
            transaction_data = data.get('data', {}).get('transaction', {})
            referencia = transaction_data.get('reference')
            status = transaction_data.get('status')
            wompi_transaction_id = transaction_data.get('id')

            if not referencia:
                logger.error("No se encontró referencia en el webhook")
                return

            # Buscar el pago en la base de datos
            try:
                pago = Pago.objects.get(referencia_externa=referencia)
            except Pago.DoesNotExist:
                logger.error(f"No se encontró pago con referencia {referencia}")
                return

            with transaction.atomic():
                # Actualizar datos del pago
                pago.wompi_transaction_id = wompi_transaction_id
                pago.wompi_payment_status = status

                # Mapear estado de Wompi a nuestro sistema
                if status == 'APPROVED':
                    pago.estado = 'aprobado'
                    # Actualizar el plan del usuario
                    usuario = pago.usuario
                    plan = pago.plan
                    from django.utils import timezone
                    usuario.plan_activo = plan
                    usuario.plan_activado_at = timezone.now()
                    duracion = int(getattr(plan, 'duration_days', 30))
                    usuario.plan_expira_at = timezone.now() + timezone.timedelta(days=duracion)
                    usuario.save()
                    # Si hay propiedad asociada, activarla
                    if pago.Propiedad:
                        pago.Propiedad.estado = 'activo'
                        pago.Propiedad.save()
                        logger.info(f"Propiedad {pago.Propiedad.id} activada por pago aprobado")
                elif status == 'DECLINED' or status == 'ERROR':
                    pago.estado = 'rechazado'
                elif status == 'PENDING':
                    pago.estado = 'pendiente'

                pago.save()
                logger.info(f"Pago {referencia} actualizado a estado {pago.estado}")

        except Exception as e:
            logger.error(f"Error al procesar webhook de Wompi: {str(e)}")
            raise


class PagoService:
    @staticmethod
    @transaction.atomic
    def iniciar_pago(usuario, Propiedad_id, plan_id, metodo='wompi'):
        """
        Inicia un pago verificando que la propiedad y el plan sean válidos,
        que la propiedad pertenezca al usuario y que no exista un pago aprobado previo.
        """
        from plans.models import Plan

        if not plan_id:
            raise ValueError("El campo plan_id es obligatorio.")

        propiedad = None
        if Propiedad_id:
            from properties.models import Propiedad
            try:
                propiedad = Propiedad.objects.get(id=Propiedad_id)
                if propiedad.usuario_id != usuario.id:
                    raise PermissionDenied("La propiedad no pertenece al usuario autenticado.")
            except Propiedad.DoesNotExist:
                raise ValueError("Propiedad no encontrada.")

            # Verificar que no exista un pago pendiente o aprobado para la misma propiedad
            if Pago.objects.filter(Propiedad=propiedad, estado__in=['pendiente', 'aprobado']).exists():
                raise ValueError("Ya existe un pago pendiente o aprobado para esta propiedad.")

        # Validar que el usuario no tenga un plan activo
        from django.utils import timezone
        ultimo_aprobado = Pago.objects.filter(usuario=usuario, estado='aprobado').order_by('-created_at').first()
        if ultimo_aprobado:
            try:
                duracion = int(getattr(ultimo_aprobado.plan, 'duration_days', 30))
                fecha_expiracion = ultimo_aprobado.created_at + timezone.timedelta(days=duracion)
                if fecha_expiracion > timezone.now():
                    raise ValueError(f"Ya tienes un plan activo hasta {fecha_expiracion.strftime('%Y-%m-%d')}")
            except Exception:
                pass

        try:
            plan = Plan.objects.get(id=plan_id)
        except Plan.DoesNotExist:
            raise ValueError("Plan no encontrado.")

        if not getattr(plan, 'is_active', True):
            raise ValueError("El plan seleccionado no está activo.")

        # Usar Wompi para crear el link de pago
        return WompiService.create_payment_link(usuario, plan, propiedad)

    @staticmethod
    @transaction.atomic
    def confirmar_pago(referencia):
        """
        Confirma un pago (para compatibilidad con la interfaz existente)
        La confirmación principal se hace via webhook
        """
        if not referencia:
            raise ValueError("El campo referencia es obligatorio.")

        try:
            pago = Pago.objects.get(referencia_externa=referencia)
            return {
                "referencia": pago.referencia_externa,
                "monto": f"{pago.monto:.2f}",
                "estado": pago.estado
            }
        except Pago.DoesNotExist:
            return None

    @staticmethod
    def obtener_mis_pagos(usuario):
        """
        Retorna los pagos del usuario autenticado ordenados por fecha.
        """
        return Pago.objects.filter(usuario=usuario).select_related('plan', 'Propiedad').order_by('-created_at')

    @staticmethod
    def obtener_estadisticas_completas():
        """
        Calcula estadísticas completas para el dashboard administrativo usando agregaciones.
        """
        from users.models import Usuario
        from properties.models import Propiedad
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

        propiedades_stats = Propiedad.objects.aggregate(
            total=Count('id'),
            activos=Count('id', filter=Q(estado='activo')),
            pendientes=Count('id', filter=Q(estado='pendiente')),
            finalizados=Count('id', filter=Q(estado='finalizado'))
        )

        from django.db.models import Count as DjangoCount
        propiedades_por_ciudad_qs = Propiedad.objects.values('ciudad').annotate(total=DjangoCount('id')).order_by('-total')[:5]
        propiedades_por_ciudad = [{'ciudad': item['ciudad'], 'total': item['total']} for item in propiedades_por_ciudad_qs]

        propiedades_por_tipo_qs = Propiedad.objects.values('tipo').annotate(total=DjangoCount('id')).order_by('-total')
        propiedades_por_tipo = [{'tipo': item['tipo'], 'total': item['total']} for item in propiedades_por_tipo_qs]

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
            {"nombre": plan.name, "total_ventas": plan.total_ventas}
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
            "propiedades": {
                "total": propiedades_stats['total'],
                "activos": propiedades_stats['activos'],
                "pendientes": propiedades_stats['pendientes'],
                "finalizados": propiedades_stats['finalizados']
            },
            "propiedades_por_ciudad": propiedades_por_ciudad,
            "propiedades_por_tipo": propiedades_por_tipo,
            "pagos": {
                "total": pagos_stats['total'],
                "aprobados": pagos_stats['aprobados'],
                "pendientes": pagos_stats['pendientes'],
                "rechazados": pagos_stats['rechazados'],
                "ingresos_este_mes": str(pagos_stats['ingresos_mes'] or "0.00")
            },
            "planes_populares": planes_populares_data
        }

import logging
from .models import Plan

logger = logging.getLogger('apps')

class PlanService:
    """
    Clase de servicio para manejar la lógica de negocio de los planes de publicación.
    """

    @staticmethod
    def listar_planes_activos():
        """
        Retorna todos los planes marcados como activos para el público.
        """
        return Plan.objects.filter(is_active=True)

    @staticmethod
    def crear_plan(data):
        """
        Crea un nuevo plan en el sistema.
        """
        try:
            plan = Plan.objects.create(**data)
            logger.info(f"Nuevo plan creado exitosamente: {plan.nombre} (ID: {plan.id})")
            return plan
        except Exception as e:
            logger.error(f"Error al crear el plan: {str(e)}")
            raise e

    @staticmethod
    def editar_plan(plan_id, data):
        """
        Actualiza los datos de un plan existente.
        """
        try:
            plan = Plan.objects.get(id=plan_id)
            for attr, value in data.items():
                setattr(plan, attr, value)
            plan.save()
            logger.info(f"Plan actualizado exitosamente: {plan.nombre} (ID: {plan.id})")
            return plan
        except Plan.DoesNotExist:
            logger.error(f"Intento de edición en plan inexistente. ID: {plan_id}")
            return None
        except Exception as e:
            logger.error(f"Error al editar el plan {plan_id}: {str(e)}")
            raise e

    @staticmethod
    def desactivar_plan(plan_id):
        """
        Realiza una desactivación lógica del plan (activo=False).
        """
        try:
            plan = Plan.objects.get(id=plan_id)
            plan.activo = False
            plan.save()
            logger.info(f"Plan desactivado exitosamente: {plan.nombre} (ID: {plan.id})")
            return plan
        except Plan.DoesNotExist:
            logger.error(f"Intento de desactivación en plan inexistente. ID: {plan_id}")
            return None

import logging
from plans.models import Plan

logger = logging.getLogger('apps')

class PlanService:
    @staticmethod
    def obtener_planes_activos():
        """
        Retorna la lista de planes que están marcados como activos.
        """
        return Plan.objects.filter(activo=True)

    @staticmethod
    def crear_plan(datos):
        """
        Crea un nuevo plan de publicación. Solo accesible por admin.
        """
        try:
            plan = Plan.objects.create(**datos)
            logger.info(f"Plan creado: {plan.nombre}")
            return plan
        except Exception as e:
            logger.error(f"Error al crear plan: {str(e)}")
            raise e

    @staticmethod
    def eliminar_plan_logico(plan_id):
        """
        Desactiva un plan en lugar de borrarlo físicamente.
        """
        try:
            plan = Plan.objects.get(id=plan_id)
            plan.activo = False
            plan.save()
            logger.info(f"Plan desactivado: {plan.nombre}")
            return True
        except Plan.DoesNotExist:
            return False

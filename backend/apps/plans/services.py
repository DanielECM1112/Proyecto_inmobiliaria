import logging
from django.utils.text import slugify
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
        Crea un nuevo plan en el sistema, generando el slug automáticamente.
        """
        try:
            # Generar slug único a partir del nombre
            base_slug = slugify(data.get('name', 'plan'))
            unique_slug = base_slug
            counter = 1
            while Plan.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{counter}"
                counter += 1
            
            data['slug'] = unique_slug
            
            plan = Plan.objects.create(**data)
            logger.info(f"Nuevo plan creado exitosamente: {plan.name} (ID: {plan.id})")
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
            logger.info(f"Plan actualizado exitosamente: {plan.name} (ID: {plan.id})")
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
            plan.is_active = False
            plan.save()
            logger.info(f"Plan desactivado exitosamente: {plan.name} (ID: {plan.id})")
            return plan
        except Plan.DoesNotExist:
            logger.error(f"Intento de desactivación en plan inexistente. ID: {plan_id}")
            return None

    @staticmethod
    def eliminar_plan(plan_id):
        """
        Elimina un plan permanentemente.
        """
        try:
            plan = Plan.objects.get(id=plan_id)
            plan.delete()
            logger.info(f"Plan eliminado exitosamente: {plan.name} (ID: {plan.id})")
            return True
        except Plan.DoesNotExist:
            logger.error(f"Intento de eliminación en plan inexistente. ID: {plan_id}")
            return False
        except Exception as e:
            logger.error(f"Error al eliminar el plan {plan_id}: {str(e)}")
            raise e

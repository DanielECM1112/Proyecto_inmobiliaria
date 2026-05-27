import json
import logging
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.http import Http404
from django.conf import settings

logger = logging.getLogger('apps')

class GlobalExceptionMiddleware:
    """Middleware que captura excepciones no manejadas y devuelve
    una respuesta JSON con un mensaje amigable en español.

    No expone tracebacks en producción.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except PermissionDenied as e:
            logger.warning(f"PermissionDenied: {str(e)}")
            return JsonResponse({"error": str(e) or "Acceso denegado."}, status=403)
        except (Http404, ObjectDoesNotExist) as e:
            logger.info(f"Not Found: {str(e)}")
            return JsonResponse({"error": str(e) or "Recurso no encontrado."}, status=404)
        except ValueError as e:
            logger.info(f"ValueError: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            # Error inesperado: no mostrar traceback en producción
            logger.exception("Error no manejado en la aplicación: %s", str(e))
            if settings.DEBUG:
                mensaje = str(e)
            else:
                mensaje = "Ocurrió un error interno."
            return JsonResponse({"error": mensaje}, status=500)

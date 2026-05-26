from django.http import HttpResponse

def health_check(request):
    """
    Simple health-check view for the project root.
    Returns a plain-text confirmation message.
    """
    return HttpResponse("Backend Proyecto Inmobiliaria funcionando correctamente", content_type="text/plain")

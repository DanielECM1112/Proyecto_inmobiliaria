from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from .models import Propiedad, ImagenPropiedad
from .serializers import PropiedadSerializer, PropiedadCreateSerializer
from .permissions import IsOwnerOrReadOnly
from users.permissions import IsAdminRole
from rest_framework.decorators import api_view, permission_classes

class PropiedadListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropiedadSerializer
    queryset = Propiedad.objects.filter(activo=True)

class PropiedadCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropiedadCreateSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # El propietario es el usuario autenticado
        prop = serializer.save(propietario=self.request.user)

        # Manejar imágenes
        imagenes = self.request.FILES.getlist('imagenes')
        for i, archivo in enumerate(imagenes):
            es_principal = (i == 0)
            ImagenPropiedad.objects.create(
                propiedad=prop, 
                imagen=archivo, 
                es_principal=es_principal
            )
        return prop

    def create(self, request, *args, **kwargs):
        # Verificar el límite de propiedades del plan
        user = request.user
        
        # Refrescar los datos del usuario desde la BD para obtener plan_activo más actualizado
        user.refresh_from_db()
        plan_activo = user.plan_activo
        
        # Si no tiene plan, usamos un plan por defecto con 1 propiedad máxima
        max_props = 1
        if plan_activo:
            # Verificar si el plan no ha expirado
            if user.plan_expira_at and timezone.now() > user.plan_expira_at:
                return Response(
                    {"error": "Tu plan ha expirado. Por favor, renueva o compra un nuevo plan."},
                    status=status.HTTP_403_FORBIDDEN
                )
            max_props = plan_activo.max_properties
        
        # Si es administrador, no hay límite
        if user.is_staff or user.rol == 'admin':
            max_props = 999
        
        # Contar las propiedades activas del usuario
        props_activas = Propiedad.objects.filter(
            propietario=user, 
            activo=True
        ).count()
        
        if props_activas >= max_props:
            return Response(
                {"error": f"Has alcanzado el límite de {max_props} propiedad(es) para tu plan. Por favor, actualiza tu plan para publicar más."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Continuar con la creación normal
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prop = self.perform_create(serializer)
        
        # Devolver la propiedad con sus imágenes usando el serializer completo
        full_serializer = PropiedadSerializer(prop, context={'request': request})
        return Response(full_serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_plan_status(request):
    """
    Devuelve el estado del plan del usuario:
    - Plan activo
    - Cuántas propiedades ha publicado
    - Cuántas puede publicar más
    - Fecha de expiración
    
    Nota: Intenta sincronizar el plan si hay pagos aprobados pendientes
    """
    from payments.services import PagoService
    from django.utils import timezone
    
    user = request.user
    
    # Intentar sincronizar el plan desde pagos aprobados (útil si webhook no llegó)
    try:
        PagoService.sincronizar_plan_usuario(user)
        user.refresh_from_db()
    except Exception as e:
        # No bloquear si la sincronización falla
        pass
    
    plan_activo = user.plan_activo
    
    # Datos básicos
    plan_nombre = "Plan Gratuito"
    max_props = 1
    plan_expira = None
    es_admin = user.is_staff or user.rol == 'admin'
    
    if plan_activo:
        plan_nombre = plan_activo.name
        max_props = plan_activo.max_properties
        plan_expira = user.plan_expira_at
        
        # Si es admin, no hay límite
        if es_admin:
            max_props = 999
    
    # Contar propiedades activas
    props_activas = Propiedad.objects.filter(
        propietario=user,
        activo=True
    ).count()
    
    props_disponibles = max_props - props_activas
    
    return Response({
        "plan_activo": plan_nombre,
        "plan_id": str(plan_activo.id) if plan_activo else None,
        "max_propiedades": max_props,
        "propiedades_activas": props_activas,
        "propiedades_disponibles": props_disponibles,
        "plan_expira": plan_expira.isoformat() if plan_expira else None,
        "es_admin": es_admin
    })

class PropiedadDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropiedadSerializer
    queryset = Propiedad.objects.filter(activo=True)

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsOwnerOrReadOnly]
        return super().get_permissions()

class MisPropiedadesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropiedadSerializer

    def get_queryset(self):
        return Propiedad.objects.filter(propietario=self.request.user, activo=True)


class PropiedadAdminUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = PropiedadSerializer
    queryset = Propiedad.objects.all()


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_property_image(request, pk):
    try:
        imagen = ImagenPropiedad.objects.get(pk=pk)
        # Verificar que el usuario es el propietario de la propiedad
        if imagen.propiedad.propietario != request.user and not request.user.is_staff:
            return Response({"error": "No tienes permiso para eliminar esta imagen"}, status=status.HTTP_403_FORBIDDEN)
        imagen.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ImagenPropiedad.DoesNotExist:
        return Response({"error": "Imagen no encontrada"}, status=status.HTTP_404_NOT_FOUND)


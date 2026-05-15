from rest_framework import viewsets, permissions
from .models import Property
from .serializers import PropertySerializer
from .permissions import IsOwnerOrAdmin, IsAdminToUpdateStatus

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    def get_permissions(self):
        """
        Asigna permisos dependiendo de la acción.
        """
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Solo dueño o admin, y solo admin cambia status
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin, IsAdminToUpdateStatus]
        else:
            # Listar y recuperar es público (o según tu lógica previa)
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # El creador es el dueño automáticamente
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # Los usuarios normales solo ven sus propiedades + las activas.
        # Los admins ven todo.
        if self.request.user and self.request.user.is_staff:
            return Property.objects.all()
        
        if self.request.user.is_authenticated:
            from django.db.models import Q
            return Property.objects.filter(Q(owner=self.request.user) | Q(status='activo'))
            
        return Property.objects.filter(status='activo')

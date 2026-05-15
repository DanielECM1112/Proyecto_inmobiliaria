from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso para que solo el dueño de un objeto o un admin puedan editarlo/eliminarlo.
    """
    def has_object_permission(self, request, view, obj):
        # Admin siempre tiene permiso
        if request.user and request.user.is_staff:
            return True
        # El usuario normal solo si es el dueño
        return obj.owner == request.user

class IsAdminToUpdateStatus(permissions.BasePermission):
    """
    Permiso para que solo el administrador pueda cambiar el estado de la propiedad.
    """
    def has_object_permission(self, request, view, obj):
        # Si se intenta cambiar el status, debe ser admin
        if 'status' in request.data:
            return request.user and request.user.is_staff
        return True

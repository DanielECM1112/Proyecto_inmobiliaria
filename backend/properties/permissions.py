from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso personalizado:
    - Admin puede hacer todo.
    - Usuario normal solo puede editar/borrar si es el dueño (owner).
    """
    def has_object_permission(self, request, view, obj):
        # Admin siempre tiene permiso
        if request.user.is_staff:
            return True
        # El dueño tiene permiso
        return obj.owner == request.user

class IsAdminToUpdateStatus(permissions.BasePermission):
    """
    Solo el administrador puede cambiar el campo 'status'.
    """
    def has_object_permission(self, request, view, obj):
        if 'status' in request.data:
            return request.user.is_staff
        return True

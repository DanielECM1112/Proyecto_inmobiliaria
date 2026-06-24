from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permite el acceso solo al dueño del recurso o a un administrador.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.rol == 'admin':
            return True
        return obj.propietario == request.user

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permite el acceso solo al dueño del recurso, o lectura a cualquiera.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.rol == 'admin':
            return True
        return obj.propietario == request.user

from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Permite el acceso solo a usuarios con rol 'admin'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol == 'admin')

class IsAuthenticatedAndActive(permissions.BasePermission):
    """
    Permite el acceso solo a usuarios autenticados y activos.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_active)

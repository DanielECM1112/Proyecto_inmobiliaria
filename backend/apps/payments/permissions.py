from rest_framework import permissions

class IsAdminOrOwnerOnly(permissions.BasePermission):
    """
    Permiso para que solo el admin vea todos los pagos,
    y usuarios normales vean solo los suyos.
    """
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return obj.user == request.user

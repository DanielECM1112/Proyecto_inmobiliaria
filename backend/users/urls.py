from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserAdminViewSet, login_admin_api, UserList, RegisterView, LoginView

router = DefaultRouter()
# Registra tu ViewSet administrativo para el control de la tabla tornasolada
router.register(r'admin-users', UserAdminViewSet, basename='admin-users')

urlpatterns = [
    # 1. Ruta explícita y directa en espejo con tu Axios para el Login Administrativo
    path('admin-users/login/', login_admin_api, name='admin-login-api'),
    
    # 2. Inclusión automática del CRUD de tu panel (Promover, degradar, eliminar)
    path('', include(router.urls)),
    
    # 3. Rutas del catálogo público del cliente común
    path('list/', UserList.as_view(), name='user-list'),
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', login_admin_api, name='user-login'),
]

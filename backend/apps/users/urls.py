from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import RegisterView, LoginView, AdminUsuarioListView, AdminUsuarioDetailView

urlpatterns = [
    # Autenticación
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Administración de usuarios
    path('admin/usuarios/', AdminUsuarioListView.as_view(), name='admin_usuarios_list'),
    path('admin/usuarios/<uuid:pk>/', AdminUsuarioDetailView.as_view(), name='admin_usuarios_detail'),
]

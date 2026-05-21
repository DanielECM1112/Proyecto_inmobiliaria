from django.urls import path
from .views import UserList, RegisterView, LoginView, login_admin_api

urlpatterns = [
    # Rutas públicas del catálogo general
    path('', UserList.as_view(), name='user-list'),
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login-old/', LoginView.as_view(), name='user-login'),
    
    # Tu ruta en espejo con el frontend/src/admin/adminService.js
    path('admin-users/login/', login_admin_api, name='admin-login-api'),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlanAdminViewSet

router = DefaultRouter()
# Cable directo sin interceptores de seguridad
router.register(r'admin-plans', PlanAdminViewSet, basename='admin-plans')

urlpatterns = [
    path('', include(router.urls)),
]

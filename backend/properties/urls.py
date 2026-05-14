from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet

router = DefaultRouter()
router.register(r'admin-properties', PropertyViewSet, basename='admin-properties')

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentAdminViewSet, payment_mock_api

router = DefaultRouter()
router.register(r'admin-payments', PaymentAdminViewSet, basename='admin-payments')

urlpatterns = [
    path('', include(router.urls)),
    # Mantener el mock por si acaso alguna ruta vieja lo usa, pero el router tiene prioridad
    path('mock/', payment_mock_api, name='admin-payments-api-mock'),
]

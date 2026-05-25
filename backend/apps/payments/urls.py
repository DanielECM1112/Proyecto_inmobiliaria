from django.urls import path
from payments.views import (
    IniciarPagoView, ConfirmarPagoView, 
    AdminPagoListView, AdminPagoDetailView, AdminStatsView
)

urlpatterns = [
    path('pagos/iniciar/', IniciarPagoView.as_view(), name='pago-iniciar'),
    path('pagos/confirmar/', ConfirmarPagoView.as_view(), name='pago-confirmar'),
    path('admin/pagos/', AdminPagoListView.as_view(), name='admin-pago-list'),
    path('admin/pagos/<uuid:pk>/', AdminPagoDetailView.as_view(), name='admin-pago-detail'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]

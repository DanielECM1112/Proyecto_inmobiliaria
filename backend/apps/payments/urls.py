from django.urls import path
from payments.views import (
    IniciarPagoView, ConfirmarPagoView,
    AdminPagoListView, AdminPagoDetailView, AdminStatsView,
    MisPagosView, ProcesarPagoView, WompiWebhookView, SincronizarPlanView
)

urlpatterns = [
    path('pagos/iniciar/', IniciarPagoView.as_view(), name='pago-iniciar'),
    path('pagos/confirmar/', ConfirmarPagoView.as_view(), name='pago-confirmar'),
    path('pagos/webhook/', WompiWebhookView.as_view(), name='wompi-webhook'),
    path('pagos/process/', ProcesarPagoView.as_view(), name='pago-process'),
    path('pagos/mis-pagos/', MisPagosView.as_view(), name='mis-pagos'),
    path('pagos/sincronizar-plan/', SincronizarPlanView.as_view(), name='sincronizar-plan'),
    path('admin/pagos/', AdminPagoListView.as_view(), name='admin-pago-list'),
    path('admin/pagos/<uuid:pk>/', AdminPagoDetailView.as_view(), name='admin-pago-detail'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]

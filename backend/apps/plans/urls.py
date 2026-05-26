from django.urls import path
from .views import PlanListView, PlanAdminView, PlanAdminDetailView

urlpatterns = [
    # Rutas públicas
    path('planes/', PlanListView.as_view(), name='plan-list-public'),
    
    # Rutas administrativas
    path('admin/planes/', PlanAdminView.as_view(), name='admin-plan-list-create'),
    path('admin/planes/<uuid:pk>/', PlanAdminDetailView.as_view(), name='admin-plan-detail-update'),
]

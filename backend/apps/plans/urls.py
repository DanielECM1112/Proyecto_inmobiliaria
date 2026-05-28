from django.urls import path
from .views import PlanListView, PlanAdminView, PlanAdminDetailView, PlanDetailView

urlpatterns = [
    # Rutas públicas
    path('plans/', PlanListView.as_view(), name='plan-list-public'),
    path('plans/<uuid:pk>/', PlanDetailView.as_view(), name='plan-detail'),
    
    # Rutas administrativas
    path('admin/plans/', PlanAdminView.as_view(), name='admin-plan-list-create'),
    path('admin/plans/<uuid:pk>/', PlanAdminDetailView.as_view(), name='admin-plan-detail-update'),
]

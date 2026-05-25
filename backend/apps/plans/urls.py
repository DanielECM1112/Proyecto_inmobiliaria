from django.urls import path
from plans.views import PlanListView, AdminPlanCreateView, AdminPlanDetailView

urlpatterns = [
    path('planes/', PlanListView.as_view(), name='plan-list'),
    path('admin/planes/', AdminPlanCreateView.as_view(), name='admin-plan-create'),
    path('admin/planes/<uuid:pk>/', AdminPlanDetailView.as_view(), name='admin-plan-detail'),
]

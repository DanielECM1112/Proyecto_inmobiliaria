from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from plans.models import Plan
from plans.serializers import PlanSerializer
from plans.services import PlanService
from users.permissions import IsAdminRole

class PlanListView(generics.ListAPIView):
    """
    Lista pública de planes activos.
    """
    permission_classes = [AllowAny]
    serializer_class = PlanSerializer
    queryset = Plan.objects.filter(activo=True)

class AdminPlanCreateView(generics.CreateAPIView):
    """
    Crear plan (Admin only).
    """
    permission_classes = [IsAdminRole]
    serializer_class = PlanSerializer

class AdminPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Detalle, edición y eliminación (Admin only).
    """
    permission_classes = [IsAdminRole]
    serializer_class = PlanSerializer
    queryset = Plan.objects.all()

    def perform_destroy(self, instance):
        PlanService.eliminar_plan_logico(instance.id)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PlanPublicoSerializer, PlanAdminSerializer
from .services import PlanService
from users.permissions import IsAdminRole

class PlanListView(generics.ListAPIView):
    """
    Vista pública para listar planes activos.
    """
    permission_classes = [AllowAny]
    serializer_class = PlanPublicoSerializer

    def get_queryset(self):
        return PlanService.listar_planes_activos()


class PlanAdminView(APIView):
    """
    Vista administrativa para listar y crear planes.
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        from .models import Plan
        planes = Plan.objects.all()
        serializer = PlanAdminSerializer(planes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PlanAdminSerializer(data=request.data)
        if serializer.is_valid():
            try:
                plan = PlanService.crear_plan(serializer.validated_data)
                return Response(PlanAdminSerializer(plan).data, status=status.HTTP_201_CREATED)
            except Exception:
                return Response({"error": "Error interno al crear el plan."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlanAdminDetailView(APIView):
    """
    Vista administrativa para editar y desactivar planes.
    """
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        serializer = PlanAdminSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            plan = PlanService.editar_plan(pk, serializer.validated_data)
            if plan:
                return Response(PlanAdminSerializer(plan).data)
            return Response({"error": "Plan no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Desactivación lógica del plan.
        """
        plan = PlanService.desactivar_plan(pk)
        if plan:
            return Response({"message": "Plan desactivado correctamente."}, status=status.HTTP_200_OK)
        return Response({"error": "Plan no encontrado."}, status=status.HTTP_404_NOT_FOUND)

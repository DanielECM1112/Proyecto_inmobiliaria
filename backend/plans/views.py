from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Plan
from .serializers import PlanSerializer

@method_decorator(csrf_exempt, name='dispatch')
class PlanAdminViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all().order_by('id')
    serializer_class = PlanSerializer
    permission_classes = [AllowAny]

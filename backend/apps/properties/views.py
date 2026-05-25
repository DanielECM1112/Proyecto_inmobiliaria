from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from properties.models import Inmueble, ImagenInmueble, Favorito, Contacto
from properties.serializers import InmuebleSerializer, ImagenInmuebleSerializer, FavoritoSerializer, ContactoSerializer
from properties.services import InmuebleService
from properties.permissions import IsOwnerOrAdmin

class InmuebleViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Inmuebles. Maneja lista pública con filtros y CRUD privado.
    """
    queryset = Inmueble.objects.all()
    serializer_class = InmuebleSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrAdmin()]

    def get_queryset(self):
        filtros = self.request.query_params.dict()
        return InmuebleService.listar_inmuebles(filtros)

    def perform_create(self, serializer):
        # Lógica de negocio: Validar si tiene pago aprobado antes de activar (esto se hace en PagoService)
        # Por ahora creamos como pendiente
        serializer.save(usuario=self.request.user, estado='pendiente')

class ImagenInmuebleView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = ImagenInmuebleSerializer

    def post(self, request, pk):
        try:
            inmueble = Inmueble.objects.get(pk=pk)
            self.check_object_permissions(request, inmueble)
            serializer = ImagenInmuebleSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(inmueble=inmueble)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Inmueble.DoesNotExist:
            return Response({"error": "Inmueble no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class FavoritoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FavoritoSerializer

    def get_queryset(self):
        return Favorito.objects.filter(usuario=self.request.user)

    def create(self, request, *args, **kwargs):
        inmueble_id = request.data.get('inmueble')
        agregado = InmuebleService.gestionar_favorito(request.user, inmueble_id)
        return Response({"agregado": agregado}, status=status.HTTP_200_OK)

class ContactoView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ContactoSerializer

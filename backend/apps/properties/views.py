from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Propiedad, ImagenPropiedad
from .serializers import PropiedadSerializer, PropiedadCreateSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import api_view, permission_classes

class PropiedadListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropiedadSerializer
    queryset = Propiedad.objects.filter(activo=True)

class PropiedadCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropiedadCreateSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # El propietario es el usuario autenticado
        prop = serializer.save(propietario=self.request.user)

        # Manejar imágenes
        imagenes = self.request.FILES.getlist('imagenes')
        for i, archivo in enumerate(imagenes):
            es_principal = (i == 0)
            ImagenPropiedad.objects.create(
                propiedad=prop, 
                imagen=archivo, 
                es_principal=es_principal
            )
        return prop

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prop = self.perform_create(serializer)
        
        # Devolver la propiedad con sus imágenes usando el serializer completo
        full_serializer = PropiedadSerializer(prop, context={'request': request})
        return Response(full_serializer.data, status=status.HTTP_201_CREATED)

class PropiedadDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropiedadSerializer
    queryset = Propiedad.objects.filter(activo=True)

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsOwnerOrReadOnly]
        return super().get_permissions()

class MisPropiedadesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropiedadSerializer

    def get_queryset(self):
        return Propiedad.objects.filter(propietario=self.request.user, activo=True)


class PropiedadAdminUpdateView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropiedadSerializer
    queryset = Propiedad.objects.all()


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_property_image(request, pk):
    try:
        imagen = ImagenPropiedad.objects.get(pk=pk)
        # Verificar que el usuario es el propietario de la propiedad
        if imagen.propiedad.propietario != request.user and not request.user.is_staff:
            return Response({"error": "No tienes permiso para eliminar esta imagen"}, status=status.HTTP_403_FORBIDDEN)
        imagen.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ImagenPropiedad.DoesNotExist:
        return Response({"error": "Imagen no encontrada"}, status=status.HTTP_404_NOT_FOUND)


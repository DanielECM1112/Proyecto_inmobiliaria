from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Inmueble, ImagenInmueble, Favorito
from .serializers import (
    InmuebleListSerializer, InmuebleDetailSerializer, 
    InmuebleCreateSerializer, ImagenSerializer, 
    FavoritoSerializer, ContactoSerializer
)
from .services import InmuebleService
from .permissions import IsOwnerOrAdmin

class InmuebleListView(generics.ListAPIView):
    """
    Vista pública para listar inmuebles con filtros.
    """
    permission_classes = [AllowAny]
    serializer_class = InmuebleListSerializer

    def get_queryset(self):
        filtros = self.request.query_params.dict()
        return InmuebleService.listar_inmuebles(filtros)

class InmuebleDetailView(APIView):
    """
    Vista pública para el detalle de un inmueble.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        inmueble = InmuebleService.obtener_inmueble(pk)
        if inmueble:
            serializer = InmuebleDetailSerializer(inmueble, context={'request': request})
            return Response(serializer.data)
        return Response({"error": "Inmueble no encontrado."}, status=status.HTTP_404_NOT_FOUND)

class InmuebleCreateView(APIView):
    """
    Vista para crear un inmueble (requiere autenticación).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InmuebleCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                inmueble = InmuebleService.crear_inmueble(request.user, serializer.validated_data)
                return Response(InmuebleDetailSerializer(inmueble).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InmuebleAdminView(APIView):
    """
    Vista para edición y desactivación (dueño o admin).
    """
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def patch(self, request, pk):
        inmueble = InmuebleService.obtener_inmueble(pk)
        if not inmueble:
            return Response({"error": "Inmueble no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, inmueble)
        
        serializer = InmuebleCreateSerializer(inmueble, data=request.data, partial=True)
        if serializer.is_valid():
            inmueble_editado, error = InmuebleService.editar_inmueble(pk, serializer.validated_data, request.user)
            if inmueble_editado:
                return Response(InmuebleDetailSerializer(inmueble_editado).data)
            return Response({"error": error}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Desactivación lógica del inmueble.
        """
        inmueble = InmuebleService.obtener_inmueble(pk)
        if not inmueble:
            return Response({"error": "Inmueble no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, inmueble)
        
        if InmuebleService.desactivar_inmueble(pk):
            return Response({"message": "Inmueble marcado como finalizado."}, status=status.HTTP_200_OK)
        return Response({"error": "No se pudo desactivar el inmueble."}, status=status.HTTP_400_BAD_REQUEST)

class ImagenView(APIView):
    """
    Gestión de imágenes de un inmueble.
    """
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def post(self, request, pk):
        inmueble = InmuebleService.obtener_inmueble(pk)
        if not inmueble:
            return Response({"error": "Inmueble no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, inmueble)
        
        if 'imagen' not in request.FILES:
            return Response({"error": "No se proporcionó ninguna imagen."}, status=status.HTTP_400_BAD_REQUEST)
        
        nueva_img, error = InmuebleService.agregar_imagen(pk, request.FILES['imagen'])
        if nueva_img:
            return Response(ImagenSerializer(nueva_img).data, status=status.HTTP_201_CREATED)
        return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, img_id):
        try:
            imagen = ImagenInmueble.objects.get(id=img_id, inmueble_id=pk)
            self.check_object_permissions(request, imagen.inmueble)
            imagen.delete()
            return Response({"message": "Imagen eliminada."}, status=status.HTTP_200_OK)
        except ImagenInmueble.DoesNotExist:
            return Response({"error": "Imagen no encontrada."}, status=status.HTTP_404_NOT_FOUND)

class FavoritoView(APIView):
    """
    Gestión de favoritos del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favoritos = Favorito.objects.filter(usuario=request.user)
        serializer = FavoritoSerializer(favoritos, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        inmueble_id = request.data.get('inmueble')
        if not inmueble_id:
            return Response({"error": "ID de inmueble requerido."}, status=status.HTTP_400_BAD_REQUEST)
        
        resultado = InmuebleService.toggle_favorito(request.user, inmueble_id)
        if resultado is True:
            return Response({"message": "Agregado a favoritos."}, status=status.HTTP_201_CREATED)
        elif resultado is False:
            return Response({"message": "Eliminado de favoritos."}, status=status.HTTP_200_OK)
        return Response({"error": "Error al procesar favorito."}, status=status.HTTP_400_BAD_REQUEST)

class ContactoView(APIView):
    """
    Envío de mensajes de contacto.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactoSerializer(data=request.data)
        if serializer.is_valid():
            InmuebleService.enviar_contacto(serializer.validated_data)
            return Response({"message": "Mensaje enviado correctamente."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

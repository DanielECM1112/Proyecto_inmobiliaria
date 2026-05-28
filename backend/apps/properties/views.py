from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Inmueble, ImagenInmueble, Favorito
from .serializers import (
    InmuebleListSerializer, InmuebleDetailSerializer,
    InmuebleCreateSerializer, ImagenSerializer,
    FavoritoSerializer, ContactoSerializer, MisInmuebleSerializer
)
from .services import InmuebleService
from .permissions import IsOwnerOrAdmin

class InmuebleListCreateView(APIView):
    """
    Vista para listar inmuebles con filtros y crear nuevos inmuebles.
    """
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        filtros = request.query_params.dict()
        # Indicar al servicio si el request lo hace un admin para relajar filtro de estado
        if request.user and request.user.is_authenticated and getattr(request.user, 'rol', None) == 'admin':
            filtros['is_admin'] = True

        inmuebles = InmuebleService.listar_inmuebles(filtros)
        serializer = InmuebleListSerializer(inmuebles, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"error": "No estás autenticado para publicar."}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = InmuebleCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Crear el inmueble primero
                inmueble = InmuebleService.crear_inmueble(request.user, serializer.validated_data)
                
                # Manejar imágenes si se enviaron en el mismo request
                files = request.FILES.getlist('imagenes')
                if files:
                    for f in files:
                        InmuebleService.agregar_imagen(inmueble.id, f, request.user)
                elif 'imagen' in request.FILES:
                    InmuebleService.agregar_imagen(inmueble.id, request.FILES['imagen'], request.user)

                detalle = InmuebleDetailSerializer(inmueble, context={'request': request})
                return Response(detalle.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # Devolver errores formateados como el usuario pidió
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MisInmueblesView(APIView):
    """
    Retorna los inmuebles del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        inmuebles = InmuebleService.obtener_mis_inmuebles(request.user)
        serializer = MisInmuebleSerializer(inmuebles, many=True, context={'request': request})
        return Response(serializer.data)

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

        serializer = InmuebleCreateSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            inmueble_editado, error = InmuebleService.editar_inmueble(pk, serializer.validated_data, request.user)
            if inmueble_editado:
                detalle = InmuebleDetailSerializer(inmueble_editado, context={'request': request})
                return Response(detalle.data)
            return Response({"error": error}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """Alias para PATCH (PUT actúa igual que PATCH para ediciones parciales)"""
        return self.patch(request, pk)

    def delete(self, request, pk):
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

        files = request.FILES.getlist('imagenes')
        if not files:
            # Soporte para campo único 'imagen' por compatibilidad
            if 'imagen' in request.FILES:
                files = [request.FILES['imagen']]
            else:
                return Response({"error": "No se proporcionaron imágenes."}, status=status.HTTP_400_BAD_REQUEST)

        resultados = []
        errores = []

        for f in files:
            resultado, error = InmuebleService.agregar_imagen(pk, f, request.user)
            if resultado and not error:
                imagen_obj = resultado.get('imagen')
                serializer = ImagenSerializer(imagen_obj, context={'request': request})
                resultados.append(serializer.data)
            else:
                errores.append({"nombre": f.name, "error": error})

        if errores and not resultados:
            return Response({"errores": errores}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "mensaje": f"{len(resultados)} imágenes subidas correctamente.",
            "imagenes": resultados,
            "errores": errores
        }, status=status.HTTP_201_CREATED)

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
        if isinstance(resultado, dict):
            accion = resultado.get('accion')
            total = resultado.get('total_favoritos', 0)
            if accion == 'agregado':
                return Response({"accion": accion, "total_favoritos": total}, status=status.HTTP_201_CREATED)
            return Response({"accion": accion, "total_favoritos": total}, status=status.HTTP_200_OK)

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


class FavoritoCountView(APIView):
    """
    Retorna el total de favoritos de un inmueble (público).
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        resultado = InmuebleService.contar_favoritos(pk)
        return Response(resultado)

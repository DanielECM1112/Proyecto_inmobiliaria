from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.serializers import (
    RegisterSerializer, 
    LoginSerializer, 
    UsuarioSerializer, 
    UsuarioAdminSerializer
)
from users.services import UsuarioService
from users.permissions import IsAdminRole
import json

class RegisterView(APIView):
    """
    Vista para el registro de nuevos usuarios públicos.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # Ensure incoming data is a dict. Some clients may send raw JSON string
        # which DRF should parse, but add a safe fallback to decode it.
        incoming = request.data
        if isinstance(incoming, (str, bytes)):
            try:
                if isinstance(incoming, bytes):
                    incoming = incoming.decode('utf-8')
                incoming = json.loads(incoming)
            except Exception:
                # Try parsing raw body as last resort
                try:
                    incoming = json.loads(request.body.decode('utf-8'))
                except Exception:
                    return Response({"non_field_errors": ["Datos inválidos. Se esperaba un diccionario pero es un str."]}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegisterSerializer(data=incoming)
        if serializer.is_valid():
            try:
                user = UsuarioService.registrar_usuario(
                    email=serializer.validated_data['email'],
                    nombre=serializer.validated_data['nombre'],
                    password=serializer.validated_data['password']
                )
                return Response(UsuarioSerializer(user).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": "No se pudo completar el registro."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Vista para el inicio de sesión y obtención de tokens JWT.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            result = UsuarioService.login_usuario(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            
            if result:
                if "error" in result:
                    return Response(result, status=status.HTTP_403_FORBIDDEN)
                return Response(result, status=status.HTTP_200_OK)
            
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUsuarioListView(generics.ListAPIView):
    """
    Vista para listar todos los usuarios (solo administradores).
    """
    permission_classes = [IsAdminRole]
    serializer_class = UsuarioSerializer
    
    def get_queryset(self):
        return UsuarioService.obtener_todos_los_usuarios()


class AdminUsuarioDetailView(APIView):
    """
    Vista para ver, editar y desactivar usuarios desde el panel administrativo.
    """
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        from users.models import Usuario
        try:
            usuario = Usuario.objects.get(pk=pk)
            serializer = UsuarioAdminSerializer(usuario, data=request.data, partial=True)
            
            if serializer.is_valid():
                updated_user = UsuarioService.actualizar_usuario_admin(pk, serializer.validated_data)
                return Response(UsuarioSerializer(updated_user).data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """
        Desactivación lógica del usuario por parte del administrador.
        """
        usuario = UsuarioService.desactivar_usuario(pk)
        if usuario:
            return Response({"message": "Usuario desactivado correctamente"})
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

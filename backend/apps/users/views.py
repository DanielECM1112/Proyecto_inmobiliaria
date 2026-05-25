from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.serializers import RegistroSerializer, LoginSerializer, UsuarioSerializer
from users.services import UsuarioService
from users.permissions import IsAdminRole

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Registro de nuevo usuario.
        """
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = UsuarioService.registrar_usuario(
                    email=serializer.validated_data['email'],
                    nombre=serializer.validated_data['nombre'],
                    password=serializer.validated_data['password']
                )
                return Response(UsuarioSerializer(user).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Login de usuario.
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            result = UsuarioService.login_usuario(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if result:
                return Response(result, status=status.HTTP_200_OK)
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminUsuarioListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = UsuarioSerializer
    
    def get_queryset(self):
        from users.models import Usuario
        return Usuario.objects.all()

class AdminUsuarioDetailView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        from users.models import Usuario
        try:
            usuario = Usuario.objects.get(pk=pk)
            serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """
        Desactivación lógica del usuario.
        """
        usuario = UsuarioService.desactivar_usuario(pk)
        if usuario:
            return Response({"message": "Usuario desactivado correctamente"})
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

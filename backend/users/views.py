from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

# === 👥 VISTAS ORIGINALES DE JHONATAN ===
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ===  TU NUEVO ENDPOINT DE AUTENTICACIÓN PARA EL PANEL TORNASOLADO ===
@api_view(['POST'])
@permission_classes([AllowAny])
def login_admin_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        rol = "Administrador" if user.is_superuser else "Usuario"
        return Response({
            'token': token.key,
            'rol': rol,
            'username': user.username
        }, status=status.HTTP_200_OK)
        
    return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_400_BAD_REQUEST)

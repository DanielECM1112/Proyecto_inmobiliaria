from django.shortcuts import render
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, UserAdminSerializer

# === 👥 CONTROL REAL DE USUARIOS DESDE TU PANEL TORNASOLADO ===
class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id') # Trae todos los usuarios, los más nuevos primero
    serializer_class = UserAdminSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'])
    def promover(self, request, pk=None):
        usuario = self.get_object()
        usuario.is_superuser = True
        usuario.is_staff = True
        usuario.save()
        return Response({'success': True}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def degradar(self, request, pk=None):
        usuario = self.get_object()
        usuario.is_superuser = False
        usuario.is_staff = False
        usuario.save()
        return Response({'success': True}, status=status.HTTP_200_OK)

# === 👥 VISTAS ORIGINALES DE JHONATAN (PÁGINA PÚBLICA CORREGIDA) ===
@method_decorator(csrf_exempt, name='dispatch')
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # Guarda el usuario encriptado de forma real en la base de datos única
            return Response({"success": True, "message": "Usuario registrado real"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ===  TU ENDPOINT DE AUTENTICACIÓN PARA EL LOGIN ADMÍN ===
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

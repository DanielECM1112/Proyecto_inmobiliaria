import json
import requests
from urllib.parse import quote
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import render, redirect
from .models import Usuario
from .serializers import UsuarioSerializer, RegisterSerializer, LoginSerializer, UsuarioAdminSerializer
from .permissions import IsAdminRole


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = Usuario.objects.create_user(
                email=data['email'],
                nombre=data['nombre'],
                password=data['password']
            )
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Cuenta creada exitosamente',
                'access': str(refresh.access_token),
                'token': str(refresh.access_token),
                'user': UsuarioSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response(
                {'detail': 'Correo o contraseña incorrectos.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if not user.is_active:
            return Response(
                {'detail': 'Esta cuenta está desactivada.'},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Inicio de sesión exitoso',
            'access': str(refresh.access_token),
            'token': str(refresh.access_token),
            'user': UsuarioSerializer(user).data
        })


class SocialLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get('access_token')
        provider = request.data.get('provider', 'facebook').lower()
        is_register = request.data.get('register', False)

        import os
        import traceback
        log_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'social_debug.log')
        with open(log_path, 'a', encoding='utf-8') as f:
            f.write(f"\n=========================================\n")
            f.write(f"INTENTO ENTRADA - provider: {provider}, is_register: {is_register}\n")
            f.write(f"token recibido: {access_token[:20] if access_token else 'None'}...\n")

        if not access_token:
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"ERROR: Falta el access_token de {provider}\n")
            return Response({'error': f'Falta el access_token de {provider}'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if provider == 'facebook':
                social_user_url = f"https://graph.facebook.com/me?fields=id,name,email&access_token={access_token}"
            elif provider == 'google':
                social_user_url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"
            else:
                return Response({'error': 'Proveedor no soportado'}, status=status.HTTP_400_BAD_REQUEST)
            
            response = requests.get(social_user_url, timeout=10)
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"{provider.upper()} API Response Status: {response.status_code}\n")
            if response.status_code != 200:
                with open(log_path, 'a', encoding='utf-8') as f:
                    f.write(f"ERROR: Token de {provider} inválido o expirado. Response: {response.text}\n")
                return Response({'error': f'Token de {provider} inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)
            social_data = response.json()
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"{provider.upper()} Data: {social_data}\n")
        except requests.RequestException as e:
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"ERROR RED {provider.upper()}: {str(e)}\n")
                f.write(traceback.format_exc())
            return Response({'error': f'No se pudo conectar con {provider}: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        if provider == 'facebook':
            email = social_data.get('email')
            nombre = social_data.get('name', 'Usuario de Facebook')
        else:
            email = social_data.get('email')
            nombre = social_data.get('name', 'Usuario de Google') or social_data.get('given_name', 'Usuario')

        if not email:
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"ERROR: Cuenta de {provider} sin correo electrónico público\n")
            return Response({'error': f'Tu cuenta de {provider} debe tener un correo electrónico público asociado'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Usuario.objects.get(email=email)
            created = False
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"Usuario existente encontrado: {user.email}\n")
        except Usuario.DoesNotExist:
            if is_register:
                try:
                    user = Usuario(email=email, nombre=nombre)
                    user.set_unusable_password()
                    user.save()
                    created = True
                    with open(log_path, 'a', encoding='utf-8') as f:
                        f.write(f"NUEVO USUARIO CREADO EXITOSAMENTE: {user.email} (ID: {user.id})\n")
                except Exception as db_err:
                    with open(log_path, 'a', encoding='utf-8') as f:
                        f.write(f"ERROR AL GUARDAR USUARIO EN BD: {str(db_err)}\n")
                        f.write(traceback.format_exc())
                    return Response({'error': f'Error interno al guardar usuario en base de datos: {str(db_err)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                register_url = f'http://localhost:3000/register?email={quote(email)}&social={quote(provider)}'
                with open(log_path, 'a', encoding='utf-8') as f:
                    f.write(f"Usuario no existe, redirigiendo a: {register_url}\n")
                return Response({
                    'detail': 'email_not_registered',
                    'email': email,
                    'provider': provider,
                    'register_url': register_url
                }, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            with open(log_path, 'a', encoding='utf-8') as f:
                f.write(f"ERROR: Cuenta de usuario inactiva: {user.email}\n")
            return Response({'detail': 'Esta cuenta está desactivada.'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        with open(log_path, 'a', encoding='utf-8') as f:
            f.write(f"AUTENTICACION EXITOSA: {user.email}\n")
        return Response({
            'message': f'Registro con {provider} exitoso' if created else f'Inicio de sesión con {provider} exitoso',
            'access': str(refresh.access_token),
            'token': str(refresh.access_token),
            'user': UsuarioSerializer(user).data
        }, status=status.HTTP_200_OK)


class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UsuarioSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        return self.patch(request)


class AdminUsuarioListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)


class AdminUsuarioDetailView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UsuarioAdminSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordResetView(APIView):
    def post(self, request):
        return Response({'message': 'Si el correo existe, recibirás instrucciones.'})


class PasswordResetConfirmView(APIView):
    def post(self, request):
        return Response({'message': 'Funcionalidad próximamente disponible.'})


def social_auth_complete(request):
    if not request.user.is_authenticated:
        return redirect('http://localhost:3000/login')
    
    refresh = RefreshToken.for_user(request.user)
    token = str(refresh.access_token)
    user_data = UsuarioSerializer(request.user).data
    
    return render(request, 'social_auth_complete.html', {
        'token': token,
        'user_json': json.dumps(user_data),
    })

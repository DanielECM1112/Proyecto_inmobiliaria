from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.db.models import Q
from django.shortcuts import render
from django.core.serializers.json import DjangoJSONEncoder
import json
from .models import User
from .serializers import UserSerializer, LoginSerializer

class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username_or_email = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = None
            try:
                user_obj = User.objects.get(Q(username=username_or_email) | Q(email=username_or_email))
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
            
            if user:
                login(request, user)
                user_serializer = UserSerializer(user)
                return Response({
                    'message': 'Inicio de sesión exitoso',
                    'user': user_serializer.data
                })
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def social_auth_complete(request):
    if request.user.is_authenticated:
        user_serializer = UserSerializer(request.user)
        user_json = json.dumps(user_serializer.data, cls=DjangoJSONEncoder)
        return render(request, 'social_auth_complete.html', {'user_json': user_json})
    return render(request, 'social_auth_complete.html', {'user_json': 'null'})

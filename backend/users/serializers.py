from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# 1. Traductor estándar de lectura de usuarios
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# 2. Traductor obligatorio de escritura para el Formulario de Registro Público
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Encripta la contraseña de forma segura en la base de datos
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# 3. Traductor para la verificación del Login público anterior
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


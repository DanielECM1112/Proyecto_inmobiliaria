from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# 1. TRADUCTOR PARA TU TABLA TORNASOLADA (REQUERIDO)
class UserAdminSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    nombre = serializers.CharField(source='username')
    correo = serializers.CharField(source='email')
    rol = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'nombre', 'correo', 'rol']

    def get_rol(self, obj):
        return "Administrador" if obj.is_superuser else "Usuario"

# 2. Traductor estándar de lectura de usuarios públicos
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# 3. Traductor obligatorio de escritura para el Formulario de Registro Público
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Si tus compañeros guardan el teléfono en otra tabla o atributo, se asocia aquí
        return user

# 4. Traductor para la verificación del Login público anterior
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

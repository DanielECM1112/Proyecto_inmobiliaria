from rest_framework import serializers
from users.models import Usuario

# Serializer para ver datos del usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'nombre', 'email', 'rol', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')


# Serializer para el registro de nuevos usuarios
class RegisterSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data


# Serializer para el login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# Serializer para que el administrador edite usuarios
class UsuarioAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('nombre', 'email', 'rol', 'is_active', 'is_staff')
        
    def validate_email(self, value):
        usuario_id = self.instance.id if self.instance else None
        if Usuario.objects.exclude(id=usuario_id).filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está siendo usado por otro usuario.")
        return value

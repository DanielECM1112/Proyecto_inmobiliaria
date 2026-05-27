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

    def validate_password(self, value):
        """Validaciones de complejidad de contraseña.

        - Mínimo 8 caracteres (asegurado por min_length)
        - Al menos una mayúscula
        - Al menos un número
        - Al menos un carácter especial (!@#$%^&*)
        """
        import re
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError('La contraseña debe contener al menos una letra mayúscula.')
        if not re.search(r'\d', value):
            raise serializers.ValidationError('La contraseña debe contener al menos un número.')
        if not re.search(r'[!@#$%^&*]', value):
            raise serializers.ValidationError('La contraseña debe contener al menos un carácter especial (!@#$%^&*).')
        return value

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value

    def validate(self, data):
        # Verificar que las contraseñas coincidan
        if data.get('password') != data.get('password_confirm'):
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

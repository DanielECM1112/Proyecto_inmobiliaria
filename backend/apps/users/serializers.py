from rest_framework import serializers
from users.models import Usuario
from plans.serializers import PlanPublicoSerializer

# Serializer para ver datos del usuario
class UsuarioSerializer(serializers.ModelSerializer): 
    plan_activo = PlanPublicoSerializer(read_only=True)
    
    class Meta: 
        model = Usuario 
        fields = ('id', 'nombre', 'email', 'rol', 'is_staff', 'is_active', 
                  'telefono', 'ciudad', 'avatar', 'created_at', 
                  'plan_activo', 'plan_activado_at', 'plan_expira_at') 
        read_only_fields = ('id', 'email', 'created_at', 'rol', 'is_staff', 'is_active', 
                           'plan_activo', 'plan_activado_at', 'plan_expira_at') 


# Serializer para actualizar el perfil (incluye contraseña opcional)
class PerfilUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = ('nombre', 'telefono', 'ciudad', 'password')

    def validate_password(self, value):
        if value:
            import re
            if not re.search(r'[A-Z]', value):
                raise serializers.ValidationError('La contraseña debe contener al menos una letra mayúscula.')
            if not re.search(r'\d', value):
                raise serializers.ValidationError('La contraseña debe contener al menos un número.')
            if not re.search(r'[!@#$%^&*]', value):
                raise serializers.ValidationError('La contraseña debe contener al menos un carácter especial (!@#$%^&*).')
        return value


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

import logging
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import Usuario

logger = logging.getLogger('apps')

class UsuarioService:
    @staticmethod
    def registrar_usuario(email, nombre, password):
        """
        Registra un nuevo usuario con rol 'usuario' por defecto.
        """
        try:
            user = Usuario.objects.create_user(
                email=email,
                nombre=nombre,
                password=password,
                rol='usuario'
            )
            logger.info(f"Usuario registrado: {email}")
            return user
        except Exception as e:
            logger.error(f"Error al registrar usuario {email}: {str(e)}")
            raise e

    @staticmethod
    def login_usuario(email, password):
        """
        Autentica un usuario y retorna los tokens JWT.
        """
        user = authenticate(email=email, password=password)
        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            logger.info(f"Login exitoso: {email}")
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': str(user.id),
                    'nombre': user.nombre,
                    'email': user.email,
                    'rol': user.rol
                }
            }
        logger.warning(f"Intento de login fallido: {email}")
        return None

    @staticmethod
    def desactivar_usuario(usuario_id):
        """
        Desactiva un usuario y marca sus inmuebles como finalizados.
        """
        try:
            usuario = Usuario.objects.get(id=usuario_id)
            usuario.is_active = False
            usuario.save()
            
            # Lógica de negocio: Inmuebles pasan a 'finalizado'
            usuario.inmuebles.all().update(estado='finalizado')
            
            logger.info(f"Usuario desactivado: {usuario.email}")
            return usuario
        except Usuario.DoesNotExist:
            logger.error(f"Usuario no encontrado para desactivación: {usuario_id}")
            return None

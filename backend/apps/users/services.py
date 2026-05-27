import logging
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import Usuario

# Configuración del logger
logger = logging.getLogger('apps')

class UsuarioService:
    """
    Clase de servicio para manejar la lógica de negocio de los usuarios.
    """

    @staticmethod
    def registrar_usuario(email, nombre, password):
        """
        Crea un nuevo usuario con rol 'usuario' por defecto.
        """
        try:
            user = Usuario.objects.create_user(
                email=email,
                nombre=nombre,
                password=password,
                rol='usuario'
            )
            logger.info(f"Usuario registrado exitosamente: {email}")
            return user
        except Exception as e:
            logger.error(f"Error al registrar usuario {email}: {str(e)}")
            raise e

    @staticmethod
    def login_usuario(email, password):
        """
        Autentica un usuario y genera los tokens JWT correspondientes.
        """
        user = authenticate(email=email, password=password)
        
        if user:
            if not user.is_active:
                logger.warning(f"Intento de login en cuenta desactivada: {email}")
                return {"error": "Esta cuenta está desactivada."}
            
            refresh = RefreshToken.for_user(user)
            logger.info(f"Login exitoso para el usuario: {email}")
            
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
        
        logger.warning(f"Credenciales inválidas para el usuario: {email}")
        return None

    @staticmethod
    def desactivar_usuario(usuario_id):
        """
        Realiza la desactivación lógica de un usuario y marca sus inmuebles como finalizados.
        """
        try:
            usuario = Usuario.objects.get(id=usuario_id)
            usuario.is_active = False
            usuario.save()
            
            # Lógica de negocio adicional: Inmuebles asociados pasan a estado 'finalizado'
            if hasattr(usuario, 'inmuebles'):
                usuario.inmuebles.all().update(estado='finalizado')
            
            logger.info(f"Usuario {usuario.email} desactivado correctamente.")
            return usuario
        except Usuario.DoesNotExist:
            logger.error(f"No se encontró el usuario con ID {usuario_id} para desactivar.")
            return None

    @staticmethod
    def activar_usuarios(queryset):
        """
        Activa múltiples usuarios desde el panel administrativo.
        """
        actualizado = queryset.update(is_active=True)
        logger.info(f"Se activaron {actualizado} usuarios desde el admin.")
        return actualizado

    @staticmethod
    def desactivar_usuarios(queryset):
        """
        Desactiva múltiples usuarios desde el panel administrativo.
        """
        usuarios = list(queryset)
        for usuario in usuarios:
            usuario.is_active = False
            usuario.save()
            if hasattr(usuario, 'inmuebles'):
                usuario.inmuebles.all().update(estado='finalizado')
        logger.info(f"Se desactivaron {len(usuarios)} usuarios desde el admin.")
        return len(usuarios)

    @staticmethod
    def obtener_todos_los_usuarios():
        """
        Retorna todos los usuarios registrados en el sistema.
        """
        return Usuario.objects.all()

    @staticmethod
    def actualizar_usuario_admin(usuario_id, datos):
        """
        Actualiza los datos de un usuario desde el panel de administración.
        """
        try:
            usuario = Usuario.objects.get(id=usuario_id)
            for attr, value in datos.items():
                setattr(usuario, attr, value)
            usuario.save()
            logger.info(f"Usuario {usuario.email} actualizado por administrador.")
            return usuario
        except Usuario.DoesNotExist:
            logger.error(f"No se encontró el usuario con ID {usuario_id} para actualizar.")
            return None

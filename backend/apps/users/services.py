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

    # ------------------ Recuperación de contraseña ------------------
    @staticmethod
    def _validar_contrasena(password):
        import re
        if len(password) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres.')
        if not re.search(r'[A-Z]', password):
            raise ValueError('La contraseña debe contener al menos una letra mayúscula.')
        if not re.search(r'\d', password):
            raise ValueError('La contraseña debe contener al menos un número.')
        if not re.search(r'[!@#$%^&*]', password):
            raise ValueError('La contraseña debe contener al menos un carácter especial (!@#$%^&*).')

    @staticmethod
    def solicitar_recuperacion(email):
        """
        Busca usuario por email, crea un PasswordResetToken y lo registra.
        En desarrollo imprime el token en el log.
        Retorna un mensaje informativo.
        """
        from users.models import PasswordResetToken
        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            raise ValueError('Email no registrado')

        # Crear token
        token_obj = PasswordResetToken.objects.create(usuario=usuario)
        logger.info(f"Token de recuperación generado para {email}: {token_obj.token}")

        # En producción aquí se enviaría el email. En desarrollo solo logueamos.
        return {"mensaje": "Si el email existe recibirás instrucciones"}

    @staticmethod
    def confirmar_recuperacion(token, nueva_password):
        """
        Valida el token, la nueva contraseña y actualiza la contraseña del usuario.
        El token expira a la hora.
        """
        from users.models import PasswordResetToken
        try:
            token_obj = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            raise ValueError('Token inválido o no encontrado')

        if token_obj.esta_expirado():
            # Borrar el token expirado
            token_obj.delete()
            raise ValueError('Token expirado')

        # Validar nueva contraseña
        UsuarioService._validar_contrasena(nueva_password)

        # Actualizar contraseña del usuario
        usuario = token_obj.usuario
        usuario.set_password(nueva_password)
        usuario.save()

        # Eliminar token usado
        token_obj.delete()

        logger.info(f"Contraseña actualizada para usuario: {usuario.email}")
        return {"mensaje": "Contraseña actualizada"}

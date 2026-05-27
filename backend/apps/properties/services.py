import logging
from django.db.models import Q
from .models import Inmueble, ImagenInmueble, Favorito, Contacto

logger = logging.getLogger('apps')

class InmuebleService:
    """
    Capa de servicios para la lógica de negocio de Inmuebles.
    """

    @staticmethod
    def listar_inmuebles(filtros=None):
        """
        Lista inmuebles con filtros dinámicos. 
        Solo muestra 'activos' a menos que se especifique lo contrario (admin).
        """
        queryset = Inmueble.objects.select_related('usuario', 'plan').prefetch_related('imagenes')
        
        if filtros:
            if filtros.get('ciudad'):
                queryset = queryset.filter(ciudad__icontains=filtros['ciudad'])
            if filtros.get('tipo'):
                queryset = queryset.filter(tipo=filtros['tipo'])
            if filtros.get('precio_min'):
                queryset = queryset.filter(precio__gte=filtros['precio_min'])
            if filtros.get('precio_max'):
                queryset = queryset.filter(precio__lte=filtros['precio_max'])
            
            # Filtro de estado
            estado = filtros.get('estado')
            if estado:
                queryset = queryset.filter(estado=estado)
            else:
                queryset = queryset.filter(estado='activo')
        else:
            queryset = queryset.filter(estado='activo')
            
        return queryset

    @staticmethod
    def obtener_inmueble(inmueble_id):
        """
        Retorna un inmueble por su ID.
        """
        try:
            return Inmueble.objects.get(id=inmueble_id)
        except Inmueble.DoesNotExist:
            return None

    @staticmethod
    def crear_inmueble(usuario, data):
        """
        Crea un inmueble con estado inicial 'pendiente'.
        """
        try:
            inmueble = Inmueble.objects.create(
                usuario=usuario,
                estado='pendiente',
                **data
            )
            logger.info(f"Inmueble creado: {inmueble.titulo} (ID: {inmueble.id}) por {usuario.email}")
            return inmueble
        except Exception as e:
            logger.error(f"Error al crear inmueble: {str(e)}")
            raise e

    @staticmethod
    def editar_inmueble(inmueble_id, data, usuario):
        """
        Edita un inmueble validando que sea el dueño o un administrador.
        """
        try:
            inmueble = Inmueble.objects.get(id=inmueble_id)
            
            # Validación de permisos (Owner or Admin)
            if inmueble.usuario != usuario and usuario.rol != 'admin':
                logger.warning(f"Intento de edición no autorizado por {usuario.email} en {inmueble_id}")
                return None, "No tienes permiso para editar este inmueble."

            for attr, value in data.items():
                setattr(inmueble, attr, value)
            
            inmueble.save()
            logger.info(f"Inmueble editado: {inmueble.id} por {usuario.email}")
            return inmueble, None
        except Inmueble.DoesNotExist:
            return None, "Inmueble no encontrado."

    @staticmethod
    def activar_inmueble(inmueble_id):
        """
        Activa un inmueble desde el panel administrativo.
        """
        try:
            inmueble = Inmueble.objects.get(id=inmueble_id)
            inmueble.estado = 'activo'
            inmueble.save()
            logger.info(f"Inmueble activado: {inmueble_id}")
            return True
        except Inmueble.DoesNotExist:
            return False

    @staticmethod
    def finalizar_inmueble(inmueble_id):
        """
        Finaliza un inmueble desde el panel administrativo.
        """
        try:
            inmueble = Inmueble.objects.get(id=inmueble_id)
            inmueble.estado = 'finalizado'
            inmueble.save()
            logger.info(f"Inmueble finalizado: {inmueble_id}")
            return True
        except Inmueble.DoesNotExist:
            return False

    @staticmethod
    def agregar_imagen(inmueble_id, imagen_file):
        """
        Sube una imagen validando tamaño y formato.
        """
        # Validación de tamaño (5MB)
        if imagen_file.size > 5 * 1024 * 1024:
            return None, "La imagen excede el límite de 5MB."
        
        # Validación de formato
        extension = imagen_file.name.split('.')[-1].lower()
        if extension not in ['jpg', 'jpeg', 'png', 'webp']:
            return None, "Formato no permitido. Solo jpg, png o webp."

        try:
            inmueble = Inmueble.objects.get(id=inmueble_id)
            nueva_img = ImagenInmueble.objects.create(
                inmueble=inmueble,
                imagen=imagen_file
            )
            return nueva_img, None
        except Inmueble.DoesNotExist:
            return None, "Inmueble no encontrado."

    @staticmethod
    def toggle_favorito(usuario, inmueble_id):
        """
        Agrega a favoritos si no existe, o lo quita si ya existe.
        """
        try:
            favorito, created = Favorito.objects.get_or_create(
                usuario=usuario,
                inmueble_id=inmueble_id
            )
            if not created:
                favorito.delete()
                logger.info(f"Favorito quitado: {inmueble_id} por {usuario.email}")
                return False # Quitado
            
            logger.info(f"Favorito agregado: {inmueble_id} por {usuario.email}")
            return True # Agregado
        except Exception as e:
            logger.error(f"Error en toggle_favorito: {str(e)}")
            return None

    @staticmethod
    def enviar_contacto(data):
        """
        Guarda el mensaje de contacto.
        """
        try:
            contacto = Contacto.objects.create(**data)
            logger.info(f"Mensaje de contacto registrado para inmueble {data['inmueble'].id}")
            # Aquí se podría implementar el envío de email real
            return contacto
        except Exception as e:
            logger.error(f"Error al registrar contacto: {str(e)}")
            raise e

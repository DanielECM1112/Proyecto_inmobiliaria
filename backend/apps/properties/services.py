import logging
from django.db.models import Q
from properties.models import Inmueble, ImagenInmueble, Favorito, Contacto

logger = logging.getLogger('apps')

class InmuebleService:
    @staticmethod
    def listar_inmuebles(filtros=None):
        """
        Lista inmuebles con filtros opcionales.
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
            if filtros.get('estado'):
                queryset = queryset.filter(estado=filtros['estado'])
            else:
                # Por defecto solo mostrar activos en lista pública
                queryset = queryset.filter(estado='activo')
                
        return queryset

    @staticmethod
    def crear_inmueble(usuario, datos):
        """
        Crea un inmueble. Inicialmente en estado 'pendiente' hasta que se apruebe el pago.
        """
        try:
            inmueble = Inmueble.objects.create(
                usuario=usuario,
                estado='pendiente',
                **datos
            )
            logger.info(f"Inmueble creado (pendiente): {inmueble.titulo} por {usuario.email}")
            return inmueble
        except Exception as e:
            logger.error(f"Error al crear inmueble: {str(e)}")
            raise e

    @staticmethod
    def gestionar_favorito(usuario, inmueble_id):
        """
        Agrega o quita un inmueble de favoritos.
        """
        favorito, created = Favorito.objects.get_or_create(
            usuario=usuario,
            inmueble_id=inmueble_id
        )
        if not created:
            favorito.delete()
            return False # Quitado
        return True # Agregado

    @staticmethod
    def registrar_contacto(inmueble_id, datos):
        """
        Registra un mensaje de contacto para un inmueble.
        """
        return Contacto.objects.create(inmueble_id=inmueble_id, **datos)

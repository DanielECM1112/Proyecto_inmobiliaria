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
        Solo muestra 'activos' a menos que se especifique lo contrario.
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
        Retorna un inmueble por su ID con relaciones necesarias para evitar N+1.
        """
        try:
            return Inmueble.objects.select_related('usuario', 'plan').prefetch_related('imagenes', 'pagos').get(id=inmueble_id)
        except Inmueble.DoesNotExist:
            return None

    @staticmethod
    def obtener_mis_inmuebles(usuario):
        """
        Retorna los inmuebles del usuario autenticado ordenados por fecha.
        """
        return Inmueble.objects.filter(usuario=usuario).select_related('plan').prefetch_related('imagenes', 'pagos').order_by('-created_at')

    @staticmethod
    def crear_inmueble(usuario, data):
        """
        Crea un inmueble en estado 'pendiente' con validaciones de datos y plan.
        """
        titulo = data.get('titulo', '').strip()
        if not titulo:
            raise ValueError('El título es obligatorio.')

        descripcion = data.get('descripcion', '').strip()
        precio = data.get('precio')
        if precio is None:
            raise ValueError('El precio es obligatorio.')
        if precio <= 0:
            raise ValueError('El precio debe ser mayor a cero.')

        ciudad = data.get('ciudad', '').strip()
        if not ciudad:
            raise ValueError('La ciudad es obligatoria.')

        tipo = data.get('tipo')
        if not tipo:
            raise ValueError('El tipo de inmueble es obligatorio.')

        plan_id = data.get('plan_id')
        if not plan_id:
            raise ValueError('El plan_id es obligatorio.')

        from plans.models import Plan
        try:
            plan = Plan.objects.get(id=plan_id, activo=True)
        except Plan.DoesNotExist:
            raise ValueError('El plan seleccionado no existe o no está activo.')

        inmuebles_activos = Inmueble.objects.filter(usuario=usuario, plan=plan).exclude(estado='finalizado').count()
        if inmuebles_activos >= plan.max_inmuebles:
            raise ValueError('Has alcanzado el máximo de inmuebles permitidos para este plan.')

        try:
            inmueble = Inmueble.objects.create(
                usuario=usuario,
                estado='pendiente',
                plan=plan,
                titulo=titulo,
                descripcion=descripcion,
                precio=precio,
                ciudad=ciudad,
                direccion=data.get('direccion', '').strip(),
                tipo=tipo,
                url_video_youtube=data.get('url_video_youtube', '').strip(),
                whatsapp_contacto=data.get('whatsapp_contacto', '').strip(),
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
    def agregar_imagen(inmueble_id, imagen_file, usuario):
        """
        Sube una imagen validando tamaño, formato, límite y permisos.
        """
        if imagen_file.size > 5 * 1024 * 1024:
            return None, "La imagen excede el límite de 5MB."

        extension = imagen_file.name.split('.')[-1].lower()
        if extension not in ['jpg', 'jpeg', 'png', 'webp']:
            return None, "Formato no permitido. Solo jpg, png o webp."

        try:
            inmueble = Inmueble.objects.select_related('plan', 'usuario').get(id=inmueble_id)
        except Inmueble.DoesNotExist:
            return None, "Inmueble no encontrado."

        if inmueble.usuario != usuario:
            return None, "Solo el dueño del inmueble puede subir imágenes."

        imagenes_existentes = inmueble.imagenes.count()
        if imagenes_existentes >= inmueble.plan.max_imagenes:
            return None, "El inmueble ya alcanzó el máximo de imágenes permitido por el plan."

        nueva_img = ImagenInmueble.objects.create(inmueble=inmueble, imagen=imagen_file)
        return nueva_img, None

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
                return False

            logger.info(f"Favorito agregado: {inmueble_id} por {usuario.email}")
            return True
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
            return contacto
        except Exception as e:
            logger.error(f"Error al registrar contacto: {str(e)}")
            raise e

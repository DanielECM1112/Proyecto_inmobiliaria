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
        # Evitar N+1: traer usuario y plan y prefetchear imágenes
        queryset = Inmueble.objects.select_related('usuario', 'plan').prefetch_related('imagenes')

        # Aplicar filtros combinables
        if filtros:
            ciudad = filtros.get('ciudad')
            if ciudad:
                queryset = queryset.filter(ciudad__icontains=ciudad)

            tipo = filtros.get('tipo')
            if tipo:
                queryset = queryset.filter(tipo=tipo)

            precio_min = filtros.get('precio_min')
            if precio_min:
                try:
                    queryset = queryset.filter(precio__gte=float(precio_min))
                except Exception:
                    pass

            precio_max = filtros.get('precio_max')
            if precio_max:
                try:
                    queryset = queryset.filter(precio__lte=float(precio_max))
                except Exception:
                    pass

            # Estado: por defecto para público mostrar 'activo'. Si se indica is_admin=True no se aplica el filtro por defecto.
            estado = filtros.get('estado')
            is_admin = filtros.get('is_admin') in [True, 'True', 'true', '1', 1]
            if estado:
                queryset = queryset.filter(estado=estado)
            elif not is_admin:
                queryset = queryset.filter(estado='activo')

            # Ordenamiento
            ordenar_por = filtros.get('ordenar_por')
            if ordenar_por == 'precio_asc':
                queryset = queryset.order_by('precio')
            elif ordenar_por == 'precio_desc':
                queryset = queryset.order_by('-precio')
            elif ordenar_por == 'reciente':
                queryset = queryset.order_by('-created_at')
            elif ordenar_por == 'antiguo':
                queryset = queryset.order_by('created_at')

        else:
            # Si no hay filtros, mostrar solo activos
            queryset = queryset.filter(estado='activo').order_by('-created_at')

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
        # Incluimos pagos para calcular estado de pago cuando sea necesario
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
            plan = Plan.objects.get(id=plan_id, is_active=True)
        except Plan.DoesNotExist:
            raise ValueError('El plan seleccionado no existe o no está activo.')

        inmuebles_activos = Inmueble.objects.filter(usuario=usuario, plan=plan).exclude(estado='finalizado').count()
        if inmuebles_activos >= plan.max_properties:
            raise ValueError('Has alcanzado el máximo de inmuebles permitidos para este plan.')

        try:
            inmueble = Inmueble.objects.create(
                usuario=usuario,
                estado='activo', # Publicar directamente para visibilidad inmediata
                plan=plan,
                titulo=titulo,
                descripcion=descripcion,
                precio=precio,
                ciudad=ciudad,
                direccion=data.get('direccion', '').strip(),
                tipo=tipo,
                whatsapp_contacto=data.get('whatsapp_contacto', '').strip(),
                amenidades=data.get('amenidades', '').strip(),
                detalles_extra=data.get('detalles_extra', '').strip(),
                observaciones=data.get('observaciones', '').strip(),
                habitaciones=data.get('habitaciones') or 0,
                banos=data.get('banos') or 0,
                area=data.get('area') or 0,
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
        # Validaciones de tamaño y extensión
        if imagen_file.size > 5 * 1024 * 1024:
            return None, "La imagen excede el límite de 5MB."

        extension = imagen_file.name.split('.')[-1].lower()
        if extension not in ['jpg', 'jpeg', 'png', 'webp']:
            return None, "Formato no permitido. Solo jpg, jpeg, png o webp."

        # Validar existencia del inmueble y permisos
        try:
            inmueble = Inmueble.objects.select_related('plan', 'usuario').get(id=inmueble_id)
        except Inmueble.DoesNotExist:
            return None, "Inmueble no encontrado."

        if inmueble.usuario != usuario:
            return None, "Solo el dueño del inmueble puede subir imágenes."

        # Validar límite de imágenes según el plan
        imagenes_existentes = inmueble.imagenes.count()
        if imagenes_existentes >= inmueble.plan.max_photos:
            return None, f"El inmueble ya alcanzó el máximo de {inmueble.plan.max_photos} imágenes permitido por el plan."

        # Calcular orden automático
        ultimo = inmueble.imagenes.order_by('-orden').first()
        siguiente_orden = (ultimo.orden + 1) if ultimo and getattr(ultimo, 'orden', None) is not None else 1

        nueva_img = ImagenInmueble.objects.create(inmueble=inmueble, imagen=imagen_file, orden=siguiente_orden)

        # Retornar mensaje y objeto
        return {"mensaje": "Imagen subida correctamente", "imagen": nueva_img}, None

    @staticmethod
    def toggle_favorito(usuario, inmueble_id):
        """
        Agrega a favoritos si no existe, o lo quita si ya existe.
        """
        try:
            favorito, created = Favorito.objects.get_or_create(usuario=usuario, inmueble_id=inmueble_id)
            if not created:
                favorito.delete()
                logger.info(f"Favorito quitado: {inmueble_id} por {usuario.email}")
                total = Favorito.objects.filter(inmueble_id=inmueble_id).count()
                return {"accion": "eliminado", "total_favoritos": total}

            logger.info(f"Favorito agregado: {inmueble_id} por {usuario.email}")
            total = Favorito.objects.filter(inmueble_id=inmueble_id).count()
            return {"accion": "agregado", "total_favoritos": total}
        except Exception as e:
            logger.error(f"Error en toggle_favorito: {str(e)}")
            return None

    @staticmethod
    def contar_favoritos(inmueble_id):
        """Retorna el total de favoritos de un inmueble."""
        try:
            total = Favorito.objects.filter(inmueble_id=inmueble_id).count()
            return {"total_favoritos": total}
        except Exception as e:
            logger.error(f"Error al contar favoritos: {str(e)}")
            return {"total_favoritos": 0}

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

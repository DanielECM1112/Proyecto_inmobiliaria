from django.contrib import admin
from .models import Usuario
from .services import UsuarioService
from django.utils.html import format_html
from django.urls import reverse

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    """
    Configuración del panel administrativo para Usuarios.
    """
    list_display = ('nombre', 'email', 'rol', 'is_active', 'created_at', 'acciones')
    list_filter = ('rol', 'is_active')
    search_fields = ('nombre', 'email')
    actions = ['activar_usuarios', 'desactivar_usuarios', 'eliminar_usuarios']
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    @admin.action(description='Activar usuarios seleccionados')
    def activar_usuarios(self, request, queryset):
        UsuarioService.activar_usuarios(queryset)
        self.message_user(request, 'Los usuarios seleccionados han sido activados.')

    @admin.action(description='Desactivar usuarios seleccionados')
    def desactivar_usuarios(self, request, queryset):
        UsuarioService.desactivar_usuarios(queryset)
        self.message_user(request, 'Los usuarios seleccionados han sido desactivados.')

    @admin.action(description='Eliminar usuarios seleccionados')
    def eliminar_usuarios(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'Se eliminaron {count} usuarios.')

    def acciones(self, obj):
        # Link al change form y al delete view para este usuario
        change_url = reverse('admin:users_usuario_change', args=[obj.pk])
        delete_url = reverse('admin:users_usuario_delete', args=[obj.pk])
        activar_url = reverse('admin:users_usuario_changelist')
        return format_html(
            '<a class="button" href="{}">Editar</a>&nbsp;'
            '<a class="button" href="{}">Eliminar</a>',
            change_url, delete_url
        )
    acciones.short_description = 'Acciones'

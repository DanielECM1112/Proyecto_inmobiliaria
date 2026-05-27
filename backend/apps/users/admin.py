from django.contrib import admin
from .models import Usuario
from .services import UsuarioService

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    """
    Configuración del panel administrativo para Usuarios.
    """
    list_display = ('nombre', 'email', 'rol', 'is_active', 'created_at')
    list_filter = ('rol', 'is_active')
    search_fields = ('nombre', 'email')
    actions = ['activar_usuarios', 'desactivar_usuarios']
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

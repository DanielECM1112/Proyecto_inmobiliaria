from django.contrib import admin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    """
    Configuración del panel administrativo para Usuarios.
    """
    list_display = ('nombre', 'email', 'rol', 'is_active', 'created_at')
    list_filter = ('rol', 'is_active')
    search_fields = ('nombre', 'email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

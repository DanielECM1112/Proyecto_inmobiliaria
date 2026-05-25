from django.contrib import admin
from users.models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('email', 'nombre', 'rol', 'is_active', 'is_staff', 'created_at')
    list_filter = ('rol', 'is_active', 'is_staff')
    search_fields = ('email', 'nombre')
    ordering = ('-created_at',)

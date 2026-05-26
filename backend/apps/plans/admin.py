from django.contrib import admin
from .models import Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    """
    Configuración del panel administrativo para Planes.
    """
    list_display = ('nombre', 'precio', 'duracion_dias', 'max_inmuebles', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre',)
    ordering = ('precio',)
    readonly_fields = ('created_at', 'updated_at')

from django.contrib import admin
from .models import Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    """
    Configuración del panel administrativo para Planes.
    """
    list_display = ('name', 'price', 'duration_days', 'max_properties', 'is_active', 'is_featured')
    list_filter = ('is_active', 'is_featured')
    search_fields = ('name', 'slug')
    ordering = ('price',)
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('name',)}

from django.contrib import admin
from plans.models import Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'duracion_dias', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre',)

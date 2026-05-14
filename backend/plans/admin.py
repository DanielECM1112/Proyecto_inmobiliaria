from django.contrib import admin
from .models import Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration_days', 'max_properties', 'max_images', 'active')
    list_filter = ('active', 'duration_days')
    search_fields = ('name', 'description')
    ordering = ('price',)
    list_editable = ('active', 'price')

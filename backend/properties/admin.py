from django.contrib import admin
from .models import Property

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'price', 'city', 'property_type', 'status', 'created_at')
    list_filter = ('status', 'property_type', 'city', 'created_at')
    search_fields = ('title', 'description', 'address', 'city', 'owner__username')
    ordering = ('-created_at',)
    list_editable = ('status',)
    list_per_page = 20
    
    # Organizar campos en el formulario de edición
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'description', 'price', 'owner')
        }),
        ('Ubicación y Detalles', {
            'fields': ('city', 'address', 'property_type', 'bedrooms', 'bathrooms', 'area')
        }),
        ('Multimedia y Estado', {
            'fields': ('image', 'status')
        }),
    )

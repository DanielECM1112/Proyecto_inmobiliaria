from django.contrib import admin
from .models import Inmueble, ImagenInmueble, Favorito, Contacto

class ImagenInmuebleInline(admin.TabularInline):
    model = ImagenInmueble
    extra = 1

@admin.register(Inmueble)
class InmuebleAdmin(admin.ModelAdmin):
    """
    Configuración del panel administrativo para Inmuebles.
    """
    list_display = ('titulo', 'ciudad', 'tipo', 'estado', 'precio', 'usuario', 'created_at')
    list_filter = ('estado', 'tipo', 'ciudad')
    search_fields = ('titulo', 'ciudad')
    inlines = [ImagenInmuebleInline]
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Favorito)
class FavoritoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'inmueble', 'created_at')

@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ('inmueble', 'nombre', 'email', 'fecha')
    search_fields = ('nombre', 'email', 'inmueble__titulo')

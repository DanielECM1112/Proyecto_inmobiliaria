from django.contrib import admin
from properties.models import Inmueble, ImagenInmueble, Favorito, Contacto

class ImagenInmuebleInline(admin.TabularInline):
    model = ImagenInmueble
    extra = 1

@admin.register(Inmueble)
class InmuebleAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'ciudad', 'tipo', 'precio', 'estado', 'usuario')
    list_filter = ('estado', 'tipo', 'ciudad')
    search_fields = ('titulo', 'descripcion', 'ciudad')
    inlines = [ImagenInmuebleInline]

admin.site.register(Favorito)
admin.site.register(Contacto)

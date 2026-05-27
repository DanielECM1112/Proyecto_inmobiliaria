from django.contrib import admin
from .models import Inmueble, ImagenInmueble, Favorito, Contacto
from .services import InmuebleService

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
    search_fields = ('titulo', 'ciudad', 'usuario__email')
    actions = ['activar_inmueble', 'finalizar_inmueble']
    inlines = [ImagenInmuebleInline]
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    @admin.action(description='Activar inmueble seleccionado')
    def activar_inmueble(self, request, queryset):
        for inmueble in queryset:
            InmuebleService.activar_inmueble(inmueble.id)
        self.message_user(request, 'Los inmuebles seleccionados han sido activados.')

    @admin.action(description='Finalizar inmueble seleccionado')
    def finalizar_inmueble(self, request, queryset):
        for inmueble in queryset:
            InmuebleService.finalizar_inmueble(inmueble.id)
        self.message_user(request, 'Los inmuebles seleccionados han sido finalizados.')

@admin.register(Favorito)
class FavoritoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'inmueble', 'created_at')

@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ('inmueble', 'nombre', 'email', 'fecha')
    search_fields = ('nombre', 'email', 'inmueble__titulo')

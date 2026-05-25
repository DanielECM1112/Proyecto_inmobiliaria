from django.contrib import admin
from payments.models import Pago

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('referencia_externa', 'usuario', 'plan', 'monto', 'estado', 'created_at')
    list_filter = ('estado', 'metodo')
    search_fields = ('referencia_externa', 'usuario__email')
    readonly_fields = ('created_at', 'updated_at')

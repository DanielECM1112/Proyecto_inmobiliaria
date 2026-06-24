from django.contrib import admin
from .models import Pago

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    """
    Configuración del panel administrativo para Pagos.
    """
    list_display = ('usuario', 'plan', 'monto', 'metodo', 'estado', 'created_at')
    list_filter = ('estado', 'metodo')
    search_fields = ('usuario__nombre', 'usuario__email', 'referencia_externa')
    actions = ['aprobar_pagos', 'rechazar_pagos']
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    @admin.action(description='Aprobar pagos seleccionados')
    def aprobar_pagos(self, request, queryset):
        from .services import PagoService
        for pago in queryset:
            PagoService.confirmar_pago(pago.referencia_externa)
        self.message_user(request, 'Los pagos seleccionados han sido aprobados y los Propiedads activados.')

    @admin.action(description='Rechazar pagos seleccionados')
    def rechazar_pagos(self, request, queryset):
        queryset.update(estado='rechazado')
        self.message_user(request, 'Los pagos seleccionados han sido marcados como rechazados.')

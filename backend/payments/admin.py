from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'user', 'plan', 'amount', 'payment_method', 'payment_status', 'created_at')
    list_filter = ('payment_status', 'payment_method', 'created_at')
    search_fields = ('transaction_id', 'user__username', 'user__email', 'user__first_name')
    readonly_fields = ('transaction_id', 'user', 'plan', 'amount', 'created_at')
    ordering = ('-created_at',)
    
    def has_add_permission(self, request):
        # Normalmente los pagos se crean vía API, no manual en admin
        return False

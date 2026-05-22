from django.urls import path
from .views import payment_mock_api

urlpatterns = [
    path('admin-payments/', payment_mock_api, name='admin-payments-api'),
]

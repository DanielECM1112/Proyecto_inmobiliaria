from django.urls import path
from .views import PropiedadListView, PropiedadCreateView, PropiedadDetailView, MisPropiedadesView, delete_property_image, get_user_plan_status

urlpatterns = [
    path('', PropiedadListView.as_view(), name='propiedad-list'),
    path('create/', PropiedadCreateView.as_view(), name='propiedad-create'),
    path('mis-propiedades/', MisPropiedadesView.as_view(), name='mis-propiedades'),
    path('plan-status/', get_user_plan_status, name='plan-status'),
    path('<int:pk>/', PropiedadDetailView.as_view(), name='propiedad-detail'),
    path('images/<int:pk>/', delete_property_image, name='delete-property-image'),
]

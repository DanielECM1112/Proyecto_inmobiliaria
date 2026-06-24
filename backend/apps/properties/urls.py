from django.urls import path
from .views import PropiedadListView, PropiedadCreateView, PropiedadDetailView, MisPropiedadesView

urlpatterns = [
    path('', PropiedadListView.as_view(), name='propiedad-list'),
    path('create/', PropiedadCreateView.as_view(), name='propiedad-create'),
    path('mis-propiedades/', MisPropiedadesView.as_view(), name='mis-propiedades'),
    path('<int:pk>/', PropiedadDetailView.as_view(), name='propiedad-detail'),
]

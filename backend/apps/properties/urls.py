from django.urls import path
from .views import (
    InmuebleListView, InmuebleDetailView, InmuebleCreateView, 
    InmuebleAdminView, ImagenView, FavoritoView, ContactoView
)

urlpatterns = [
    # Inmuebles
    path('inmuebles/', InmuebleListView.as_view(), name='inmueble-list'),
    path('inmuebles/<uuid:pk>/', InmuebleDetailView.as_view(), name='inmueble-detail'),
    path('inmuebles/crear/', InmuebleCreateView.as_view(), name='inmueble-create'),
    path('inmuebles/admin/<uuid:pk>/', InmuebleAdminView.as_view(), name='inmueble-admin'),
    
    # Imágenes
    path('inmuebles/<uuid:pk>/imagenes/', ImagenView.as_view(), name='inmueble-imagenes'),
    path('inmuebles/<uuid:pk>/imagenes/<uuid:img_id>/', ImagenView.as_view(), name='inmueble-imagen-delete'),
    
    # Favoritos
    path('favoritos/', FavoritoView.as_view(), name='favoritos'),
    path('favoritos/<uuid:pk>/', FavoritoView.as_view(), name='favoritos-delete'), # pk del inmueble
    
    # Contacto
    path('contacto/', ContactoView.as_view(), name='contacto'),
]

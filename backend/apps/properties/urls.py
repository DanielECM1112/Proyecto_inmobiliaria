from django.urls import path
from .views import (
    InmuebleListCreateView, InmuebleDetailView,
    InmuebleAdminView, ImagenView, FavoritoView,
    ContactoView, MisInmueblesView, FavoritoCountView
)

urlpatterns = [
    # Inmuebles
    path('inmuebles/', InmuebleListCreateView.as_view(), name='inmueble-list-create'),
    path('inmuebles/mis-inmuebles/', MisInmueblesView.as_view(), name='mis-inmuebles'),
    path('inmuebles/<uuid:pk>/', InmuebleDetailView.as_view(), name='inmueble-detail'),
    path('inmuebles/admin/<uuid:pk>/', InmuebleAdminView.as_view(), name='inmueble-admin'),

    # Imágenes
    path('inmuebles/<uuid:pk>/imagenes/', ImagenView.as_view(), name='inmueble-imagenes'),
    path('inmuebles/<uuid:pk>/imagenes/<uuid:img_id>/', ImagenView.as_view(), name='inmueble-imagen-delete'),

    # Favoritos
    path('favoritos/', FavoritoView.as_view(), name='favoritos'),
    path('favoritos/<uuid:pk>/', FavoritoView.as_view(), name='favoritos-delete'),
    path('inmuebles/<uuid:pk>/favoritos/count/', FavoritoCountView.as_view(), name='favoritos-count'),

    # Contacto
    path('contacto/', ContactoView.as_view(), name='contacto'),
]

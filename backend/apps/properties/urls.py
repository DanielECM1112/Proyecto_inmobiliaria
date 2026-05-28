from django.urls import path
from .views import (
    InmuebleListCreateView, InmuebleDetailView,
    InmuebleAdminView, ImagenView, FavoritoView,
    ContactoView, MisInmueblesView, FavoritoCountView
)

urlpatterns = [
    # Inmuebles
    path('properties/', InmuebleListCreateView.as_view(), name='property-list-create'),
    path('properties/mis-inmuebles/', MisInmueblesView.as_view(), name='mis-properties'),
    path('properties/<uuid:pk>/', InmuebleDetailView.as_view(), name='property-detail'),
    path('properties/<uuid:pk>/edit/', InmuebleAdminView.as_view(), name='property-edit'),
    path('properties/admin/<uuid:pk>/', InmuebleAdminView.as_view(), name='property-admin'),

    # Imágenes
    path('properties/<uuid:pk>/imagenes/', ImagenView.as_view(), name='property-imagenes'),
    path('properties/<uuid:pk>/imagenes/<uuid:img_id>/', ImagenView.as_view(), name='property-imagen-delete'),

    # Favoritos
    path('favoritos/', FavoritoView.as_view(), name='favoritos'),
    path('favoritos/<uuid:pk>/', FavoritoView.as_view(), name='favoritos-delete'),
    path('properties/<uuid:pk>/favoritos/count/', FavoritoCountView.as_view(), name='favoritos-count'),

    # Contacto
    path('contacto/', ContactoView.as_view(), name='contacto'),
]

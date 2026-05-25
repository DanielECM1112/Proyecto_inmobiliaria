from django.urls import path, include
from rest_framework.routers import DefaultRouter
from properties.views import InmuebleViewSet, ImagenInmuebleView, FavoritoViewSet, ContactoView

router = DefaultRouter()
router.register(r'inmuebles', InmuebleViewSet, basename='inmueble')
router.register(r'favoritos', FavoritoViewSet, basename='favorito')

urlpatterns = [
    path('', include(router.urls)),
    path('inmuebles/<uuid:pk>/imagenes/', ImagenInmuebleView.as_view(), name='inmueble-imagenes'),
    path('contacto/', ContactoView.as_view(), name='contacto'),
]

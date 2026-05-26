from django.urls import path
from .views import UserList, RegisterView, LoginView, social_auth_complete

urlpatterns = [
    path('users/', UserList.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('social-auth-complete/', social_auth_complete, name='social_auth_complete'),
]

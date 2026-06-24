from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from urllib.parse import quote

Usuario = get_user_model()


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)

        if data is None:
            data = {}

        first_name = (data.get('first_name') or '').strip()
        last_name = (data.get('last_name') or '').strip()
        full_name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip()

        if first_name and last_name:
            user.nombre = f"{first_name} {last_name}".strip()
        elif full_name:
            user.nombre = full_name
        elif email:
            user.nombre = email.split('@')[0]
        else:
            user.nombre = 'Usuario'

        return user

    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        if not getattr(user, 'nombre', None):
            user.nombre = (user.email or '').split('@')[0] or 'Usuario'
            user.save(update_fields=['nombre'])
        return user

    def pre_social_login(self, request, sociallogin):
        if sociallogin.is_existing:
            return

        extra = getattr(sociallogin.account, 'extra_data', {}) or {}
        email = (extra.get('email') or '').strip()
        if not email:
            email = (getattr(sociallogin.user, 'email', '') or '').strip()

        if email:
            try:
                user = Usuario.objects.get(email=email)
                sociallogin.connect(request, user)
                return
            except Usuario.DoesNotExist:
                pass

        process = (getattr(sociallogin, 'state', None) or {}).get('process') or request.GET.get('process') or 'login'
        if process == 'signup':
            return

        provider = getattr(sociallogin.account, 'provider', '') or ''
        if email:
            raise ImmediateHttpResponse(redirect(
                f'http://localhost:3000/register?email={quote(email)}&social={quote(provider)}'
            ))
        else:
            raise ImmediateHttpResponse(redirect(
                f'http://localhost:3000/register?social={quote(provider)}'
            ))

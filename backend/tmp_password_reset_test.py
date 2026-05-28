import os
import django
import json
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from users.models import Usuario, PasswordResetToken

client = Client()
client.defaults['HTTP_HOST'] = 'localhost'
email = 'testreset@example.com'
password = 'Test1234!'
new_password = 'Newpass1!'
output_path = 'tmp_password_reset_test_output.txt'

with open(output_path, 'w', encoding='utf-8') as out:
    try:
        user, created = Usuario.objects.get_or_create(email=email, defaults={'nombre': 'Test Usuario'})
        if created:
            user.set_password(password)
            user.save()
        out.write(f'usuario_created={created}\n')

        resp1 = client.post('/api/auth/password-reset/', json.dumps({'email': email}), content_type='application/json')
        out.write(f'password_reset_status={resp1.status_code} {resp1.content.decode()}\n')

        token_obj = PasswordResetToken.objects.filter(usuario=user).order_by('-created_at').first()
        out.write(f'token_exists={bool(token_obj)}\n')
        token = str(token_obj.token) if token_obj else ''

        resp2 = client.post('/api/auth/password-reset/confirmar/', json.dumps({'token': token, 'nueva_password': new_password}), content_type='application/json')
        out.write(f'password_reset_confirm_status={resp2.status_code} {resp2.content.decode()}\n')

        user.refresh_from_db()
        out.write(f'password_changed={user.check_password(new_password)}\n')
    except Exception:
        traceback.print_exc(file=out)

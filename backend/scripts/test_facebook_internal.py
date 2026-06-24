import os
import sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import sys
# Ensure project package is importable
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
import django
django.setup()

from rest_framework.test import APIRequestFactory
from users.views import FacebookLoginView
import requests

# Monkeypatch requests.get to return a fake Facebook response
class FakeResponse:
    def __init__(self, data, status_code=200):
        self._data = data
        self.status_code = status_code
    def json(self):
        return self._data

def fake_requests_get(url, *args, **kwargs):
    # Simulate Facebook returning an email not present in DB
    return FakeResponse({'id':'123','name':'FB Test','email':'noexiste@example.com'})

requests.get = fake_requests_get

factory = APIRequestFactory()
view = FacebookLoginView.as_view()

req = factory.post('/api/auth/facebook/', {'access_token':'fake-token'}, format='json')
resp = view(req)
print('STATUS:', resp.status_code)
try:
    print(resp.data)
except Exception as e:
    print(str(e))

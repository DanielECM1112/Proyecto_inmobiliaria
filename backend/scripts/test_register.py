import requests
import json
url='http://127.0.0.1:8000/auth/register/'
payload={'nombre':'Prueba Social','email':'test_social@example.com','password':'Testpass123!','password_confirm':'Testpass123!'}
res = requests.post(url,json=payload)
print('STATUS',res.status_code)
try:
    print(json.dumps(res.json(),indent=2,ensure_ascii=False))
except Exception as e:
    print(res.text)

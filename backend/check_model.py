import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from plans.models import Plan

print("Fields in Plan model:")
for field in Plan._meta.get_fields():
    print(f"- {field.name}")

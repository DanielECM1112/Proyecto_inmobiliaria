
import os
import sys
from pathlib import Path
from datetime import timedelta
from decouple import config, Csv
from corsheaders.defaults import default_headers

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Agregar la carpeta 'apps' al sys.path para importaciones limpias
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

# --- SEGURIDAD ---
SECRET_KEY = config(
    'SECRET_KEY',
    default='django-insecure-default-key-change-me'
)

DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='localhost,127.0.0.1,0.0.0.0',
    cast=Csv()
)

# Agregar soporte para ngrok y permitir todos si DEBUG=True
if DEBUG:
    ALLOWED_HOSTS = ['*']
else:
    # Agregar dominios específicos si no están en la lista
    if 'flying-dislocate-skimming.ngrok-free.dev' not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append('flying-dislocate-skimming.ngrok-free.dev')

# --- APLICACIONES ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Librerías
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'corsheaders',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.facebook',
    # Cloud storage
    'storages',
    # Apps del proyecto
    'users',
    'plans',
    'properties',
    'payments',
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Middleware personalizado para manejo global de errores
# Se agrega al final de la pila para capturar excepciones no manejadas
MIDDLEWARE.append('backend.middleware.GlobalExceptionMiddleware')

ROOT_URLCONF = 'backend.urls'

# --- TEMPLATES ---
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# --- BASE DE DATOS ---
# Usar SQLite local por defecto para que el backend funcione sin MySQL.
DB_ENGINE = config('DB_ENGINE', default='django.db.backends.sqlite3')

if DB_ENGINE == 'django.db.backends.sqlite3':
    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
elif DB_ENGINE == 'django.db.backends.postgresql':
    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': config('DB_NAME', default='luxhabitat_db'),
            'USER': config('DB_USER', default='admin'),
            'PASSWORD': config('DB_PASSWORD', default='admin123'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': config('DB_NAME', default='luxhabitat'),
            'USER': config('DB_USER', default='root'),
            'PASSWORD': config('DB_PASSWORD', default=''),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='3306'),
            'OPTIONS': {
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }

# --- MODELO DE USUARIO ---
AUTH_USER_MODEL = 'users.Usuario'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# --- DJANGO REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # ← CAMBIO AQUÍ
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
    },
}

# --- JWT ---
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# --- CORS ---
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://flying-dislocate-skimming.ngrok-free.dev",
]

# --- CSRF ---
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://flying-dislocate-skimming.ngrok-free.dev",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'authorization',
    'content-type',
    'origin',
    'x-requested-with',
]

# --- INTERNACIONALIZACIÓN ---
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# --- SESIONES Y SEGURIDAD ---
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'

# --- ARCHIVOS ESTÁTICOS ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# --- MEDIA ---
USE_S3 = config('USE_S3', default=False, cast=bool)

if USE_S3:
    # Cloudflare R2 (S3-compatible) — usado en producción
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_ENDPOINT_URL = config('AWS_S3_ENDPOINT_URL')
    AWS_S3_REGION_NAME = 'auto'
    AWS_S3_FILE_OVERWRITE = False
    AWS_QUERYSTRING_AUTH = False
    # URL pública del bucket R2 (la que Cloudflare asigna al activar acceso público)
    AWS_S3_CUSTOM_DOMAIN = config('R2_PUBLIC_URL').replace('https://', '')
    MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/"
    MEDIA_ROOT = ''
else:
    # Disco local — usado en desarrollo
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# --- DEFAULT FIELD ---
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- LOGGING ---
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'apps': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

# --- ALLAUTH / SOCIAL AUTH ---
LOGIN_REDIRECT_URL = '/api/social-auth-complete/'
LOGIN_URL = '/api/social-auth-complete/'
SITE_ID = 1

ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_VERIFICATION = 'none'

ACCOUNT_ADAPTER = 'allauth.account.adapter.DefaultAccountAdapter'
SOCIALACCOUNT_ADAPTER = 'users.adapters.CustomSocialAccountAdapter'
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'

# --- WOMPI ---
WOMPI_PUBLIC_KEY = config('WOMPI_PUBLIC_KEY', default='')
WOMPI_PRIVATE_KEY = config('WOMPI_PRIVATE_KEY', default='')
WOMPI_WEBHOOK_URL = config('WOMPI_WEBHOOK_URL', default='')
WOMPI_REDIRECT_URL = config('WOMPI_REDIRECT_URL', default='http://localhost:3000/payment-success')
WOMPI_CURRENCY = config('WOMPI_CURRENCY', default='COP')
WOMPI_ENV = config('WOMPI_ENV', default='sandbox')

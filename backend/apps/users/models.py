import uuid
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)


class UsuarioManager(BaseUserManager):

    def create_user(self, email, nombre, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            nombre=nombre,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, nombre, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('rol', 'admin')

        return self.create_user(
            email,
            nombre,
            password,
            **extra_fields
        )


class Usuario(AbstractBaseUser, PermissionsMixin):

    ROLES = (
        ('admin', 'Administrador'),
        ('usuario', 'Usuario'),
    )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    nombre = models.CharField(max_length=255)

    email = models.EmailField(
        unique=True
    )

    rol = models.CharField(
        max_length=10,
        choices=ROLES,
        default='usuario'
    )

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['nombre']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.rol})"
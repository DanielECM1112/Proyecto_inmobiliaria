from django.db import models

class Plan(models.Model):
    # Campos obligatorios en espejo con las columnas de Git y tu terminal
    nombre = models.CharField(max_length=255, default="Plan Especial")
    name = models.CharField(max_length=255, default="Plan Especial")
    
    precio = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    
    # Variables exactas extraídas de tu SystemCheckError de la terminal
    duration_days = models.IntegerField(default=30)
    max_properties = models.IntegerField(default=10)
    max_images = models.IntegerField(default=20)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


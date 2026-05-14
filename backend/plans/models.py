from django.db import models

class Plan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField()
    max_images = models.PositiveIntegerField()
    max_properties = models.PositiveIntegerField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

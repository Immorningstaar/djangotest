from django.db import models
from django.contrib.auth.models import AbstractUser

class Comuna(models.Model):
    nombre = models.CharField(max_length=50)
    def __str__(self):
        return self.nombre

class Usuario(AbstractUser):
    rut = models.CharField(max_length=12, unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    comuna = models.ForeignKey(Comuna, on_delete=models.SET_NULL, null=True, blank=True)
    
    USERNAME_FIELD = 'rut'
    REQUIRED_FIELDS = ['username']  # Agrega 'username' aunque uses rut como USERNAME_FIELD
    
    class Meta:
        swappable = 'AUTH_USER_MODEL'
    
    def __str__(self):
        return f"{self.rut} ({self.get_full_name()})"
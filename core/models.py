from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.core.validators import RegexValidator

class Comuna(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre

class Rol(Group):
    class Meta:
        proxy = True
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

class Usuario(AbstractUser):
    # Campos personalizados (tu código actual)
    rut_validator = RegexValidator(
        regex=r'^\d{7,8}-[\dkK]$',
        message="El RUT debe estar en formato 12345678-9"
    )
    
    rut = models.CharField(
        max_length=12,
        unique=True,
        validators=[rut_validator],
        help_text="Ejemplo: 12345678-9"
    )
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    comuna = models.ForeignKey(Comuna, on_delete=models.SET_NULL, null=True, blank=True)
    roles = models.ManyToManyField(Rol, blank=True, related_name='usuarios')

    # 🔥 ¡Aquí estaba el error! La clase Meta debe estar indentada dentro de la clase Usuario
    class Meta:
        db_table = 'CORE_USUARIOS'  # Nombre personalizado para la tabla
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.rut} ({self.get_full_name() or 'Sin nombre'})"
    
    # Campos personalizados
    rut = models.CharField(
        max_length=12,
        unique=True,
        validators=[rut_validator],
        help_text="Ejemplo: 12345678-9"
    )
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    comuna = models.ForeignKey(Comuna, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Relación con roles
    roles = models.ManyToManyField(Rol, blank=True, related_name='usuarios')

    # Configuración especial
    USERNAME_FIELD = 'rut'
    REQUIRED_FIELDS = ['username', 'email']  # Campos obligatorios

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.rut} ({self.get_full_name() or 'Sin nombre'})"
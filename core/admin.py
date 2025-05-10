from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Comuna, Rol

# Configuración básica para Usuario
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('rut', 'email', 'first_name', 'last_name', 'is_staff')
    fieldsets = (
        (None, {'fields': ('rut', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'email')}),
        ('Datos adicionales', {'fields': ('telefono', 'direccion', 'comuna')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'groups')}),
    )

# Configuración básica para Comuna
@admin.register(Comuna)
class ComunaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

# Registro simple para Rol (sin personalización)
admin.site.register(Rol)
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Comuna, Rol

admin.site.register(Comuna)
admin.site.register(Rol)

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('rut', 'email', 'first_name', 'last_name', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Datos adicionales', {'fields': ('rut', 'telefono', 'direccion', 'comuna', 'roles')}),
    )
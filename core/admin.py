from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Comuna, Usuario

admin.site.register(Comuna)

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('rut', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('rut', 'first_name', 'last_name', 'email')
    ordering = ('rut',)
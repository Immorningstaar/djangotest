# core/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Comuna, Rol

admin.site.register(Usuario, UserAdmin)
admin.site.register(Comuna)
admin.site.register(Rol)
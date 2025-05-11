from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('quienes-somos/', views.quienes_somos, name='quienes'),
    path('registro/', views.registro, name='registro'),
    path('login/', views.login_view, name='login'),
    path('cerrar-sesion/', views.cerrar_sesion, name='cerrar_sesion'),
    path('mi-perfil/', views.mi_perfil, name='mi_perfil'),
    path('mis-reservas/', views.mis_reservas, name='mis-reservas'),
    path('administrar/usuarios/', views.listar_usuarios, name='listar_usuarios'),
]
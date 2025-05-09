from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Ruta principal (index.html)
    path('mi-cuenta/', views.mi_cuenta, name='mi-cuenta'),
    path('quienes-somos/', views.quienes_somos, name='quienes-somos'),
]
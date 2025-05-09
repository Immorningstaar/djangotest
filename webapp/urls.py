from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Ruta principal
    path('mi-cuenta/', views.mi_cuenta, name='mi-cuenta'),
    path('quienes-somos/', views.quienes_somos, name='quienes-somos'),
    # Eliminamos admin/ y el include circular
]
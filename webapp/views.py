from django.shortcuts import render

def index(request):
    return render(request, 'webapp/index.html')  # Renderiza index.html

def mi_cuenta(request):
    return render(request, 'webapp/mi-cuenta.html')  # Renderiza mi-cuenta.html

def quienes_somos(request):
    return render(request, 'webapp/quienes-somos.html')  # Renderiza quienes-somos.html

def mis_reservas(request):
    return render(request, 'webapp/mis-reservas.html')
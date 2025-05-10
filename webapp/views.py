from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
import json
from core.models import Usuario

# Vistas existentes
def index(request):
    return render(request, 'webapp/index.html')

@csrf_exempt
def mi_cuenta(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = request.GET.get('action', 'register')
            
            if action == 'register':
                # Validación de campos
                required_fields = ['name', 'rut', 'email', 'phone', 'role', 'password']
                if not all(field in data for field in required_fields):
                    return JsonResponse({'success': False, 'message': 'Faltan campos requeridos'}, status=400)
                
                try:
                    # Crear usuario
                    user = Usuario.objects.create_user(
                        username=data['rut'],
                        rut=data['rut'],
                        email=data['email'],
                        password=data['password'],
                        first_name=data['name'].split()[0],
                        last_name=' '.join(data['name'].split()[1:]) if len(data['name'].split()) > 1 else '',
                        telefono=f"+569{data['phone']}"
                    )
                    
                    # Asignar rol
                    from django.contrib.auth.models import Group
                    try:
                        group = Group.objects.get(name=data['role'])
                        user.groups.add(group)
                    except Group.DoesNotExist:
                        pass
                    
                    return JsonResponse({'success': True, 'message': 'Registro exitoso'})
                
                except Exception as e:
                    return JsonResponse({'success': False, 'message': str(e)}, status=400)
            
            elif action == 'login':
                user = authenticate(request, username=data['email'], password=data['password'])
                if user is not None:
                    login(request, user)
                    return JsonResponse({'success': True, 'message': 'Login exitoso'})
                return JsonResponse({'success': False, 'message': 'Credenciales inválidas'}, status=401)
            
            elif action == 'recover':
                # Lógica de recuperación (simplificada)
                return JsonResponse({'success': True, 'message': 'Enlace enviado'})
        
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Error en los datos'}, status=400)
    
    # GET request - mostrar template normal
    return render(request, 'webapp/mi-cuenta.html')

@login_required
def mis_reservas(request):
    return render(request, 'webapp/mis-reservas.html')

def quienes_somos(request):
    return render(request, 'webapp/quienes-somos.html')
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from core.models import Usuario, Comuna
import json
from django.db import IntegrityError

@csrf_exempt
def mi_cuenta(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = request.GET.get('action', 'register')
            
            if action == 'register':
                # Validación de campos requeridos
                required_fields = ['name', 'rut', 'email', 'phone', 'role', 'password']
                if not all(field in data for field in required_fields):
                    return JsonResponse({'success': False, 'message': 'Faltan campos requeridos'}, status=400)
                
                try:
                    # Crear el usuario con AbstractUser
                    usuario = Usuario.objects.create_user(
                        username=data['rut'],  # Usamos RUT como username
                        rut=data['rut'],
                        email=data['email'],
                        password=data['password'],
                        first_name=data['name'].split()[0],
                        last_name=' '.join(data['name'].split()[1:]) if len(data['name'].split()) > 1 else '',
                        telefono=f"+569{data['phone']}"
                    )
                    
                    # Asignar rol (asumiendo que ya existen los roles en la base de datos)
                    from django.contrib.auth.models import Group
                    try:
                        rol = Group.objects.get(name=data['role'])
                        usuario.groups.add(rol)
                    except Group.DoesNotExist:
                        pass
                    
                    return JsonResponse({
                        'success': True,
                        'message': 'Usuario registrado exitosamente'
                    })
                
                except IntegrityError as e:
                    if 'rut' in str(e):
                        return JsonResponse({'success': False, 'message': 'El RUT ya está registrado'}, status=400)
                    elif 'email' in str(e):
                        return JsonResponse({'success': False, 'message': 'El email ya está registrado'}, status=400)
                    else:
                        return JsonResponse({'success': False, 'message': 'Error al registrar usuario'}, status=500)
                
                except Exception as e:
                    return JsonResponse({'success': False, 'message': str(e)}, status=500)
            
            elif action == 'login':
                try:
                    # Autenticación con RUT
                    user = authenticate(
                        request,
                        username=data['email'],  # o data['rut'] si prefieres
                        password=data['password']
                    )
                    
                    if user is not None:
                        login(request, user)
                        return JsonResponse({
                            'success': True,
                            'message': 'Inicio de sesión exitoso',
                            'user': {
                                'name': user.get_full_name(),
                                'email': user.email
                            }
                        })
                    else:
                        return JsonResponse({
                            'success': False,
                            'message': 'Credenciales incorrectas'
                        }, status=401)
                
                except Exception as e:
                    return JsonResponse({
                        'success': False,
                        'message': 'Error en el inicio de sesión'
                    }, status=500)
            
            elif action == 'recover':
                # Lógica simplificada de recuperación
                try:
                    usuario = Usuario.objects.get(email=data['email'])
                    # Aquí deberías generar y enviar un token de recuperación
                    return JsonResponse({
                        'success': True,
                        'message': 'Se ha enviado un enlace de recuperación a tu email'
                    })
                except Usuario.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Email no registrado'
                    }, status=404)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Error en el formato de los datos'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Error interno del servidor'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Método no permitido'
    }, status=405)
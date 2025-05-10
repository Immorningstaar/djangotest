from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import json
from .models import Usuario, Rol, Comuna

@csrf_exempt
def mi_cuenta(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action')

            if action == 'register':
                # Obtener datos del formulario
                name = data.get('name')
                rut = data.get('rut')
                email = data.get('email')
                phone = data.get('phone')
                role = data.get('role')
                password = data.get('password')

                # Validar que el RUT no exista
                if Usuario.objects.filter(rut=rut).exists():
                    return JsonResponse({'success': False, 'message': 'El RUT ya está registrado'})

                # Validar que el email no exista
                if Usuario.objects.filter(email=email).exists():
                    return JsonResponse({'success': False, 'message': 'El email ya está registrado'})

                # Crear el nuevo usuario
                user = Usuario.objects.create_user(
                    rut=rut,
                    username=email,  # Podrías usar el RUT aquí si prefieres
                    email=email,
                    password=password,
                    first_name=name.split(' ')[0] if name else '',
                    last_name=' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else '',
                    telefono=phone
                )

                # Asignar rol si existe
                try:
                    rol_obj = Rol.objects.get(name=role)
                    user.roles.add(rol_obj)
                except Rol.DoesNotExist:
                    pass  # O manejar el error si el rol es requerido

                # Autenticar y loguear al usuario directamente
                authenticated_user = authenticate(request, rut=rut, password=password)
                if authenticated_user is not None:
                    login(request, authenticated_user)
                    return JsonResponse({
                        'success': True, 
                        'message': f'¡Bienvenido {name}!'
                    })
                else:
                    return JsonResponse({
                        'success': True, 
                        'message': 'Registro exitoso. Por favor inicia sesión.'
                    })

            elif action == 'login':
                rut = data.get('email')  # Ojo: en tu formulario usas email pero el USERNAME_FIELD es rut
                password = data.get('password')
                
                user = authenticate(request, rut=rut, password=password)
                
                if user is not None:
                    login(request, user)
                    return JsonResponse({
                        'success': True, 
                        'message': 'Inicio de sesión exitoso'
                    })
                else:
                    return JsonResponse({
                        'success': False, 
                        'message': 'RUT o contraseña incorrectos'
                    })

            elif action == 'recover':
                # Implementar lógica de recuperación
                email = data.get('email')
                if Usuario.objects.filter(email=email).exists():
                    # Aquí iría la lógica para enviar el correo de recuperación
                    return JsonResponse({
                        'success': True, 
                        'message': 'Instrucciones enviadas a tu email'
                    })
                else:
                    return JsonResponse({
                        'success': False, 
                        'message': 'Email no registrado'
                    })

        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Error en el servidor: {str(e)}'
            })

    return JsonResponse({
        'success': False, 
        'message': 'Método no permitido'
    })
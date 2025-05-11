from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages

def inicio(request):
    context = {
        'usuario_nombre': request.user.get_full_name() if request.user.is_authenticated else None,
        'usuario_rol': request.user.profile.rol if hasattr(request.user, 'profile') else None
    }
    return render(request, 'index.html', context)

def quienes_somos(request):
    return render(request, 'quienes_somos.html')

def registro(request):
    if request.method == 'POST':
        # Procesar el formulario de registro
        nombre = request.POST.get('nombre')
        apellidos = request.POST.get('apellidos')
        email = request.POST.get('correo')
        password = request.POST.get('clave')
        direccion = request.POST.get('direccion')
        telefono = request.POST.get('telefono')
        rol = request.POST.get('rol')
        
        # Validaciones y creación de usuario
        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=nombre,
                last_name=apellidos
            )
            
            # Crear perfil extendido (asumiendo que tienes un modelo Profile)
            profile = Profile.objects.create(
                user=user,
                direccion=direccion,
                telefono=telefono,
                rol=rol
            )
            
            # Autenticar y loguear al usuario
            user = authenticate(username=email, password=password)
            login(request, user)
            
            messages.success(request, 'Registro exitoso!')
            return redirect('inicio')
            
        except Exception as e:
            messages.error(request, f'Error en el registro: {str(e)}')
    
    return render(request, 'registro.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        user = authenticate(username=email, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('inicio' + '?fromLogin=true')
        else:
            messages.error(request, 'Credenciales inválidas')
    
    return render(request, 'login.html')

@login_required
def cerrar_sesion(request):
    logout(request)
    return redirect('inicio')

@login_required
def mi_perfil(request):
    if request.method == 'POST':
        # Actualizar datos del perfil
        user = request.user
        user.first_name = request.POST.get('nombre')
        user.last_name = request.POST.get('apellidos')
        user.email = request.POST.get('email')
        user.save()
        
        if hasattr(user, 'profile'):
            profile = user.profile
            profile.direccion = request.POST.get('direccion')
            profile.telefono = request.POST.get('telefono')
            profile.save()
        
        messages.success(request, 'Perfil actualizado correctamente')
        return redirect('mi_perfil')
    
    return render(request, 'mi_perfil.html')

@login_required
def mis_reservas(request):
    # Aquí deberías obtener las reservas del usuario actual
    # reservas = Reserva.objects.filter(usuario=request.user)
    return render(request, 'mis_reservas.html', {'reservas': []})

@login_required
def listar_usuarios(request):
    if not request.user.is_superuser and not (hasattr(request.user, 'profile') and request.user.profile.rol == 1):
        return redirect('inicio')
    
    usuarios = User.objects.all()
    return render(request, 'admin/usuarios.html', {'usuarios': usuarios})
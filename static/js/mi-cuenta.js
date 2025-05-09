// static/js/mi-cuenta.js
document.addEventListener('DOMContentLoaded', function() {
    // 1. Manejo de pestañas (login/register/recover)
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover clases activas
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activar pestaña clickeada
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 2. Validación de contraseña en tiempo real
    const passwordInput = document.getElementById('regPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
    }

    // 3. Formulario de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validatePassword() && validateConfirmPassword()) {
                const name = document.getElementById('regName').value;
                const email = document.getElementById('regEmail').value;
                const password = document.getElementById('regPassword').value;
                
                // Guardar en localStorage (solución temporal)
                const users = JSON.parse(localStorage.getItem('raconto_users')) || [];
                users.push({ name, email, password });
                localStorage.setItem('raconto_users', JSON.stringify(users));
                
                // Guardar sesión
                localStorage.setItem('raconto_currentUser', JSON.stringify({ name, email }));
                
                alert(`¡Bienvenido ${name}! Redirigiendo...`);
                setTimeout(() => {
                    window.location.href = "/";  // Redirige a la página principal
                }, 1500);
            }
        });
    }

    // 4. Formulario de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const users = JSON.parse(localStorage.getItem('raconto_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('raconto_currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                
                alert('¡Inicio de sesión exitoso!');
                setTimeout(() => {
                    window.location.href = "/";  // Redirige a la página principal
                }, 1000);
            } else {
                alert('Credenciales incorrectas');
            }
        });
    }

    // 5. Formulario de Recuperación
    const recoverForm = document.getElementById('recoverForm');
    if (recoverForm) {
        recoverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Enlace de recuperación enviado a tu email');
            recoverForm.reset();
            document.querySelector('.tab[data-tab="login"]').click();
        });
    }
});

// Función para validar contraseña
function validatePassword() {
    const password = document.getElementById('regPassword').value;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[!@#$%^&*]/.test(password)
    };

    // Actualizar indicadores visuales
    for (const [key, isValid] of Object.entries(requirements)) {
        const element = document.getElementById(`req-${key}`);
        if (element) element.classList.toggle('valid', isValid);
    }

    return Object.values(requirements).every(Boolean);
}

// Función para confirmar contraseña
function validateConfirmPassword() {
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    if (password !== confirm) {
        alert('Las contraseñas no coinciden');
        return false;
    }
    
    return true;
}
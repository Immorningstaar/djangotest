document.addEventListener('DOMContentLoaded', function() {
    // Obtener el token CSRF
    const getCSRFToken = () => {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    };

    // 1. Manejo de pestañas
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
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
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validatePassword() || !validateConfirmPassword()) {
                return;
            }

            const formData = {
                action: 'register',
                name: document.getElementById('regName').value,
                rut: document.getElementById('regRut').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                role: document.getElementById('regRole').value,
                password: document.getElementById('regPassword').value
            };
            
            try {
                const response = await fetch('/mi-cuenta/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showAlert('success', `¡Bienvenido ${formData.name}! Redirigiendo...`);
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                } else {
                    showAlert('error', data.message || 'Error en el registro');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('error', 'Error al conectar con el servidor');
            }
        });
    }

    // 4. Formulario de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                action: 'login',
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            };
            
            try {
                const response = await fetch('/mi-cuenta/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showAlert('success', '¡Inicio de sesión exitoso!');
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                } else {
                    showAlert('error', data.message || 'Credenciales incorrectas');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('error', 'Error al iniciar sesión');
            }
        });
    }

    // 5. Formulario de Recuperación
    const recoverForm = document.getElementById('recoverForm');
    if (recoverForm) {
        recoverForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('recoverEmail').value;
            
            try {
                const response = await fetch('/mi-cuenta/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: JSON.stringify({
                        action: 'recover',
                        email: email
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showAlert('success', 'Enlace de recuperación enviado a tu email');
                    recoverForm.reset();
                    document.querySelector('.tab[data-tab="login"]').click();
                } else {
                    showAlert('error', data.message || 'Error al enviar el enlace de recuperación');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('error', 'Error al procesar la solicitud');
            }
        });
    }

    // Función para mostrar alertas estilizadas
    function showAlert(type, message) {
        // Puedes reemplazar esto con tu propio sistema de notificaciones
        alert(message); // Temporal - considera usar Toast o SweetAlert
    }

    // Validación de formato RUT chileno
    const rutInput = document.getElementById('regRut');
    if (rutInput) {
        rutInput.addEventListener('input', function(e) {
            this.value = formatRUT(this.value);
        });
    }
});

// Funciones auxiliares
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
        if (element) {
            element.classList.toggle('valid', isValid);
            element.classList.toggle('invalid', !isValid);
        }
    }

    return Object.values(requirements).every(Boolean);
}

function validateConfirmPassword() {
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    if (password !== confirm) {
        const confirmElement = document.getElementById('regConfirm');
        confirmElement.classList.add('invalid');
        return false;
    }
    
    document.getElementById('regConfirm').classList.remove('invalid');
    return true;
}

function formatRUT(rut) {
    // Formatear RUT chileno: 12345678-9
    rut = rut.replace(/[^0-9kK-]/g, '');
    
    if (rut.length > 1) {
        const body = rut.slice(0, -1).replace(/\D/g, '');
        let check = rut.slice(-1).toUpperCase();
        
        if (body && check.match(/^[0-9kK]$/)) {
            return `${body}-${check}`;
        }
    }
    
    return rut;
}
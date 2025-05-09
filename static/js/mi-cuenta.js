document.addEventListener('DOMContentLoaded', function() {
    // Manejo de pestañas
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('loginForm'); // Añadí esta línea que faltaba
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  
    // Validación de contraseña en tiempo real
    const passwordInput = document.getElementById('regPassword');
    if (passwordInput) {
      passwordInput.addEventListener('input', validatePassword);
    }
  
    // Validación del formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validatePassword() && validateConfirmPassword()) {
          const name = document.getElementById('regName').value;
          const email = document.getElementById('regEmail').value;
          const password = document.getElementById('regPassword').value;
          
          // Guardar nuevo usuario
          const users = JSON.parse(localStorage.getItem('raconto_users')) || [];
          users.push({ name, email, password });
          localStorage.setItem('raconto_users', JSON.stringify(users));
          
          // Guardar sesión activa
          localStorage.setItem('raconto_currentUser', JSON.stringify({ name, email }));
          
          alert(`Bienvenido ${name}! Serás redirigido...`);
          
          // Redirección absoluta garantizada
          setTimeout(() => {
            const basePath = window.location.href.split('/mi-cuenta/')[0];
            window.location.href = basePath + '/index.html?fromLogin=true';
          }, 1500);
        }
      });
    }
  
    // Validación del formulario de login
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
          
          alert('Inicio de sesión exitoso! Redirigiendo...');
          
          // Redirección mejorada
          setTimeout(() => {
            window.location.href = "/index.html";
          }, 1000);
        } else {
          alert('Credenciales incorrectas. Intente nuevamente.');
        }
      });
    }
  
    // Formulario de recuperación
    const recoverForm = document.getElementById('recoverForm');
    if (recoverForm) {
      recoverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Se ha enviado un enlace de recuperación a tu correo');
        recoverForm.reset();
        document.querySelector('.tab[data-tab="login"]').click();
      });
    }
});
  
function validatePassword() {
    const password = document.getElementById('regPassword').value;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*]/.test(password)
    };
  
    for (const [key, isValid] of Object.entries(requirements)) {
      const element = document.getElementById(`req-${key}`);
      if (element) element.classList.toggle('valid', isValid);
    }
  
    return Object.values(requirements).every(Boolean);
}
  
function validateConfirmPassword() {
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    if (password !== confirm) {
      alert('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
}
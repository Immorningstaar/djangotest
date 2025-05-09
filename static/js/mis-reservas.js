// static/js/mis-reservas.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Iniciando sistema de reservas');
    
    // 1. Sistema de pestañas
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clases activas
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activar pestaña clickeada
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            console.log('Cambiando a pestaña:', tabId);
            
            // Cargar datos si es necesario
            if (tabId === 'reservas-activas') {
                cargarReservasActivas();
            } else if (tabId === 'historial') {
                cargarHistorial();
            }
        });
    });
    //horarios
    
    // 2. Formulario de reserva
    const reservaForm = document.getElementById('reservaForm');
    if (reservaForm) {
        console.log('Formulario de reserva encontrado');
        
        reservaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario enviado');
            
            const usuario = JSON.parse(localStorage.getItem('raconto_currentUser'));
            if (!usuario) {
                alert('Debes iniciar sesión para hacer reservas');
                window.location.href = "{% url 'mi-cuenta' %}";
                return;
            }

            // Validar y crear reserva
            const reserva = {
                id: Date.now(),
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                personas: document.getElementById('personas').value,
                sucursal: document.getElementById('sucursal').value,
                comentarios: document.getElementById('comentarios').value,
                estado: 'confirmada',
                fechaCreacion: new Date().toISOString(),
                usuarioNombre: usuario.name,
                usuarioEmail: usuario.email
            };
        

            // Validación básica
            if (!reserva.fecha || !reserva.hora || !reserva.personas || !reserva.sucursal) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }

            // Guardar reserva
            guardarReserva(reserva);
            console.log('Reserva guardada:', reserva);

            // Mostrar confirmación
            document.getElementById('nombreUsuarioReserva').textContent = usuario.name;
            document.getElementById('reservaConfirmada').style.display = 'block';
            
            // Resetear después de 2 segundos
            setTimeout(() => {
                reservaForm.reset();
                document.getElementById('reservaConfirmada').style.display = 'none';
                cargarReservasActivas(); // Actualizar lista
            }, 2000);
        });
    } else {
        console.warn('No se encontró el formulario de reserva');
    }

    // 3. Cargar datos iniciales
    if (document.querySelector('.tab[data-tab="reservas-activas"].active')) {
        cargarReservasActivas();
    }
});

// ===== FUNCIONES AUXILIARES =====
function guardarReserva(reserva) {
    const reservas = JSON.parse(localStorage.getItem('raconto_reservas')) || [];
    reservas.push(reserva);
    localStorage.setItem('raconto_reservas', JSON.stringify(reservas));
}

function cargarReservasActivas() {
    console.log('Cargando reservas activas...');
    const usuario = JSON.parse(localStorage.getItem('raconto_currentUser'));
    const container = document.getElementById('reservas-activas-list');
    
    if (!usuario) {
        container.innerHTML = '<p class="no-data">Debes iniciar sesión para ver tus reservas</p>';
        return;
    }

    const reservas = JSON.parse(localStorage.getItem('raconto_reservas')) || [];
    const reservasUsuario = reservas.filter(
        r => r.usuarioEmail === usuario.email && r.estado !== 'cancelada'
    );

    container.innerHTML = '';
    
    if (reservasUsuario.length === 0) {
        container.innerHTML = '<p class="no-data">No tienes reservas activas</p>';
        return;
    }

    reservasUsuario.forEach(reserva => {
        const card = document.createElement('div');
        card.className = 'reserva-card';
        card.innerHTML = `
            <h3>Reserva #${reserva.id.toString().slice(-4)}</h3>
            <p><strong>Nombre:</strong> ${reserva.usuarioNombre}</p>
            <div class="reserva-meta">
                <span>Fecha: ${formatDate(reserva.fecha)}</span>
                <span>Hora: ${reserva.hora}</span>
                <span>Personas: ${reserva.personas}</span>
                <span>Sucursal: ${reserva.sucursal === 'los-andes' ? 'Los Andes' : 'San Felipe'}</span>
            </div>
            ${reserva.comentarios ? `<p>Comentarios: ${reserva.comentarios}</p>` : ''}
            <button class="btn-cancelar" data-id="${reserva.id}">Cancelar Reserva</button>
        `;
        
        card.querySelector('.btn-cancelar').addEventListener('click', function() {
            if (confirm('¿Cancelar esta reserva?')) {
                cancelarReserva(reserva.id);
            }
        });
        
        container.appendChild(card);
    });
}

function cargarHistorial() {
    console.log('Cargando historial...');
    const usuario = JSON.parse(localStorage.getItem('raconto_currentUser'));
    const container = document.getElementById('historial-reservas-list');
    
    if (!usuario) {
        container.innerHTML = '<p class="no-data">Debes iniciar sesión para ver tu historial</p>';
        return;
    }

    const reservas = JSON.parse(localStorage.getItem('raconto_reservas')) || [];
    const reservasUsuario = reservas.filter(r => r.usuarioEmail === usuario.email);

    container.innerHTML = '';
    
    if (reservasUsuario.length === 0) {
        container.innerHTML = '<p class="no-data">No tienes reservas en tu historial</p>';
        return;
    }

    reservasUsuario.forEach(reserva => {
        const card = document.createElement('div');
        card.className = 'reserva-card';
        card.innerHTML = `
            <h3>Reserva #${reserva.id.toString().slice(-4)}</h3>
            <div class="reserva-meta">
                <span>Fecha: ${formatDate(reserva.fecha)}</span>
                <span>Hora: ${reserva.hora}</span>
                <span>Estado: ${reserva.estado}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function cancelarReserva(id) {
    const reservas = JSON.parse(localStorage.getItem('raconto_reservas')) || [];
    const index = reservas.findIndex(r => r.id === id);
    
    if (index !== -1) {
        reservas[index].estado = 'cancelada';
        localStorage.setItem('raconto_reservas', JSON.stringify(reservas));
        cargarReservasActivas();
        alert('Reserva cancelada exitosamente');
    }
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
}
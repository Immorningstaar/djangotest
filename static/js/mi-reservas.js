document.addEventListener('DOMContentLoaded', function() {
    // Manejo de pestañas
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
  
        // Si es la pestaña de reservas activas, cargarlas
        if (tabId === 'reservas-activas') {
          cargarReservasActivas();
        }
  
        // Si es el historial, cargarlo
        if (tabId === 'historial') {
          cargarHistorial();
        }
      });
    });
  
    // Formulario de reserva
    const reservaForm = document.getElementById('reservaForm');
    if (reservaForm) {
      reservaForm.addEventListener('submit', function(e) {
        e.preventDefault();
  
        const usuario = JSON.parse(localStorage.getItem('raconto_currentUser'));
        if (!usuario) {
          alert('Debes iniciar sesión para hacer reservas');
          return;
        }
  
        // Obtener datos del formulario
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
  
        // Validar horarios permitidos (solo 2 horarios)
        const horariosPermitidos = ['12:00', '13:00']; // Ajusta estos valores según necesites
        if (!horariosPermitidos.includes(reserva.hora)) {
          alert('Por favor selecciona uno de los horarios disponibles');
          return;
        }
  
        // Guardar reserva
        guardarReserva(reserva);
  
        // Mostrar confirmación con nombre de usuario
        document.getElementById('nombreUsuarioReserva').textContent = usuario.name;
        document.getElementById('reservaConfirmada').style.display = 'block';
  
        // Resetear formulario después de 2 segundos
        setTimeout(() => {
          reservaForm.reset();
        }, 2000);
      });
    }
  
    // Cargar reservas activas al inicio si está en esa pestaña
    if (document.querySelector('.tab[data-tab="reservas-activas"].active')) {
      cargarReservasActivas();
    }
  });
  
  // Función para guardar reserva en localStorage
  function guardarReserva(reserva) {
    const reservas = JSON.parse(localStorage.getItem('raconto_reservas')) || [];
    reservas.push(reserva);
    localStorage.setItem('raconto_reservas', JSON.stringify(reservas));
  }
  
  // Función para cargar reservas activas
  function cargarReservasActivas() {
    const usuario = JSON.parse(localStorage.getItem('raconto_currentUser'));
    if (!usuario) {
      document.getElementById('reservas-activas-list').innerHTML =
        '<p>Debes iniciar sesión para ver tus reservas</p>';
      return;
    }
  
    const reservas = JSON.parse(localStorage.getItem('raconto_reservas')) || [];
    const reservasUsuario = reservas.filter(
      r => r.usuarioEmail === usuario.email && r.estado !== 'cancelada'
    );
  
    const container = document.getElementById('reservas-activas-list');
    container.innerHTML = '';
  
    if (reservasUsuario.length === 0) {
      container.innerHTML = '<p>No tienes reservas activas</p>';
      return;
    }
  
    reservasUsuario.forEach(reserva => {
      const card = document.createElement('div');
      card.className = 'reserva-card';
      card.innerHTML = `
        <h3>Reserva #${reserva.id.toString().slice(-4)}</h3>
        <p><strong>Reservado a nombre de:</strong> ${reserva.usuarioNombre}</p>
        <div class="reserva-meta">
          <span>${formatearFecha(reserva.fecha)}</span>
          <span>${reserva.hora}</span>
          <span>${reserva.personas} persona${reserva.personas > 1 ? 's' : ''}</span>
          <span>${reserva.sucursal === 'los-andes' ? 'Los Andes' : 'San Felipe'}</span>
        </div>
        ${reserva.comentarios ? `<p>${reserva.comentarios}</p>` : ''}
        <button class="btn-cancelar" data-id="${reserva.id}">Cancelar Reserva</button>
      `;
      container.appendChild(card);
    });
  
    // Agregar eventos a botones de cancelar
    document.querySelectorAll('.btn-cancelar').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        cancelarReserva(id);
      });
    });
  }
  
  // Función para cargar historial
  function cargarHistorial() {
    const usuario = JSON.parse(localStorage.getItem('raconto_currentUser'));
    if (!usuario) {
      document.getElementById('historial-reservas-list').innerHTML =
        '<p>Debes iniciar sesión para ver tu historial</p>';
      return;
    }
  
    const reservas = JSON.parse(localStorage.getItem('raconto_reservas')) || [];
    const reservasUsuario = reservas.filter(
      r => r.usuarioEmail === usuario.email
    ).sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
  
    const container = document.getElementById('historial-reservas-list');
    container.innerHTML = '';
  
    if (reservasUsuario.length === 0) {
      container.innerHTML = '<p>No tienes reservas en tu historial</p>';
      return;
    }
  
    reservasUsuario.forEach(reserva => {
      const card = document.createElement('div');
      card.className = 'reserva-card';
      card.innerHTML = `
        <h3>Reserva #${reserva.id.toString().slice(-4)}</h3>
        <div class="reserva-meta">
          <span>${formatearFecha(reserva.fecha)}</span>
          <span>${reserva.hora}</span>
          <span>${reserva.personas} persona${reserva.personas > 1 ? 's' : ''}</span>
          <span>${reserva.sucursal === 'los-andes' ? 'Los Andes' : 'San Felipe'}</span>
          <span class="estado-${reserva.estado}">${reserva.estado}</span>
        </div>
        ${reserva.comentarios ? `<p>${reserva.comentarios}</p>` : ''}
      `;
      container.appendChild(card);
    });
  }
  
  // Función para cancelar reserva
  function cancelarReserva(id) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
  
    const reservas = JSON.parse(localStorage.getItem('raconto_reservas')) || [];
    const reservaIndex = reservas.findIndex(r => r.id === id);
  
    if (reservaIndex !== -1) {
      reservas[reservaIndex].estado = 'cancelada';
      localStorage.setItem('raconto_reservas', JSON.stringify(reservas));
      cargarReservasActivas();
      alert('Reserva cancelada exitosamente');
    }
  }
  
  // Función para formatear fecha
  function formatearFecha(fechaStr) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
  }
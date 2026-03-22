// Definimos la URL base de nuestra API o servidor backend. 
// Todos los endpoints se concatenarán a esta dirección.
const API_URL = 'http://localhost:8080';

// ================= UTILIDADES ================= //

// Configuración de "Toast" de SweetAlert para notificaciones
// Un "Toast" es una pequeña alerta no intrusiva. Aquí la pre-configuramos.
const Toast = Swal.mixin({
    toast: true, // Indica que es un toast y no un modal centrado
    position: 'top-end', // Aparecerá en la esquina superior derecha
    showConfirmButton: false, // No necesita botón de "Ok"
    timer: 3000, // Desaparece automáticamente a los 3 segundos
    timerProgressBar: true, // Muestra una barra de progreso visual del tiempo
    didOpen: (toast) => {
        // Si el usuario pasa el ratón por encima, el temporizador se pausa
        toast.addEventListener('mouseenter', Swal.stopTimer)
        // Al quitar el ratón, el temporizador se reanuda
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

// Función para mostrar notificación
// Usa la configuración "Toast" anterior para mostrar un mensaje rápido (éxito, error, info).
function showAlert(message, type = 'success') {
    Toast.fire({
        icon: type,
        title: message
    });
}

// Función helper para confirmar acciones destructivas (como eliminar un registro)
// Devuelve una Promesa que se resuelve como 'true' si el usuario confirma, o 'false' si cancela.
async function confirmAction(title = '¿Estás seguro?', text = "No podrás revertir esto") {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', // Color rojo para advertir peligro
        cancelButtonColor: '#3085d6', // Color azul para cancelar
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed; // isConfirmed es un booleano de SweetAlert
}

// Función para formatear fechas a un formato legible localmente (ej. DD/MM/AAAA)
function formatDate(dateString) {
    if (!dateString) return '-'; // Si no hay fecha, devuelve un guion para no mostrar "undefined"
    return new Date(dateString).toLocaleDateString();
}

// ================= FUNCIÓN FETCH MODIFICADA PARA JWT ================= //
// Esta es una función central (un "Wrapper"). En lugar de llamar a fetch() 
// directamente por todo el código, usamos esta función para automatizar tareas repetitivas.
async function fetchAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' } // Indicamos que enviamos y recibimos JSON
    };

    // Inyectamos el Token JWT si existe en LocalStorage
    // Esto es vital para peticiones protegidas. Si el usuario está logueado,
    // adjuntamos su "carnet de identidad" (token) en las cabeceras.
    const token = localStorage.getItem('jwt_token');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Si hay datos para enviar (POST o PUT), los convertimos a string JSON
    if (body) options.body = JSON.stringify(body);

    try {
        // Hacemos la petición real al servidor
        const response = await fetch(`${API_URL}${endpoint}`, options);
        // Parseamos la respuesta a JSON
        const data = await response.json();
        
        // Si el código de estado HTTP no es exitoso (ej. 400, 401, 500)
        // forzamos un error para que caiga en el bloque 'catch' de abajo.
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status}`);
        }
        // Si todo va bien, devolvemos solo la propiedad 'result' de la respuesta
        return data.result;
    } catch (error) {
        // Mostramos el error al usuario de forma amigable y lo relanzamos
        showAlert(error.message, 'error');
        throw error;
    }
}

// ================= AUTENTICACIÓN Y REGISTRO ================= //

// Función para actualizar la UI (Interfaz de Usuario) en base a si hay token o no
// Esconde o muestra formularios de login/registro y el botón de logout.
function updateAuthUI() {
    const token = localStorage.getItem('jwt_token');
    const statusBadge = document.getElementById('authStatus');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');

    if (token) {
        // ESTADO: Logueado
        statusBadge.textContent = 'Autenticado';
        statusBadge.className = 'badge bg-success';
        // Ocultamos elementos de login añadiendo la clase 'd-none' (display: none de Bootstrap)
        loginUsername.classList.add('d-none');
        loginPassword.classList.add('d-none');
        loginBtn.classList.add('d-none');
        showRegisterBtn.classList.add('d-none'); // Ocultar botón de registro al estar logueado
        // Mostramos botón de salir
        logoutBtn.classList.remove('d-none');
    } else {
        // ESTADO: NO Logueado
        statusBadge.textContent = 'No autenticado';
        statusBadge.className = 'badge bg-danger';
        // Mostramos los campos de login
        loginUsername.classList.remove('d-none');
        loginPassword.classList.remove('d-none');
        loginBtn.classList.remove('d-none');
        showRegisterBtn.classList.remove('d-none');
        // Ocultamos botón de salir
        logoutBtn.classList.add('d-none');
    }
}

// Procesar el login y guardar token
async function login(e) {
    e.preventDefault(); // Evita que el formulario recargue la página al enviarse
    // Recogemos los valores de los inputs
    const loginField = document.getElementById('loginUsername').value;
    const passwordField = document.getElementById('loginPassword').value;

    try {
        // Hacemos petición de login
        const token = await fetchAPI('/auth/login', 'POST', { 
            login: loginField, 
            password: passwordField 
        });
        console.log(token)
        // Si el backend nos devuelve un token, lo guardamos en el navegador (localStorage)
        localStorage.setItem('jwt_token', token);
        showAlert('Login exitoso', 'success');
        
        // Actualizamos la interfaz para reflejar que estamos logueados
        updateAuthUI();
        
        // Recargar datos tras loguearnos (ahora con el token en las cabeceras, 
        // podríamos tener acceso a datos que antes estaban bloqueados)
        loadPlayers();
        loadTeams();
        loadMatches();
    } catch (e) {
        console.error("Fallo al iniciar sesión:", e);
    }
}

// Borrar sesión local
function logout() {
    // Para desloguearnos, simplemente borramos el token guardado
    localStorage.removeItem('jwt_token');
    showAlert('Sesión cerrada', 'info');
    
    // Actualizamos la interfaz
    updateAuthUI();
    document.getElementById('loginForm').reset(); // Limpia los campos del formulario
    
    // Refrescar vistas para comprobar qué se ve sin token 
    // (probablemente el servidor ahora deniegue los datos y devuelva errores o listas vacías)
    loadPlayers();
    loadTeams();
    loadMatches();
}

// Procesar el registro de un nuevo usuario
async function registerUser(e) {
    e.preventDefault(); // Evitamos recarga
    
    // Recogemos datos del formulario de registro
    const loginField = document.getElementById('reg_login').value;
    const passwordField = document.getElementById('reg_password').value;
    const rolField = document.getElementById('reg_rol').value;

    try {
        // Enviamos los datos al endpoint de registro
        await fetchAPI('/auth/register', 'POST', {
            login: loginField,
            password: passwordField,
            rol: rolField
        });
        
        showAlert('Usuario registrado correctamente. Ya puedes iniciar sesión.', 'success');
        
        // Limpiar el formulario de registro para que quede vacío la próxima vez
        document.getElementById('registerForm').reset();
        
        // Cerrar el modal usando la API de Bootstrap
        // Buscamos el elemento HTML del modal y le pedimos a Bootstrap que lo oculte
        const registerModalEl = document.getElementById('registerModal');
        const modalInstance = bootstrap.Modal.getInstance(registerModalEl);
        if (modalInstance) {
            modalInstance.hide();
        }

    } catch (e) {
        console.error("Fallo al registrar usuario:", e);
        // El error visual ya lo maneja showAlert dentro de fetchAPI, por eso el catch está casi vacío
    }
}

// ================= INICIALIZACIÓN ================= //

// Este evento se dispara cuando el HTML ha cargado completamente.
// Es el punto de entrada de nuestra aplicación frontend.
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar estado de auth al cargar la página (comprueba si hay un token viejo)
    updateAuthUI();

    // Cargamos los datos iniciales en las tablas
    loadPlayers();
    loadTeams();
    loadMatches();

    // Listeners Formularios: Asociamos las funciones a los eventos 'submit' de cada formulario
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('registerForm').addEventListener('submit', registerUser); // NUEVO LISTENER
    document.getElementById('createPlayerForm').addEventListener('submit', createPlayer);
    document.getElementById('editPlayerForm').addEventListener('submit', updatePlayer);
    document.getElementById('createTeamForm').addEventListener('submit', createTeam);
    document.getElementById('addToRosterForm').addEventListener('submit', addToRoster);
    document.getElementById('createMatchForm').addEventListener('submit', createMatch);
});

// ================= JUGADORES ================= //

// Obtener y pintar todos los jugadores
async function loadPlayers() {
    try {
        const players = await fetchAPI('/players');
        const tbody = document.getElementById('playersTableBody');
        tbody.innerHTML = ''; // Limpiamos la tabla antes de rellenarla

        if (!players) return; // Si no hay datos, salimos de la función

        // Iteramos sobre el array de jugadores
        players.forEach(p => {
            const tr = document.createElement('tr'); // Creamos una fila de tabla <tr>
            // Rellenamos el HTML de la fila con los datos del jugador (p)
            tr.innerHTML = `
                <td>${p.nickname}</td>
                <td>${p.name}</td>
                <td><span class="badge bg-info text-dark">${p.country}</span></td>
                <td>${p.role}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditPlayer('${p._id}')" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger me-1" onclick="deletePlayer('${p._id}')" title="Eliminar">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-link text-secondary" onclick="copyId('${p._id}')" title="Copiar ID">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr); // Añadimos la fila al cuerpo de la tabla
        });
    } catch (e) { console.error(e); }
}

// Crear un jugador nuevo
async function createPlayer(e) {
    e.preventDefault();
    // Construimos el objeto a enviar leyendo los inputs del DOM
    const body = {
        nickname: document.getElementById('p_nickname').value,
        name: document.getElementById('p_name').value,
        country: document.getElementById('p_country').value,
        birthDate: document.getElementById('p_birthDate').value,
        role: document.getElementById('p_role').value
    };

    try {
        await fetchAPI('/players', 'POST', body);
        showAlert('Jugador creado correctamente');
        document.getElementById('createPlayerForm').reset(); // Limpiamos formulario
        loadPlayers(); // Recargamos la tabla para ver el jugador nuevo
    } catch (e) {}
}

// Buscar jugadores por nombre
async function searchPlayer() {
    const name = document.getElementById('searchPlayerName').value;
    // Si la barra de búsqueda está vacía, cargamos todos los jugadores normales
    if(!name) return loadPlayers();

    try {
        // Llamamos al endpoint de búsqueda con query params (?name=...)
        const players = await fetchAPI(`/players/find?name=${name}`);
        const tbody = document.getElementById('playersTableBody');
        tbody.innerHTML = ''; // Vaciamos tabla
        
        players.forEach(p => {
            const tr = document.createElement('tr');
            tr.classList.add('table-warning'); // Le damos un color amarillento para resaltar la búsqueda
            tr.innerHTML = `
                <td>${p.nickname}</td>
                <td>${p.name}</td>
                <td>${p.country}</td>
                <td>${p.role}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="openEditPlayer('${p._id}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {}
}

// Eliminar un jugador
async function deletePlayer(id) {
    // Pedimos confirmación antes de lanzar la petición DELETE
    if (!await confirmAction('¿Eliminar jugador?')) return; 
    
    try {
        await fetchAPI(`/players/${id}`, 'DELETE');
        showAlert('Jugador eliminado');
        loadPlayers(); // Refrescamos la tabla
    } catch (e) {}
}

// Edición
let editModal; // Variable global para guardar la instancia del modal de edición

// Abre el modal y precarga los datos del jugador a editar
async function openEditPlayer(id) {
    // Si no existe la instancia del modal, la creamos
    if (!editModal) editModal = new bootstrap.Modal(document.getElementById('editPlayerModal'));
    
    try {
        // Pedimos al backend los datos actuales del jugador por su ID
        const player = await fetchAPI(`/players/${id}`);
        // Rellenamos el formulario del modal con los datos recibidos
        document.getElementById('edit_p_id').value = player._id; // ID oculto para saber a quién actualizamos
        document.getElementById('edit_p_nickname').value = player.nickname;
        document.getElementById('edit_p_name').value = player.name;
        
        editModal.show(); // Mostramos el modal
    } catch (e) {}
}

// Guarda los cambios hechos en el modal de edición
async function updatePlayer(e) {
    e.preventDefault();
    // Recuperamos el ID oculto para pasarlo en la URL
    const id = document.getElementById('edit_p_id').value;
    const body = {
        nickname: document.getElementById('edit_p_nickname').value,
        name: document.getElementById('edit_p_name').value
    };

    try {
        await fetchAPI(`/players/${id}`, 'PUT', body); // PUT se suele usar para actualizar
        showAlert('Jugador actualizado');
        editModal.hide(); // Ocultamos modal
        loadPlayers(); // Refrescamos tabla
    } catch (e) {}
}

// ================= EQUIPOS ================= //

// Obtener y pintar todos los equipos
async function loadTeams() {
    try {
        const teams = await fetchAPI('/teams');
        const tbody = document.getElementById('teamsTableBody');
        tbody.innerHTML = '';

        if (!teams) return;

        teams.forEach(t => {
            // Calculamos cuántos jugadores están "activos" filtrando el array del roster interno
            const activeCount = t.roster ? t.roster.filter(r => r.active).length : 0;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${t.name}</strong></td>
                <td>${formatDate(t.foundedAt)}</td>
                <td><span class="badge rounded-pill bg-success">${activeCount} Activos</span></td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="openTeamDetails('${t._id}')" title="Gestionar Roster">
                        <i class="bi bi-gear-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger me-1" onclick="deleteTeam('${t._id}')" title="Eliminar Equipo">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-link text-secondary" onclick="copyId('${t._id}')" title="Copiar ID">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

// Crear nuevo equipo
async function createTeam(e) {
    e.preventDefault();
    const body = {
        name: document.getElementById('t_name').value,
        // Si el usuario no puso fecha, enviamos 'undefined' para que la base de datos no guarde strings vacíos
        foundedAt: document.getElementById('t_foundedAt').value || undefined 
    };

    try {
        await fetchAPI('/teams', 'POST', body);
        showAlert('Equipo creado');
        document.getElementById('createTeamForm').reset();
        loadTeams();
    } catch (e) {}
}

// Eliminar equipo
async function deleteTeam(id) {
    if(!await confirmAction('¿Eliminar equipo?', 'Se borrará si no tiene partidos asociados.')) return;
    
    try {
        await fetchAPI(`/teams/${id}`, 'DELETE');
        showAlert('Equipo eliminado');
        loadTeams();
    } catch (e) {}
}

// Detalles y Roster (Plantilla del equipo)
let teamModal; // Instancia global para el modal de detalles del equipo

// Abre el modal de un equipo para ver y gestionar sus jugadores
async function openTeamDetails(id) {
    if (!teamModal) teamModal = new bootstrap.Modal(document.getElementById('teamDetailsModal'));
    try {
        const team = await fetchAPI(`/teams/${id}`);
        // Guardamos el ID del equipo en un input oculto para poder añadir jugadores después
        document.getElementById('details_t_id').value = team._id; 
        // Cambiamos el título del modal dinámicamente
        document.getElementById('teamDetailsTitle').innerHTML = `<i class="bi bi-shield-shaded"></i> Gestión: ${team.name}`;
        
        // Llamamos a una función separada para pintar solo la tabla del roster
        renderRosterTable(id, team.roster);
        teamModal.show();
    } catch (e) {}
}

// Función auxiliar para pintar la tabla de jugadores dentro del modal de un equipo
function renderRosterTable(teamId, roster) {
    const tbody = document.getElementById('rosterTableBody');
    tbody.innerHTML = '';
    
    // Manejo del estado vacío
    if(!roster || roster.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Roster vacío</td></tr>';
        return;
    }

    // Iteramos por los jugadores que pertenecen a este equipo
    roster.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.player.name}</td>
            <td>${r.player.nickname}</td>
            <td>${formatDate(r.joinDate)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger py-0" onclick="removeFromRoster('${teamId}', '${r.player._id}')" title="Dar de baja">
                    <i class="bi bi-person-dash-fill"></i> Baja
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Añade un jugador existente a la plantilla de un equipo
async function addToRoster(e) {
    e.preventDefault();
    const teamId = document.getElementById('details_t_id').value; // ID del equipo (input oculto)
    const body = {
        player: document.getElementById('roster_p_id').value, // ID del jugador a añadir
        joinDate: document.getElementById('roster_date').value,
        active: true
    };

    try {
        // Endpoint especial para añadir al roster
        const updatedTeam = await fetchAPI(`/teams/${teamId}/roster`, 'POST', body);
        showAlert('Jugador añadido al roster');
        document.getElementById('addToRosterForm').reset();
        
        // Repintamos la tabla del modal con los datos nuevos que nos devuelve el servidor
        renderRosterTable(teamId, updatedTeam.roster); 
        loadTeams(); // Refrescamos la tabla general de equipos de fondo por si cambió el "Activos"
    } catch (e) {}
}

// Dar de baja a un jugador del roster
async function removeFromRoster(teamId, playerId) {
    if(!await confirmAction('¿Dar de baja?', 'El jugador pasará a inactivo en este equipo.')) return;
    
    try {
        // En lugar de borrar al jugador de la BD, solo se quita de la relación con el equipo
        await fetchAPI(`/teams/${teamId}/roster/${playerId}`, 'DELETE');
        showAlert('Jugador dado de baja');
        // Recargamos el modal para que desaparezca visualmente (o se actualice su estado)
        openTeamDetails(teamId); 
        loadTeams(); 
    } catch (e) {}
}

// ================= PARTIDOS ================= //

// Cargar listado de partidos
async function loadMatches() {
    try {
        const matches = await fetchAPI('/matches');
        const tbody = document.getElementById('matchesTableBody');
        tbody.innerHTML = '';

        if (!matches) return;

        matches.forEach(m => {
            const tr = document.createElement('tr');
            // Al pintar, verificamos si 'homeTeam' o 'awayTeam' existen por si fueron borrados de la BD (Unknown)
            tr.innerHTML = `
                <td><small>${m.tournament}</small></td>
                <td>${formatDate(m.date)}</td>
                <td class="text-end">${m.homeTeam ? m.homeTeam.name : 'Unknown'}</td>
                <td>${m.awayTeam ? m.awayTeam.name : 'Unknown'}</td>
                <td class="fw-bold text-center">${m.homeScore} - ${m.awayScore}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteMatch('${m._id}')" title="Borrar Partido">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

// Crear un nuevo partido
async function createMatch(e) {
    e.preventDefault();
    const body = {
        tournament: document.getElementById('m_tournament').value,
        date: document.getElementById('m_date').value,
        stage: document.getElementById('m_stage').value,
        homeTeam: document.getElementById('m_homeTeam').value, // Se espera el _id del equipo
        awayTeam: document.getElementById('m_awayTeam').value, // Se espera el _id del equipo
        homeScore: parseInt(document.getElementById('m_homeScore').value), // Forzamos números enteros para los puntos
        awayScore: parseInt(document.getElementById('m_awayScore').value)
    };

    try {
        await fetchAPI('/matches', 'POST', body);
        showAlert('Partido registrado');
        document.getElementById('createMatchForm').reset();
        loadMatches();
    } catch (e) {}
}

// Eliminar un partido
async function deleteMatch(id) {
    if(!await confirmAction('¿Eliminar partido?')) return;
    try {
        await fetchAPI(`/matches/${id}`, 'DELETE');
        showAlert('Partido eliminado');
        loadMatches();
    } catch (e) {}
}

// Utilidad extra para copiar ID al portapapeles
// Usa la API Clipboard del navegador web. Muy útil para copiar IDs y pegarlos rápido en otros formularios
function copyId(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('ID copiado al portapapeles', 'info');
    });
}
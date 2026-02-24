const API_URL = 'https://basket.joanpomares.es/';

// ================= UTILIDADES ================= //

// Configuración de "Toast" de SweetAlert para notificaciones
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

// Función para mostrar notificación
function showAlert(message, type = 'success') {
    Toast.fire({
        icon: type,
        title: message
    });
}

// Función helper para confirmar acciones destructivas
async function confirmAction(title = '¿Estás seguro?', text = "No podrás revertir esto") {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
}

async function fetchAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status}`);
        }
        return data.result;
    } catch (error) {
        // En caso de error usamos un icono de 'error' en el Toast
        showAlert(error.message, 'error');
        throw error;
    }
}

// ================= INICIALIZACIÓN ================= //

document.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
    loadTeams();
    loadMatches();

    // Listeners Formularios
    document.getElementById('createPlayerForm').addEventListener('submit', createPlayer);
    document.getElementById('editPlayerForm').addEventListener('submit', updatePlayer);
    document.getElementById('createTeamForm').addEventListener('submit', createTeam);
    document.getElementById('addToRosterForm').addEventListener('submit', addToRoster);
    document.getElementById('createMatchForm').addEventListener('submit', createMatch);
});

// ================= JUGADORES ================= //

async function loadPlayers() {
    try {
        const players = await fetchAPI('/players');
        const tbody = document.getElementById('playersTableBody');
        tbody.innerHTML = '';

        if (!players) return; 

        players.forEach(p => {
            const tr = document.createElement('tr');
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
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function createPlayer(e) {
    e.preventDefault();
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
        document.getElementById('createPlayerForm').reset();
        loadPlayers();
    } catch (e) {}
}

async function searchPlayer() {
    const name = document.getElementById('searchPlayerName').value;
    if(!name) return loadPlayers();

    try {
        const players = await fetchAPI(`/players/find?name=${name}`);
        const tbody = document.getElementById('playersTableBody');
        tbody.innerHTML = '';
        players.forEach(p => {
            const tr = document.createElement('tr');
            tr.classList.add('table-warning'); 
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

async function deletePlayer(id) {
    if (!await confirmAction('¿Eliminar jugador?')) return;
    
    try {
        await fetchAPI(`/players/${id}`, 'DELETE');
        showAlert('Jugador eliminado');
        loadPlayers();
    } catch (e) {}
}

// Edición
const editModal = new bootstrap.Modal(document.getElementById('editPlayerModal'));

async function openEditPlayer(id) {
    try {
        const player = await fetchAPI(`/players/${id}`);
        document.getElementById('edit_p_id').value = player._id;
        document.getElementById('edit_p_nickname').value = player.nickname;
        document.getElementById('edit_p_name').value = player.name;
        editModal.show();
    } catch (e) {}
}

async function updatePlayer(e) {
    e.preventDefault();
    const id = document.getElementById('edit_p_id').value;
    const body = {
        nickname: document.getElementById('edit_p_nickname').value,
        name: document.getElementById('edit_p_name').value
    };

    try {
        await fetchAPI(`/players/${id}`, 'PUT', body);
        showAlert('Jugador actualizado');
        editModal.hide();
        loadPlayers();
    } catch (e) {}
}

// ================= EQUIPOS ================= //

async function loadTeams() {
    try {
        const teams = await fetchAPI('/teams');
        const tbody = document.getElementById('teamsTableBody');
        tbody.innerHTML = '';

        if (!teams) return;

        teams.forEach(t => {
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

async function createTeam(e) {
    e.preventDefault();
    const body = {
        name: document.getElementById('t_name').value,
        foundedAt: document.getElementById('t_foundedAt').value || undefined
    };

    try {
        await fetchAPI('/teams', 'POST', body);
        showAlert('Equipo creado');
        document.getElementById('createTeamForm').reset();
        loadTeams();
    } catch (e) {}
}

async function deleteTeam(id) {
    if(!await confirmAction('¿Eliminar equipo?', 'Se borrará si no tiene partidos asociados.')) return;
    
    try {
        await fetchAPI(`/teams/${id}`, 'DELETE');
        showAlert('Equipo eliminado');
        loadTeams();
    } catch (e) {}
}

// Detalles y Roster
const teamModal = new bootstrap.Modal(document.getElementById('teamDetailsModal'));

async function openTeamDetails(id) {
    try {
        const team = await fetchAPI(`/teams/${id}`);
        document.getElementById('details_t_id').value = team._id;
        document.getElementById('teamDetailsTitle').innerHTML = `<i class="bi bi-shield-shaded"></i> Gestión: ${team.name}`;
        
        renderRosterTable(id, team.roster);
        teamModal.show();
    } catch (e) {}
}

function renderRosterTable(teamId, roster) {
    const tbody = document.getElementById('rosterTableBody');
    tbody.innerHTML = '';
    
    if(!roster || roster.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Roster vacío</td></tr>';
        return;
    }

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

async function addToRoster(e) {
    e.preventDefault();
    const teamId = document.getElementById('details_t_id').value;
    const body = {
        player: document.getElementById('roster_p_id').value,
        joinDate: document.getElementById('roster_date').value,
        active: true
    };

    try {
        const updatedTeam = await fetchAPI(`/teams/${teamId}/roster`, 'POST', body);
        showAlert('Jugador añadido al roster');
        document.getElementById('addToRosterForm').reset();
        renderRosterTable(teamId, updatedTeam.roster);
        loadTeams();
    } catch (e) {}
}

async function removeFromRoster(teamId, playerId) {
    if(!await confirmAction('¿Dar de baja?', 'El jugador pasará a inactivo en este equipo.')) return;
    
    try {
        await fetchAPI(`/teams/${teamId}/roster/${playerId}`, 'DELETE');
        showAlert('Jugador dado de baja');
        openTeamDetails(teamId);
        loadTeams();
    } catch (e) {}
}

// ================= PARTIDOS ================= //

async function loadMatches() {
    try {
        const matches = await fetchAPI('/matches');
        const tbody = document.getElementById('matchesTableBody');
        tbody.innerHTML = '';

        if (!matches) return;

        matches.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><small>${m.tournament}</small></td>
                <td>${formatDate(m.date)}</td>
                <td class="text-end">${m.homeTeam ? m.homeTeam.name : 'Unknown'}</td>
                <td>${m.awayTeam ? m.awayTeam.name : 'Unknown'}</td>
                <td class="fw-bold text-center">${m.homeScore} - ${m.awayScore}</td>
                <td class="fw-bold text-center">${m.description}</td>
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

async function createMatch(e) {
    e.preventDefault();
    const body = {
        tournament: document.getElementById('m_tournament').value,
        date: document.getElementById('m_date').value,
        stage: document.getElementById('m_stage').value,
        homeTeam: document.getElementById('m_homeTeam').value,
        awayTeam: document.getElementById('m_awayTeam').value,
        homeScore: parseInt(document.getElementById('m_homeScore').value),
        awayScore: parseInt(document.getElementById('m_awayScore').value)
    };

    try {
        await fetchAPI('/matches', 'POST', body);
        showAlert('Partido registrado');
        document.getElementById('createMatchForm').reset();
        loadMatches();
    } catch (e) {}
}

async function deleteMatch(id) {
    if(!await confirmAction('¿Eliminar partido?')) return;
    try {
        await fetchAPI(`/matches/${id}`, 'DELETE');
        showAlert('Partido eliminado');
        loadMatches();
    } catch (e) {}
}

// Utilidad extra para copiar ID al portapapeles
function copyId(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('ID copiado al portapapeles', 'info');
    });
}
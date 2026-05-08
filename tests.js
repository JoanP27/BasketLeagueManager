import * as player from "./tests/playerTests.js";
import * as team from "./tests/teamTests.js";
import * as auth from "./tests/authTests.js";
import colors from 'colors'

let tests = { total: 0, ok: 0, error: 0 }

export const sumar = (error = false) => {
    error ? tests.error++:tests.ok++;
    tests.total++;
    return tests.total;
}

// {name: string, result: boolean, message: string}
const showResult = (resultado) => {
    if (resultado.result == false) {
        return console.log(colors.red(`${colors.magenta(sumar(true))} [x] Test ${colors.underline(resultado.name)} Fallido => ${resultado.message}`))
    }

    return console.log(colors.green(`${colors.magenta(sumar())} [v] Test ${colors.underline(resultado.name)} Correcto => ${resultado.message}`))
}

// Tests de authenticacion

//const token = await player.authenticate()

console.log('[TEST] Registro de usuarios'.yellow)

// Registra un usuario de cada tipo

const user = { login:`ejemploUser${Date.now()}`, password:'12345678', rol:'user' }
const manager = { login:`ejemploManager${Date.now()}`, password:'12345678', rol:'manager' }
const admin = { login:`ejemploAdmin${Date.now()}`, password:'12345678', rol:'admin' }

await auth.registrarUsuario(user);
await auth.registrarUsuario(manager);
await auth.registrarUsuario(admin);

console.log('')

// Login de cada usuario registrado

console.log('[ Login de usuarios ]'.yellow)

const userToken = await auth.login(user);
const managerToken = await auth.login(manager);
const adminToken = await auth.login(admin);

console.log('')

console.log('[ Registro con errores ]'.yellow)

await auth.registrarRolIncorrecto();
await auth.registrarFaltanDatos();
await auth.registrarUsuarioYaExiste(user);

console.log('')

console.log('[ Login con errores ]'.yellow)

await auth.loginNoExiste();
await auth.loginContraseñaIncorrecta(user)
await auth.loginSinUser(user)

await auth.peticionSinAuth()
await auth.peticionTokenIncorrecto()


// Tests de jugador

console.log('')
console.log('[ Creacion de Jugadores ]'.yellow)

// Insertar jugador
const datos = await player.crearJugador(adminToken);
showResult(datos);

const datos2 = await player.crearJugador(adminToken);
const jugador3 = await player.crearJugador(adminToken);
const jugador4 = await player.crearJugador(adminToken);

// Insertar jugador que ya existe
showResult(await player.crearJugadorExistente(adminToken, datos.datos))

// Insertar jugador con datos incorrectos
showResult(await player.crearJugadorDatosIncorrectos(adminToken))

// Insertar jugador con rol no authorizado
showResult(await player.crearJugadorRolUsuario(userToken))

// Lista de jugadores
showResult(await player.listarJugadores(userToken))

// Buscar Jugador por id
showResult(await player.buscarUnJugador(userToken, datos.datos._id))

// Buscador Jugador por id no existente
showResult(await player.buscarUnJugadorInexistente(userToken))

// Actualizar jugador
showResult(await player.actualizarJugador(adminToken, datos.datos._id))

// Actualizar jugador con mismo nick a otro
showResult(await player.actualizarJugadorConNickExistente(adminToken, datos.datos._id, datos2.datos.nickname))

// Actualizar jugador no existente
showResult(await player.actualizarJugadorInexistente(adminToken))

// Actualizar jugador con campos incorrectos
showResult(await player.actualizarJugadorFaltandoCampos(adminToken))

// Actualizar jugador no autorizado
showResult(await player.actualizarJugadorRolNoAutorizado(userToken, datos.datos._id))

// Eliminar jugadores
showResult(await player.eliminarJugador(adminToken, datos.datos._id))

// Eliminar jugador no existente
showResult(await player.eliminarJugadorInexistente(adminToken))

// Eliminar jugador Rol no autorizado
showResult(await player.eliminarJugadorRolNoAutorizado(userToken, datos.datos._id))

// Tests equipos
console.log(colors.yellow('[ Equipos ]'))

// Crear un equipo
const respuestaEquipo = await team.crearEquipo(adminToken)
showResult(respuestaEquipo)

// Crear un equipo ya existente
showResult(await team.crearEquipoExistente(adminToken, respuestaEquipo.datos));

// Crear un equipo con nombre menor a 3 caracteres
showResult(await team.crearEquipoConNombreDe2Caracteres(adminToken));

// Crear un equipo con nombre superior a 50 caracteres
showResult(await team.crearEquipoConNombreDe51Caracteres(adminToken));

// Crear un equipo sin nombre
showResult(await team.crearEquipoSinNombre(adminToken));

// Crear un equipo sin fecha de fundacion
showResult(await team.crearEquipoSinFechaFundacion(adminToken));



// Listar equipos
showResult(await team.listarEquipos(adminToken))

// Listar un equipo
showResult(await team.buscarEquipo(adminToken, respuestaEquipo.datos._id))

// Listar un equipo inexistente 
showResult(await team.buscarEquipoInexistente(adminToken, respuestaEquipo.datos._id))

//Listar un equipo con rol de Usuario
showResult(await team.buscarEquipoNoAutorizado(userToken, respuestaEquipo.datos._id, 'Listar un equipo usando rol usuario'))

// Listar un equipo con rol de Manager
showResult(await team.buscarEquipoNoAutorizado(managerToken, respuestaEquipo.datos._id, 'Listar un equipo usando rol manager'))

// Tests Rosters

// Crear un roster
const roster = await team.crearRoster(managerToken, respuestaEquipo.datos._id, datos.datos._id)
showResult(roster)
// Crear un roster sin jugador
showResult(await team.crearRosterSinJugador(adminToken, respuestaEquipo.datos._id, datos.datos._id))

// Crear un roster sin joinDate
showResult(await team.crearRosterSinFechaDeEntrada(adminToken, respuestaEquipo.datos._id, datos.datos._id))

// Crear un roster sin joinDate
showResult(await team.crearRosterSinActive(adminToken, respuestaEquipo.datos._id, datos2.datos._id))

// Crear un roster con rol usuario
showResult(await team.crearRoasterConRolNoAutenticado(userToken, respuestaEquipo.datos._id, datos2.datos._id, 'Crear roster con rol de usuario'))

// Crear un roster con rol manager
showResult(await team.crearRoster(managerToken, respuestaEquipo.datos._id, jugador3.datos._id, 'Crear roster con rol de manager'))

// Eliminar un roster
showResult(await team.eliminarRoster(managerToken, respuestaEquipo.datos._id, datos.datos._id))

// Eliminar un roster inexistente
showResult(await team.eliminarRosterInexistente(managerToken, respuestaEquipo.datos._id))

// Eliminar un roster con equipo inexistente
showResult(await team.eliminarRosterConEquipoInexistente(managerToken, datos.datos._id))

// Eliminar un roster no activo (que ya ha sido "eliminado")
showResult(await team.eliminarRosterInactivo(managerToken, respuestaEquipo.datos._id, datos.datos._id))

// Crear un equipo con roster
showResult(await team.crearEquipoConRoster(adminToken, roster)); 

// Tests partidos

// Crear un partido con admin


// Crear un partido con manager

// Crear un partido con user

// Crear un partido ya existente

// Crear un partido sin datos

// Crear un partido sin fecha

// Crear un partido sin fecha

// Crear un partido con stage Group

// Crear un partido con stage Quarterfinal

// Crear un partido con stage Semifinal

// Crear un partido con stage Final

// Crear un partido con stage Incorrecto

// Crear un partido sin homeTeam

// Crear un partido sin awayTeam

// Crear un partido con el mismo homeTeam y awayTeam

// Crear un partido con homeTeam inexistente

// Crear un partido con awayTeam inexistente

// Crear un partido con los 2 equipos inexistentes

// Crear un partido sin puntos para homeTeam

// Crear un partido sin puntos para awayTeam

// Crear un partido con puntos negativos para homeTeam

// Crear un partido con puntos negativos para awayTeam

// Crear un partido con puntos negativos para los 2 Teams

// Crear un partido sin descripcion

// ----

// Listar todos los partidos

// Listar todos los partidos con Rol de Usuario

// Listar todos los partidos con Rol de Admin

// Listar todos los partidos con Rol de Manager

// -----

// Listar un partido con Rol de Usuario

// Listar un partido con Rol de Manager

// Listar un partido con Rol de Admin

// Listar un partido inexistente

// Listar un partido sin id

// -------


// Actualizar un partido inexistente

// Actualizar un partido con Rol de Admin

// Actualizar un partido con Rol de Manager

// Actualizar un partido con Rol de Usuario

// --------------

// Actualizar la descripcion de un partido con rol de Admin

// Actualizar la descripcion de un partido con rol de Manager

// Actualizar la descripcion de un partido con rol de Usuario

// Actualizar la descripcion de un partido inexsistente

// --------------

// Eliminar un partido con rol de Admin

// Eliminar un partido con rol de Manager

// Eliminar un partido con rol de Usuario

// Eliminar un partido inexistente

console.log(tests)


// Equipos: mismo que jugadores pero usando relaciones..*/
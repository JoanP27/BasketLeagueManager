import * as player from "./tests/playerTests.js";
import * as team from "./tests/teamTests.js";
import * as auth from "./tests/authTests.js";
import * as match from "./tests/matchTests.js";

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

// Insertar un jugador sin nickname
showResult(await player.crearJugadorSinNickName(adminToken));

// Insertar un jugador sin nombre
showResult(await player.crearJugadorSinNombre(adminToken));

// Insertar un jugador sin nombre
showResult(await player.crearJugadorSinCountry(adminToken));

// Insertar un jugador sin nombre
showResult(await player.crearJugadorSinBirthday(adminToken));

// Insertar un jugador sin nombre
showResult(await player.crearJugadorSinRol(adminToken));

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
const respuestaEquipo = await team.crearEquipo(adminToken);
const equipo2 = await team.crearEquipo(adminToken);

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
const matchDatos = await match.crearMatch(adminToken, respuestaEquipo.datos, equipo2.datos)
showResult(matchDatos)

const matchDatos2 =  await match.crearMatch(adminToken, respuestaEquipo.datos, equipo2.datos)
const matchDatos3 =  await match.crearMatch(adminToken, respuestaEquipo.datos, equipo2.datos)

// Crear un partido con manager
showResult(await match.crearMatch(managerToken, respuestaEquipo.datos, equipo2.datos, 'Crear un partido con Rol de manager'))

// Crear un partido con user
showResult(await match.crearMatchRolNoAutorizado(userToken, respuestaEquipo.datos, equipo2.datos, 'Crear un partido con Rol de usuario'))

// Crear un partido ya existente
showResult(await match.crearMatchYaExistente(adminToken, matchDatos.datos))

// Crear un partido sin datos
showResult(await match.crearMatchFaltanDatos(adminToken))

// Crear un partido sin fecha
showResult(await match.crearMatchSinFecha(adminToken, respuestaEquipo.datos, equipo2.datos))

// Crear un partido sin stage
showResult(await match.crearMatchSinStage(adminToken, respuestaEquipo.datos, equipo2.datos))

// Crear un partido con stage Group
showResult(await match.crearMatchConStageGroup(adminToken, respuestaEquipo.datos, equipo2.datos,))

// Crear un partido con stage Quarterfinal
showResult(await match.crearMatchConStageQuarterfinal(adminToken, respuestaEquipo.datos, equipo2.datos))

// Crear un partido con stage Semifinal
showResult(await match.crearMatchConStageSemifinal(adminToken, respuestaEquipo.datos, equipo2.datos))

// Crear un partido con stage Final
showResult(await match.crearMatchConStageFinal(adminToken, respuestaEquipo.datos, equipo2.datos))


// Crear un partido con stage Incorrecto
showResult(await match.crearMatchConStageIncorrecto(adminToken, respuestaEquipo.datos, equipo2.datos))

// Crear un partido sin homeTeam
showResult(await match.crearMatchSinHomeTeam(adminToken, respuestaEquipo.datos, equipo2.datos,))

// Crear un partido sin awayTeam
showResult(await match.crearMatchSinAwayTeam(adminToken, respuestaEquipo.datos, equipo2.datos,))

// Crear un partido sin awayTeam ni homeTeam
showResult(await match.crearMatchSinAwayTeamNiHomeTeam(adminToken, respuestaEquipo.datos, equipo2.datos,))

// Crear un partido con el mismo homeTeam y awayTeam
showResult(await match.crearMatchMismoHomeTeamYAwayTean(adminToken, respuestaEquipo.datos))

// Crear un partido con homeTeam inexistente
showResult(await match.crearMatchConHomeTeamInexistente(adminToken, respuestaEquipo.datos))


// Crear un partido con awayTeam inexistente
showResult(await match.crearMatchConAwayTeamInexistente(adminToken, respuestaEquipo.datos))

// Crear un partido con los 2 equipos inexistentes
showResult(await match.crearMatchConEquiposInexistentes(adminToken))


// Crear un partido sin puntos para homeTeam
showResult(await match.crearMatchSinPuntosHomeTeam(adminToken, respuestaEquipo.datos, equipo2.datos,))

// Crear un partido sin puntos
showResult(await match.crearMatchSinPuntos(adminToken, respuestaEquipo.datos, equipo2.datos,))

// Crear un partido sin puntos para awayTeam
showResult(await match.crearMatchSinPuntosAwayTeam(adminToken, respuestaEquipo.datos, equipo2.datos,))

// Crear un partido con puntos negativos para homeTeam

showResult(await match.crearMatchConPuntosDeHomeTeamNegativos(managerToken, respuestaEquipo.datos, equipo2.datos))

// Crear un partido con puntos negativos para awayTeam
showResult(await match.crearMatchConPuntosDeAwayTeamNegativos(managerToken, respuestaEquipo.datos, equipo2.datos))

// Crear un partido con puntos negativos para los 2 Teams
showResult(await match.crearMatchConPuntosNegativos(managerToken, respuestaEquipo.datos, equipo2.datos))

// Crear un partido sin descripcion
showResult(await match.crearMatchSinDescripcion(adminToken, respuestaEquipo.datos, equipo2.datos))

// ----

// Listar todos los partidos
showResult(await match.listarMatches(adminToken))

// Listar todos los partidos con Rol de Usuario
showResult(await match.listarMatches(userToken, 'Listar partidos con rol de usuario'))

// Listar todos los partidos con Rol de Manager
showResult(await match.listarMatches(managerToken, 'Listar partidos con rol de manager'))

// -----

// Listar un partido con Rol de Usuario
showResult(await match.listarUnaMatch(userToken, matchDatos.datos._id, 'Listar un partido con rol de usuario'))

// Listar un partido con Rol de Manager
showResult(await match.listarUnaMatch(managerToken, matchDatos.datos._id, 'Listar un partido con rol de manager'))

// Listar un partido con Rol de Admin
showResult(await match.listarUnaMatch(adminToken, matchDatos.datos._id, 'LIstar un partido con rol de admin'))

// Listar un partido inexistente
showResult(await match.listarUnMatchInexistente(adminToken))

// -------

// Actualizar la descripcion de un partido con Rol de Admin
showResult(await match.actualizarDescripcionMatch(adminToken, matchDatos.datos, 'Actualizar las descripcion de un partido con rol de admin'))

// Actualizar un partido con Rol de Manager
showResult(await match.actualizarDescripcionMatch(managerToken, matchDatos.datos, 'Actualizar las descripcion de un partido con rol de manager'))

// Actualizar un partido con Rol de Usuario
showResult(await match.actualizarDescripcionMatch(userToken, matchDatos.datos, 'Actualizar las descripcion de un partido con rol de admin'))

// Actualizar la descripcion de un partido inexsistente
showResult(await match.actualizarDescripcionMatchInexistente(userToken, matchDatos.datos))

// Actualizar la descripcion de un partido faltando datos
showResult(await match.actualizarDescripcionMatchSinDatos(userToken, matchDatos.datos))


// --------------

// Eliminar un partido con rol de Admin
showResult(await match.eliminarMatch(adminToken, matchDatos.datos, 'Eliminar partido con rol de admin'))


// Eliminar un partido con rol de Manager
showResult(await match.eliminarMatch(managerToken, matchDatos2.datos, 'Eliminar partido con rol de Manager'))


// Eliminar un partido con rol de Usuario
showResult(await match.eliminarMatchRolNoAutorizado(userToken, matchDatos3.datos, 'Eliminar partido con rol de Usuario'))


// Eliminar un partido inexistente
showResult(await match.eliminarMatchInexistente(adminToken, matchDatos3.datos))

// Eliminar la descripcion de un partido con rol de admin
showResult(await match.eliminarDescripcionMatch(adminToken, matchDatos3.datos, 'Eliminar descripcion de un partido con rol de admin'))


// Eliminar la descripcion de un partido con rol de manager
showResult(await match.eliminarDescripcionMatch(managerToken, matchDatos3.datos, 'Eliminar descripcion de un partido con rol de manager'))

// Eliminar la descripcion de un partido con rol de usuario
showResult(await match.eliminarDescripcionMatch(userToken, matchDatos3.datos, 'Eliminar descripcion de un partido con rol de usuario'))

console.log(tests)


// Equipos: mismo que jugadores pero usando relaciones..*/
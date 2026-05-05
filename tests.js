import * as player from "./tests/playerTests.js";
import * as auth from "./tests/authTests.js";
import colors from 'colors'

let tests = { total: 0, ok: 0, error: 0 }

export const sumar = (error = false) => {
    error ? tests.error++:tests.ok++;
    tests.total++;
    return tests.total;
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

const datos = await player.crearJugador(adminToken);
await player.crearJugadorExistente(adminToken, datos.player);
await player.listarJugadores(adminToken);
await player.buscarUnJugador(adminToken, datos.respuesta);
await player.actualizarJugador(adminToken, datos.respuesta);
await player.buscarUnJugadorInexistente(adminToken);
await player.actualizarJugadorFaltandoCampos(adminToken, datos.respuesta);
console.log(tests)
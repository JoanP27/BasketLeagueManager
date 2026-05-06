import colors from 'colors'
import axios from 'axios'
import http from 'http'
import {sumar} from '../tests.js'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    httpAgent: new http.Agent({ keepAlive: false })
})

const setToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['authorization'];
    }
};

/*const showResult = (error = false, test = "" , message = "") => {
    if (error == true) {
        return console.log(colors.red(`${colors.magenta(sumar(true))} [x] Test ${colors.underline(test)} Fallido => ${message}`))
    }
    return console.log(colors.green(`${colors.magenta(sumar())} [v] Test ${colors.underline(test)} Correcto => ${message}`))
}*/

export const crearJugador = async(token, player = null) => {
    setToken(token)
    
    if(!player) {
        player = {
            nickname: `player_${Date.now()}`,
            name: "Test Player",
            country: "ES",
            birthDate: "1995-05-20",
            role: "base",
            lesionado: false
        }
    }

    try {
        const resp = await axiosInstance.post('/players', player);
        if(resp.status == 201) return { 
            name: 'Crear Jugador', 
            result: true, 
            message: 'jugador creado correctamente',  
            datos: resp.data.result
        }

        throw new Error('el estado no era 201');
    }
    catch(ex) {
        return { 
            name: 'Crear Jugador', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const crearJugadorExistente = async(token, player) => {
    setToken(token)
    try {
        const resp = await axiosInstance.post('/players', player);
        if(resp.status == 201) return { 
            name: 'Crear Jugador Existente', 
            result: false, 
            message: 'jugador creado correctamente',  
            datos: resp.data.result
        }

        throw new Error('el estado no era 201');
    }
    catch(ex) {
        if(ex.status == 400)
            return { 
                name: 'Crear Jugador Existente', 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        else
            return { 
                name: 'Crear Jugador Existente', 
                result: false, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
    }
}
export const crearJugadorDatosIncorrectos = async(token) => {
    setToken(token)
    try {
        const resp = await axiosInstance.post('/players', {});
        if(resp.status == 201) return { 
            name: 'Crear Jugador Faltan datos', 
            result: false, 
            message: 'jugador creado correctamente',  
            datos: resp.data.result
        }

        throw new Error('el estado no era 201');
    }
    catch(ex) {
        if(ex.status == 400)
            return { 
                name: 'Crear Jugador Faltan datos', 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        else
            return { 
                name: 'Crear Jugador Faltan datos', 
                result: false, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
    }
}
export const crearJugadorRolUsuario = async(token) => {
    setToken(token)

    const player = {
        nickname: `player_${Date.now()}`,
        name: "Test Player",
        country: "ES",
        birthDate: "1995-05-20",
        role: "base",
        lesionado: false
    }


    try {
        const resp = await axiosInstance.post('/players', player);
        if(resp.status == 201) return { 
            name: 'Crear Jugador Rol no autorizado', 
            result: false, 
            message: 'jugador creado correctamente',  
            datos: resp.data.result
        }

        throw new Error('el estado no era 201');
    }
    catch(ex) {
        if(ex.status == 401)
            return { 
                name: 'Crear Jugador Rol no autorizado', 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        else
            return { 
                name: 'Crear Jugador Rol no autorizado', 
                result: false, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
    }
}



export const listarJugadores = async(token) => {
    setToken(token);
    try {
        const respuesta = await axiosInstance.get('/players');
        if (respuesta.status === 200 && respuesta.data.result.length > 0) {
            showResult(false, 'Listado de jugadores', 'jugadores encontrados => ' + colors.yellow(respuesta.data.result.length))
        } else {
            throw new Error("Estado no fue 200 o listado vacio no capturado como 404");
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            showResult(false, 'Listado de jugadores', 'jugadores encontrados => ' + 0)
        } else {
            showResult(false, 'Listado de jugadores', error.response?.data?.error || error.message)
        }
    }
}


export const buscarUnJugador = async(token, playerId) => {
    setToken(token);
    try {
        const respuesta = await axiosInstance.get('/players/' + playerId);
        if (respuesta.status === 200 && respuesta.data.result != null) {
            showResult(false, 'Buscar jugador por id', 'jugadores encontrado => ' + colors.yellow(respuesta.data.result._id))
        } else {
            throw new Error("Estado no fue 200 o listado vacio no capturado como 404");
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            showResult(true, 'Buscar jugador por id', 'jugadores encontrados => ' + 0)
        } else {
            showResult(true, 'Buscar jugador por id', error.response?.data?.error || error.message)
        }
    }
}

export const buscarUnJugadorInexistente = async(token) => {
    setToken(token);

    try {
        const res = await axiosInstance.get('/players/69975a85d09119404777415d');
        if(res.status == 200) {
            showResult(true, 'Buscar jugador por id', 'jugadores encontrado => ' + colors.yellow(respuesta.data.result._id))
        }else{
            throw new Error("Estado no fue 404");
        }
    }catch(error) {

        if (error.response.status === 404) {
            showResult(false, 'Buscar jugador por id', 'jugador no encontrado')
        } else {
            showResult(true, 'Buscar jugador por id', error.response?.data?.error || error.message)
        }
    }
}

export const actualizarJugador = async(token, playerId) => {
    setToken(token);
    const player = {
        _id: playerId,
        nickname: `player_${Date.now()}`,
        name: "Test Player",
        country: "ES",
        birthDate: "1995-05-20",
        role: "base",
        lesionado: false
    }
    
    try {
        const respuesta = await axiosInstance.put('/players/' + playerId, player);
        if (respuesta.status === 201) {
            showResult(false, 'Actualizacion de jugador', 'id de jugador => ' + colors.yellow(respuesta.data.result._id))
            return {player: player, respuesta: respuesta.data.result._id};
        } else {
            throw new Error("Estado no fue 201");
        }
    } catch (error) {
        console.error('error: ', error)
        showResult(true, error.response?.data?.error || error.message)
        return null;
    }
}

export const actualizarJugadorFaltandoCampos = async(token, playerId) => {
    setToken(token);
    const player = {}
    try {
        const respuesta = await axiosInstance.put('/players/' + playerId, player);

        if (respuesta.status === 201) {
            showResult(true, 'Actualizar jugador faltando datos', 'id de jugador => ' + colors.yellow(respuesta.data.result._id))
            return {player: player, respuesta: respuesta.data.result._id};
        } else {
            throw new Error("Estado no fue 201");
        }
    } catch (error) {
        console.log(error)
        if (error.response.status === 500) {
            showResult(false, 'Actualizar jugador faltando datos', 'jugador no encontrado')
        } else {
            showResult(true, 'Actualizar jugador faltando datos', error.response?.data?.error || error.message)
        }
    }
}

export const eliminarJugadorInexistente = async (token, playerId) => {
    setToken(token)

    try {
       const respuesta = await axiosInstance.delete('/players/69975a85d09119404777415d');

        if(respuesta.status === 200) {
            showResult(true, 'Eliminacion de jugador', 'id de jugador => ' + colors.yellow(respuesta.data.result._id));
            return;
        }
        throw new Error('El codigo de respuesta no es 200')
    }
    catch(ex) {
        if(ex.response.status == 404) {
            showResult(true, 'Eliminacion de jugador', 'juador no encontrado');
            return;
        }
        showResult(false, error.response?.data?.error || error.message);
        return;
    }
}

export const eliminarJugador = async(token, playerId) => {
    setToken(token);

    try {
        const respuesta = await axiosInstance.delete('/players/' + playerId);
        if(respuesta.status === 200) {
            showResult(false, 'Eliminacion de jugador', 'id de jugador => ' + colors.yellow(respuesta.data.result._id));
            return;
        }
        throw '';
    }
    catch(error) {
        showResult(true, error.response?.data?.error || error.message);
        return;
    }
}



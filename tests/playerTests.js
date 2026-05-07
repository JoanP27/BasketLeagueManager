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
    setToken(token)
    try {
        const resp = await axiosInstance.get('/players');

        if (resp.status === 200 && resp.data.result.length > 0) 
            return { 
                name: 'Listar jugadores', 
                result: true, 
                message: 'lista de jugadores correcta',  
                datos: resp.data.result
            }
        throw new Error("Estado no fue 200 o listado vacio no capturado como 404");

    }catch(ex) {
        return { 
            name: 'Lista de jugadores', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const buscarUnJugador = async(token, playerId) => {
    setToken(token);

     try {
        const resp = await axiosInstance.get('/players/' + playerId);

        if (resp.status === 200 && resp.data.result != null) 
            return { 
                name: 'Buscar un jugador', 
                result: true, 
                message: 'Jugador encontrado => ' + colors.yellow(resp.data.result._id),  
                datos: resp.data.result
            }
        throw new Error("Estado no fue 200 o listado vacio no capturado como 404");

    }catch(ex) {
        return { 
            name: 'Buscar un jugador', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const buscarUnJugadorInexistente = async(token) => {
    setToken(token);
    try {
        const resp = await axiosInstance.get('/players/69975a85d09119404777415d');
        return { 
            name: 'Buscar un jugador Inexistente', 
            result: false, 
            message: 'Jugador encontrado => ' + colors.yellow(respuesta.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        if (ex.response.status === 404) 
            return { 
                name: 'Buscar un jugador Inexistente', 
                result: true, 
                message: 'El jugador no existe',  
                datos: null
            }
        else 
            return { 
                name: 'Buscar un jugador Inexistente', 
                result: false, 
                message: error.response?.data?.error || error.message,  
                datos: null
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
        const resp = await axiosInstance.put('/players/' + playerId, player);
        if(resp.status === 201 && resp.data.result.nickname === player.nickname) {
            return { 
                name: 'Actualizar un jugador', 
                result: true, 
                message: 'Jugador actualizado => ' + colors.yellow(resp.data.result._id),  
                datos: resp.data.result
            }
        }
        throw new Error('el estado no era 201');

        
    } catch(ex) {
        return { 
            name: 'Actualizar un jugador', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const actualizarJugadorConNickExistente = async(token, playerId, nickname) => {
    setToken(token);
    const player = {
        _id: playerId,
        nickname: nickname,
        name: "Test Player",
        country: "ES",
        birthDate: "1995-05-20",
        role: "base",
        lesionado: false
    }

    try {
        const resp = await axiosInstance.put('/players/' + playerId, player);
        if(resp.status === 201 && resp.data.result.nickname === player.nickname) {
            return { 
                name: 'Actualizar un jugador con nick existente', 
                result: false, 
                message: 'Jugador actualizado => ' + colors.yellow(resp.data.result._id),  
                datos: resp.data.result
            }
        }
        throw new Error('el estado no era 201');

        
    } catch(ex) {
        if(ex.response.status === 400) 
            return { 
                name: 'Actualizar un jugador con nick existente', 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return { 
            name: 'Actualizar un jugador con nick existente', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const actualizarJugadorInexistente = async(token, playerId) => {
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
        const resp = await axiosInstance.put('/players/69975a85d09119404777415d', player);
        if(resp.status === 201 && resp.data.result.nickname === player.nickname) {
            return { 
                name: 'Actualizar un jugador Inexistente', 
                result: false, 
                message: 'Jugador actualizado => ' + colors.yellow(resp.data.result._id),  
                datos: resp.data.result
            }
        }
        throw new Error('el estado no era 201');

        
    } catch(ex) {
        if (ex.response.status === 404) 
            return { 
                name: 'Actualizar un jugador Inexistente', 
                result: true, 
                message: 'El jugador no existe',  
                datos: null
            }
        else 
            return { 
                name: 'Actualizar un jugador Inexistente', 
                result: false, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
    }
}
export const actualizarJugadorFaltandoCampos = async(token, playerId) => {
    setToken(token);
    try {
        const respuesta = await axiosInstance.put('/players/' + playerId, {});

        if (respuesta.status === 201) 
            return { 
                name: 'Actualizar jugador faltan campos', 
                result: false, 
                message: 'Jugador actualizado => ' + colors.yellow(respuesta.data.result._id),  
                datos: resp.data.result
            }
        throw new Error("Estado no fue 201");

    } catch(ex) {
        if (ex.response.status === 400) {
            return { 
                name: 'Actualizar jugador faltan campos', 
                result: true, 
                message: 'faltan campos obligatorios',
                datos: null
            }
        }
        return { 
            name: 'Actualizar jugador faltan campos', 
            result: false, 
            message: ex.response?.data?.error || ex.message,
            datos: null
        }
    }
}
export const actualizarJugadorRolNoAutorizado = async(token, playerId) => {
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
        const resp = await axiosInstance.put('/players/' + playerId, player);
        if(resp.status === 201 && resp.data.result.nickname === player.nickname) {
            return { 
                name: 'Actualizar jugador no autorizado', 
                result: false, 
                message: 'Jugador actualizado => ' + colors.yellow(resp.data.result._id),  
                datos: resp.data.result
            }
        }
        throw new Error('el estado no era 201');

        
    } catch(ex) {
        if (ex.response.status === 401) 
            return { 
                name: 'Actualizar jugador no autorizado', 
                result: true, 
                message: 'no autorizado',
                datos: null
            }
        return { 
            name: 'Actualizar jugador no autorizado', 
            result: false, 
            message: ex.response?.data?.error || ex.message,
            datos: null
        }
    }
}

export const eliminarJugador = async(token, playerId) => {
    setToken(token);

    try {
        const resp = await axiosInstance.delete('/players/' + playerId);
        if(resp.status === 200) {
           return { 
                name: 'Eliminacion de jugador', 
                result: true, 
                message: 'Jugador eliminado => ' + colors.yellow(resp.data.result._id),  
                datos: resp.data.result
            }
        }
        throw new Error("Estado no fue 201");
    }
    catch(ex) {
        return { 
            name: 'Eliminacion de jugador', 
            result: false, 
            message: ex.response?.data?.error || ex.message,
            datos: null
        }
    }
}
export const eliminarJugadorInexistente = async(token, playerId) => {
    setToken(token);

    try {
        const resp = await axiosInstance.delete('/players/69975a85d09119404777415d');
        if(resp.status === 200) {
           return { 
                name: 'Eliminacion de jugador no existente', 
                result: false, 
                message: 'Jugador eliminado => ' + colors.yellow(resp.data.result._id),  
                datos: resp.data.result
            }
        }
        throw new Error("Estado no fue 201");
    }
    catch(ex) {
        if(ex.response.status === 404)
            return { 
                name: 'Eliminacion de jugador no existente', 
                result: true, 
                message: ex.response?.data?.error || ex.message,
                datos: null
            }
        return { 
            name: 'Eliminacion de jugador no existente', 
            result: false, 
            message: ex.response?.data?.error || ex.message,
            datos: null
        }
    }
}
export const eliminarJugadorRolNoAutorizado = async(token, playerId) => {
    setToken(token);

    try {
        const resp = await axiosInstance.delete('/players/' + playerId);
        if(resp.status === 200) {
           return { 
                name: 'Eliminacion de jugador rol no autorizado', 
                result: false, 
                message: 'Jugador eliminado => ' + colors.yellow(resp.data.result._id),  
                datos: resp.data.result
            }
        }
        throw new Error("Estado no fue 201");
    }
    catch(ex) {
        if(ex.response.status === 401)
            return { 
                name: 'Eliminacion de jugador rol no autorizado', 
                result: true, 
                message: ex.response?.data?.error || ex.message,
                datos: null
            }
        return { 
            name: 'Eliminacion de jugador rol no  autorizado', 
            result: false, 
            message: ex.response?.data?.error || ex.message,
            datos: null
        }
    }
}
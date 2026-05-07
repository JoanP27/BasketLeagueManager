import colors from 'colors'
import axios from 'axios'
import http from 'http'

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

export const crearEquipo = async(token, equipo = null) => {
    setToken(token)
    
    if(!equipo) {
        equipo = {
            name: `Equipo${Date.now()}`,
            foundedAt: Date.now()
        }
    }

    try {
        const resp = await axiosInstance.post('/teams', equipo);
        return { 
            name: 'Crear Equipo', 
            result: true, 
            message: 'Equipo creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        return {
            name: 'Crear Equipo', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }

}
export const crearEquipoExistente = async(token, equipo) => {
    setToken(token)

    try {
        const resp = await axiosInstance.post('/teams', equipo);
        return { 
            name: 'Crear Equipo existente', 
            result: false, 
            message: 'Equipo creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        if(ex.response.status === 404) {
            return { 
                name: 'Crear Equipo existente', 
                result: true, 
                message: 'El equipo ya existe',  
                datos: null
            }
        }
        return {
            name: 'Crear Equipo existente', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }

}
export const crearEquipoConNombreDe2Caracteres = async(token) => {
    setToken(token)
    const equipo = {
        name: `ab`,
        foundedAt: Date.now()
    }
    try {
        const resp = await axiosInstance.post('/teams', equipo);
        return { 
            name: 'Crear Equipo con nombre menor a 3 caracteres', 
            result: false, 
            message: 'Equipo creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        if(ex.response.status === 400) {
            return { 
                name: 'Crear Equipo con nombre menor a 3 caracteres',
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }
        return {
            name: 'Crear Equipo con nombre menor a 3 caracteres', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }

}
export const crearEquipoConNombreDe51Caracteres = async(token) => {
    setToken(token)
    const equipo = {
        name: `12345678901234567890123456789012345678901234567890123456789012345678901234567890`,
        foundedAt: Date.now()
    }
    try {
        const resp = await axiosInstance.post('/teams', equipo);
        return { 
            name: 'Crear Equipo con nombre menor a 3 caracteres', 
            result: false, 
            message: 'Equipo creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        if(ex.response.status === 400) {
            return { 
                name: 'Crear Equipo con nombre mayor a 50 caracteres',
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }
        return {
            name: 'Crear Equipo con nombre menor a 3 caracteres', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }

}
export const crearEquipoSinNombre = async(token) => {
    setToken(token)
    const equipo = {
        foundedAt: Date.now()
    }
    try {
        const resp = await axiosInstance.post('/teams', equipo);
        return { 
            name: 'Crear un equipo sin nombre', 
            result: false, 
            message: 'Equipo creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        if(ex.response.status === 400) {
            return { 
                name: 'Crear un equipo sin nombre',
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }
        return {
            name: 'Crear un equipo sin nombre', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }

}
export const crearEquipoSinFechaFundacion = async(token) => {
    setToken(token)
    const equipo = {
        name: `Equipo${Date.now()}`,
    }
    try {
        const resp = await axiosInstance.post('/teams', equipo);
        return { 
            name: 'Crear un equipo sin fecha de fundacion', 
            result: true, 
            message: 'Equipo creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        return {
            name: 'Crear un equipo sin fecha de fundacion', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }

}
export const crearEquipoConRoster = async(token, roster, message = 'crear un equipo con un roster') => {
    setToken(token)

    const equipo = {
        name: `Equipo${Date.now()}`,
        foundedAt: Date.now(),
        roster: roster._id    
    }

    try {
        const resp = await axiosInstance.post('/teams', equipo);
        return { 
            name: message, 
            result: true, 
            message: 'Equipo creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }

}

export const listarEquipos = async(token) => {
    setToken(token)
    try {
        const resp = await axiosInstance.get('/teams');
        if(resp.data.result == null || resp.data.result.length <= 0) 
            throw new Error('Error al buscar la lista o no se ha manejado el error 404 cuando hay una lista vacia')
        
        return { 
            name: 'Listar equipos', 
            result: true, 
            message: 'Equipos encontrados => ' + colors.yellow(resp.data.result.length),  
            datos: resp.data.result
        }
    } catch(ex) {
        return {
            name: 'Listar equipos', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const buscarEquipo = async(token, id, message = null) => {
    setToken(token)
    try {
        const resp = await axiosInstance.get('/teams/'+ id);
        if(!resp.data.result) 
            throw new Error('Error al buscar o caso de error 404 no manejado')
        
        return { 
            name: 'Listar un equipo', 
            result: true, 
            message: 'Equipo encontrado => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        if(codigoEsperado)
        return {
            name: 'Listar un equipo', 
            result: false && resultadoEsperado, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}

export const buscarEquipoNoAutorizado = async(token, id, message = null) => {
    setToken(token)
    try {
        const resp = await axiosInstance.get('/teams/'+ id);
        if(!resp.data.result) 
            throw new Error('Error al buscar o caso de error 404 no manejado')
        
        return { 
            name: message ?? 'Listar un equipo con rol autorizado', 
            result: true, 
            message: 'Equipo encontrado => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        if(ex.response.status == 401)
            return {
                name: message ?? 'Listar un equipo con rol autorizado', 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message ?? 'Listar un equipo con rol autorizado', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}

export const buscarEquipoInexistente = async(token) => {
    setToken(token)
    try {
        const resp = await axiosInstance.get('/teams/69975a85d09119404777415d');
        return { 
            name: 'Listar un equipo inexistente', 
            result: false, 
            message: 'Equipo encontrado => ' + colors.yellow(resp.data.result._id),  
            datos: resp.data.result
        }
    } catch(ex) {
        if(ex.response.status === 404) {
            return { 
                name: 'Listar un equipo inexistente', 
                result: true, 
                message: 'Equipo no encontrado => ' + ex.response?.data?.error || ex.message,  
                datos: null,  
            }
        }
        return {
            name: 'Listar un equipo inexistente', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}

export const crearRoster = async(token, idTeam, idPlayer, message = null) => {
    setToken(token)

    const roster = {
        player: idPlayer,
        joinDate: Date.now(),
        active: true
    }

    try{
        const resp = await axiosInstance.post('/teams/' + idTeam + '/roster', roster);

        return {
            name: message ?? 'crear un Roster', 
            result: true, 
            message: 'roster creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {
        return {
            name: message ?? 'crear un Roster', 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}

export const crearRosterSinJugador = async(token, idTeam, idPlayer, message = 'crear un Roster sin Jugador') => {
    setToken(token)

    const roster = {
        joinDate: Date.now(),
        active: true
    }

    try{
        const resp = await axiosInstance.post('/teams/' + idTeam + '/roster', roster);

        return {
            name: message, 
            result: false, 
            message: 'roster creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {
        if(ex.response.status === 400) {
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const crearRosterSinFechaDeEntrada = async(token, idTeam, idPlayer, message = 'crear un Roster sin Fecha de entrada') => {
    setToken(token)

    const roster = {
        player: idPlayer,
        active: true
    }

    try{
        const resp = await axiosInstance.post('/teams/' + idTeam + '/roster', roster);

        return {
            name: message, 
            result: false, 
            message: 'roster creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {
        if(ex.response.status === 400) {
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const crearRosterSinActive = async(token, idTeam, idPlayer, message = 'crear un Roster sin Active') => {
    setToken(token)

    const roster = {
        player: idPlayer,
        joinDate: Date.now(),
    }

    try{
        const resp = await axiosInstance.post('/teams/' + idTeam + '/roster', roster);

        return {
            name: message, 
            result: true, 
            message: 'roster creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {
        
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const crearRoasterConRolNoAutenticado = async(token, idTeam, idPlayer, message = 'crear un Roster con un rol no autenticado') => {
    setToken(token)

    const roster = {
        player: idPlayer,
        joinDate: Date.now(),
        active: true
    }

    try{
        const resp = await axiosInstance.post('/teams/' + idTeam + '/roster', roster);

        return {
            name: message, 
            result: false, 
            message: 'roster creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {
        
        if(ex.response.status == 401) {
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }

        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}

export const eliminarRoster = async(token, idTeam, idPlayer, message = 'eliminar un Roster') => {
    setToken(token)
    try{
        const resp = await axiosInstance.delete('/teams/' + idTeam + '/roster/' + idPlayer + '/');

        return {
            name: message, 
            result: true, 
            message: 'roster eliminado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const eliminarRosterInexistente = async(token, idTeam, message = 'eliminar un Roster Inexistente') => {
    setToken(token)
    try{
        const resp = await axiosInstance.delete('/teams/' + idTeam + '/roster/69975a85d09119404777415d/');

        return {
            name: message, 
            result: false, 
            message: 'roster eliminado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {

        if(ex.response.status === 404) {
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }

        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const eliminarRosterConEquipoInexistente = async(token, idPlayer, message = 'eliminar un Roster  con un equipo Inexistente') => {
    setToken(token)
    try{
        const resp = await axiosInstance.delete('/teams/69975a85d09119404777415d/roster/' + idPlayer + '/');

        return {
            name: message, 
            result: false, 
            message: 'roster eliminado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {

        if(ex.response.status === 404) {
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }

        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const eliminarRosterInactivo = async(token, idTeam, idPlayer, message = 'eliminar un Roster Inactivo') => {
    setToken(token)
    try{
        const resp = await axiosInstance.delete('/teams/' + idTeam + '/roster/' + idPlayer + '/');

        return {
            name: message, 
            result: false, 
            message: 'roster eliminado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    } catch(ex) {

        if(ex.response.status == 404) {
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}

export const eliminarEquipo = async(token) => {

}
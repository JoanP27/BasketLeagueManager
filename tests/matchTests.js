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

export const crearMatch = (token, homeTeam, awayTeam, message = 'Crear un partido') => {
    setToken(token)
    
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/match/', match);
        return {
            name: message, 
            result: true, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchRolNoAutorizado = (token, homeTeam, awayTeam, message = 'Crear un partido con rol no autorizado') => {
    setToken(token)
    
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/match/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 401)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchYaExistente = (token, match, message = 'Crear un partido que ya existe') => {
    setToken(token)

    try{
        const resp = await axiosInstance.post('/match/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 404)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchFaltanDatos = (token, message = 'Crear un partido sin datos') => {
    setToken(token)

    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinFecha = (token, homeTeam, awayTeam, message = 'Crear un partido sin fecha') => {
    setToken(token)
    const match = {
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinStage = (token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinHomeTeam = (token, homeTeam, awayTeam, message = 'Crear un partido sin homeTean') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinAwayTeam = (token, homeTeam, awayTeam, message = 'Crear un partido sin awayTeam') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinAwayTeamNiHomeTeam = (token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinPuntosHomeTeam = (token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinPuntosAwayTeam = (token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinPuntos = (token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinDescripcion = (token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
export const crearMatchSinStage = (token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        foundedAt: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/match/', {});
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data.result._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response.status == 400)
            return {
                name: message, 
                result: true, 
                message: ex.response?.data?.error || ex.message,  
                datos: null
            }
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }   
}
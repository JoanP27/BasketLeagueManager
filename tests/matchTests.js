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

export const crearMatch = async(token, homeTeam, awayTeam, message = 'Crear un partido') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: true, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
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
export const crearMatchRolNoAutorizado = async(token, homeTeam, awayTeam, message = 'Crear un partido con rol no autorizado') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchYaExistente = async(token, match, message = 'Crear un partido que ya existe') => {
    setToken(token)

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchFaltanDatos = async(token, message = 'Crear un partido sin datos') => {
    setToken(token)

    try{
        const resp = await axiosInstance.post('/matches/', {});
        return {
            
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchSinFecha = async(token, homeTeam, awayTeam, message = 'Crear un partido sin fecha') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchSinStage = async(token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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


export const crearMatchConStageGroup = async(token, homeTeam, awayTeam, message = 'Crear un partido con stage de tipo Group') => {
    setToken(token)
    const match = {
        stage: 'Group',
        tournament: 'Ejemplo',
        date: Date.now(),
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: true, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchConStageQuarterfinal = async(token, homeTeam, awayTeam, message = 'Crear un partido con stage de tipo QuarterFinal') => {
    setToken(token)
    const match = {
        stage: 'Quarterfinal',
        tournament: 'Ejemplo',
        date: Date.now(),
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: true, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchConStageSemifinal = async(token, homeTeam, awayTeam, message = 'Crear un partido con stage de tipo Semifinal') => {
    setToken(token)
    const match = {
        stage: 'Semifinal',
        tournament: 'Ejemplo',
        date: Date.now(),
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: true, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchConStageFinal = async(token, homeTeam, awayTeam, message = 'Crear un partido con stage de tipo FInal') => {
    setToken(token)
    const match = {
        stage: 'Final',
        tournament: 'Ejemplo',
        date: Date.now(),
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: true, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchConStageIncorrecto = async(token, homeTeam, awayTeam, message = 'Crear un partido con stage de tipo EJemploIncorrecto') => {
    setToken(token)
    const match = {
        stage: 'EjemploIncorrecto',
        tournament: 'Ejemplo',
        date: Date.now(),
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: null
        }
    }
    catch(ex) {
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

export const crearMatchSinHomeTeam = async(token, homeTeam, awayTeam, message = 'Crear un partido sin homeTean') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchSinAwayTeam = async(token, homeTeam, awayTeam, message = 'Crear un partido sin awayTeam') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchSinAwayTeamNiHomeTeam = async(token, homeTeam, awayTeam, message = 'Crear un partido sin homeTeam ni awayTeam') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchSinPuntosHomeTeam = async(token, homeTeam, awayTeam, message = 'Crear un partido sin puntos para homeTeam') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchSinPuntosAwayTeam = async(token, homeTeam, awayTeam, message = 'Crear un partido sin ountos para awayTeam') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchSinPuntos = async(token, homeTeam, awayTeam, message = 'Crear un partido sin puntos') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
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
export const crearMatchSinDescripcion = async(token, homeTeam, awayTeam, message = 'Crear un partido sin descripcion') => {
    setToken(token)
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
    }
    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: true, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: null
        }
    }
    catch(ex) {
        if(ex.response?.status === 400)
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

export const crearMatchMismoHomeTeamYAwayTean = async(token, team, message = 'Crear un partido con mismo awayTeam y homeTeam') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: team._id,
        awayTeam: team._id,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
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
export const crearMatchConHomeTeamInexistente = async(token, awayTeam, message = 'Crear un partido con homeTeam inexistente') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: '69975a85d09119404777415d',
        awayTeam: awayTeam._id,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
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
export const crearMatchConAwayTeamInexistente = async(token, homeTeam, message = 'Crear un partido con awayTeam inexistente') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: '69975a85d09119404777415d',
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
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
export const crearMatchConEquiposInexistentes = async(token, message = 'Crear un partido con equipos inexistentes') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: '69975a85d09119404777415d',
        awayTeam: '69975a85d09119404777416d',
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
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
export const crearMatchConPuntosDeAwayTeamNegativos = async(token, homeTeam, awayTeam, message = 'Crear un partido con puntos de away team negativos') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        homeScore: 10,
        awayScore: -10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
        if(ex.response.status === 400)
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
export const crearMatchConPuntosDeHomeTeamNegativos = async(token, homeTeam, awayTeam, message = 'Crear un partido con puntos de home team negativos') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        homeScore: 10,
        awayScore: -10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
        if(ex.response.status === 400)
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
export const crearMatchConPuntosNegativos = async(token, homeTeam, awayTeam, message = 'Crear un partido con puntos negativos') => {
    setToken(token)
    
    const match = {
        tournament: 'Ejemplo',
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        homeScore: -10,
        awayScore: -10,
        description: 'Ejemplo'
    }

    try{
        const resp = await axiosInstance.post('/matches/', match);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
        if(ex.response.status === 400)
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

export const listarMatches = async(token, message='Listar partidos') => {
    setToken(token)

    try{
        const resp = await axiosInstance.get('/matches/');
        return {
            name: message, 
            result: true, 
            message: 'match encontrados => ' + colors.yellow(resp.data.result.length),  
            datos: resp.data
        }
    }catch(ex) {
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const listarUnaMatch = async(token, matchId,  message='Listar un partido') => {
    setToken(token)

    try{
        const resp = await axiosInstance.get('/matches/' + matchId);
        return {
            name: message, 
            result: true, 
            message: 'match encontrado => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }catch(ex) {
        return {
            name: message, 
            result: false, 
            message: ex.response?.data?.error || ex.message,  
            datos: null
        }
    }
}
export const listarUnMatchInexistente = async(token,  message='Listar un partido inexistente') => {
    setToken(token)

    try{
        const resp = await axiosInstance.get('/matches/69975a85d09119404777415d');
        return {
            name: message, 
            result: false, 
            message: 'match encontrado => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }catch(ex) {
        if(ex.response.status === 404)
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

export const actualizarDescripcionMatch = async(token, match, message = 'Actualizar la descripcion de un partido') => {
    setToken(token)
    
    match.description = 'Ejemplo'

    try{
        const resp = await axiosInstance.put('/matches/' + match._id + '/description', match);
        return {
            name: message, 
            result: true, 
            message: 'match actualizado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
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
export const actualizarDescripcionMatchInexistente = async(token, match, message = 'Actualizar la descripcion de un partido inexistente') => {
    setToken(token)
    
    match.description = 'Ejemplo'

    try{
        const resp = await axiosInstance.put('/matches/69975a85d09119404777415d/description', match);
        return {
            name: message, 
            result: false, 
            message: 'match actualizado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
        if(ex.response.status === 404)
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
export const actualizarDescripcionMatchSinDatos = async(token, match, message = 'Actualizar la descripcion de un partido inexistente faltando datos') => {
    setToken(token)
    
    match.description = null
    try{
        const resp = await axiosInstance.put('/matches/' + match._id + '/description');
        return {
            name: message, 
            result: false, 
            message: 'match actualizado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
        if(ex.response.status === 400)
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

export const eliminarMatch = async(token, match, message = 'Eliminar un partido') => {
    setToken(token)
    

    try{
        const resp = await axiosInstance.delete('/matches/' + match._id);
        return {
            name: message, 
            result: true, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
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
export const eliminarMatchRolNoAutorizado = async(token, match, message = 'Eliminar un partido') => {
    setToken(token)
    

    try{
        const resp = await axiosInstance.delete('/matches/' + match._id);
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
        if(ex.response.status === 401)
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
export const eliminarMatchInexistente = async(token, match, message = 'Eliminar un partido inexistente') => {
    setToken(token);

    try{
        const resp = await axiosInstance.delete('/matches/69975a85d09119404777415d');
        return {
            name: message, 
            result: false, 
            message: 'match creado correctamente => ' + colors.yellow(resp.data._id),  
            datos: resp.data
        }
    }
    catch(ex) {
        if(ex.response.status === 404)
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
export const eliminarDescripcionMatch = async(token, match, message = 'Eliminar la descripcion de un partido') => {
    setToken(token)
    
    try{
        const resp = await axiosInstance.delete('/matches/' + match._id + '/description');
        return {
            name: message, 
            result: true, 
            message: 'descripcion eliminada correctamente',  
            datos: resp.data
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
/*export const crearMatchSinStage = async(token, homeTeam, awayTeam, message = 'Crear un partido sin stage') => {
    setToken(token)
    const match = {
        date: Date.now(),
        stage: 'Group',
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 10,
        awayScore: 10,
        description: 'Ejemplo'
    }
    try{
        const resp = await axiosInstance.post('/matches/', {});
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
}*/
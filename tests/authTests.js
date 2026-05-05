import colors from 'colors'
import axios from 'axios'
import http from 'http'
import {sumar} from '../tests.js'


const showResult = (error = false, test = "" , message = "") => {
    if (error == true) {
        return console.log(colors.red(`${colors.magenta(sumar(true))} [x] Test ${colors.underline(test)} Fallido => ${message}`))
    }
    return console.log(colors.green(`${colors.magenta(sumar())} [v] Test ${colors.underline(test)} Correcto => ${message}`))
} 

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    httpAgent: new http.Agent({ keepAlive: false })
})

export const registrarUsuario = async (credenciales) => {
    try {
        await axiosInstance.post('/auth/register', credenciales);
        showResult(false, `Registro de ${credenciales.rol}`, `usuario ${colors.yellow(credenciales.login)} registrado`)
    } catch(e) {
        if (e.response && e.response.status === 400) {
            showResult(false, 'Registro de Usuario' , e.response?.data?.error || e.message)
        } else {
            showResult(true, 'Registro de usuario', e.response?.data?.error || e.message);
        }
    }
}

export const registrarUsuarioYaExiste = async (credenciales) => {
    try {
        await axiosInstance.post('/auth/register', credenciales);
        showResult(true, `Registro de Usuario Ya Existente`, `usuario ${colors.yellow(credenciales.login)} registrado`)
    } catch(e) {
        if (e.response && e.response.status === 400) {
            showResult(false, 'Registro de Usuario Ya Existente' , e.response?.data?.error || e.message)
        } else {
            showResult(true, 'Registro de Usuario Ya Existente', e.response?.data?.error || e.message);
        }
    }
}

export const login = async (credenciales) => {
    try {
        const respuesta = await axiosInstance.post('/auth/login', {
            login: credenciales.login,
            password: credenciales.password
        });
        if (respuesta.status === 200) {
            showResult(false, `Inicio de sesion de ${credenciales.rol}`, 'Login exitoso, Token:' + ` ${respuesta.data.result}`.yellow);
            return respuesta.data.result; // Devolvemos el token
        } else {
            throw new Error("Estado no fue 200");
        }
    } catch (error) {
        showResult(true, 'Inicio de Sesion', error.response?.data?.error || error.message);
        return null;
    }
}

export const loginSinUser = async(credenciales) => {
    try {
        const respuesta = await axiosInstance.post('/auth/login', {
            password: credenciales.password
        });
        if (respuesta.status === 200) {
            showResult(true, `Inicio de sesion de ${credenciales.rol}`, 'Login exitoso, Token:' + ` ${respuesta.data.result}`.yellow);
            return respuesta.data.result; // Devolvemos el token
        } else {
            throw new Error("Estado no fue 200");
        }
    } catch (error) {
        showResult(false, 'Inicio de Sesion', error.response?.data?.error || error.message);
        return null;
    }
}

export const registrarRolIncorrecto = async() => {
    const credenciales = { login:`ejemploUser${Date.now()}`, password:'12345678', rol:'ejemplo' }

    try {
        await axiosInstance.post('/auth/register', credenciales);
        showResult(true, `Registro de ${credenciales.rol}`, `usuario ${colors.yellow(credenciales.login)} registrado`)
    } catch(e) {
        showResult(false, 'Registro de usuario fallo correctamente', e.response?.data?.error || e.message);
    }
}

export const registrarFaltanDatos = async() => {
    const credenciales = {  password:'12345678', rol:'user' }

    try {
        await axiosInstance.post('/auth/register', credenciales);
        showResult(true, `Registro de ${credenciales.rol}`, `usuario ${colors.yellow(credenciales.login)} registrado`)
    } catch(e) {
        showResult(false, 'Registro de usuario fallo correctamente', e.response?.data?.error || e.message);
    }
}

export const loginNoExiste = async() => {
    const credenciales = { login:`ejemploUser${Date.now()}`, password:'12345678', rol:'user' }

    try {
        const respuesta = await axiosInstance.post('/auth/login', {
            login: credenciales.login,
            password: credenciales.password
        });
        if (respuesta.status === 200) {
            showResult(true, `Inicio de sesion de ${credenciales.rol}`, 'Login exitoso, Token:' + ` ${respuesta.data.result}`.yellow);
            return respuesta.data.result; // Devolvemos el token
        } else {
            showResult(false, 'Inicio de Sesion', error.response?.data?.error || error.message);
            return null;        
        }
    }  catch (e) {
        showResult(false, 'Inicio de Sesion con usuario inexistente', e.response?.data?.error || e.message);
        return null;        
    }
}

export const loginContraseñaIncorrecta = async(credenciales) => {
    try {
        const respuesta = await axiosInstance.post('/auth/login', {
            login: credenciales.login,
            password: '' + Date.now()
        });
        if (respuesta.status === 200) {
            showResult(true, `Inicio de Sesion con contraseña incorrecta'`, 'Login exitoso, Token:' + ` ${respuesta.data.result}`.yellow);
            return respuesta.data.result; // Devolvemos el token
        } else {
            throw new Error("Estado no fue 200");
        }
    }  
    catch (e) {
        if(e.code == 'ERR_BAD_REQUEST') {
            showResult(false, 'Inicio de Sesion con contraseña incorrecta', e.response?.data?.error || e.message);
            return null;      
        }  
        else {
            showResult(true, 'Inicio de Sesion con contraseña incorrecta', e.response?.data?.error || e.message);
            return null; 
        }
    }
    
}

export const peticionSinAuth = async() => {
    const player = {
        nickname: `player_${Date.now()}`,
        name: "Test Player",
        country: "ES",
        birthDate: "1995-05-20",
        role: "base",
        lesionado: false
    }

    try {
        const respuesta = await axiosInstance.post('/players', player);
        if (respuesta.status === 201) {
            showResult(true, 'Creacion de Usuario', 'id de usuario => ' + colors.yellow(respuesta.data.result._id))
            return {player: player, respuesta: respuesta.data.result._id};
        } else {
            throw new Error("Estado no fue 201");
        }
    } catch (error) {
        if(error.status == 401) {
            showResult(false, 'Autenticacion sin token' , error.response?.data?.error || error.message)
            return null;
        }
        showResult(true, error.response?.data?.error || error.message)
        return null;
    }
}

export const peticionTokenIncorrecto = async() => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6eyJfaWQiOiI2OWYzODA3M2JmYmExOWZlMDg4NTRlMDciLCJsb2dpbiI6ImVqZW1wbG9BZG1pbjE3Nzc1NjU4MTE3NjQiLCJwYXNzd29yZCI6IiQyYiQxMCQvbkZ0ZnFtLzJkQzMwNE5LZ1p0elhPZXluWDl0ZTY2YkVURDdhR2pLekdaYjUyYWNueHZxVyIsInJvbCI6ImFkbWluIiwiX192IjowfSwiaWaaaaaaaaaaaaaaaaayLCJleHAiOjE3Nzc1NzMwMTJ9.ZOTwKBHX3_193wTMdzg_kZLGrfNYgLyjz0na8wjbsCs'

    const player = {
        nickname: `player_${Date.now()}`,
        name: "Test Player",
        country: "ES",
        birthDate: "1995-05-20",
        role: "base",
        lesionado: false
    }

    try {
        const respuesta = await axiosInstance.post('/players', player);
        if (respuesta.status === 201) {
            showResult(true, 'Creacion de Usuario', 'id de usuario => ' + colors.yellow(respuesta.data.result._id))
            return {player: player, respuesta: respuesta.data.result._id};
        } else {
            throw new Error("Estado no fue 201");
        }
    } catch (error) {
        if(error.status == 401) {
            showResult(false, 'Autenticacion token incorrecto' , error.response?.data?.error || error.message)
            return null;
        }
        showResult(true, error.response?.data?.error || error.message)
        return null;
    }
}
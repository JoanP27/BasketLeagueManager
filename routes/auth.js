import mongoose, { MongooseError } from 'mongoose';
import express from 'express';
import { Match } from '../models/match.js';
import { Roster } from '../models/team.js';
import { Team } from '../models/team.js';
import { User } from '../models/users.js';
import { generarToken } from '../auth/auth.js';
import Bcrypt from 'bcrypt';

export const router = express.Router();

const usuarios = [
    { usuario: 'nacho', password: '12345', rol: 'admin' },
    { usuario: 'pepe', password: 'pepe111', rol: 'manager' },
    { usuario: 'pepe2', password: 'pepeuser', rol: 'user' }
];

class RestError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'RestError';
        this.status = status;
    }
}

router.post('/login', async (req, res) => {
    try {
        const user = {... req.body}
        const saltRounds = 10;

        const usuario = await User.findOne({login: user.login});
        
        if(!usuario) {
            throw new RestError('El usuario no existe', 404);
        }

        const validPassword = await Bcrypt.compare(user.password, usuario.password);

        if(!validPassword) {
            throw new RestError('Contraseña incorrecta', 400);
        }

        res.send({result: generarToken(usuario)});
    } catch(ex) {
        const errResult = getErrorMessage(ex);
        res.status(errResult.statusCode).send({error: errResult.message})
    }
})

router.post('/register', async (req, res) =>  {
    try {
        const saltRounds = 10;
        const userData = {... req.body}
        const user = new User(userData);

        const passwd = await Bcrypt.hash(user.password, saltRounds);

        user.password = passwd;

        const userBuscado = await User.findOne({login: user.login});

        console.log(userBuscado)

        if(userBuscado) {
            throw new RestError('El usuario ya existe', 400);
        }

        await user.save();

        res.send({ok: true})
    }catch(ex) {
        const errResult = getErrorMessage(ex);
        res.status(errResult.statusCode).send({error: errResult.message})
    } 
});

function getErrorMessage(er) {
    console.log(er)
        
    if(er.name == 'RestError') { return { statusCode: er.status, message: er.message } }
    
    if(er.name == 'ValidationError') { return { statusCode: 400, message: 'Datos incorrectos: faltan campos obligatorios' } }

    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    if(er.code == 11000) { return { statusCode: 404, message: 'El nickname ya está registrado' } }
    


    // Si no es ninguno de los anteriores el error debe ser del servidor
    return { statusCode: 500, message: 'Error interno del servidor' }
}
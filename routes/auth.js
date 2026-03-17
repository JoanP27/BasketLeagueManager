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


router.post('/login', (req, res) => {
    const user = {... req.body}

    const userExists = usuarios.filter(u => 
        u.usuario == user.usuario && u.password == user.password);

    if (userExists.length == 1)
        res.send({ok: true, token: generarToken(userExists[0])});
    else
        res.send({ok: false});
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
            res.send({ok: false, error: 'el usuario ya existe'})
        }

        await user.save();

        res.send({ok: true})
    }catch(ex) {
        res.send({ok: false, error: ex.message})
    } 
});
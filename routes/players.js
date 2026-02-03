import mongoose from 'mongoose';
import express from 'express';

import { Player } from '../models/player.js';

export const router = express.Router();

router.get('/', (req, res) => {
    Player.find()
    .then((resultado) => {
        if(resultado.length <= 0) {
            res.statusCode = 404;
            res.send("No existen jugadores registrados en el sistema");
        }
        else {
            res.statusCode = 200;
            res.send(resultado);
        }
    })
    .catch((err) => {
        res.statusCode = 500;
        res.send("Error interno del servidor")
    });
});

router.get('/:id', (req, res) => {
    Player.findById(req.params)
    .then((resultado) => {
        if(resultado.length <= 0) {
            res.statusCode = 404;
            res.send("No existen jugadores con ese nombre.")
        }
        else {
            res.statusCode = 200
            res.send(resultado);
        }
    })
    .catch(err => {

    });
});

router.post('/', async (req, res) => {
    // Asignamos los valores de el cuerpo del mensaje a un nuevo Jugador
    const player = new Player({...req.body});
    player.save().then((resp) => {
        res.statusCode = 201;
        res.send(resp)
    }).catch((er) => {
        // Comprobamos si el error es por fallo en los datos enviados
        if(er.name == 'ValidationError') {
            res.statusCode = 400;
            res.send('Datos incorrectos: faltan campos obligatorios')
        }
        // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
        else if (er.code == 11000) {
            res.statusCode = 400;
            res.send('El nickname ya está registrado')
        }
        else {
            res.statusCode = 500;
            res.send('Error interno del servidor')
        }
    })
})

router.put('/:id', async (req, res) => {

    Player.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((resp) => {

        if(resp == null || resp == undefined) {
            res.statusCode = 404;
            return res.send('Jugador no encontrado')
        }

        console.log("resp", resp)
        res.statusCode = 200;
        res.send(resp)
    })
    .catch(er => {
        const error = getErrorMessage(er);
        
        res.statusCode = error.statusCode;
        res.send(error.message)
    })
});




function getErrorMessage(er) {
    console.log(er.message)

    if(er.name == 'ValidationError') {
        return { 
            statusCode: 400,
            message: 'Datos incorrectos: faltan campos obligatorios'
        }
    }
    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    else if (er.code == 11000) {
        return { 
            statusCode: 400,
            message: 'El nickname ya está registrado'
        }
    }
    else {
        return { 
            statusCode: 500,
            message: 'Error interno del servidor'
        }
    }
}
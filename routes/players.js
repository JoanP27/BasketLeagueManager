import mongoose from 'mongoose';
import express from 'express';

import { Player } from '../models/player.js';
import { Team } from '../models/team.js';
import { Roster } from '../models/team.js';

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

router.get('/:id', async (req, res) => {
    try
    {
        console.log(req.params.id)
        const player = await Player.findById(req.params.id);
        console.log("player: ", player)
        if(!player) {
            const err = new Error()
            err.name = "OneNotFound"
            throw err;
        }
        res.status(200).send(player);
    }
    catch(ex){
        console.log(ex.cause)
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
})  

router.get('/find', async(req, res) => {
    console.log(req.query)
    const { name } = req.query

    if(!name) {
        res.status(400).send('Falta el parámetro de búsqueda')
    }

    Player.find({ name: { $regex: name, $options: 'i' }}).then((result) => {

        if(result.length <= 0){
            return res.status(404).send('No existen jugadores con ese nombre')
        }

        return res.status(200).send(result)
    }).catch(er => {
        const datos = getErrorMessage(er);
        res.status(datos.statusCode).send(datos.message)
    });
})

router.post('/', async (req, res) => {
    // Asignamos los valores de el cuerpo del mensaje a un nuevo Jugador
    const player = new Player({...req.body});
    player.save().then((resp) => {

        res.statusCode = 201;
        res.status(201).send(resp)

    }).catch((er) => {
        console.log(er)
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


router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const player = await Player.findOne({_id: req.params.id});

        if (!player) {
            const error = new Error("Jugador no encontrado");
            error.name = "NotFound"
            throw error;
        }

        const activeRosters = await Roster.find({player: player, active: true})

        if(activeRosters.length > 0) {
            const error = new Error("No se puede eliminar el jugador porque está activo en algún equipo");
            error.name = "AlreadyActive"
            throw error;
        }

        const deletedPlayer = await player.deleteOne();

        res.status(200).send(deletedPlayer);
    }
    catch(ex){
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
});

function getErrorMessage(er) {
    console.log(er.name)
    if(er.name == 'AlreadyActive') { return { statusCode: 400, message: er.message } }
    if(er.name == 'OneNotFound') { return { statusCode: 400, message: 'No existe ese jugador en el sistema.' } }
    if(er.name == 'NotFound') { return { statusCode: 404, message: er.message } }

    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    if(er.code == 11000) { return { statusCode: 404, message: 'El nombre ya está registrado' } }
    
    // Si no es ninguno de los anteriores el error debe ser del servidor
    return { statusCode: 500, message: 'Error interno del servidor' }
}
import mongoose from 'mongoose';
import express from 'express';

import { Player } from '../models/player.js';
import { Team } from '../models/team.js';
import { Roster } from '../models/team.js';

export const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const players = await Player.find();

        if(players.length <= 0) {
            const error = Error()
            error.name = "EmptyList"
            throw error;
        }

        res.status(200).send(players)

    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message);
    }
});

router.get('/find', async(req, res) => {

    try {
        const { name } = req.query

        if (!name) {
            const error = Error()
            error.name = "NeedParameters"
            throw error;
        }

        const player = await Player.find({ name: { $regex: name, $options: 'i' } });

        if (!player) {
            const error = Error()
            error.name = "PlayerNotFound"
            throw error;
        }

        res.status(200).send(player);

    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try
    {
        const { id } = req.params;
        
        const player = await Player.findById(id);

        if(!player) {
            const err = new Error()
            err.name = "PlayerNotFound"
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

router.post('/', async (req, res) => {

    try {
        const player = new Player({...req.body});
        const savedPlayer = player.save();

        res.status(201).send(savedPlayer);

    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
})

router.put('/:id', async (req, res) => {
    
    try {
        const { id } = req.params;
        const player = { ...req.body };

        const update = Player.findByIdAndUpdate(id, player, { new: true })

        if(!player) {
            const err = new Error()
            err.name = "PlayerNotFound"
            throw err;
        }

        res.status(201).send(savedPlayer);
    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
});


router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const player = await Player.findOne({_id: req.params.id});

        if (!player) {
            const error = new Error();
            error.name = "PlayerNotFound"
            throw error;
        }

        const activeRosters = await Roster.find({player: player, active: true})

        if(activeRosters.length > 0) {
            const error = new Error();
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
    
    console.error(er);

    if(er.name == 'PlayerNotFound') { return { statusCode: 404, message: 'No existe ese jugador en el sistema.' } }
    if(er.name == 'AlreadyActive') { return { statusCode: 404, message: 'No se puede eliminar el jugador porque está activo en algún equipo' } }
    if(er.name == 'EmptyList') { return { statusCode: 404, message: 'No existen jugadores registrados en el sistema.' } }
    if(er.name == 'NeedParameters') { return { statusCode: 400, message: 'Falta el parámetro de búsqueda.' } }
    if(er.name == 'ValidationError') { return { statusCode: 400, message: 'Datos incorrectos: faltan campos obligatorios' } }

    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    if(er.code == 11000) { return { statusCode: 404, message: 'El nickname ya está registrado' } }
    
    // Si no es ninguno de los anteriores el error debe ser del servidor
    return { statusCode: 500, message: 'Error interno del servidor' }
}
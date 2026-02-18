import mongoose, { MongooseError } from 'mongoose';
import express from 'express';
import { Match } from '../models/match.js';


export const router = express.Router();

router.get('/', (req, res) => {
    Match.find()
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


router.get('/:id', async(req, res) => {
    try
    {
        const id = req.params.id;

        const match = await Match.findById(id);

        if(!match) {
            const err = new Error();
            err.name = "MatchNotFound"
            throw err;
        }

    } catch(ex){
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
});


router.post('/', async (req, res) => {
    try {
        const match = new Match({...req.body});

        if(match.awayTeam == match.homeTeam) {
            const err = new Error();
            err.name = "SameTeams"
            throw err;
        }




        const savedMatch = await match.save();
        res.status(201).send(savedMatch)
    } catch(ex) {
        
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedMatch = await Match.findByIdAndDelete(id);

        if(!deletedMatch) {
            const err = new Error();
            err.name = "MatchNotFound"
            throw err;
        }

        res.status(200).send(deletedMatch);
    } catch (ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
});

 

function getErrorMessage(er) {
    //console.log("errors: ", Object.values(er.errors).map(s => s.kind));

    

    if(er.name == 'AlreadyActive') { return { statusCode: 400, message: er.message } }
    if(er.name == 'ValidationError') { return { statusCode: 400, message: 'Datos incorrectos: faltan campos obligatorios' } }
    if(er.name == 'NotFound') { return { statusCode: 404, message: er.message } }
    if(er.name == 'PlayerNotActive') { return { statusCode: 404, message: 'El jugador no está activo en el roster de este equipo.' } }
    if(er.name == 'MatchNotFound') { return { statusCode: 404, message: 'Equipo no encontrado.' } }
    if(er.name == 'SameTeams') { return { statusCode: 404, message: 'El equipo local y visitante no pueden ser el mismo.' } }

    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    if(er.code == 11000) { return { statusCode: 404, message: 'Ya existe este partido' } }
    
    // Si no es ninguno de los anteriores el error debe ser del servidor
    return { statusCode: 500, message: 'Error interno del servidor' }
}
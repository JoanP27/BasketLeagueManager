import mongoose, { MongooseError } from 'mongoose';
import express from 'express';
import { Match } from '../models/match.js';


export const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const match = await Match.find();

        if(match.length <= 0) {
            const error = Error()
            error.name = "EmptyList"
            throw error;
        }

        res.status(200).send(match)

    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message);
    }
});


router.get('/:id', async(req, res) => {
    try
    {
        const { id } = req.params;

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
    console.log(er)

    if(er.name == 'EmptyList') { return { statusCode: 404, message: 'No existen partidos registrados.' } }

    if(er.name == 'MatchNotFound') { return { statusCode: 404, message: 'Partido no encontrado.' } }
    
    if(er.name == 'SameTeams') { return { statusCode: 400, message: 'El equipo local y visitante no pueden ser el mismo.' } }

    if(er.name == 'NeedParameters') { return { statusCode: 400, message: 'Falta el parámetro de búsqueda.' } }
    if(er.name == 'ValidationError') { return { statusCode: 400, message: 'Datos incorrectos: faltan campos obligatorios' } }

    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    if(er.code == 11000) { return { statusCode: 404, message: 'El nickname ya está registrado' } }
    
    // Si no es ninguno de los anteriores el error debe ser del servidor
    return { statusCode: 500, message: 'Error interno del servidor' }
}
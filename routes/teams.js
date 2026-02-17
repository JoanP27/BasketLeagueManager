import express from 'express';

import { Player } from '../models/player.js';
import { Team } from '../models/team.js';
import { Roster } from '../models/team.js';
import { Match } from '../models/match.js';

export const router = express.Router();

router.get('/', (req, res) => {
    Team.find()
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

    try{
        const id = req.params.id;
        const team = await Team.findById(id);
        res.status(200).send(team)
    }catch(ex)
    {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }


    Team.find()
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


router.post('/', async (req, res) => {
    const team = new Team({... req.body});
    team.save().then((resp) => {
        res.statusCode = 201;
        res.status(201).send(resp)
    }).catch((er) => {
        getErrorMessage(er)
    });
});

router.post('/:id/roster', async (req, res) => {
    try{
        const roster = new Roster({...req.body});
        const teamId = req.params.id;
        const playerId = roster.player;

        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if(!team){
            const error = new Error("el equipo no se pudo encontrar o no existe");
            error.name = "NotFound"
            throw error;
        }
        
        if(!player){
            const error = new Error("el jugador no se pudo encontrar o no existe");
            error.name = "NotFound"
            throw error;
        }

        const roastersWithPlayer = await Roster.find({player: playerId, active: true})
        const teamsWithActiveRoster = await Team.find({roster: {$in: roastersWithPlayer}})

        if(teamsWithActiveRoster.filter(t => t != team).length > 0)
        {
            const error = new Error("El jugador ya está activo en el roster de este equipo.");
            error.name = "AlreadyActive"
            throw error;
        }

        if(teamsWithActiveRoster.length > 0)
        {
            const error = new Error("El jugador está activo en otro equipo");
            error.name = "AlreadyActive"
            throw error;
        }

        const savedRoster = await roster.save();
        team.roster.push(savedRoster);
        const savedTeam = await Team.findByIdAndUpdate(team._id, team);

        res.status(200).send(team);
    }catch(ex){
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
});


router.delete('/:id/roster/:playerId', async (req, res) => {
    try{
        const teamId = req.params.id
        const playerId = req.params.playerId;

        const team = await Team.findById(teamId);
        
        if(!team) {
            const err = new Error();
            err.name = "TeamNotFound";
            throw err;
        }

        const rostersInTeam = await Roster.find({_id: {$in: team.roster}})

        const activePlayer = rostersInTeam.filter(r => (r.player == playerId) && (r.active == true));

        if(activePlayer.length <= 0)
        {
            const err = new Error();
            err.name = "PlayerNotActive";
            throw err;
        }
        console.log(activePlayer)

        activePlayer[0].active = false;

        activePlayer[0].save();

        const savedTeam = Team.findByIdAndUpdate(teamId, team)
        console.log(activePlayer);

        res.status(200).send(team);

    }catch(ex){
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const teamId = req.params.id;

        const team = await Team.findById(teamId);

        if(!team) {
            const error = new Error();
            error.name = "TeamNotFound"
            throw error;
        }

        const matchesWithTeam = await Match.find({$or: [
                {homeTeam: team},
                {awayTeam: team}
            ]
        });

        if(matchesWithTeam.length > 0) {
            const error = Error()
            error.name = "HasMatches"
            throw error;
        }

        await team.deleteOne();

        res.status(200).send(team);

    }catch(ex){
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
});

function getErrorMessage(er) {
    console.log(er)

    if(er.name == 'AlreadyActive') { return { statusCode: 400, message: er.message } }
    if(er.name == 'ValidationError') { return { statusCode: 400, message: 'Datos incorrectos: faltan campos obligatorios' } }
    if(er.name == 'NotFound') { return { statusCode: 404, message: er.message } }
    if(er.name == 'PlayerNotActive') { return { statusCode: 404, message: 'El jugador no está activo en el roster de este equipo.' } }
    if(er.name == 'TeamNotFound') { return { statusCode: 404, message: 'Equipo no encontrado.' } }

    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    if(er.code == 11000) { return { statusCode: 404, message: 'El nombre ya está registrado' } }
    
    // Si no es ninguno de los anteriores el error debe ser del servidor
    return { statusCode: 500, message: 'Error interno del servidor' }
}
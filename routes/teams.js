import express from 'express';

import { Player } from '../models/player.js';
import { Team } from '../models/team.js';
import { Roster } from '../models/team.js';
import { Match } from '../models/match.js';

export const router = express.Router();


router.get('/', async (req, res) => {
    try{
        const teams = await Team.find();

        if(teams.length <= 0) {
            const error = Error()
            error.name = "EmptyList"
            throw error;
        }

        res.status(200).send(teams)

    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try
    {
        const { id } = req.params;
        
        const team = await Team.findById(id);

        if(!team) {
            const err = new Error()
            err.name = "TeamNotFound"
            throw err;
        }

        const rostersOfTeam = await Roster.find({_id: {$in: team.roster}})

        team.roster = rostersOfTeam.filter(r => r.active);

        res.status(200).send(team);
    }
    catch(ex){
        console.log(ex.cause)
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
})  

router.post('/', async (req, res) => {
    try {
        const team = new Team({... body});
        const savedTeam = await team.save();

        res.status(201).send(savedTeam);
    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send(error.message)
    }
})

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
            const error = new Error();
            error.name = "AlreadyActiveInThisTeam"
            throw error;
        }

        if(teamsWithActiveRoster.length > 0)
        {
            const error = new Error();
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

    if(er.name == 'EmptyList') { return { statusCode: 404, message: 'No existen equipos registrados en el sistema' } }
    if(er.name == 'TeamNotFound') { return { statusCode: 404, message: 'No existe ese equipo en el sistema.' } }
    if(er.name == 'AlreadyActive') { return { statusCode: 400, message: 'No se puede eliminar el jugador porque está activo en algún equipo' } }
    if(er.name == 'AlreadyActiveInThisTeam') { return { statusCode: 400, message: 'No se puede eliminar el jugador porque está activo en este equipo' } }
    if(er.name == 'PlayerNotActive') { return { statusCode: 404, message: 'Jugador no encontrado.' } }

    if(er.name == 'NeedParameters') { return { statusCode: 400, message: 'Falta el parámetro de búsqueda.' } }
    if(er.name == 'ValidationError') { return { statusCode: 400, message: 'Datos incorrectos: faltan campos obligatorios' } }

    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    if(er.code == 11000) { return { statusCode: 404, message: 'El nickname ya está registrado' } }
    
    // Si no es ninguno de los anteriores el error debe ser del servidor
    return { statusCode: 500, message: 'Error interno del servidor' }
}
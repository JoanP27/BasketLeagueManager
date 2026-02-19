import express from 'express';

import { Player } from '../models/player.js';
import { Team } from '../models/team.js';
import { Roster } from '../models/team.js';
import { Match } from '../models/match.js';

export const router = express.Router();


router.get('/', async (req, res) => {
    try{
        const teams = await Team.find().populate('roster');

        if(teams.length <= 0) {
            const error = Error()
            error.name = "EmptyList"
            throw error;
        }

        res.status(200).send({result: teams})

    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send({error: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try
    {
        const { id } = req.params;
        
        const team = await Team.findById(id).populate('roster');

        if(!team) {
            const err = new Error()
            err.name = "TeamNotFound"
            throw err;
        }

        await team.populate('roster.player')

        team.roster = team.roster.filter(r => r.active);
        res.status(200).send({result: team});
    }
    catch(ex){
        console.log(ex.cause)
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send({error: error.message})
    }
})  

router.post('/', async (req, res) => {
    try {
        const team = new Team({... req.body});
        const savedTeam = await team.save();

        res.status(201).send({result: savedTeam});
    } catch(ex) {
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send({error: error.message})
    }
})

router.post('/:id/roster', async (req, res) => {
    try{
        const teamId = req.params.id;
        const roster = new Roster({...req.body});

        const team = await Team.findById(teamId)
        console.log("Equipo encontrado: ", team)
        
        if(!team) {
            const err = new Error();
            err.name = "TeamNotFound";
            throw err;
        }

        const roastersWithPlayer = await Roster.find({player: roster.player})
        const rostersWithActivePlayer = roastersWithPlayer.filter(r => r.active)

        const teamWithActiveRoster = await Team.findOne({roster: {$in: rostersWithActivePlayer}});
        const teamWithRoster = await Team.findOne({roster: {$in: rostersWithActivePlayer}});

        const rosterInThisTeam = await Roster.findOne({_id: {$in: team.roster}, player: roster.player});

        if(teamWithActiveRoster && teamWithActiveRoster._id.equals(team._id)) {
            const error = new Error();
            error.name = "AlreadyActiveInThisTeam"
            throw error;
        }

        if(teamWithActiveRoster) {
            const error = new Error();
            error.name = "AlreadyActive"
            throw error;
        }

        let savedTeam;

        if(rosterInThisTeam) {
            rosterInThisTeam.active = true;
            const savedRoster = await rosterInThisTeam.save();
            savedTeam = await team.save();
        }
        else {
            const savedRoster = await roster.save();
            team.roster.push(savedRoster);
            savedTeam = await team.save();
        }

        await savedTeam.populate('roster');
        await savedTeam.populate('roster.player')
        
        savedTeam.roster = savedTeam.roster.filter(r => r.active)

        res.status(200).send({result: savedTeam});

    }catch(ex){
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send({error: error.message})
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

        res.status(200).send({result: team});

    }catch(ex){
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send({error: error.message})
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

        for (const r of team.roster) {
            await Roster.findByIdAndDelete(r);
        }


        if(team.roster > 0) {
            const error = Error()
            error.name = "CannotDeleteRoster"
            throw error;
        }

        await team.deleteOne();

        res.status(200).send({result: team});


    }catch(ex){
        const error = getErrorMessage(ex);
        res.status(error.statusCode).send({error: error.message})
    }
});

function getErrorMessage(er) {
    console.log(er)

    if(er.name == 'EmptyList') { return { statusCode: 404, message: 'No existen equipos registrados en el sistema' } }
    if(er.name == 'TeamNotFound') { return { statusCode: 404, message: 'No existe ese equipo en el sistema.' } }
    if(er.name == 'PlayerNotFound') { return { statusCode: 404, message: 'Jugador no encontrado.' } }
    if(er.name == 'AlreadyActive') { return { statusCode: 400, message: 'El jugador está activo en otro equipo.' } }
    if(er.name == 'AlreadyActiveInThisTeam') { return { statusCode: 400, message: 'El jugador ya está activo en el roster de este equipo.' } }
    if(er.name == 'PlayerNotActive') { return { statusCode: 404, message: 'Jugador no encontrado.' } }
    if(er.name == 'CannotDeleteRoster') { return { statusCode: 400, message: 'No se puede eliminar los rosters del equipo' } }
    if(er.name == 'HasMatches') { return { statusCode: 400, message: 'No se puede eliminar el equipo porque tiene partidos asociados.' } }

    if(er.name == 'NeedParameters') { return { statusCode: 400, message: 'Falta el parámetro de búsqueda.' } }
    if(er.name == 'ValidationError') { return { statusCode: 400, message: 'Datos incorrectos: faltan campos obligatorios' } }

    // Si no es el error de falta de datos entonces con el codigo 11000 es el error de clave duplicada
    if(er.code == 11000) { return { statusCode: 404, message: 'El nickname ya está registrado' } }
    
    // Si no es ninguno de los anteriores el error debe ser del servidor
    return { statusCode: 500, message: 'Error interno del servidor' }
}
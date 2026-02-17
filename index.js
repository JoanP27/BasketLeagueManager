import express from "express";
import mongoose from "mongoose";

// Rutas
import { router as playerRouter } from './routes/players.js';
import { router as matchRouter } from './routes/matches.js';
import { router as teamRouter } from './routes/teams.js';
import path from 'path';

import cors from 'cors';



// Conexion a Moongose
mongoose.connect('mongodb://127.0.0.1:27017/basketleaguemanager')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar:', err.message));



const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(path.dirname('.'), 'public')))
// Uso de las rutas
app.use('/players', playerRouter);
app.use('/matches', matchRouter);
app.use('/teams', teamRouter);

const puerto = 8080
app.listen(puerto);
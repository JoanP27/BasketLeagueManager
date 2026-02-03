import express from "express";
import mongoose from "mongoose";

// Rutas
import { router as playerRouter } from './routes/players.js';


// Conexion a Moongose
mongoose.connect('mongodb://127.0.0.1:27017/basketleaguemanager')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar:', err.message));

const app = express();

app.use(express.json());

// Uso de las rutas
app.use('/players', playerRouter);
//app.use('/matches', matches);
//app.use('/teams', teams);

const puerto = 8080
app.listen(puerto);
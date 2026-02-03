import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: 2100,
    },
    season: {
        title: String,
        required: true,
        enum: [
            'Spring',
            'Summer',
            'Auntum',
            'Winter'
        ]
    },
    organizer:{
        type: String,
        minlength: 3,
        maxlength: 70
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
    }]
});
tournamentSchema.index({ title: 1, year: 1, season: 1 }, { unique: true });

export const Tournament = mongoose.model('tournament', tournamentSchema)
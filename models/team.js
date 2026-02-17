import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    foundedAt: {
        type: Date
    },
    roster: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roster'
    }]
    
});

const rosterSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'player',
        required: true
    },
    joinDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

export const Team = mongoose.model("team", teamSchema); 
export const Roster = mongoose.model("roster", rosterSchema); 
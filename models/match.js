import mongoose from "mongoose"

const matchSchema = new mongoose.Schema({
    tournament: { type: String, required: true, minlength: 3, maxlength: 100 },
    date: {
        type: Date,
        required: true
    },
    stage: {
        type: String,
        required: true,
        enum: [
            'Group',
            'Quarterfinal',
            'Semifinal',
            'Final'
        ]
    },
    homeTeam : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
        required: true
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
        required: true
    },
    homeScore: {
        type: Number,
        required: true,
        min: 0
    },
    awayScore: {
        type: Number,
        required: true,
        min: 0
    }
});
matchSchema.index({ tournament: 1, date: 1, homeTeam: 1, awayTeam: 1 }, { unique: true });

export const Match = mongoose.model('match', matchSchema);
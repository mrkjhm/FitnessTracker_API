const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    duration: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, required: true },
        seconds: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['pending', 'inProgress', 'completed'],
        default: 'pending'
    }
    ,
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateCompleted: {
        type: Date,
    }
});

module.exports = mongoose.model('Workout', workoutSchema);
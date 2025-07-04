const Workout = require("../models/Workout")
const { errorHandler } = require("../auth")



module.exports.addWorkout = (req, res) => {
    const userId = req.user.id;
    const { name, hours, minutes, seconds } = req.body;

    if (!name || minutes === undefined) {
        return res.status(400).json({ error: 'Name and duration (in minutes) are required' });
    }

    const newWorkout = new Workout({
        userId,
        name,
        duration: {
            hours: parseInt(hours) || 0,
            minutes: parseInt(minutes),
            seconds: parseInt(seconds) || 0
        }
    });

    newWorkout.save()
        .then(workout => res.status(201).json(workout))
        .catch(err => errorHandler(err, req, res));
};


module.exports.getMyWorkouts = (req, res) => {
    const userId = req.user.id;
    const { date } = req.query;

    const filter = { userId };

    if (date) {
        const start = new Date(date);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        filter.dateAdded = {
            $gte: start,
            $lt: end
        };
    }

    return Workout.find(filter).sort({ dateAdded: -1 })
        .then(workouts => {
            return res.status(200).json({ workouts });
        })
        .catch(err => errorHandler(res, err));
};

module.exports.getWorkout = async (req, res) => {
    const workoutId = req.params.id;

    try {
        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        return res.status(200).json({ workout });
    } catch (err) {
        return errorHandler(res, err); // assuming you have a centralized error handler
    }
};




module.exports.updateWorkout = (req, res) => {
    const userId = req.user.id;
    const workoutId = req.params.id;

    const { name, hours, minutes, seconds } = req.body;

    const parsedHours = parseInt(hours) || 0;
    const parsedMinutes = parseInt(minutes) || 0;
    const parsedSeconds = parseInt(seconds) || 0;

    Workout.findOneAndUpdate(
        { _id: workoutId, userId: userId },
        {
            $set: {
                name,
                duration: {
                    hours: parsedHours,
                    minutes: parsedMinutes,
                    seconds: parsedSeconds
                }
            }
        },
        { new: true, runValidators: true }
    )
    .then(workout => {
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found or you do not have permission to update this workout' });
        }
        return res.status(200).json({ message: 'Workout updated successfully', updatedWorkout: workout });
    })
    .catch(err => errorHandler(res, err));
};




module.exports.deleteWorkout = (req, res) => {
    const userId = req.user.id;
    const workoutId = req.params.id;

    Workout.findOneAndDelete({ _id: workoutId, userId: userId })
        .then(workout => {
            if (!workout) {
                return res.status(404).json({ error: 'Workout not found or you do not have permission to delete this workout' });
            }
            return res.status(200).json({ message: 'Workout deleted successfully' });
        })
        .catch(err => errorHandler(res, err));
};


module.exports.completeWorkoutStatus = (req, res) => {
    const userId = req.user.id;
    const workoutId = req.params.id; 

    Workout.findOneAndUpdate(
        { _id: workoutId, userId: userId },
        { 
            $set: { 
                status: 'completed',
                dateCompleted: new Date()
            } 
        },
        { new: true, runValidators: true }
    )
    .then(workout => {
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found or you do not have permission to update this workout' });
        }
        return res.status(200).json({ message: 'Workout status updated successfully', updatedWorkout: workout });
    })
    .catch(err => errorHandler(res, err));
};

module.exports.startWorkout = (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, { status: 'inProgress' }, { new: true })
        .then(workout => res.json({ message: 'Workout started', workout }))
        .catch(err => res.status(500).json({ error: 'Failed to update workout' }));
};


// In your backend controller
module.exports.resetWorkout = (req, res) => {
    const userId = req.user.id;
    const workoutId = req.params.id;

    Workout.findOneAndUpdate(
        { _id: workoutId, userId },
        {
            $set: {
                status: "pending",
                dateCompleted: null
            }
        },
        { new: true }
    )
    .then(workout => {
        if (!workout) return res.status(404).json({ message: "Workout not found" });
        res.status(200).json({ message: "Workout reset successfully", workout });
    })
    .catch(err => res.status(500).json({ message: "Reset failed", error: err.message }));
};

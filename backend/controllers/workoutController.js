const Workout = require("../models/Workout");

// CREATE WORKOUT
exports.createWorkout = async (req, res) => {
    try {
        const { exercise, duration, notes } = req.body;

        const workout = await Workout.create({
            user: req.user.id,
            exercise,
            duration,
            notes,
        });

        res.status(201).json(workout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL WORKOUTS (solo utente loggato)
exports.getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
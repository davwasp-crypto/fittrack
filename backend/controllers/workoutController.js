const Workout = require("../models/Workout");

// CREATE
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

// GET
exports.getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: "Workout non trovato" });
        }

        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Non autorizzato" });
        }

        await workout.deleteOne();

        res.json({ message: "Workout eliminato" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
exports.updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: "Workout non trovato" });
        }

        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Non autorizzato" });
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedWorkout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const express = require("express");
const router = express.Router();

const {
    createWorkout,
    getWorkouts,
    deleteWorkout,
    updateWorkout,
} = require("../controllers/workoutController");

const protect = require("../middleware/authMiddleware");

// CREATE WORKOUT
router.post("/", protect, createWorkout);

// GET WORKOUTS
router.get("/", protect, getWorkouts);

// DELETE WORKOUT
router.delete("/:id", protect, deleteWorkout);

// UPDATE WORKOUT
router.put("/:id", protect, updateWorkout);

module.exports = router;
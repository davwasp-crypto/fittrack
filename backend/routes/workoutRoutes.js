const express = require("express");
const router = express.Router();

const {
    createWorkout,
    getWorkouts,
} = require("../controllers/workoutController");

const protect = require("../middleware/authMiddleware");

// CREATE WORKOUT
router.post("/", protect, createWorkout);

// GET WORKOUTS
router.get("/", protect, getWorkouts);

module.exports = router;
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        exercise: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
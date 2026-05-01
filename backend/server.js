const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors"); // 👈 AGGIUNTO

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

dotenv.config();

const app = express();

// DB
connectDB();

// 🔥 CORS (FONDAMENTALE)
app.use(cors());

// Middleware
app.use(express.json());

// Test
app.get("/", (req, res) => {
    res.send("FitTrack API running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
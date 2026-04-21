const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// connessione database
connectDB();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("FitTrack API running 🚀");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
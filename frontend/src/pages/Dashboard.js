import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [exercise, setExercise] = useState("");
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");

    const token = localStorage.getItem("token");

    // GET WORKOUTS
    const fetchWorkouts = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/workouts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setWorkouts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    // CREATE WORKOUT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:5000/api/workouts",
                {
                    exercise,
                    duration,
                    notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // reset form
            setExercise("");
            setDuration("");
            setNotes("");

            // aggiorna lista
            fetchWorkouts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Dashboard 💪</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Esercizio"
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                />

                <input
                    placeholder="Durata (min)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />

                <input
                    placeholder="Note"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <button type="submit">Aggiungi</button>
            </form>

            <hr />

            {/* LISTA WORKOUT */}
            {workouts.length === 0 ? (
                <p>Nessun workout</p>
            ) : (
                workouts.map((w) => (
                    <div key={w._id} style={{ marginBottom: "20px" }}>
                        <p><b>{w.exercise}</b></p>
                        <p>Durata: {w.duration} min</p>
                        <p>{w.notes}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Dashboard;
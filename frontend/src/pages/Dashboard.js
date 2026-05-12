import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [exercise, setExercise] = useState("");
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [editExercise, setEditExercise] = useState("");
    const [editDuration, setEditDuration] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const getToken = () => localStorage.getItem("token");

    // GET WORKOUTS
    const fetchWorkouts = async () => {
        const token = getToken();

        if (!token) return;

        try {
            const res = await axios.get(
                "https://fittrack-k81j.onrender.com/api/workouts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setWorkouts(res.data);
        } catch (error) {
            console.error("GET ERROR:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        fetchWorkouts();
        const savedTheme = localStorage.getItem("darkMode");

        if (savedTheme === "true") {
            setDarkMode(true);
        }

        // eslint-disable-next-line
    }, []);

    // CREATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "https://fittrack-k81j.onrender.com/api/workouts",
                {
                    exercise,
                    duration: Number(duration),
                    notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            setExercise("");
            setDuration("");
            setNotes("");

            fetchWorkouts();
        } catch (error) {
            console.error("POST ERROR:", error);
        }
    };


    // START EDIT
    const startEdit = (workout) => {
        setEditingId(workout._id);

        setEditExercise(workout.exercise);
        setEditDuration(workout.duration);
        setEditNotes(workout.notes);
    };

    // SAVE EDIT
    const saveEdit = async (id) => {
        try {
            await axios.put(
                `https://fittrack-k81j.onrender.com/api/workouts/${id}`,
                {
                    exercise: editExercise,
                    duration: Number(editDuration),
                    notes: editNotes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            setEditingId(null);

            fetchWorkouts();
        } catch (error) {
            console.error("UPDATE ERROR:", error);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `https://fittrack-k81j.onrender.com/api/workouts/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            fetchWorkouts();
        } catch (error) {
            console.error("DELETE ERROR:", error);
        }
    };

    // STATS
    const totalWorkouts = workouts.length;

    const totalMinutes = workouts.reduce(
        (acc, workout) => acc + workout.duration,
        0
    );

    const averageMinutes =
        totalWorkouts > 0
            ? Math.round(totalMinutes / totalWorkouts)
            : 0;

    const chartData = workouts.map((workout) => ({
        name:
            workout.exercise.length > 8
                ? workout.exercise.substring(0, 8) + "..."
                : workout.exercise,
        minuti: workout.duration,
    }));

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;

        setDarkMode(newMode);

        localStorage.setItem("darkMode", newMode);
    };
    return (
        <div
            style={{
                minHeight: "100vh",
                background: darkMode ? "#121212" : "#f4f6f8",
                display: "flex",
                justifyContent: "center",
                padding: "40px 15px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "380px",
                    background: darkMode ? "#1e1e1e" : "#fff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        color: darkMode ? "white" : "black",
                    }}
                >
                    FitTrack 💪
                </h2>

                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        marginBottom: "15px",
                        background: "#333",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>

                <button
                    onClick={toggleDarkMode}
                    style={{
                        width: "100%",
                        marginBottom: "15px",
                        background: darkMode ? "#444" : "#ddd",
                        color: darkMode ? "white" : "black",
                        border: "none",
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>

                {/* STATS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            background: darkMode ? "#2a2a2a" : "#f9f9f9",
                            padding: "15px",
                            borderRadius: "10px",
                            color: darkMode ? "white" : "black",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        }}
                    >
                        🏋️ Workout Totali: <b>{totalWorkouts}</b>
                    </div>

                    <div
                        style={{
                            background: darkMode ? "#2a2a2a" : "#f9f9f9",
                            padding: "15px",
                            borderRadius: "10px",
                            color: darkMode ? "white" : "black",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        }}
                    >
                        ⏱ Totale Minuti: <b>{totalMinutes}</b>
                    </div>

                    <div
                        style={{
                            background: darkMode ? "#2a2a2a" : "#f9f9f9",
                            padding: "15px",
                            borderRadius: "10px",
                            color: darkMode ? "white" : "black",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        }}
                    >
                        🔥 Media Workout: <b>{averageMinutes} min</b>
                    </div>
                </div>

                {/* CHART */}
                <div
                    style={{
                        width: "100%",
                        height: 280,
                        background: darkMode ? "#1e1e1e" : "#fff",
                        padding: "10px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3
                        style={{
                            marginBottom: "15px",
                            color: darkMode ? "white" : "black",
                        }}
                    >
                        📊 Workout Chart
                    </h3>

                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: -20,
                                bottom: 5,
                            }}
                        >
                            <XAxis
                                dataKey="name"
                                tick={{ fill: darkMode ? "#ccc" : "#555" }}
                            />
                            <YAxis
                                tick={{ fill: darkMode ? "#ccc" : "#555" }}
                            />
                            <Tooltip />
                            <Bar dataKey="minuti" fill="#4CAF50" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    style={{ marginBottom: "20px" }}
                >
                    <input
                        placeholder="Esercizio"
                        value={exercise}
                        onChange={(e) =>
                            setExercise(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                        }}
                    />

                    <input
                        placeholder="Durata (min)"
                        value={duration}
                        onChange={(e) =>
                            setDuration(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                        }}
                    />

                    <input
                        placeholder="Note"
                        value={notes}
                        onChange={(e) =>
                            setNotes(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        Aggiungi Workout
                    </button>
                </form>

                {/* LISTA */}
                {workouts.length === 0 ? (
                    <p style={{ textAlign: "center" }}>
                        Nessun workout
                    </p>
                ) : (
                    workouts.map((w) => (
                        <div
                            key={w._id}
                            style={{
                                background: "#ffffff",
                                padding: "15px",
                                borderRadius: "10px",
                                marginBottom: "12px",
                                textAlign: "left",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,0.08)",
                            }}
                        >
                            {editingId === w._id ? (
                                <>
                                    <input
                                        value={editExercise}
                                        onChange={(e) =>
                                            setEditExercise(e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            marginBottom: "8px",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            boxSizing: "border-box",
                                        }}
                                    />

                                    <input
                                        value={editDuration}
                                        onChange={(e) =>
                                            setEditDuration(e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            marginBottom: "8px",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            boxSizing: "border-box",
                                        }}
                                    />

                                    <input
                                        value={editNotes}
                                        onChange={(e) =>
                                            setEditNotes(e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            marginBottom: "10px",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            boxSizing: "border-box",
                                        }}
                                    />

                                    <button
                                        onClick={() => saveEdit(w._id)}
                                        style={{
                                            background: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            marginRight: "10px",
                                        }}
                                    >
                                        Salva
                                    </button>

                                    <button
                                        onClick={() => setEditingId(null)}
                                        style={{
                                            background: "#999",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Annulla
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p
                                        style={{
                                            fontWeight: "bold",
                                            margin: "0 0 5px 0",
                                        }}
                                    >
                                        {w.exercise}
                                    </p>

                                    <p
                                        style={{
                                            margin: "0 0 5px 0",
                                            color: "#555",
                                        }}
                                    >
                                        ⏱ {w.duration} min
                                    </p>

                                    <p style={{ margin: "0 0 10px 0" }}>
                                        {w.notes}
                                    </p>

                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: darkMode ? "#bbb" : "#777",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        📅 {new Date(w.createdAt).toLocaleDateString()}
                                    </p>

                                    <button
                                        onClick={() => startEdit(w)}
                                        style={{
                                            background: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            marginRight: "10px",
                                        }}
                                    >
                                        Modifica
                                    </button>

                                    <button
                                        onClick={() => handleDelete(w._id)}
                                        style={{
                                            background: "#ff4d4d",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Elimina
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Dashboard;
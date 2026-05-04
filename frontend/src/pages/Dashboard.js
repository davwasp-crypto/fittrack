import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [exercise, setExercise] = useState("");
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");

    const getToken = () => localStorage.getItem("token");

    // GET WORKOUTS
    const fetchWorkouts = async () => {
        const token = getToken();
        if (!token) return;

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
            console.error("GET ERROR:", error);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    // CREATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:5000/api/workouts",
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

    // DELETE
    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/workouts/${id}`,
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

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f8",
                display: "flex",
                justifyContent: "center",
                padding: "40px 15px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "380px",
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
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

                {/* FORM */}
                <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                    <input
                        placeholder="Esercizio"
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value)}
                        onFocus={(e) => e.target.style.border = "1px solid #4CAF50"}
                        onBlur={(e) => e.target.style.border = "1px solid #ccc"}
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
                        onChange={(e) => setDuration(e.target.value)}
                        onFocus={(e) => e.target.style.border = "1px solid #4CAF50"}
                        onBlur={(e) => e.target.style.border = "1px solid #ccc"}
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
                        onChange={(e) => setNotes(e.target.value)}
                        onFocus={(e) => e.target.style.border = "1px solid #4CAF50"}
                        onBlur={(e) => e.target.style.border = "1px solid #ccc"}
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
                    <p style={{ textAlign: "center" }}>Nessun workout</p>
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
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            }}
                        >
                            <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>
                                {w.exercise}
                            </p>

                            <p style={{ margin: "0 0 5px 0", color: "#555" }}>
                                ⏱ {w.duration} min
                            </p>

                            <p style={{ margin: "0 0 10px 0" }}>
                                {w.notes}
                            </p>

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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Dashboard;
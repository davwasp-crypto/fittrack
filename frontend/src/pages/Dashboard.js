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
    const [search, setSearch] = useState("");


    const [deleteId, setDeleteId] = useState(null);


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
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success | error

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

            // SUCCESS MESSAGE
            setMessage("✅ Workout aggiunto con successo!");
            setMessageType("success");

            // RESET INPUT
            setExercise("");
            setDuration("");
            setNotes("");

            fetchWorkouts();

            // AUTO HIDE
            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);

        } catch (error) {
            console.error("POST ERROR:", error);

            // ERROR MESSAGE
            setMessage("❌ Errore durante il salvataggio del workout");
            setMessageType("error");

            // AUTO HIDE
            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);
        }
    };

    const handleUpdate = async (workout) => {

        const newExercise = prompt(
            "Nuovo esercizio",
            workout.exercise
        );

        const newDuration = prompt(
            "Nuova durata",
            workout.duration
        );

        const newNotes = prompt(
            "Nuove note",
            workout.notes
        );

        if (!newExercise || !newDuration) return;

        try {

            await axios.put(
                `https://fittrack-k81j.onrender.com/api/workouts/${workout._id}`,
                {
                    exercise: newExercise,
                    duration: Number(newDuration),
                    notes: newNotes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            setMessage("✏️ Workout modificato!");
            setMessageType("success");

            fetchWorkouts();

            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);

        } catch (error) {

            console.error("UPDATE ERROR:", error);

            setMessage("❌ Errore modifica");
            setMessageType("error");
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

            setMessage("🗑️ Workout eliminato con successo!");
            setMessageType("success");

            setDeleteId(null);

            fetchWorkouts();

            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);

        } catch (error) {

            console.error("DELETE ERROR:", error);

            setMessage("❌ Errore durante l'eliminazione");
            setMessageType("error");

            setDeleteId(null);

            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);
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

    const filteredWorkouts = workouts.filter((workout) =>
        workout.exercise
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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
                background: darkMode
                    ? "linear-gradient(135deg, #0f172a, #111827, #1e293b)"
                    : "linear-gradient(135deg, #dbeafe, #f8fafc, #e0f2fe)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 20px",
                transition: "all 0.3s ease",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "530px",
                    background: darkMode
                        ? "rgba(17, 24, 39, 0.88)"
                        : "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    padding: "28px",
                    borderRadius: "26px",
                    boxShadow: darkMode
                        ? "0 12px 40px rgba(0,0,0,0.45)"
                        : "0 12px 40px rgba(0,0,0,0.12)",
                    border: darkMode
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(255,255,255,0.6)",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "24px",
                        color: darkMode ? "white" : "#0f172a",
                        fontSize: "30px",
                        fontWeight: "700",
                        letterSpacing: "-1px",
                    }}
                >
                    🏋️ FitTrack Pro
                </h2>

                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        marginBottom: "14px",
                        background:
                            "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "white",
                        border: "none",
                        padding: "14px",
                        borderRadius: "14px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "15px",
                        boxShadow:
                            "0 4px 14px rgba(239,68,68,0.35)",
                        transition: "0.2s",
                    }}
                >
                    Logout
                </button>

                <button
                    onClick={toggleDarkMode}
                    style={{
                        width: "100%",
                        marginBottom: "20px",
                        background: darkMode
                            ? "linear-gradient(135deg, #334155, #1e293b)"
                            : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                        color: darkMode ? "white" : "#0f172a",
                        border: "none",
                        padding: "14px",
                        borderRadius: "14px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "15px",
                        transition: "0.2s",
                    }}
                >
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>

                {/* STATS */}
                <div
                    style={{
                        display: "grid",
                        gap: "14px",
                        marginBottom: "24px",
                    }}
                >
                    {[
                        {
                            icon: "🏋️",
                            label: "Workout Totali",
                            value: totalWorkouts,
                        },
                        {
                            icon: "⏱",
                            label: "Totale Minuti",
                            value: totalMinutes,
                        },
                        {
                            icon: "🔥",
                            label: "Media Workout",
                            value: `${averageMinutes} min`,
                        },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            style={{
                                background: darkMode
                                    ? "rgba(30,41,59,0.9)"
                                    : "rgba(255,255,255,0.9)",
                                padding: "18px",
                                borderRadius: "18px",
                                color: darkMode ? "white" : "#0f172a",
                                boxShadow:
                                    "0 4px 14px rgba(0,0,0,0.08)",
                                fontSize: "15px",
                                fontWeight: "500",
                            }}
                        >
                            {stat.icon} {stat.label}:{" "}
                            <b>{stat.value}</b>
                        </div>
                    ))}
                </div>

                {/* CHART */}
                <div
                    style={{
                        width: "93%",
                        height: 300,
                        background: darkMode
                            ? "rgba(30,41,59,0.95)"
                            : "rgba(255,255,255,0.95)",
                        padding: "18px",
                        borderRadius: "22px",
                        marginBottom: "24px",
                        boxShadow:
                            "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3
                        style={{
                            marginBottom: "16px",
                            color: darkMode ? "white" : "#0f172a",
                            fontSize: "18px",
                        }}
                    >
                        📊 Workout Analytics
                    </h3>

                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 5,
                            }}
                        >
                            <XAxis
                                dataKey="name"
                                tick={{
                                    fill: darkMode
                                        ? "#cbd5e1"
                                        : "#475569",
                                }}
                            />

                            <YAxis
                                tick={{
                                    fill: darkMode
                                        ? "#cbd5e1"
                                        : "#475569",
                                }}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="minuti"
                                fill="#22c55e"
                                radius={[12, 12, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "22px",
                    }}
                >
                    <input
                        placeholder="🔎 Cerca workout..."
                        value={search}
                        onChange={(e) => {

                            const value = e.target.value;

                            setSearch(value);

                            fetchWorkouts(value);
                        }}
                        style={{
                            flex: 1,
                            padding: "14px",
                            borderRadius: "14px",
                            border: darkMode
                                ? "1px solid #334155"
                                : "1px solid #dbe2ea",
                            boxSizing: "border-box",
                            background: darkMode
                                ? "#1e293b"
                                : "white",
                            color: darkMode ? "white" : "#111827",
                            fontSize: "14px",
                            outline: "none",
                        }}
                    />

                    <button
                        onClick={() => {

                            // RESET INPUT
                            setSearch("");

                            // RICARICA TUTTI I WORKOUT
                            fetchWorkouts("");
                        }}
                        style={{
                            padding: "14px 18px",
                            border: "none",
                            borderRadius: "14px",
                            cursor: "pointer",
                            fontWeight: "600",
                            background: darkMode
                                ? "linear-gradient(135deg, #334155, #1e293b)"
                                : "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
                            color: darkMode ? "white" : "#0f172a",
                            transition: "0.2s",
                            whiteSpace: "nowrap",
                        }}
                    >
                        ✖ Reset
                    </button>
                </div>
                {/* ALERT CARD */}
                {message && (
                    <div
                        style={{
                            width: "100%",
                            padding: "14px",
                            marginBottom: "18px",
                            borderRadius: "16px",
                            fontWeight: "600",
                            fontSize: "14px",
                            textAlign: "center",
                            color: "white",
                            background:
                                messageType === "success"
                                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                                    : "linear-gradient(135deg, #ef4444, #dc2626)",
                            boxShadow:
                                messageType === "success"
                                    ? "0 4px 16px rgba(34,197,94,0.35)"
                                    : "0 4px 16px rgba(239,68,68,0.35)",
                            animation: "fadeIn 0.3s ease",
                        }}
                    >
                        {message}
                    </div>
                )}
                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    style={{ marginBottom: "22px" }}
                >
                    {[
                        {
                            placeholder: "Esercizio",
                            value: exercise,
                            setter: setExercise,
                        },
                        {
                            placeholder: "Durata (min)",
                            value: duration,
                            setter: setDuration,
                        },
                        {
                            placeholder: "Note",
                            value: notes,
                            setter: setNotes,
                        },
                    ].map((field, index) => (
                        <input
                            key={index}
                            placeholder={field.placeholder}
                            value={field.value}
                            onChange={(e) =>
                                field.setter(e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: "14px",
                                marginBottom: "14px",
                                borderRadius: "14px",
                                border: darkMode
                                    ? "1px solid #334155"
                                    : "1px solid #dbe2ea",
                                boxSizing: "border-box",
                                background: darkMode
                                    ? "#1e293b"
                                    : "white",
                                color: darkMode
                                    ? "white"
                                    : "#111827",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    ))}

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "15px",
                            background:
                                "linear-gradient(135deg, #22c55e, #16a34a)",
                            color: "white",
                            border: "none",
                            borderRadius: "16px",
                            cursor: "pointer",
                            fontWeight: "700",
                            fontSize: "15px",
                            boxShadow:
                                "0 4px 16px rgba(34,197,94,0.35)",
                        }}
                    >
                        ➕ Aggiungi Workout
                    </button>
                </form>
                {/* DELETE CONFIRM CARD */}
                {deleteId && (
                    <div
                        style={{
                            width: "100%",
                            padding: "20px",
                            marginBottom: "20px",
                            borderRadius: "20px",
                            background: darkMode
                                ? "rgba(30,41,59,0.95)"
                                : "rgba(255,255,255,0.95)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                            border: darkMode
                                ? "1px solid rgba(255,255,255,0.08)"
                                : "1px solid #e2e8f0",
                            textAlign: "center",
                            animation: "fadeIn 0.25s ease",
                        }}
                    >
                        <h3
                            style={{
                                marginBottom: "12px",
                                color: darkMode ? "white" : "#0f172a",
                            }}
                        >
                            ⚠️ Conferma Eliminazione
                        </h3>

                        <p
                            style={{
                                marginBottom: "20px",
                                color: darkMode ? "#cbd5e1" : "#475569",
                            }}
                        >
                            Sei sicuro di voler eliminare questo workout?
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={() => handleDelete(deleteId)}
                                style={{
                                    background:
                                        "linear-gradient(135deg, #ef4444, #dc2626)",
                                    color: "white",
                                    border: "none",
                                    padding: "12px 18px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
                            >
                                ✅ Si continua
                            </button>

                            <button
                                onClick={() => setDeleteId(null)}
                                style={{
                                    background: darkMode
                                        ? "#334155"
                                        : "#e2e8f0",
                                    color: darkMode ? "white" : "#0f172a",
                                    border: "none",
                                    padding: "12px 18px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                )}
                {/* LISTA */}
                {workouts.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px 20px",
                            borderRadius: "22px",
                            background: darkMode
                                ? "rgba(30,41,59,0.95)"
                                : "rgba(255,255,255,0.95)",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "55px",
                                marginBottom: "16px",
                            }}
                        >
                            🏋️
                        </div>

                        <h3
                            style={{
                                color: darkMode ? "white" : "#0f172a",
                                marginBottom: "10px",
                            }}
                        >
                            Nessun workout ancora
                        </h3>

                        <p
                            style={{
                                color: darkMode ? "#cbd5e1" : "#64748b",
                                fontSize: "14px",
                            }}
                        >
                            Inizia aggiungendo il tuo primo allenamento 🚀
                        </p>
                    </div>
                ) : (
                    filteredWorkouts.map((w) => (
                        <div
                            key={w._id}
                            style={{
                                background: darkMode
                                    ? "rgba(30,41,59,0.95)"
                                    : "rgba(255,255,255,0.95)",
                                padding: "18px",
                                borderRadius: "20px",
                                marginBottom: "16px",
                                textAlign: "left",
                                boxShadow:
                                    "0 4px 14px rgba(0,0,0,0.08)",
                                transition: "0.2s",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    marginBottom: "8px",
                                    color: darkMode
                                        ? "white"
                                        : "#0f172a",
                                }}
                            >
                                🔥 {w.exercise}
                            </p>

                            <p
                                style={{
                                    marginBottom: "8px",
                                    color: darkMode
                                        ? "#cbd5e1"
                                        : "#475569",
                                }}
                            >
                                ⏱ {w.duration} min
                            </p>

                            <p
                                style={{
                                    marginBottom: "12px",
                                    color: darkMode
                                        ? "#e2e8f0"
                                        : "#334155",
                                }}
                            >
                                {w.notes}
                            </p>

                            <p
                                style={{
                                    fontSize: "12px",
                                    color: darkMode
                                        ? "#94a3b8"
                                        : "#64748b",
                                    marginBottom: "14px",
                                }}
                            >
                                📅{" "}
                                {new Date(
                                    w.createdAt
                                ).toLocaleDateString()}
                            </p>



                            <button
                                onClick={() => handleUpdate(w)}
                                style={{
                                    background:
                                        "linear-gradient(135deg, #22c55e, #16a34a)",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 14px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                    fontWeight: "600",
                                }}
                            >
                                ✏️ Modifica
                            </button>

                            <button
                                onClick={() => setDeleteId(w._id)}
                                style={{
                                    background:
                                        "linear-gradient(135deg, #ef4444, #dc2626)",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 14px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "600",
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

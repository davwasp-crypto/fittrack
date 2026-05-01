import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = localStorage.getItem("token");

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

        fetchWorkouts();
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Dashboard 💪</h2>

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
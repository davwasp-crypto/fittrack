import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "https://fittrack-k81j.onrender.com/api/auth/register",
                {
                    username,
                    email,
                    password,
                }
            );

            localStorage.setItem("token", res.data.token);

            alert("Registrazione riuscita 🚀");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Errore registrazione");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f4f6f8",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <div style={{
                width: "100%",
                maxWidth: "350px",
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Registrati ✍️
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
                    />

                    <button type="submit" style={{
                        width: "100%",
                        padding: "12px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                    }}>
                        Registrati
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
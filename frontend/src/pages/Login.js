import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem("token", res.data.token);

            navigate("/dashboard");
        } catch (error) {
            alert("Errore login");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "350px",
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    FitTrack 💪
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        type="password"
                        placeholder="Password"
                        value={password}
                        onFocus={(e) => e.target.style.border = "1px solid #4CAF50"}
                        onBlur={(e) => e.target.style.border = "1px solid #ccc"}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
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
                        Accedi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
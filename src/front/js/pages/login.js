import React, { useState } from "react";
import "../../styles/login.css";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Lógica de autenticación a integrar con el backend

        
        console.log("Iniciar sesión con:", { email, password });
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Iniciar Sesión</h1>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <i className="fas fa-envelope"></i>
                        <input 
                            type="email" 
                            placeholder="Correo electrónico" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <i className="fas fa-lock"></i>
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-login">Iniciar sesión</button>
                    <p className="forgot-password">
                        ¿Olvidaste tu contraseña? <a href="#">Recupérala aquí</a>
                    </p>
                </form>
            </div>
        </div>
    );
};
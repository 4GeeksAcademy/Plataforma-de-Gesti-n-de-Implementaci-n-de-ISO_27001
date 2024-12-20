import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";
import Logo from "../../img/white-logo.png";

export const Login = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Para manejar errores
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Lógica de autenticación a integrar con el backend para agregar aqui: 
        
        const success = await actions.loginAccount(email, password);

        if (success) {
            navigate("/projectlist"); // Redirige a la lista de proyectos si el login es exitoso
            console.log("Iniciar sesión con:", { email, password });
        } else {
            setErrorMessage("Error al iniciar sesión. Verifica tus credenciales.");
        }

    };
    const handleForgotPassword = () => {
        navigate("/reset-password");
    };

    return (
        <div className="big-div">
            <div className="left-div">
                <div className="left-div-logo text-center">
                    <img className="white-logo" src={Logo} />
                </div>
            </div>
            <div className="right-div">
                <div>
                    <h1 className="h3-custom text-center p-4" style={{borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px"}}>Inicio de Sesión</h1>
                </div>
                <div className="right-div-login-form">
                    <div className="login-container">
                        <div className="login-form">
                        {errorMessage && <p className="error-message">{errorMessage}</p>} 
                        <p className="text-center">Ingrese su correo registrado y contraseña</p>
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
                            <p className="forgot-password" onClick={handleForgotPassword}>
                                ¿Olvidaste tu contraseña? <a href="#">Recupérala aquí</a>
                            </p>
                        </form>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

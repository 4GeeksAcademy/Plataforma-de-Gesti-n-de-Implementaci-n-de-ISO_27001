import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import Logo from "../../img/white-logo.png";

export const Profile = () => {
    const { store } = useContext(Context);
    const [password, setPassword] = useState("");

    // Simulamos la fecha de registro (debería venir del backend)
    const registrationDate = "2024-12-20";

    const handlePasswordChange = () => {
        console.log("Nueva contraseña:", password);
        alert("Funcionalidad de cambio de contraseña en desarrollo.");
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
                    <h1 className="h3-custom text-center p-4" style={{borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px"}}>Mi Perfil</h1>
                </div>
                <div className="mt-5" style={{display: "flex", justifyContent: "center", paddingTop: "10%"}}>
                    <div className="card shadow">
                        <p><strong>Nombre Completo:</strong> {store.user?.full_name || "Usuario"}</p>
                        <p><strong>Correo Electrónico:</strong> {store.user?.email || "email@example.com"}</p>
                        <p><strong>Fecha de Registro:</strong> {store.user?.registered_on || registrationDate}</p>


                        <div className="mt-4">
                            <h5>Cambiar Contraseña</h5>
                            <input
                                type="password"
                                className="form-control my-2"
                                placeholder="Nueva contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handlePasswordChange}>
                                Guardar Nueva Contraseña
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

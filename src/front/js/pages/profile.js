import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

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
        <div className="container mt-5">
            <h1>Mi Perfil</h1>
            <div className="card shadow p-4">
                <p><strong>Nombre Completo:</strong> {store.user?.full_name || "Usuario"}</p>
                <p><strong>Correo Electrónico:</strong> {store.user?.email || "email@example.com"}</p>
                <p><strong>Fecha de Registro:</strong> {store.user?.registered_on || registrationDate}</p>

                <div className="mt-4">
                    <h4>Cambiar Contraseña</h4>
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
    );
};

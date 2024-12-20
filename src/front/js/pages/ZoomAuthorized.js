import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ZoomAuthorized = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("access_token");

        if (token) {
            // Guardar el token en localStorage
            localStorage.setItem("zoomAccessToken", token);
            alert("Token de Zoom recibido y almacenado.");
        } else {
            alert("Error al recibir el token de Zoom.");
        }

        // Redirigir al usuario a la página principal
        navigate("/main");
    }, [navigate]);

    return <div>Procesando autorización de Zoom...</div>;
};

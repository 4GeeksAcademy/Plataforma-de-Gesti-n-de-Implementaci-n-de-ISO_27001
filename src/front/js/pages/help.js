import React from "react";
import Logo from "../../img/white-logo.png";

export const Help = () => {
    return (

        <div className="big-div">
            <div className="left-div">
                <div className="left-div-logo text-center">
                    <img className="white-logo" src={Logo} />
                </div>
            </div>
            <div className="right-div d-flex flex-column text-center">
                <h1 className="mb-2">Ayuda y Contacto</h1>
                <div className="card w-20 shadow p-4">
                    <p>
                        <strong>Correo Electrónico de Soporte:</strong> soporte@plataforma.com
                    </p>
                    <p>
                        <strong>Teléfono de Contacto:</strong> +1 800 123 4567
                    </p>
                    <p>
                        <strong>Horario de Atención:</strong> Lunes a Viernes, 9:00 AM - 5:00 PM
                    </p>
                </div>

            </div>
        </div>
    );
};

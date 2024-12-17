import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const ResetPassword = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const { token } = useParams(); // Captura el token de la URL

    useEffect(() => {
        if (token) {
            store.resetToken = token;
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.forgotPassword(email);
        if (success) {
            console.log("Correo enviado exitosamente");
        } else {
            console.log("Error al enviar el correo");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="reset_email" className="form-label">
                        Introduzca su Correo Electrónico
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        name="reset_email"
                        placeholder="Enter email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary">
                            Send
                        </button>
                    </div>
                </div>
            </form>
            {store.message && <div className="alert alert-success mt-3">{store.message}</div>}
            {store.error && <div className="alert alert-danger mt-3">{store.error}</div>}
        </div>
    );
};

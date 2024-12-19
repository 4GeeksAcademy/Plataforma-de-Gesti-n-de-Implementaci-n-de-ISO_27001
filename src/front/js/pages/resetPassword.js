import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Logo from "../../img/white-logo.png";
import "../../styles/resetPassword.css";

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
        <div className="big-div">
            <div className="left-div">
                <div className="left-div-logo text-center">
                    <img className="white-logo" src={Logo} />
                </div>
            </div>
            <div className="right-div">
                <div>
                    <h3 className="h3-custom text-center p-4" style={{borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px"}}>Recuperación de Contraseña</h3>
                </div>
                <div className="custom-card-password">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="reset_email" className="form-label pb-2" style={{fontSize: "18px", textDecoration: "underline"}}>
                                Introduzca su Correo Electrónico
                            </label>
                            <p className="mb-2 mt-2" style={{textAlign: "justify"}}>Para recuperar tu contraseña, te enviaremos un enlace de restablecimiento a la dirección de correo electrónico que ingreses.</p>
                            <input
                                type="email"
                                className="form-control"
                                name="reset_email"
                                placeholder="Escribe tu correo electrónico aquí"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="row justify-content-center mt-4">
                            <div className="col-auto">
                                <button type="submit" className="btn btn-primary" style={{width: "180px"}}>
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </form>
                    {store.message && <div className="alert alert-success mt-3">{store.message}</div>}
                    {store.error && <div className="alert alert-danger mt-3">{store.error}</div>}
                    
                </div>

            </div>
        </div>
    );
};

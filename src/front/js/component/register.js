import React, { Component, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Logo from "../../img/white-logo.png";
import "../../styles/adminRegister.css";

export const Register = () => {

    const {store, actions} = useContext(Context);
    const navigate = useNavigate();
    async function submitForm(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const full_name = formData.get("full_name")
        const email = formData.get("email")
        const password = formData.get("password")
        if (!full_name || !email || !password) {
            console.log("Incomplete data")
            return 
        }
        let success = await actions.registerAccount(full_name, email, password)
        if(success) {
            console.log("Account registered succesfully")
            navigate("/projectlist");
        }
        else {
            console.log("Error registering account or loggin in")
        }
    }
    return (
        <div className="big-div">
            <div className="left-div">
                <div className="text-center left-div-logo">
                    <img className="white-logo" src={Logo} />
                </div>
            </div>
            <div className="right-div">
                <h1 className="text-center h3-custom p-4" style={{borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px"}}>Registro de Cuenta</h1>
                <div className="custom-card-password">
                    <form onSubmit={submitForm}>
                        <div className="mb-3 text-start">
                            <label htmlFor="full_name" className="form-label">Nombre Completo</label>
                            <input type="text" className="form-control" name="full_name" placeholder="Escribe tu nombre completo aquí" required />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input type="email" className="form-control" name="email" placeholder="Escribe tu correo electrónico aquí" required />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" name="password" placeholder="Escribe tu contraseña aquí" required />
                        </div>
                        <div className="row justify-content-center mt-3">
                            <div className="col-auto">
                                <button type="submit" className="btn" style={{width: "180px"}}>Registrar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}



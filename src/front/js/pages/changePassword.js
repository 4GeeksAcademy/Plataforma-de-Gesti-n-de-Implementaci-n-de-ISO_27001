import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useSearchParams } from "react-router-dom";
import "../../styles/changePassword.css";
import Logo from "../../img/white-logo.png";

export const ChangePassword = () => {
  const [params, setParams] = useSearchParams()
  const [currentPassword, setCurrentPassword] = useState(""); // Nueva variable para la contraseña actual
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { actions } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    const token = params.get("token");
    const result = await actions.changePassword(currentPassword, newPassword, confirmPassword, token);

    if (result) {
      setSuccessMessage("Contraseña cambiada con éxito.");
      setErrorMessage("");
    } else {
      setSuccessMessage("");
      console.log(token);
      setErrorMessage("Hubo un error al cambiar la contraseña.");
    }
  };

  return (
    <div className="big-div">
      <div className="left-div">
        <div className="left-div-logo text-center">
          <img className="white-logo" src={Logo} alt="Logo" />
        </div>
      </div>

      <div className="right-div">
        <h1
          className="h3-custom text-center p-4"
          style={{ borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px" }}
        >
          Cambio de Contraseña
        </h1>

        {/* Mostrar mensajes de error o éxito */}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="custom-card-password">
          <form onSubmit={handleSubmit}>
            <div className="form-group text-start">
              <label htmlFor="currentPassword" className="text-start mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control"
                placeholder="Escribe tu contraseña actual"
              />
            </div>

            <div className="form-group text-start mt-4">
              <label htmlFor="newPassword" className="text-start mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                placeholder="Escribe tu nueva contraseña"
              />
            </div>

            <div className="form-group text-start mt-4">
              <label htmlFor="confirmPassword" className="text-start mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Cambiar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
